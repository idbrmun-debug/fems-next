def _alarm_rows() -> list[dict]:
    return [
        {
            "id": "ALM-20250524-001",
            "occurred_at": "2025-05-24 14:28:58",
            "recovered_at": "",
            "factory": "4 공장",
            "process": "열처리 공정",
            "equipment": "전기로 11",
            "item": "온도",
            "current_value": "88.5 ℃",
            "threshold": "상한 80.0 ℃",
            "level": "경고",
            "status": "발생",
            "acknowledged": False,
            "ack_owner": "",
            "ack_time": "",
            "message": "전기로 11 온도 상승 경고가 발생했습니다.",
            "guide": "냉각팬 동작 상태와 온도 센서 결선을 확인하십시오.",
            "ack_note": "",
        },
        {
            "id": "ALM-20250524-002",
            "occurred_at": "2025-05-24 14:27:41",
            "recovered_at": "",
            "factory": "5 공장",
            "process": "압출 공정",
            "equipment": "전기로 17",
            "item": "전류",
            "current_value": "812 A",
            "threshold": "상한 800 A",
            "level": "경고",
            "status": "발생",
            "acknowledged": False,
            "ack_owner": "",
            "ack_time": "",
            "message": "전기로 17 전류 불균형 경고가 발생했습니다.",
            "guide": "부하 편차와 피더 연결 상태를 확인하십시오.",
            "ack_note": "",
        },
        {
            "id": "ALM-20250524-003",
            "occurred_at": "2025-05-24 14:25:13",
            "recovered_at": "",
            "factory": "3 공장",
            "process": "압출 공정",
            "equipment": "RTU-301",
            "item": "통신 상태",
            "current_value": "Timeout",
            "threshold": "30초",
            "level": "통신이상",
            "status": "발생",
            "acknowledged": False,
            "ack_owner": "",
            "ack_time": "",
            "message": "RTU-301 통신 응답 지연이 발생했습니다.",
            "guide": "네트워크 케이블, RTU 전원, Modbus TCP 포트를 확인하십시오.",
            "ack_note": "",
        },
        {
            "id": "ALM-20250524-004",
            "occurred_at": "2025-05-24 14:20:33",
            "recovered_at": "",
            "factory": "5 공장",
            "process": "열처리 공정",
            "equipment": "전기로 05",
            "item": "설비 상태",
            "current_value": "정지",
            "threshold": "운전",
            "level": "정지",
            "status": "발생",
            "acknowledged": True,
            "ack_owner": "admin",
            "ack_time": "2025-05-24 14:22:10",
            "message": "전기로 05 설비 정지가 발생했습니다.",
            "guide": "현장 운전반의 인터락 및 비상정지 상태를 확인하십시오.",
            "ack_note": "현장 확인 요청 완료",
        },
        {
            "id": "ALM-20250524-005",
            "occurred_at": "2025-05-24 14:18:07",
            "recovered_at": "2025-05-24 14:24:18",
            "factory": "4 공장",
            "process": "열처리 공정",
            "equipment": "전기로 08",
            "item": "온도",
            "current_value": "79.1 ℃",
            "threshold": "상한 78.0 ℃",
            "level": "복구완료",
            "status": "복구완료",
            "acknowledged": True,
            "ack_owner": "operator",
            "ack_time": "2025-05-24 14:19:00",
            "message": "전기로 08 온도 경고가 복구되었습니다.",
            "guide": "복구 후 온도 추이를 10분 이상 관찰하십시오.",
            "ack_note": "자동 복구 확인",
        },
        {
            "id": "ALM-20250524-006",
            "occurred_at": "2025-05-24 13:56:44",
            "recovered_at": "",
            "factory": "3 공장",
            "process": "성형 공정",
            "equipment": "RTU-302",
            "item": "역률",
            "current_value": "0.78",
            "threshold": "하한 0.80",
            "level": "경고",
            "status": "발생",
            "acknowledged": True,
            "ack_owner": "admin",
            "ack_time": "2025-05-24 13:59:21",
            "message": "RTU-302 역률 저하 경고가 발생했습니다.",
            "guide": "부하 상태와 콘덴서 투입 상태를 확인하십시오.",
            "ack_note": "설비 담당자 확인 중",
        },
    ]


def alarm_summary() -> dict:
    rows = _alarm_rows()
    return {
        "status": "ok",
        "cards": [
            {"label": "전체 알람", "value": len(rows), "icon": "bi-bell-fill", "tone": "blue"},
            {"label": "경고 알람", "value": sum(1 for row in rows if row["level"] == "경고"), "icon": "bi-exclamation-triangle-fill", "tone": "warning"},
            {"label": "정지 알람", "value": sum(1 for row in rows if row["level"] == "정지"), "icon": "bi-octagon-fill", "tone": "stop"},
            {"label": "통신 이상", "value": sum(1 for row in rows if row["level"] == "통신이상"), "icon": "bi-router-fill", "tone": "comm"},
            {"label": "미확인 알람", "value": sum(1 for row in rows if not row["acknowledged"]), "icon": "bi-eye-slash-fill", "tone": "unack"},
        ],
        "status_ratio": [
            {"label": "경고", "count": 3, "color": "#f3a400"},
            {"label": "정지", "count": 1, "color": "#ef3340"},
            {"label": "통신이상", "count": 1, "color": "#7c2d92"},
            {"label": "복구완료", "count": 1, "color": "#249336"},
        ],
    }


def alarm_list() -> dict:
    return {
        "status": "ok",
        "filters": {
            "factories": ["전체", "3 공장", "4 공장", "5 공장"],
            "processes": ["전체", "압출 공정", "열처리 공정", "성형 공정"],
            "equipments": ["전체", "RTU-301", "RTU-302", "전기로 05", "전기로 08", "전기로 11", "전기로 17"],
            "levels": ["전체", "경고", "정지", "통신이상", "복구완료"],
            "statuses": ["전체", "발생", "복구완료"],
            "acknowledgements": ["전체", "미확인", "확인완료"],
        },
        "items": _alarm_rows(),
        "hourly_counts": {
            "labels": ["08시", "09시", "10시", "11시", "12시", "13시", "14시"],
            "data": [1, 0, 2, 1, 3, 2, 6],
        },
        "equipment_top5": {
            "labels": ["전기로 11", "전기로 05", "RTU-301", "전기로 17", "RTU-302"],
            "data": [6, 4, 3, 2, 2],
        },
    }


def recent_alarms() -> dict:
    return {"status": "ok", "items": _alarm_rows()[:10]}


def acknowledge_alarm(payload: dict | None = None) -> dict:
    return {
        "status": "acknowledged",
        "message": "더미 알람 확인 완료",
        "received": payload or {},
    }


def register_alarm_screen_routes(app):
    app.add_url_rule("/api/alarm-page/summary", "alarm_summary", alarm_summary, methods=["GET"])
    app.add_url_rule("/api/alarm-page/list", "alarm_list", alarm_list, methods=["GET"])
    app.add_url_rule("/api/alarm-page/recent", "recent_alarms", recent_alarms, methods=["GET"])
