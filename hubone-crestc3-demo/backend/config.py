from pathlib import Path
import os
import sys

from dotenv import load_dotenv, dotenv_values

ROOT = Path(__file__).resolve().parents[1]
# Only model settings may override the legacy profile; camera/vision settings stay untouched.
for key,value in dotenv_values(ROOT / '.env.local',interpolate=False).items():
    if value is not None and key.startswith(('LLM_','DEEPSEEK_','ANTHROPIC_','HUBONE_DEEPSEEK_')):
        os.environ.setdefault(key,value)
load_dotenv(ROOT / '.env', override=False)
sys.path.insert(0, str(ROOT / 'third_party'))


def data_dir() -> Path:
    return Path(os.getenv('HUBONE_DATA_DIR') or ROOT / 'runtime').resolve()


def configured_path(name: str, default: str) -> Path:
    p = Path(os.getenv(name) or default)
    return p if p.is_absolute() else ROOT / p


class CapabilityError(RuntimeError):
    """Missing model, service or credential; never replaced by synthetic results."""
