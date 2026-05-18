import os

from .config_store import load_runtime_settings


def get_settings() -> dict[str, str]:
    runtime = load_runtime_settings()
    return {
        "influxdb_url": os.getenv("INFLUXDB_URL", "http://localhost:8086"),
        "influxdb_token": os.getenv("INFLUXDB_TOKEN", "dev-token-change-me"),
        "influxdb_org": os.getenv("INFLUXDB_ORG", "fems"),
        "influxdb_bucket": os.getenv("INFLUXDB_BUCKET", "gems_test"),
        "target_unit_kwh_per_unit": str(
            runtime.get(
                "target_unit_kwh_per_unit",
                os.getenv("TARGET_UNIT_KWH_PER_UNIT", "0"),
            )
        ),
    }


def get_public_settings() -> dict[str, str]:
    settings = get_settings()
    return {
        "influxdb_url": settings["influxdb_url"],
        "influxdb_org": settings["influxdb_org"],
        "influxdb_bucket": settings["influxdb_bucket"],
        "target_unit_kwh_per_unit": settings["target_unit_kwh_per_unit"],
    }
