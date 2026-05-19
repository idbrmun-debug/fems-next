def _equipment_items() -> list[dict]:
    return [
        {
            "id": "RTU-301",
            "name": "3공장 압출1라인 메인계측기",
            "factory": "3공장",
            "process": "압출 공정",
            "line": "압출 라인 1",
            "feeder": "메인 피더",
            "type": "RTU",
            "status": "가동",
            "power_kw": 842.5,
            "today_kwh": 8521,
            "month_kwh": 245123,
            "avg_v": 379.8,
            "avg_a": 1280.5,
            "avg_pf": 0.94,
            "communication": "정상",
            "collected_at": "2025-05-24 14:30:00",
            "ip": "192.168.1.301",
            "location": "3공장 1층 배전반",
            "alarms": ["역률 저하 경고"],
            "maintenance": ["2025-05-21 통신 케이블 점검"],
        },
        {
            "id": "RTU-302",
            "name": "3공장 압출1라인 피더1",
            "factory": "3공장",
            "process": "압출 공정",
            "line": "압출 라인 1",
            "feeder": "피더 1",
            "type": "RTU",
            "status": "경고",
            "power_kw": 612.2,
            "today_kwh": 6210,
            "month_kwh": 178420,
            "avg_v": 378.2,
            "avg_a": 1012.0,
            "avg_pf": 0.78,
            "communication": "정상",
            "collected_at": "2025-05-24 14:29:52",
            "ip": "192.168.1.302",
            "location": "3공장 압출 라인 1 MCC",
            "alarms": ["역률 하한 경고"],
            "maintenance": ["2025-05-18 CT 단자 조임"],
        },
        {
            "id": "RTU-401",
            "name": "4공장 열처리 전기로 11",
            "factory": "4공장",
            "process": "열처리 공정",
            "line": "열처리 라인 2",
            "feeder": "전기로 11",
            "type": "RTU",
            "status": "가동",
            "power_kw": 1184.4,
            "today_kwh": 9342,
            "month_kwh": 268654,
            "avg_v": 381.4,
            "avg_a": 1810.3,
            "avg_pf": 0.96,
            "communication": "정상",
            "collected_at": "2025-05-24 14:30:00",
            "ip": "192.168.1.401",
            "location": "4공장 전기로 배전반",
            "alarms": ["온도 상승 경고"],
            "maintenance": ["2025-05-20 냉각팬 점검"],
        },
        {
            "id": "RTU-402",
            "name": "4공장 열처리 전기로 08",
            "factory": "4공장",
            "process": "열처리 공정",
            "line": "열처리 라인 1",
            "feeder": "전기로 08",
            "type": "RTU",
            "status": "가동",
            "power_kw": 980.0,
            "today_kwh": 8120,
            "month_kwh": 234112,
            "avg_v": 380.1,
            "avg_a": 1540.7,
            "avg_pf": 0.95,
            "communication": "정상",
            "collected_at": "2025-05-24 14:29:48",
            "ip": "192.168.1.402",
            "location": "4공장 열처리 라인 1",
            "alarms": [],
            "maintenance": ["2025-05-12 차단기 열화상 점검"],
        },
        {
            "id": "RTU-501",
            "name": "5공장 성형 메인계측기",
            "factory": "5공장",
            "process": "성형 공정",
            "line": "성형 라인 1",
            "feeder": "메인 피더",
            "type": "RTU",
            "status": "정지",
            "power_kw": 0.0,
            "today_kwh": 4210,
            "month_kwh": 132450,
            "avg_v": 0.0,
            "avg_a": 0.0,
            "avg_pf": 0.0,
            "communication": "정상",
            "collected_at": "2025-05-24 14:20:33",
            "ip": "192.168.1.501",
            "location": "5공장 성형 메인 배전반",
            "alarms": ["설비 정지"],
            "maintenance": ["2025-05-24 설비 정지 원인 확인"],
        },
        {
            "id": "RTU-502",
            "name": "5공장 성형 전기로 17",
            "factory": "5공장",
            "process": "성형 공정",
            "line": "성형 라인 2",
            "feeder": "전기로 17",
            "type": "RTU",
            "status": "통신이상",
            "power_kw": 725.8,
            "today_kwh": 7895,
            "month_kwh": 215897,
            "avg_v": 376.8,
            "avg_a": 1190.4,
            "avg_pf": 0.91,
            "communication": "Timeout",
            "collected_at": "2025-05-24 14:25:13",
            "ip": "192.168.1.502",
            "location": "5공장 성형 라인 2",
            "alarms": ["통신 응답 지연", "전류 불균형 경고"],
            "maintenance": ["2025-05-19 Modbus TCP 포트 점검"],
        },
    ]


def equipment_summary() -> dict:
    rows = _equipment_items()
    running = sum(1 for row in rows if row["status"] == "가동")
    stopped = sum(1 for row in rows if row["status"] == "정지")
    comm = sum(1 for row in rows if row["status"] == "통신이상")
    average_rate = round((running / len(rows)) * 100, 1) if rows else 0
    return {
        "status": "ok",
        "cards": [
            {"label": "전체 설비 수", "value": len(rows), "unit": "대", "icon": "bi-hdd-network-fill", "tone": "blue"},
            {"label": "가동 설비 수", "value": running, "unit": "대", "icon": "bi-play-circle-fill", "tone": "green"},
            {"label": "정지 설비 수", "value": stopped, "unit": "대", "icon": "bi-stop-circle-fill", "tone": "red"},
            {"label": "통신 이상 설비 수", "value": comm, "unit": "대", "icon": "bi-router-fill", "tone": "purple"},
            {"label": "평균 가동률", "value": average_rate, "unit": "%", "icon": "bi-speedometer2", "tone": "amber"},
        ],
    }


def equipment_list() -> dict:
    rows = _equipment_items()
    return {
        "status": "ok",
        "filters": {
            "factories": ["전체", "3공장", "4공장", "5공장"],
            "processes": ["전체", "압출 공정", "열처리 공정", "성형 공정"],
            "statuses": ["전체", "가동", "정지", "경고", "통신이상"],
            "types": ["전체", "RTU"],
        },
        "items": rows,
        "charts": {
            "process_operation": {
                "labels": ["압출 공정", "열처리 공정", "성형 공정"],
                "data": [50, 100, 0],
            },
            "power_top10": {
                "labels": [row["id"] for row in sorted(rows, key=lambda item: item["power_kw"], reverse=True)],
                "data": [row["power_kw"] for row in sorted(rows, key=lambda item: item["power_kw"], reverse=True)],
            },
            "status_ratio": {
                "labels": ["가동", "경고", "정지", "통신이상"],
                "data": [
                    sum(1 for row in rows if row["status"] == "가동"),
                    sum(1 for row in rows if row["status"] == "경고"),
                    sum(1 for row in rows if row["status"] == "정지"),
                    sum(1 for row in rows if row["status"] == "통신이상"),
                ],
                "colors": ["#43a83f", "#f3a400", "#ef3340", "#7c2d92"],
            },
        },
    }


def equipment_detail(equipment_id: str | None = None) -> dict:
    rows = _equipment_items()
    item = next((row for row in rows if row["id"] == equipment_id), rows[0])
    return {
        "status": "ok",
        "item": item,
        "grafana": {
            "placeholder": True,
            "title": "Grafana 설비 상세 패널",
            "description": "추후 RTU 계측기 ID와 InfluxDB tag 조건을 Grafana dashboard variable로 전달합니다.",
        },
    }


def equipment_power_trend(equipment_id: str | None = None) -> dict:
    return {
        "status": "ok",
        "equipment_id": equipment_id or "RTU-301",
        "labels": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        "power_kw": [720, 760, 812, 840, 825, 842],
        "energy_kwh": [1120, 2360, 3620, 4880, 6310, 8521],
    }


def register_equipment_screen_routes(app):
    app.add_url_rule("/api/equipment-page/summary", "equipment_summary", equipment_summary, methods=["GET"])
    app.add_url_rule("/api/equipment-page/list", "equipment_list", equipment_list, methods=["GET"])
    app.add_url_rule(
        "/api/equipment-page/detail/<equipment_id>",
        "equipment_detail",
        equipment_detail,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/equipment-page/power-trend/<equipment_id>",
        "equipment_power_trend",
        equipment_power_trend,
        methods=["GET"],
    )
