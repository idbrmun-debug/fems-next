def dashboard_summary() -> dict:
    return {
        "status": "ok",
        "cards": [
            {
                "icon": "bi-lightning-charge-fill",
                "label": "전체 전력량 (금일)",
                "value": "25,758 kWh",
                "delta": "▼ 3.6%",
                "trend": "good",
            },
            {
                "icon": "bi-arrow-left-right",
                "label": "전체 누적 전력량 (금월)",
                "value": "729,674 kWh",
                "delta": "▼ 3.4%",
                "trend": "good",
            },
            {
                "icon": "bi-speedometer2",
                "label": "평균 원단위 (금일)",
                "value": "69.86 kWh/ton",
                "delta": "▼ 2.8%",
                "trend": "good",
            },
            {
                "icon": "bi-buildings-fill",
                "label": "총 생산량 (금일)",
                "value": "368.7 ton",
                "delta": "▲ 1.5%",
                "trend": "bad",
            },
        ],
        "input_warning": "생산량 미입력 공장: 5 공장",
    }


def dashboard_factories() -> dict:
    return {
        "status": "ok",
        "items": [
            {
                "name": "3 공장",
                "color": "#1f7aff",
                "rate": 87,
                "today_kwh": 8521,
                "month_kwh": 245123,
                "equipment_count": 24,
                "running_count": 21,
                "status_label": "정상",
            },
            {
                "name": "4 공장",
                "color": "#43a83f",
                "rate": 91,
                "today_kwh": 9342,
                "month_kwh": 268654,
                "equipment_count": 24,
                "running_count": 22,
                "status_label": "정상",
            },
            {
                "name": "5 공장",
                "color": "#8e48d6",
                "rate": 82,
                "today_kwh": 7895,
                "month_kwh": 215897,
                "equipment_count": 24,
                "running_count": 20,
                "status_label": "정상",
            },
        ],
    }


def dashboard_power_trend() -> dict:
    return {
        "status": "ok",
        "unit": "kWh",
        "labels": ["05/18", "05/19", "05/20", "05/21", "05/22", "05/23", "05/24"],
        "series": [
            {"label": "3 공장", "color": "#1f7aff", "data": [6700, 7900, 9300, 10500, 12100, 13200, 14200]},
            {"label": "4 공장", "color": "#43a83f", "data": [8200, 9500, 10800, 11200, 12600, 13400, 11200]},
            {"label": "5 공장", "color": "#8e48d6", "data": [6100, 6900, 7600, 8300, 8900, 9800, 9100]},
        ],
        "peak_power": {
            "unit": "kW",
            "labels": ["00시", "04시", "08시", "12시", "16시", "20시"],
            "series": [
                {"label": "3 공장", "color": "#1f7aff", "data": [7600, 8300, 9800, 8700, 10300, 7400]},
                {"label": "4 공장", "color": "#43a83f", "data": [9800, 9300, 11200, 10800, 11400, 7200]},
                {"label": "5 공장", "color": "#8e48d6", "data": [6900, 7600, 9000, 9800, 8800, 7300]},
            ],
        },
    }


def dashboard_specific_energy_trend() -> dict:
    return {
        "status": "ok",
        "unit": "kWh/ton",
        "labels": ["05/18", "05/19", "05/20", "05/21", "05/22", "05/23", "05/24"],
        "series": [
            {"label": "3 공장", "color": "#1f7aff", "data": [25.5, 27.3, 28.1, 26.9, 30.2, 29.7, 31.4]},
            {"label": "4 공장", "color": "#43a83f", "data": [24.2, 25.7, 26.4, 23.1, 24.6, 25.5, 25.1]},
            {"label": "5 공장", "color": "#8e48d6", "data": [31.2, 33.4, 29.5, 27.2, 28.6, 29.1, 28.4]},
        ],
        "target": {"label": "목표 원단위", "color": "#ef3340", "data": [20.8, 20.8, 20.8, 20.8, 20.8, 20.8, 20.8]},
    }


def dashboard_production_status() -> dict:
    return {
        "status": "ok",
        "items": [
            {"factory": "3 공장", "today": 125.3, "total": 3652.1, "input_status": "입력 완료", "recent": "05-24 08:00"},
            {"factory": "4 공장", "today": 132.8, "total": 3857.7, "input_status": "입력 완료", "recent": "05-24 08:00"},
            {"factory": "5 공장", "today": 110.6, "total": 3102.4, "input_status": "입력 필요", "recent": "-"},
        ],
        "indicators": [
            {"factory": "3 공장", "power_kwh": 8521, "production_ton": 125.3, "specific_energy": 68.00, "target_specific_energy": 20.50, "attainment": 30.1},
            {"factory": "4 공장", "power_kwh": 9342, "production_ton": 132.8, "specific_energy": 70.35, "target_specific_energy": 20.00, "attainment": 28.4},
            {"factory": "5 공장", "power_kwh": 7895, "production_ton": 110.6, "specific_energy": 71.38, "target_specific_energy": 22.00, "attainment": 30.8},
        ],
    }


def dashboard_alarms() -> dict:
    return {
        "status": "ok",
        "summary": {
            "total": 10,
            "items": [
                {"type": "경고", "count": 6, "ratio": 60, "color": "#f3a400"},
                {"type": "정지", "count": 3, "ratio": 30, "color": "#ef3340"},
                {"type": "통신이상", "count": 1, "ratio": 10, "color": "#1f7aff"},
            ],
        },
        "recent": [
            {"time": "14:28:58", "factory": "4 공장", "message": "전기로 11 온도 상승 경고 (88.5℃)", "type": "경고"},
            {"time": "14:27:41", "factory": "5 공장", "message": "전기로 17 전류 불균형 경고", "type": "경고"},
            {"time": "14:25:13", "factory": "3 공장", "message": "전기로 03 통신 이상", "type": "통신이상"},
            {"time": "14:20:33", "factory": "5 공장", "message": "전기로 05 설비 정지", "type": "정지"},
            {"time": "14:18:07", "factory": "4 공장", "message": "전기로 08 온도 상승 경고 (79.1℃)", "type": "경고"},
        ],
    }


def register_dashboard_routes(app):
    app.add_url_rule("/api/dashboard/summary", "dashboard_summary", dashboard_summary, methods=["GET"])
    app.add_url_rule("/api/dashboard/factories", "dashboard_factories", dashboard_factories, methods=["GET"])
    app.add_url_rule("/api/dashboard/power-trend", "dashboard_power_trend", dashboard_power_trend, methods=["GET"])
    app.add_url_rule(
        "/api/dashboard/specific-energy-trend",
        "dashboard_specific_energy_trend",
        dashboard_specific_energy_trend,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/dashboard/production-status",
        "dashboard_production_status",
        dashboard_production_status,
        methods=["GET"],
    )
    app.add_url_rule("/api/dashboard/alarms", "dashboard_alarms", dashboard_alarms, methods=["GET"])
