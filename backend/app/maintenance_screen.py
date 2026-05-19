def maintenance_screen_data() -> dict:
    return {
        "status": "ok",
        "summary": [
            {"label": "금월 유지보수", "value": "18건", "delta": "전월 대비 +4건", "icon": "bi-tools", "tone": "blue"},
            {"label": "예방정비", "value": "11건", "delta": "전체 61%", "icon": "bi-shield-check", "tone": "green"},
            {"label": "고장정비", "value": "4건", "delta": "긴급 2건 포함", "icon": "bi-exclamation-triangle", "tone": "red"},
            {"label": "총 정지시간", "value": "14.5h", "delta": "전월 대비 -2.1h", "icon": "bi-clock-history", "tone": "amber"},
            {"label": "총 비용", "value": "₩8.7M", "delta": "예산 대비 72%", "icon": "bi-cash-coin", "tone": "purple"},
        ],
        "filters": {
            "factories": ["전체", "3 공장", "4 공장", "5 공장"],
            "processes": ["전체", "압출 공정", "열처리 공정", "성형 공정"],
            "equipments": ["전체", "RTU-301", "RTU-302", "RTU-401", "전기로 05", "압출 라인 1"],
            "work_types": ["전체", "정기점검", "긴급수리", "부품교체", "센서교정", "청소"],
            "statuses": ["전체", "완료", "진행중", "예정"],
        },
        "history": [
            {"date": "2025-05-24", "factory": "3 공장", "process": "압출 공정", "equipment": "RTU-301", "work_type": "정기점검", "work": "메인 계측기 통신 상태 및 전원부 점검", "owner": "김정비", "downtime": 0.5, "cost": 120000, "status": "완료"},
            {"date": "2025-05-23", "factory": "4 공장", "process": "열처리 공정", "equipment": "전기로 05", "work_type": "긴급수리", "work": "온도 상승 경고 후 냉각팬 교체", "owner": "박설비", "downtime": 2.0, "cost": 1850000, "status": "완료"},
            {"date": "2025-05-22", "factory": "5 공장", "process": "성형 공정", "equipment": "압출 라인 1", "work_type": "부품교체", "work": "컨베이어 구동 모터 베어링 교체", "owner": "이기술", "downtime": 3.5, "cost": 2450000, "status": "완료"},
            {"date": "2025-05-21", "factory": "3 공장", "process": "압출 공정", "equipment": "RTU-302", "work_type": "센서교정", "work": "전류 센서 영점 보정 및 계측값 비교", "owner": "최계측", "downtime": 0.0, "cost": 250000, "status": "완료"},
            {"date": "2025-05-20", "factory": "4 공장", "process": "압출 공정", "equipment": "RTU-401", "work_type": "정기점검", "work": "피더 패널 내부 청소 및 단자 체결 확인", "owner": "정운영", "downtime": 1.0, "cost": 320000, "status": "진행중"},
            {"date": "2025-05-19", "factory": "5 공장", "process": "열처리 공정", "equipment": "전기로 08", "work_type": "청소", "work": "분전반 필터 청소 및 열화상 점검", "owner": "한보전", "downtime": 0.5, "cost": 90000, "status": "예정"},
        ],
        "monthly_downtime": {
            "labels": ["1월", "2월", "3월", "4월", "5월", "6월"],
            "series": [
                {"label": "3 공장", "color": "#1f7aff", "data": [5.0, 4.2, 6.5, 3.0, 2.5, 0]},
                {"label": "4 공장", "color": "#43a83f", "data": [7.0, 5.5, 4.0, 6.8, 3.0, 0]},
                {"label": "5 공장", "color": "#8e48d6", "data": [3.5, 6.0, 5.2, 4.5, 9.0, 0]},
            ],
        },
        "work_type_ratio": {
            "labels": ["정기점검", "긴급수리", "부품교체", "센서교정", "청소"],
            "data": [38, 14, 22, 16, 10],
            "colors": ["#1f7aff", "#ef3340", "#8e48d6", "#43a83f", "#f3a400"],
        },
    }


def save_maintenance_screen(payload: dict | None = None) -> dict:
    return {
        "status": "saved",
        "message": "더미 유지보수 이력 저장 완료",
        "received": payload or {},
    }


def register_maintenance_screen_routes(app):
    app.add_url_rule("/api/maintenance-page/data", "maintenance_screen_data", maintenance_screen_data, methods=["GET"])
