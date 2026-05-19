def settings_equipment_tree() -> dict:
    return {
        "status": "ok",
        "selected_id": "RTU-301",
        "items": [
            {
                "id": "all",
                "label": "전체 공장",
                "icon": "bi-calendar3",
                "children": [
                    {
                        "id": "factory-3",
                        "label": "3 공장",
                        "icon": "bi-buildings-fill",
                        "color": "#1f7aff",
                        "children": [
                            {
                                "id": "process-3-press",
                                "label": "압출 공정",
                                "children": [
                                    {
                                        "id": "line-3-press-1",
                                        "label": "압출 라인 1",
                                        "children": [
                                            {"id": "RTU-301", "label": "RTU-301 (메인계측기)", "selected": True},
                                            {"id": "RTU-302", "label": "RTU-302 (피더1)"},
                                            {"id": "RTU-303", "label": "RTU-303 (피더2)"},
                                        ],
                                    },
                                    {"id": "line-3-press-2", "label": "압출 라인 2"},
                                ],
                            },
                            {"id": "process-3-heat", "label": "열처리 공정"},
                            {"id": "process-3-form", "label": "성형 공정"},
                        ],
                    },
                    {
                        "id": "factory-4",
                        "label": "4 공장",
                        "icon": "bi-buildings-fill",
                        "color": "#43a83f",
                        "children": [
                            {"id": "process-4-press", "label": "압출 공정"},
                            {"id": "process-4-heat", "label": "열처리 공정"},
                            {"id": "process-4-form", "label": "성형 공정"},
                        ],
                    },
                    {
                        "id": "factory-5",
                        "label": "5 공장",
                        "icon": "bi-buildings-fill",
                        "color": "#8e48d6",
                        "children": [
                            {"id": "process-5-press", "label": "압출 공정"},
                            {"id": "process-5-heat", "label": "열처리 공정"},
                            {"id": "process-5-form", "label": "성형 공정"},
                        ],
                    },
                ],
            }
        ],
    }


def settings_equipment_detail() -> dict:
    return {
        "status": "ok",
        "equipment": {
            "meter_id": "RTU-301",
            "meter_name": "3공장 압출1라인 메인계측기",
            "factory": "3 공장",
            "process": "압출 공정",
            "line": "압출 라인 1",
            "equipment_name": "메인계측기",
            "meter_type": "RTU",
            "communication": "Modbus TCP",
            "ip": "192.168.1.301",
            "port": 502,
            "location": "압출동 1층 배전반",
            "installed_at": "2024-01-15",
            "memo": "압출 라인 1 전체 전력 사용량 측정",
        },
        "alarm_rules": [
            {"name": "전압", "low": "-", "high": "380", "unit": "V", "duration": "5초", "level": "경고", "enabled": True},
            {"name": "전류", "low": "-", "high": "800", "unit": "A", "duration": "5초", "level": "경고", "enabled": True},
            {"name": "역률", "low": "0.80", "high": "-", "unit": "-", "duration": "10초", "level": "경고", "enabled": True},
            {"name": "전력", "low": "-", "high": "500", "unit": "kW", "duration": "5초", "level": "경고", "enabled": True},
            {"name": "통신 상태", "low": "-", "high": "-", "unit": "-", "duration": "30초", "level": "중지", "enabled": True},
        ],
        "target": {
            "process": "압출 공정",
            "specific_energy": 18.0,
            "period": "2025-01-01 ~ 2025-12-31",
            "history": [
                {"start": "2024-01-01", "end": "2024-12-31", "target": 17.5, "owner": "admin", "created_at": "2024-01-01 09:00"},
                {"start": "2023-01-01", "end": "2023-12-31", "target": 17.0, "owner": "admin", "created_at": "2023-01-01 09:00"},
                {"start": "2022-01-01", "end": "2022-12-31", "target": 16.5, "owner": "admin", "created_at": "2022-01-01 09:00"},
            ],
        },
        "connected_meters": [
            {"meter_id": "RTU-302", "meter_name": "3공장 압출1라인 피더1", "type": "RTU", "connection": "Modbus TCP", "ip": "192.168.1.302", "port": 502, "role": "피더", "status": "정상"},
            {"meter_id": "RTU-303", "meter_name": "3공장 압출1라인 피더2", "type": "RTU", "connection": "Modbus TCP", "ip": "192.168.1.303", "port": 502, "role": "피더", "status": "정상"},
        ],
    }


def save_settings_screen(payload: dict | None = None) -> dict:
    return {
        "status": "saved",
        "message": "더미 설정 저장 완료",
        "received": payload or {},
    }


def register_settings_screen_routes(app):
    app.add_url_rule("/api/settings-screen/tree", "settings_equipment_tree", settings_equipment_tree, methods=["GET"])
    app.add_url_rule(
        "/api/settings-screen/equipment-detail",
        "settings_equipment_detail",
        settings_equipment_detail,
        methods=["GET"],
    )
