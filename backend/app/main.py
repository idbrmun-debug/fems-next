from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from .alarm_screen import acknowledge_alarm, register_alarm_screen_routes
from .config_store import save_runtime_settings
from .dashboard import register_dashboard_routes
from .equipment_screen import register_equipment_screen_routes
from .influx import query_flux, write_points
from .maintenance import (
    maintenance_record_to_point,
    parse_maintenance_payload,
)
from .maintenance_screen import register_maintenance_screen_routes, save_maintenance_screen
from .production import (
    parse_production_excel,
    parse_production_payload,
    production_record_to_point,
)
from .production_dashboard import (
    register_production_dashboard_routes,
    save_production_excel,
    save_production_manual,
)
from .report_screen import register_report_screen_routes
from .settings import get_public_settings, get_settings
from .settings_screen import register_settings_screen_routes, save_settings_screen

FRONTEND_DIR = "/frontend"


def _float_value(rows: list[dict], default: float = 0.0) -> float:
    if not rows:
        return default
    value = rows[0].get("_value")
    if value is None:
        return default
    return float(value)


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    register_dashboard_routes(app)
    register_equipment_screen_routes(app)
    register_production_dashboard_routes(app)
    register_settings_screen_routes(app)
    register_maintenance_screen_routes(app)
    register_alarm_screen_routes(app)
    register_report_screen_routes(app)

    @app.get("/")
    def frontend_index():
        return send_from_directory(FRONTEND_DIR, "index.html")

    @app.get("/<path:filename>")
    def frontend_asset(filename: str):
        return send_from_directory(FRONTEND_DIR, filename)

    @app.get("/api/health")
    def health():
        settings = get_settings()
        return jsonify(
            {
                "status": "ok",
                "service": "fems-next-backend",
                "bucket": settings["influxdb_bucket"],
            }
        )

    @app.get("/api/settings")
    def settings():
        return jsonify(get_public_settings())

    @app.post("/api/settings")
    def update_settings():
        payload = request.get_json(silent=True) or {}
        target = payload.get("target_unit_kwh_per_unit")
        if target in (None, ""):
            return jsonify({"status": "error", "message": "target_unit_kwh_per_unit is required"}), 400

        try:
            target_value = float(target)
        except (TypeError, ValueError):
            return jsonify({"status": "error", "message": "target_unit_kwh_per_unit must be numeric"}), 400

        if target_value < 0:
            return jsonify({"status": "error", "message": "target_unit_kwh_per_unit must be zero or greater"}), 400

        save_runtime_settings({"target_unit_kwh_per_unit": target_value})
        return jsonify({"status": "saved", **get_public_settings()})

    @app.post("/api/settings-screen/save")
    def settings_screen_save():
        payload = request.get_json(silent=True) or {}
        return jsonify(save_settings_screen(payload)), 201

    @app.post("/api/alarm-page/acknowledge")
    def alarm_acknowledge():
        payload = request.get_json(silent=True) or {}
        return jsonify(acknowledge_alarm(payload)), 201

    @app.post("/api/production-input")
    def production_input():
        payload = request.get_json(silent=True) or {}
        try:
            record = parse_production_payload(payload)
            write_points([production_record_to_point(record)])
        except ValueError as exc:
            return jsonify({"status": "error", "message": str(exc)}), 400

        return jsonify(
            {
                "status": "written",
                "measurement": "production_input",
                "written": 1,
            }
        ), 201

    @app.post("/api/production-page/manual")
    def production_page_manual_save():
        payload = request.get_json(silent=True) or {}
        return jsonify(save_production_manual(payload)), 201

    @app.post("/api/production-page/excel-upload")
    def production_page_excel_upload():
        file = request.files.get("file")
        filename = file.filename if file else None
        return jsonify(save_production_excel(filename)), 201

    @app.post("/api/production-upload")
    def production_upload():
        file = request.files.get("file")
        if file is None or file.filename == "":
            return jsonify({"status": "error", "message": "file is required"}), 400

        if not file.filename.lower().endswith(".xlsx"):
            return jsonify({"status": "error", "message": "only .xlsx files are supported"}), 400

        try:
            records, errors = parse_production_excel(file)
            write_points([production_record_to_point(record) for record in records])
        except ValueError as exc:
            return jsonify({"status": "error", "message": str(exc)}), 400

        status_code = 201 if records and not errors else 207
        return jsonify(
            {
                "status": "written" if not errors else "partial",
                "measurement": "production_input",
                "written": len(records),
                "errors": errors,
            }
        ), status_code

    @app.get("/api/electric-intensity")
    def electric_intensity():
        settings = get_settings()
        bucket = settings["influxdb_bucket"]
        target = float(settings["target_unit_kwh_per_unit"])
        energy_query = f'''
from(bucket: "{bucket}")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "gems_power")
  |> filter(fn: (r) => r._field == "sum_kwh")
  |> group(columns: ["factory", "process", "meter", "feeder", "furnace"])
  |> difference(nonNegative: true)
  |> group()
  |> sum()
'''
        production_query = f'''
from(bucket: "{bucket}")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "production_input")
  |> filter(fn: (r) => r._field == "quantity")
  |> group()
  |> sum()
'''
        energy_kwh = _float_value(query_flux(energy_query))
        production_quantity = _float_value(query_flux(production_query))
        unit_value = energy_kwh / production_quantity if production_quantity else 0.0
        return jsonify(
            {
                "status": "ok",
                "range": "-24h",
                "energy_kwh": energy_kwh,
                "production_quantity": production_quantity,
                "unit_kwh_per_unit": unit_value,
                "target_unit_kwh_per_unit": target,
            }
        )

    @app.route("/api/maintenance-log", methods=["GET", "POST"])
    def maintenance_log():
        if request.method == "POST":
            payload = request.get_json(silent=True) or {}
            try:
                record = parse_maintenance_payload(payload)
                write_points([maintenance_record_to_point(record)])
            except ValueError as exc:
                return jsonify({"status": "error", "message": str(exc)}), 400

            return jsonify(
                {
                    "status": "written",
                    "measurement": "maintenance_log",
                    "written": 1,
                }
            ), 201

        bucket = get_settings()["influxdb_bucket"]
        maintenance_query = f'''
from(bucket: "{bucket}")
  |> range(start: -30d)
  |> filter(fn: (r) => r._measurement == "maintenance_log")
  |> filter(fn: (r) => r._field == "work" or r._field == "owner" or r._field == "note")
  |> pivot(rowKey:["_time", "factory", "process", "meter", "feeder", "furnace", "status"], columnKey: ["_field"], valueColumn: "_value")
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: 50)
'''
        rows = query_flux(maintenance_query)
        items = [
            {
                "time": row.get("_time"),
                "factory": row.get("factory"),
                "process": row.get("process"),
                "meter": row.get("meter"),
                "feeder": row.get("feeder"),
                "furnace": row.get("furnace"),
                "status": row.get("status"),
                "work": row.get("work"),
                "owner": row.get("owner"),
                "note": row.get("note"),
            }
            for row in rows
        ]

        return jsonify({"status": "ok", "items": items})

    @app.post("/api/maintenance-page/save")
    def maintenance_screen_save():
        payload = request.get_json(silent=True) or {}
        return jsonify(save_maintenance_screen(payload)), 201

    return app


app = create_app()
