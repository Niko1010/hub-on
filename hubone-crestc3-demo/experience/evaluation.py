"""Temporal behavior evaluation gated on real, explicitly human-reviewed data.

This module does not create ground truth. Synthetic fixtures may test its math,
but must never become reported recognition accuracy or production annotations.
"""
from collections import defaultdict
import math

from experience.behavior import BEHAVIORS

EVALUATION_VERSION='behavior-temporal-evaluation/1.2.0'
REAL_MODES={'REAL_RECORDING','REAL_LIVE','LIVE'}


def _blocked(status,reason):
    return {'status':status,'evaluation_version':EVALUATION_VERSION,'official_metrics':None,
            'per_class':{},'unknown_ratio':None,'limitations':[reason],
            'semantic_accuracy_certified':False}


def _number(value):
    return isinstance(value,(int,float)) and not isinstance(value,bool) and math.isfinite(value)


def _bounds(row):
    start=row.get('start',row.get('timestamp'));end=row.get('end',start)
    if not _number(start) or not _number(end) or start<0 or end<start:
        raise ValueError('Invalid interval')
    return float(start),float(end)


def _scope(row):
    source=row.get('source_ref') or {}
    sid=row.get('session_id')
    if not sid or source.get('session_id',sid)!=sid or source.get('kind') not in ('live','recording'):
        raise ValueError('Invalid evidence scope')
    if source['kind']=='recording' and (not source.get('asset_id') or not source.get('run_id')):
        raise ValueError('Recording asset/run identity required')
    return sid,source['kind'],source.get('asset_id'),source.get('run_id'),str(row.get('track_id'))


def _covered(row,ranges):
    start,end=_bounds(row);scope=_scope(row)
    return any(_scope(window)==scope and _bounds(window)[0]<=start and end<=_bounds(window)[1] for window in ranges)


def _overlaps(a,b):
    if _scope(a)!=_scope(b):return False
    a0,a1=_bounds(a);b0,b1=_bounds(b)
    return max(a0,b0)<=min(a1,b1)


def _segments(rows):
    grouped=defaultdict(list)
    for row in rows:
        if row['label']!='UNKNOWN':grouped[(_scope(row),row['label'],row.get('segment_id'))].append(row)
    result=[]
    for group in grouped.values():
        active=None
        for row in sorted(group,key=lambda r:_bounds(r)):
            start,end=_bounds(row)
            if row.get('status')!='CANDIDATE':
                if active is not None:result.append(active);active=None
                continue
            if end>start:
                if active is not None:result.append(active);active=None
                result.append(dict(row));continue
            gap=row.get('thresholds',{}).get('max_gap_seconds',1.5)
            if active is not None and start-active['end']<=gap:
                active['end']=end
            else:
                if active is not None:result.append(active)
                active={**row,'start':start,'end':end}
        if active is not None:result.append(active)
    return result


def _reviewed_segments(rows,ranges,unknown_gt):
    result=[]
    for row in _segments(rows):
        start,end=_bounds(row)
        if start==end:
            if _covered(row,ranges) and not any(_overlaps(row,g) for g in unknown_gt):result.append(row)
            continue
        pieces=sorted((max(start,_bounds(w)[0]),min(end,_bounds(w)[1])) for w in ranges
                      if _scope(w)==_scope(row) and max(start,_bounds(w)[0])<min(end,_bounds(w)[1]))
        merged=[]
        for a,b in pieces:
            if merged and a<=merged[-1][1]:merged[-1]=(merged[-1][0],max(b,merged[-1][1]))
            else:merged.append((a,b))
        for unknown in unknown_gt:
            if _scope(unknown)!=_scope(row):continue
            a,b=_bounds(unknown);remaining=[]
            for left,right in merged:
                if b<=left or a>=right:remaining.append((left,right))
                else:
                    if left<a:remaining.append((left,a))
                    if b<right:remaining.append((b,right))
            merged=remaining
        result.extend({**row,'start':a,'end':b} for a,b in merged)
    return result


def temporal_overlap(prediction,truth,point_tolerance=.3):
    if _scope(prediction)!=_scope(truth) or prediction['label']!=truth['label']:return 0.0
    a0,a1=_bounds(prediction);b0,b1=_bounds(truth)
    if prediction['label'] in ('ENTERING','EXITING') and (a0==a1 or b0==b1):
        return 1.0 if max(a0,b0)-min(a1,b1)<=point_tolerance else 0.0
    union=max(a1,b1)-min(a0,b0)
    return max(0,min(a1,b1)-max(a0,b0))/union if union>0 else 0.0


def _scores(tp,fp,fn):
    precision=tp/(tp+fp) if tp+fp else None
    recall=tp/(tp+fn) if tp+fn else None
    f1=2*tp/(2*tp+fp+fn) if 2*tp+fp+fn else None
    return {'true_positive':tp,'false_positive':fp,'false_negative':fn,
            'precision':precision,'recall':recall,'f1':f1}


def evaluate_behaviors(predictions,annotations,split_manifest,*,iou_threshold=.5):
    predictions,annotations=list(predictions),list(annotations)
    if not _number(iou_threshold) or not 0<iou_threshold<=1:
        raise ValueError('Temporal IoU threshold must be in (0,1]')
    if not annotations:
        return _blocked('NOT_VERIFIED','No real human annotations are available; official accuracy is not computed.')
    if not predictions:
        return _blocked('NOT_VERIFIED','No completed behavior prediction samples are available.')
    if any(row.get('source_mode')=='SIMULATED' or row.get('simulated') is True for row in predictions+annotations):
        return _blocked('REJECTED_SIMULATED','Synthetic/simulated data cannot produce official behavior accuracy.')
    if any(row.get('source_mode') not in REAL_MODES for row in predictions+annotations):
        return _blocked('NOT_VERIFIED','Real source origin must be explicit for every prediction and annotation.')
    if any(row.get('verification_status')!='HUMAN_VERIFIED' or row.get('annotator_kind')!='HUMAN'
           or row.get('generated_by') in ('MODEL','RULE_BASED','SIMULATED') for row in annotations):
        return _blocked('NOT_VERIFIED','Ground truth requires explicit human verification; predictions are not ground truth.')
    manifest=split_manifest or {};train=manifest.get('train',[]);test=manifest.get('test',[])
    if not test or any(not isinstance(row,dict) or not row.get('session_id') for row in train+test):
        return _blocked('NOT_VERIFIED','An explicit independent Session/video test split is required.')
    train_ids={row['session_id'] for row in train};test_ids={row['session_id'] for row in test}
    train_hashes={row['video_sha256'] for row in train if row.get('video_sha256')}
    test_hashes={row['video_sha256'] for row in test if row.get('video_sha256')}
    if train_ids & test_ids or train_hashes & test_hashes:
        return _blocked('REJECTED_LEAKAGE','Train/test share a Session or source video; adjacent-frame splits are invalid.')
    if any(row.get('session_id') not in test_ids for row in predictions+annotations):
        return _blocked('INVALID_SCOPE','Evaluation input contains sources outside the explicit test Session split.')
    if any(row.get('source_ref',{}).get('kind')=='recording' and not any(item.get('session_id')==row['session_id'] and item.get('video_sha256') for item in test)
           for row in predictions+annotations):
        return _blocked('NOT_VERIFIED','Recorded-video test groups require an original video SHA256 to prevent reuse leakage.')
    ranges=manifest.get('reviewed_ranges',[])
    if not ranges or any(row.get('complete') is not True or row.get('verification_status')!='HUMAN_VERIFIED' for row in ranges):
        return _blocked('NOT_VERIFIED','Explicit completely human-reviewed ranges are required; missing labels are not negatives.')
    try:
        for row in predictions+annotations+ranges:
            _bounds(row);_scope(row)
            if row.get('track_id') is None:raise ValueError('Track scope required')
        if any(row.get('label') not in BEHAVIORS for row in predictions+annotations):raise ValueError('Unknown behavior class')
        if any(row.get('status') not in ('CANDIDATE','NOT_OBSERVED','UNKNOWN') for row in predictions):raise ValueError('Invalid prediction status')
        if any(not _covered(row,ranges) for row in annotations):raise ValueError('Annotation outside reviewed ranges')
        if any(not any(_scope(row)==_scope(window) for window in ranges) for row in predictions):raise ValueError('Prediction source/run outside review scope')
    except (ValueError,TypeError,KeyError):
        return _blocked('INVALID_SCOPE','Invalid temporal, Track, source-run, label or review-range references.')
    unknown_gt=[row for row in annotations if row['label']=='UNKNOWN' or row.get('uncertain') or row.get('occluded')]
    truth=[row for row in annotations if row not in unknown_gt]
    if not truth:
        return _blocked('NOT_VERIFIED','Human annotations contain no evaluable behavior; unknown/occluded truth is excluded.')
    for index,row in enumerate(truth):
        if any(row['label']==other['label'] and _overlaps(row,other) for other in truth[index+1:]):
            return _blocked('INVALID_GROUND_TRUTH','Duplicate/overlapping same-class ground-truth intervals require human resolution.')
    eligible=[row for row in predictions if _covered(row,ranges) and not any(_overlaps(row,unknown) for unknown in unknown_gt)]
    sampled=[row for row in eligible if row['label']!='UNKNOWN']
    unknown_count=sum(row['status']=='UNKNOWN' for row in sampled)
    # Segment before selecting review coverage, so removed samples cannot bridge
    # unreviewed/uncertain gaps or create an artificial continuous prediction.
    candidates=_reviewed_segments(predictions,ranges,unknown_gt)
    per_class={};total_tp=total_fp=total_fn=0
    for label in BEHAVIORS[:-1]:
        predicted=[row for row in candidates if row['label']==label]
        expected=[row for row in truth if row['label']==label]
        pairs=sorted(((temporal_overlap(p,g),i,j) for i,p in enumerate(predicted) for j,g in enumerate(expected)),reverse=True)
        matched_p=set();matched_g=set()
        for overlap,i,j in pairs:
            if overlap>=iou_threshold and i not in matched_p and j not in matched_g:
                matched_p.add(i);matched_g.add(j)
        tp=len(matched_p);fp=len(predicted)-tp;fn=len(expected)-tp
        per_class[label]={**_scores(tp,fp,fn),'ground_truth_support':len(expected),'predicted_intervals':len(predicted)}
        total_tp+=tp;total_fp+=fp;total_fn+=fn
    return {'status':'EVALUATED_ON_HUMAN_GT','evaluation_version':EVALUATION_VERSION,
        'official_metrics':_scores(total_tp,total_fp,total_fn),'per_class':per_class,
        'unknown_ratio':unknown_count/len(sampled) if sampled else None,
        'unknown_ratio_basis':'UNKNOWN per-class sample predictions / all eligible per-class samples; aggregate UNKNOWN label excluded',
        'unknown_samples':unknown_count,'eligible_samples':len(sampled),'excluded_unknown_gt_intervals':len(unknown_gt),
        'matching':'one-to-one greedy maximum temporal IoU; entry/exit points use 0.3s tolerance',
        'iou_threshold':iou_threshold,'test_sessions':sorted(test_ids),'test_video_sha256':sorted(test_hashes),
        'rule_versions':sorted({row.get('rule_version','unknown') for row in predictions}),
        'semantic_accuracy_certified':False,
        'limitations':['Metrics apply only to these real human-reviewed intervals, not general consumer behavior accuracy.',
                       'Unreviewed time, uncertain/occluded ground truth and cross-source identities are not inferred.',
                       'Threshold tuning and evaluation must use independent Sessions/videos.']}
