from pathlib import Path
import os
import sys

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / '.env', override=False)
sys.path.insert(0, str(ROOT / 'third_party'))


def data_dir() -> Path:
    return Path(os.getenv('HUBONE_DATA_DIR') or ROOT / 'runtime').resolve()


def configured_path(name: str, default: str) -> Path:
    p = Path(os.getenv(name) or default)
    return p if p.is_absolute() else ROOT / p


class CapabilityError(RuntimeError):
    """Missing model, service or credential; never replaced by synthetic results."""
