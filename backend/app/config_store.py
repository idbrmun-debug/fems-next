from __future__ import annotations

import json
from pathlib import Path
from typing import Any


CONFIG_PATH = Path(__file__).resolve().parents[1] / "data" / "settings.json"


def load_runtime_settings() -> dict[str, Any]:
    if not CONFIG_PATH.exists():
        return {}

    with CONFIG_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_runtime_settings(settings: dict[str, Any]) -> dict[str, Any]:
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    current = load_runtime_settings()
    current.update(settings)

    with CONFIG_PATH.open("w", encoding="utf-8") as file:
        json.dump(current, file, indent=2)

    return current
