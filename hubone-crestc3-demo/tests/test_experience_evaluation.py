"""Evaluator software tests only; fabricated fixtures are NOT real accuracy data."""
from copy import deepcopy

import pytest

from experience.evaluation import evaluate_behaviors


def row(start,end,label='WALKING',status='CANDIDATE'):
    return {'session_id':'test','source_ref':{'kind':'live','session_id':'test'},'track_id':'7',
            'start':start,'end':end,'timestamp':start,'label':label,'status':status,
            'source_mode':'REAL_LIVE','rule_version':'software-test-only','segment_id':'7:1'}


def gt(start,end,label='WALKING'):
    return {**row(start,end,label),'annotation_id':f'fixture-{start}-{end}-{label}',
            'verification_status':'HUMAN_VERIFIED','annotator_kind':'HUMAN','occluded':False,'uncertain':False}


def manifest():
    return {'train':[{'session_id':'train','video_sha256':'a'*64}],
            'test':[{'session_id':'test','video_sha256':'b'*64}],
            'reviewed_ranges':[{**row(0,10),'complete':True,'verification_status':'HUMAN_VERIFIED'}]}


def test_no_gt_or_no_prediction_returns_not_verified_without_fabricated_zero_accuracy():
    assert evaluate_behaviors([row(0,1)],[],manifest())['official_metrics'] is None
    assert evaluate_behaviors([], [gt(0,1)],manifest())['status']=='NOT_VERIFIED'


@pytest.mark.parametrize('kind',['SIMULATED','UNKNOWN','REPLAY'])
def test_only_explicit_real_sources_can_enter_official_evaluation(kind):
    truth=gt(0,1);truth['source_mode']=kind
    result=evaluate_behaviors([row(0,1)],[truth],manifest())
    assert result['official_metrics'] is None


def test_one_to_one_interval_matching_fp_fn_and_unknown_are_separate():
    result=evaluate_behaviors([row(0,1),row(2,3),row(4,5,status='UNKNOWN')],[gt(0,1),gt(4,5)],manifest())
    assert result['status']=='EVALUATED_ON_HUMAN_GT'
    score=result['official_metrics']
    assert [score[key] for key in ('true_positive','false_positive','false_negative')]==[1,1,1]
    assert score['precision']==score['recall']==score['f1']==.5
    assert result['unknown_ratio']==pytest.approx(1/3)
    assert result['per_class']['BENDING']['precision'] is None
    assert result['semantic_accuracy_certified'] is False


@pytest.mark.parametrize('failure',['same_session','same_video','incomplete_review','not_human','unverified'])
def test_leakage_and_unreviewed_ground_truth_never_produce_official_metrics(failure):
    split=manifest();truth=gt(0,1)
    if failure=='same_session':split['train'][0]['session_id']='test'
    if failure=='same_video':split['train'][0]['video_sha256']='b'*64
    if failure=='incomplete_review':split['reviewed_ranges'][0]['complete']=False
    if failure=='not_human':truth['annotator_kind']='RULE_BASED'
    if failure=='unverified':truth['verification_status']='DRAFT'
    result=evaluate_behaviors([row(0,1)],[truth],split)
    assert result['official_metrics'] is None


def test_missing_labels_are_not_negatives_outside_human_review_coverage():
    split=manifest();split['reviewed_ranges'][0]['end']=1
    result=evaluate_behaviors([row(0,1),row(2,3)],[gt(0,1)],split)
    assert result['official_metrics']['false_positive']==0
    assert result['eligible_samples']==1


def test_occluded_or_uncertain_ground_truth_is_excluded_not_a_false_negative():
    uncertain=gt(4,5);uncertain['uncertain']=True
    result=evaluate_behaviors([row(0,1),row(4,5)],[gt(0,1),uncertain],manifest())
    assert result['excluded_unknown_gt_intervals']==1
    assert result['official_metrics']['false_positive']==0
    assert result['official_metrics']['false_negative']==0


def test_frame_candidates_merge_only_within_continuous_segment():
    predictions=[row(t,t) for t in (0,.4,.8)]
    predictions+=[row(1.2,1.2,status='UNKNOWN'),row(1.6,1.6),row(2,2)]
    result=evaluate_behaviors(predictions,[gt(0,.8),gt(1.6,2)],manifest())
    assert result['official_metrics']['true_positive']==2
    assert result['per_class']['WALKING']['predicted_intervals']==2


def test_source_run_and_track_ownership_must_match_review_scope():
    wrong=row(0,1);wrong['track_id']='foreign'
    assert evaluate_behaviors([wrong],[gt(0,1)],manifest())['status']=='INVALID_SCOPE'
    missing_hash=manifest();missing_hash['test'][0].pop('video_sha256')
    predicted=row(0,1);truth=gt(0,1)
    for sample in [predicted,truth,*missing_hash['reviewed_ranges']]:
        sample['source_ref'].update(kind='recording',asset_id='asset',run_id='run')
    assert evaluate_behaviors([predicted],[truth],missing_hash)['status']=='NOT_VERIFIED'


def test_entry_point_matching_uses_explicit_tolerance_and_duplicate_truth_is_rejected():
    result=evaluate_behaviors([row(1,1,'ENTERING')],[gt(.9,1.1,'ENTERING')],manifest())
    assert result['official_metrics']['true_positive']==1
    assert evaluate_behaviors([row(0,1)],[gt(0,1),deepcopy(gt(0,1))],manifest())['status']=='INVALID_GROUND_TRUTH'


def test_review_gaps_clip_prediction_intervals_without_counting_unreviewed_time():
    split=manifest()
    split['reviewed_ranges']=[{**row(0,1),'complete':True,'verification_status':'HUMAN_VERIFIED'},
                              {**row(2,3),'complete':True,'verification_status':'HUMAN_VERIFIED'}]
    result=evaluate_behaviors([row(0,3)],[gt(0,1),gt(2,3)],split)
    assert result['official_metrics']['true_positive']==2
    assert result['official_metrics']['false_positive']==0
