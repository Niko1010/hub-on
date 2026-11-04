#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -m venv .venv
PY=.venv/bin/python
"$PY" -m pip install torch==2.7.1 torchvision==0.22.1 --index-url https://download.pytorch.org/whl/cpu
"$PY" -m pip install -r requirements.txt
"$PY" scripts/download_models.py
"$PY" scripts/generate_samples.py
"$PY" -m pytest -q
