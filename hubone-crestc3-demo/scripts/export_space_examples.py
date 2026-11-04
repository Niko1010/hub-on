"""Export actual local API examples without embedding building geometry in code."""
import argparse
import json
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://127.0.0.1:8000')
    parser.add_argument('--output', type=Path, default=ROOT/'docs/api-examples')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    endpoints = {
        'spaces.json': '/api/v1/spaces',
        'floors.json': '/api/v1/floors',
        'zones-not-connected.json': '/api/v1/zones',
        'cameras-not-connected.json': '/api/v1/cameras',
        'cameras-simulated-floor-1.json': '/api/v1/cameras?floor_id=floor_1&include_simulated=true',
        'events.json': '/api/v1/events',
        'openapi.json': '/openapi.json',
    }
    with httpx.Client(base_url=args.base_url, timeout=30, trust_env=False) as client:
        for name, path in endpoints.items():
            response = client.get(path)
            response.raise_for_status()
            (args.output/name).write_text(json.dumps(response.json(), ensure_ascii=False, indent=2), encoding='utf-8')
    print('Exported', len(endpoints), 'actual local API responses to', args.output)


if __name__ == '__main__':
    main()
