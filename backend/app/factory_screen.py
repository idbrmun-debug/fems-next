FACTORIES = ["3공장", "4공장", "5공장"]


def _factory_rows() -> list[dict]:
    return [
        {
            "factory": "3공장",
            "power_kw": 8521,
            "today_kwh": 8521,
            "month_kwh": 245123,
            "production_ton": 125.3,
            "specific": 19.58,
            "target_specific": 20.5,
            "achievement": 95.5,
            "operation_rate": 87,
            "alarm_count": 2,
            "status": "정상",
            "target_production": 130,
            "target_power": 9000,
        },
        {
            "factory": "4공장",
            "power_kw": 9342,
            "today_kwh": 9342,
            "month_kwh": 268654,
            "production_ton": 132.8,
            "specific": 18.82,
            "target_specific": 20.0,
            "achievement": 94.1,
            "operation_rate": 91,
            "alarm_count": 5,
            "status": "경고",
            "target_production": 135,
            "target_power": 9800,
        },
        {
            "factory": "5공장",
            "power_kw": 7895,
            "today_kwh": 7895,
            "month_kwh": 215897,
            "production_ton": 110.6,
            "specific": 20.73,
            "target_specific": 22.0,
            "achievement": 94.2,
            "operation_rate": 82,
            "alarm_count": 3,
            "status": "확인필요",
            "target_production": 118,
            "target_power": 8200,
        },
    ]


def _process_rows() -> list[dict]:
    return [
        {"factory": "3공장", "process": "압출 공정", "equipment_count": 8, "running_count": 7, "power_kw": 5120, "today_kwh": 5102, "production_ton": 75.2, "specific": 19.42, "target_specific": 20.5, "alarm_count": 1, "status": "정상"},
        {"factory": "3공장", "process": "성형 공정", "equipment_count": 6, "running_count": 5, "power_kw": 3401, "today_kwh": 3419, "production_ton": 50.1, "specific": 19.82, "target_specific": 20.5, "alarm_count": 1, "status": "정상"},
        {"factory": "4공장", "process": "열처리 공정", "equipment_count": 10, "running_count": 9, "power_kw": 6420, "today_kwh": 6408, "production_ton": 82.8, "specific": 18.40, "target_specific": 20.0, "alarm_count": 4, "status": "경고"},
        {"factory": "4공장", "process": "압출 공정", "equipment_count": 7, "running_count": 7, "power_kw": 2922, "today_kwh": 2934, "production_ton": 50.0, "specific": 19.20, "target_specific": 20.0, "alarm_count": 1, "status": "정상"},
        {"factory": "5공장", "process": "성형 공정", "equipment_count": 9, "running_count": 7, "power_kw": 4895, "today_kwh": 4902, "production_ton": 66.4, "specific": 20.95, "target_specific": 22.0, "alarm_count": 2, "status": "확인필요"},
        {"factory": "5공장", "process": "열처리 공정", "equipment_count": 5, "running_count": 4, "power_kw": 3000, "today_kwh": 2993, "production_ton": 44.2, "specific": 20.40, "target_specific": 22.0, "alarm_count": 1, "status": "경고"},
    ]


def _feeder_rows() -> list[dict]:
    return [
        {"factory": "3공장", "process": "압출 공정", "feeder": "압출 라인 1", "equipment": "압출 메인계측기", "meter": "RTU-301", "power_kw": 842.5, "avg_v": 379.8, "avg_a": 1280.5, "avg_pf": 0.94, "today_kwh": 8521, "status": "가동"},
        {"factory": "3공장", "process": "압출 공정", "feeder": "압출 라인 1", "equipment": "압출 피더 1", "meter": "RTU-302", "power_kw": 612.2, "avg_v": 378.2, "avg_a": 1012.0, "avg_pf": 0.78, "today_kwh": 6210, "status": "경고"},
        {"factory": "3공장", "process": "성형 공정", "feeder": "성형 라인 2", "equipment": "성형 프레스 03", "meter": "RTU-303", "power_kw": 520.4, "avg_v": 380.1, "avg_a": 830.0, "avg_pf": 0.92, "today_kwh": 4180, "status": "가동"},
        {"factory": "4공장", "process": "열처리 공정", "feeder": "열처리 라인 2", "equipment": "전기로 11", "meter": "RTU-401", "power_kw": 1184.4, "avg_v": 381.4, "avg_a": 1810.3, "avg_pf": 0.96, "today_kwh": 9342, "status": "가동"},
        {"factory": "4공장", "process": "열처리 공정", "feeder": "열처리 라인 1", "equipment": "전기로 08", "meter": "RTU-402", "power_kw": 980.0, "avg_v": 380.1, "avg_a": 1540.7, "avg_pf": 0.95, "today_kwh": 8120, "status": "가동"},
        {"factory": "4공장", "process": "압출 공정", "feeder": "압출 라인 2", "equipment": "압출 피더 2", "meter": "RTU-403", "power_kw": 740.3, "avg_v": 379.5, "avg_a": 1120.2, "avg_pf": 0.93, "today_kwh": 5900, "status": "가동"},
        {"factory": "5공장", "process": "성형 공정", "feeder": "성형 라인 1", "equipment": "성형 메인계측기", "meter": "RTU-501", "power_kw": 0.0, "avg_v": 0.0, "avg_a": 0.0, "avg_pf": 0.0, "today_kwh": 4210, "status": "정지"},
        {"factory": "5공장", "process": "성형 공정", "feeder": "성형 라인 2", "equipment": "전기로 17", "meter": "RTU-502", "power_kw": 725.8, "avg_v": 376.8, "avg_a": 1190.4, "avg_pf": 0.91, "today_kwh": 7895, "status": "통신이상"},
        {"factory": "5공장", "process": "열처리 공정", "feeder": "열처리 라인 3", "equipment": "열처리 전기로 05", "meter": "RTU-503", "power_kw": 840.5, "avg_v": 378.9, "avg_a": 1320.1, "avg_pf": 0.92, "today_kwh": 6994, "status": "경고"},
    ]


def _filter_factory(rows: list[dict], factory: str | None) -> list[dict]:
    if not factory or factory == "전체":
        return rows
    return [row for row in rows if row["factory"] == factory]


def factory_summary(factory: str | None = None) -> dict:
    rows = _filter_factory(_factory_rows(), factory)
    if not rows:
        rows = _factory_rows()
    total_power = sum(row["power_kw"] for row in rows)
    today_kwh = sum(row["today_kwh"] for row in rows)
    month_kwh = sum(row["month_kwh"] for row in rows)
    production = sum(row["production_ton"] for row in rows)
    specific = round(today_kwh / production, 2) if production else 0
    operation = round(sum(row["operation_rate"] for row in rows) / len(rows), 1)
    alarm_count = sum(row["alarm_count"] for row in rows)
    selected = factory or "전체"
    return {
        "status": "ok",
        "factory": selected,
        "cards": [
            {"label": "선택 공장 총 전력", "value": round(total_power, 1), "unit": "kW", "icon": "bi-lightning-charge-fill", "tone": "blue"},
            {"label": "금일 전력량", "value": round(today_kwh, 1), "unit": "kWh", "icon": "bi-battery-charging", "tone": "green"},
            {"label": "금월 누적 전력량", "value": round(month_kwh, 1), "unit": "kWh", "icon": "bi-calendar3", "tone": "purple"},
            {"label": "금일 생산량", "value": round(production, 1), "unit": "ton", "icon": "bi-building-fill-gear", "tone": "amber"},
            {"label": "평균 원단위", "value": specific, "unit": "kWh/ton", "icon": "bi-speedometer2", "tone": "blue"},
            {"label": "가동률", "value": operation, "unit": "%", "icon": "bi-activity", "tone": "green"},
            {"label": "알람 건수", "value": alarm_count, "unit": "건", "icon": "bi-exclamation-triangle-fill", "tone": "red"},
        ],
        "targets": {
            "specific": {"label": "목표 원단위 대비 현재 원단위", "target": 20.8, "actual": specific, "rate": min(round((20.8 / specific) * 100, 1), 120) if specific else 0},
            "production": {"label": "목표 생산량 대비 현재 생산량", "target": sum(row["target_production"] for row in rows), "actual": round(production, 1), "rate": round((production / sum(row["target_production"] for row in rows)) * 100, 1)},
            "power": {"label": "목표 전력량 대비 현재 전력량", "target": sum(row["target_power"] for row in rows), "actual": round(today_kwh, 1), "rate": min(round((today_kwh / sum(row["target_power"] for row in rows)) * 100, 1), 120)},
        },
    }


def factory_comparison() -> dict:
    return {"status": "ok", "items": _factory_rows()}


def process_status(factory: str | None = None) -> dict:
    return {"status": "ok", "items": _filter_factory(_process_rows(), factory)}


def feeder_status(factory: str | None = None, process: str | None = None) -> dict:
    rows = _filter_factory(_feeder_rows(), factory)
    if process and process != "전체":
        rows = [row for row in rows if row["process"] == process]
    return {"status": "ok", "items": rows}


def factory_power_trend(factory: str | None = None) -> dict:
    scale = {"전체": 1.0, "3공장": 0.34, "4공장": 0.36, "5공장": 0.30}.get(factory or "전체", 1.0)
    base = [12500, 13200, 14600, 16800, 18100, 17400, 19200, 21000]
    return {
        "status": "ok",
        "labels": ["08시", "10시", "12시", "14시", "16시", "18시", "20시", "22시"],
        "data": [round(value * scale, 1) for value in base],
    }


def factory_specific_energy_trend(factory: str | None = None) -> dict:
    return {
        "status": "ok",
        "factory": factory or "전체",
        "labels": ["05/18", "05/19", "05/20", "05/21", "05/22", "05/23", "05/24"],
        "data": [20.8, 20.2, 19.9, 20.1, 19.7, 19.9, 19.68],
        "target": [20.8, 20.8, 20.8, 20.8, 20.8, 20.8, 20.8],
    }


def register_factory_screen_routes(app):
    app.add_url_rule("/api/factory-page/summary", "factory_summary_all", factory_summary, methods=["GET"])
    app.add_url_rule("/api/factory-page/summary/<factory>", "factory_summary", factory_summary, methods=["GET"])
    app.add_url_rule("/api/factory-page/comparison", "factory_comparison", factory_comparison, methods=["GET"])
    app.add_url_rule("/api/factory-page/process-status", "process_status_all", process_status, methods=["GET"])
    app.add_url_rule("/api/factory-page/process-status/<factory>", "process_status", process_status, methods=["GET"])
    app.add_url_rule("/api/factory-page/feeder-status", "feeder_status_all", feeder_status, methods=["GET"])
    app.add_url_rule("/api/factory-page/feeder-status/<factory>", "feeder_status", feeder_status, methods=["GET"])
    app.add_url_rule("/api/factory-page/feeder-status/<factory>/<process>", "feeder_status_process", feeder_status, methods=["GET"])
    app.add_url_rule("/api/factory-page/power-trend", "factory_power_trend_all", factory_power_trend, methods=["GET"])
    app.add_url_rule("/api/factory-page/power-trend/<factory>", "factory_power_trend", factory_power_trend, methods=["GET"])
    app.add_url_rule("/api/factory-page/specific-energy-trend", "factory_specific_trend_all", factory_specific_energy_trend, methods=["GET"])
    app.add_url_rule("/api/factory-page/specific-energy-trend/<factory>", "factory_specific_trend", factory_specific_energy_trend, methods=["GET"])
