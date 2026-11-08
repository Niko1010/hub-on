"""V0.1 acceptance labels: input origin and processing method are independent."""


def labels(simulated: bool, processing_method: str, input_origin: str | None = None):
    return {
        'simulated': simulated,
        'input_origin': 'SIMULATED' if simulated else (input_origin or 'USER_PROVIDED'),
        'processing_method': processing_method,
    }
