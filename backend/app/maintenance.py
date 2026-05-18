from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from influxdb_client import Point, WritePrecision

from .influx import parse_timestamp


REQUIRED_FIELDS = ("factory", "process", "meter", "feeder", "furnace", "work", "owner")


@dataclass(frozen=True)
class MaintenanceRecord:
    factory: str
    process: str
    meter: str
    feeder: str
    furnace: str
    work: str
    owner: str
    status: str
    time: datetime
    note: str | None = None


def _clean(value: Any) -> str:
    return str(value).strip()


def parse_maintenance_payload(payload: dict[str, Any]) -> MaintenanceRecord:
    missing = [field for field in REQUIRED_FIELDS if payload.get(field) in (None, "")]
    if missing:
        raise ValueError(f"missing required fields: {', '.join(missing)}")

    return MaintenanceRecord(
        factory=_clean(payload["factory"]),
        process=_clean(payload["process"]),
        meter=_clean(payload["meter"]),
        feeder=_clean(payload["feeder"]),
        furnace=_clean(payload["furnace"]),
        work=_clean(payload["work"]),
        owner=_clean(payload["owner"]),
        status=_clean(payload.get("status") or "done"),
        note=_clean(payload["note"]) if payload.get("note") not in (None, "") else None,
        time=parse_timestamp(payload.get("time")),
    )


def maintenance_record_to_point(record: MaintenanceRecord) -> Point:
    point = (
        Point("maintenance_log")
        .tag("factory", record.factory)
        .tag("process", record.process)
        .tag("meter", record.meter)
        .tag("feeder", record.feeder)
        .tag("furnace", record.furnace)
        .tag("status", record.status)
        .field("work", record.work)
        .field("owner", record.owner)
        .time(record.time, WritePrecision.NS)
    )

    if record.note:
        point.field("note", record.note)

    return point
