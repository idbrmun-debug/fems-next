def report_summary() -> dict:
    return {
        "status": "ok",
        "generated_at": "2025-05-24 14:30:00",
        "cards": [
            {"label": "총 전력량", "value": "729,674", "unit": "kWh", "delta": "3.4%", "trend": "good", "icon": "bi-lightning-charge-fill"},
            {"label": "총 생산량", "value": "10,612.2", "unit": "ton", "delta": "1.8%", "trend": "good", "icon": "bi-building-fill-gear"},
            {"label": "평균 원단위", "value": "19.68", "unit": "kWh/ton", "delta": "2.8%", "trend": "good", "icon": "bi-speedometer2"},
            {"label": "최대 전력", "value": "14,820", "unit": "kW", "delta": "0.9%", "trend": "bad", "icon": "bi-graph-up-arrow"},
            {"label": "알람 발생", "value": "10", "unit": "건", "delta": "2건", "trend": "bad", "icon": "bi-exclamation-triangle-fill"},
        ],
        "preview": {
            "title": "일간 에너지 리포트",
            "period": "2025-05-24",
            "summary": "3공장, 4공장, 5공장 기준 전력량과 생산량, 원단위, 알람 발생 현황을 요약합니다.",
        },
    }


def power_report() -> dict:
    return {
        "status": "ok",
        "factory_compare": {
            "labels": ["3공장", "4공장", "5공장"],
            "data": [245123, 268654, 215897],
        },
        "daily_trend": {
            "labels": ["05/18", "05/19", "05/20", "05/21", "05/22", "05/23", "05/24"],
            "datasets": [
                {"label": "3공장", "data": [31500, 32900, 34120, 35600, 36800, 37400, 38500], "color": "#1f7aff"},
                {"label": "4공장", "data": [33800, 34900, 36050, 37200, 38600, 39400, 40200], "color": "#43a83f"},
                {"label": "5공장", "data": [28400, 29300, 30400, 31200, 32300, 33100, 33900], "color": "#8e48d6"},
            ],
        },
        "peak_by_hour": {
            "labels": ["00시", "04시", "08시", "12시", "16시", "20시"],
            "datasets": [
                {"label": "3공장", "data": [7200, 7600, 9300, 11800, 12100, 8700], "color": "#1f7aff"},
                {"label": "4공장", "data": [7800, 8100, 10400, 12600, 13200, 9300], "color": "#43a83f"},
                {"label": "5공장", "data": [6600, 6900, 8700, 10200, 11000, 8100], "color": "#8e48d6"},
            ],
        },
    }


def specific_energy_report() -> dict:
    return {
        "status": "ok",
        "factory_specific": {
            "labels": ["3공장", "4공장", "5공장"],
            "actual": [19.58, 18.82, 20.73],
            "target": [20.5, 20.0, 22.0],
        },
        "achievement": [
            {"factory": "3공장", "actual": 19.58, "target": 20.5, "rate": 95.5, "status": "달성"},
            {"factory": "4공장", "actual": 18.82, "target": 20.0, "rate": 94.1, "status": "달성"},
            {"factory": "5공장", "actual": 20.73, "target": 22.0, "rate": 94.2, "status": "달성"},
        ],
    }


def production_report() -> dict:
    return {
        "status": "ok",
        "factory_compare": {
            "labels": ["3공장", "4공장", "5공장"],
            "data": [3652.1, 3857.7, 3102.4],
        },
        "daily_trend": {
            "labels": ["05/18", "05/19", "05/20", "05/21", "05/22", "05/23", "05/24"],
            "datasets": [
                {"label": "3공장", "data": [118.2, 120.5, 119.8, 124.1, 123.4, 121.0, 125.3], "color": "#1f7aff"},
                {"label": "4공장", "data": [126.4, 127.9, 128.2, 130.1, 131.3, 129.8, 132.8], "color": "#43a83f"},
                {"label": "5공장", "data": [102.8, 105.4, 107.2, 108.1, 109.5, 106.7, 110.6], "color": "#8e48d6"},
            ],
        },
        "missing": [
            {"date": "2025-05-24", "factory": "5공장", "status": "입력 필요"},
            {"date": "2025-05-23", "factory": "5공장", "status": "확인 필요"},
        ],
    }


def alarm_report() -> dict:
    return {
        "status": "ok",
        "type_counts": {
            "labels": ["경고", "정지", "통신이상", "복구완료"],
            "data": [6, 2, 1, 1],
            "colors": ["#f3a400", "#ef3340", "#7c2d92", "#43a83f"],
        },
        "equipment_top5": {
            "labels": ["전기로 11", "전기로 05", "RTU-301", "전기로 17", "RTU-302"],
            "data": [6, 4, 3, 2, 2],
        },
        "unacknowledged": 3,
    }


def report_detail() -> dict:
    return {
        "status": "ok",
        "items": [
            {"date": "2025-05-24", "factory": "3공장", "process": "압출 공정", "equipment": "RTU-301", "power_kwh": 8521, "production_ton": 125.3, "specific": 19.58, "target": 20.5, "achievement": "95.5%", "alarms": 2, "note": "정상"},
            {"date": "2025-05-24", "factory": "4공장", "process": "열처리 공정", "equipment": "전기로 11", "power_kwh": 9342, "production_ton": 132.8, "specific": 18.82, "target": 20.0, "achievement": "94.1%", "alarms": 5, "note": "온도 경고"},
            {"date": "2025-05-24", "factory": "5공장", "process": "성형 공정", "equipment": "전기로 17", "power_kwh": 7895, "production_ton": 110.6, "specific": 20.73, "target": 22.0, "achievement": "94.2%", "alarms": 3, "note": "생산량 확인 필요"},
            {"date": "2025-05-23", "factory": "3공장", "process": "압출 공정", "equipment": "RTU-302", "power_kwh": 8120, "production_ton": 120.5, "specific": 19.72, "target": 20.5, "achievement": "96.2%", "alarms": 1, "note": "정상"},
            {"date": "2025-05-23", "factory": "4공장", "process": "압출 공정", "equipment": "RTU-402", "power_kwh": 9020, "production_ton": 128.7, "specific": 18.95, "target": 20.0, "achievement": "94.8%", "alarms": 0, "note": "정상"},
        ],
    }


def register_report_screen_routes(app):
    app.add_url_rule("/api/report-page/summary", "report_summary", report_summary, methods=["GET"])
    app.add_url_rule("/api/report-page/power", "power_report", power_report, methods=["GET"])
    app.add_url_rule("/api/report-page/specific-energy", "specific_energy_report", specific_energy_report, methods=["GET"])
    app.add_url_rule("/api/report-page/production", "production_report", production_report, methods=["GET"])
    app.add_url_rule("/api/report-page/alarms", "alarm_report", alarm_report, methods=["GET"])
    app.add_url_rule("/api/report-page/detail", "report_detail", report_detail, methods=["GET"])
