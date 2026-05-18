from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

from .settings import get_settings


def parse_timestamp(value: Any) -> datetime:
    if value in (None, ""):
        return datetime.now(timezone.utc)

    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)

    if isinstance(value, str):
        normalized = value.strip()
        if normalized.endswith("Z"):
            normalized = normalized[:-1] + "+00:00"
        parsed = datetime.fromisoformat(normalized)
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)

    raise ValueError("time must be an ISO-8601 string")


def write_points(points: list[Point]) -> None:
    if not points:
        return

    settings = get_settings()
    with InfluxDBClient(
        url=settings["influxdb_url"],
        token=settings["influxdb_token"],
        org=settings["influxdb_org"],
    ) as client:
        write_api = client.write_api(write_options=SYNCHRONOUS)
        write_api.write(
            bucket=settings["influxdb_bucket"],
            org=settings["influxdb_org"],
            record=points,
            write_precision=WritePrecision.NS,
        )


def query_flux(query: str) -> list[dict[str, Any]]:
    settings = get_settings()
    with InfluxDBClient(
        url=settings["influxdb_url"],
        token=settings["influxdb_token"],
        org=settings["influxdb_org"],
    ) as client:
        tables = client.query_api().query(query=query, org=settings["influxdb_org"])

    rows: list[dict[str, Any]] = []
    for table in tables:
        for record in table.records:
            row = dict(record.values)
            time_value = row.get("_time")
            row["_time"] = time_value.isoformat() if time_value else None
            row["_value"] = row.get("_value")
            rows.append(row)

    return rows
