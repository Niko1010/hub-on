"""Allowlisted model/runtime identity captured after successful inference."""
from importlib import metadata
import hashlib
import math
from pathlib import Path
import platform
import sys
from uuid import uuid4


def _value(obj, name, default=None):
    return obj.get(name, default) if isinstance(obj, dict) else getattr(obj, name, default)


def _scalar(value):
    if value is None or isinstance(value, (str, bool, int)):
        return value
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    if isinstance(value, (list, tuple)):
        return [_scalar(item) for item in value]
    return None


def _version(distribution):
    try:
        return metadata.version(distribution)
    except metadata.PackageNotFoundError:
        return 'unknown'


def _weights_digest(detector, weights, model):
    if weights is None:
        return None, 'UNAVAILABLE'
    key=(str(weights), id(model))
    cached=getattr(detector, '_hubone_weights_fingerprint', None)
    if cached is not None and cached[0] == key:
        return cached[1], cached[2]
    try:
        with weights.open('rb') as stream:
            digest=hashlib.file_digest(stream, 'sha256').hexdigest()
        status='HASHED'
    except OSError:
        digest, status=None, 'UNAVAILABLE'
    detector._hubone_weights_fingerprint=(key, digest, status)
    return digest, status


def capture_model_provenance(detector, sample_fps, source_fps=None):
    """Call only after detect/predict succeeds; this function never runs a model.

    The snapshot is immutable to its callers. Re-capture for a new runtime
    revision, retaining earlier snapshots and their observation references.
    """
    config=getattr(detector, 'config', None)
    model=getattr(detector, '_model', None)
    if model is None:
        model=getattr(detector, 'model', None)
    weight_value=getattr(detector, 'weights', None)
    if weight_value is None:
        weight_value=_value(config, 'weights')
    weights=Path(weight_value) if isinstance(weight_value, (str, Path)) else None
    digest, hash_status=_weights_digest(detector, weights, model)
    checkpoint=getattr(model, 'ckpt', None)
    version=_value(checkpoint, 'model_version')
    version_source='checkpoint.model_version'
    if version is None:
        version=_value(checkpoint, 'version')
        version_source='checkpoint.version (framework metadata, not a semantic model release)'
    version=_scalar(version)
    if version is None:
        version, version_source='unknown', 'unknown'

    actual_device=getattr(detector, 'actual_device', None)
    if actual_device is None:
        actual_device=getattr(detector, 'device', None)
    parameter_model=getattr(model, 'model', None)
    try:
        if parameter_model is not None:
            actual_device=str(next(parameter_model.parameters()).device)
    except (AttributeError, StopIteration):
        pass
    requested=_value(config, 'device')
    requested_source='config.device'
    if requested is None:
        requested=getattr(detector, 'device', 'unknown')
        requested_source='resolved_device_fallback'
    if getattr(detector, 'requested_device', None) is not None:
        requested=detector.requested_device
        requested_source='adapter.requested_device'
    fallback=getattr(detector, 'fallback_reason', None)
    if fallback is not None:
        fallback=str(fallback)
        fallback='FALLBACK_REPORTED' if '://' in fallback else fallback[:256]

    predictor=getattr(model, 'predictor', None)
    args=getattr(predictor, 'args', None)
    mapping={'imgsz':'imgsz', 'confidence':'conf', 'iou':'iou', 'max_detections':'max_det',
             'batch':'batch', 'person_class_id':'person_class_id'}
    parameters={}
    for config_key, effective_key in mapping.items():
        value=_value(args, effective_key)
        if value is None:
            value=_value(config, config_key)
        parameters[effective_key]=_scalar(value)
    parameters['half']=_scalar(getattr(detector, 'half', _value(args, 'half', _value(config, 'half'))))
    parameters['classes']=_scalar(_value(args, 'classes'))

    torch=getattr(detector, '_torch', None)
    if torch is None:
        torch=sys.modules.get('torch')
    cpu_threads=torch.get_num_threads() if torch is not None and hasattr(torch, 'get_num_threads') else None
    cuda_build=_value(getattr(torch, 'version', None), 'cuda')
    cv2=sys.modules.get('cv2')
    software={
        'python':platform.python_version(), 'torch':_version('torch'),
        'torchvision':_version('torchvision'), 'ultralytics':_version('ultralytics'),
        'numpy':_version('numpy'), 'opencv':getattr(cv2, '__version__', 'unknown'),
        'torch_cuda_build':_scalar(cuda_build),
    }
    return {
        'schema_version':'vision-model-provenance/1.0', 'provenance_id':uuid4().hex,
        'model_name':weights.stem if weights is not None else type(detector).__name__,
        'model_name_source':'weights_filename' if weights is not None else 'adapter_class',
        'model_version':version, 'model_version_source':version_source,
        'weights_file':weights.name if weights is not None else None,
        'weights_sha256':digest, 'weights_hash_status':hash_status,
        'requested_device':str(requested), 'requested_device_source':requested_source,
        'actual_device':str(actual_device) if actual_device is not None else 'unknown',
        'fallback_reason':fallback, 'inference_parameters':parameters,
        'cpu_threads':cpu_threads,
        'sampling':{'sample_fps':_scalar(sample_fps), 'source_fps':_scalar(source_fps)},
        'software':software,
    }
