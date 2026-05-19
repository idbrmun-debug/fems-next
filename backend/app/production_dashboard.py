def production_page_summary() -> dict:
    return {
        "status": "ok",
        "date": "2025-05-24",
        "cards": [
            {"factory": "3 공장", "color": "#1f7aff", "today": 125.3, "total": 3652.1, "icon": "bi-buildings-fill"},
            {"factory": "4 공장", "color": "#43a83f", "today": 132.8, "total": 3857.7, "icon": "bi-buildings-fill"},
            {"factory": "5 공장", "color": "#8e48d6", "today": 110.6, "total": 3102.4, "icon": "bi-buildings-fill"},
            {"factory": "전체 합계", "color": "#f3a400", "today": 368.7, "total": 10612.2, "icon": "bi-pie-chart-fill"},
        ],
        "status_counts": [
            {"label": "입력 완료", "count": 2, "unit": "공장", "status": "done"},
            {"label": "입력 필요", "count": 1, "unit": "공장", "status": "need"},
            {"label": "미입력", "count": 0, "unit": "공장", "status": "idle"},
        ],
    }


def production_manual_input_data() -> dict:
    return {
        "status": "ok",
        "date": "2025-05-24",
        "unit": "ton",
        "items": [
            {
                "factory": "3 공장",
                "color": "#1f7aff",
                "today": 125.3,
                "total": 3652.1,
                "target": 3700.0,
                "attainment": 98.7,
                "input_status": "입력 완료",
                "last_input": "05-24 14:20",
            },
            {
                "factory": "4 공장",
                "color": "#43a83f",
                "today": 132.8,
                "total": 3857.7,
                "target": 3800.0,
                "attainment": 101.5,
                "input_status": "입력 완료",
                "last_input": "05-24 14:21",
            },
            {
                "factory": "5 공장",
                "color": "#8e48d6",
                "today": 110.6,
                "total": 3102.4,
                "target": 3500.0,
                "attainment": 88.6,
                "input_status": "입력 필요",
                "last_input": "-",
            },
        ],
    }


def production_excel_upload_info() -> dict:
    return {
        "status": "ok",
        "steps": ["파일 업로드", "데이터 확인", "저장 완료"],
        "template_url": "/assets/templates/production-input-template.xlsx",
        "supported_extensions": [".xlsx", ".xls"],
        "rules": [
            "필수 컬럼: 날짜, 공장, 생산량(ton)",
            "날짜 형식: YYYY-MM-DD",
            "공장명: 3공장, 4공장, 5공장 중 선택",
            "숫자만 입력 가능",
        ],
        "sample_rows": [
            {"date": "2025-05-24", "factory": "3공장", "quantity": 125.3},
            {"date": "2025-05-24", "factory": "4공장", "quantity": 132.8},
            {"date": "2025-05-24", "factory": "5공장", "quantity": 110.6},
        ],
    }


def production_input_history() -> dict:
    return {
        "status": "ok",
        "items": [
            {"date": "2025-05-24", "factory": "3 공장", "quantity": 125.3, "total": 3652.1, "owner": "admin", "method": "직접 입력", "input_time": "2025-05-24 14:20:15"},
            {"date": "2025-05-24", "factory": "4 공장", "quantity": 132.8, "total": 3857.7, "owner": "admin", "method": "직접 입력", "input_time": "2025-05-24 14:21:03"},
            {"date": "2025-05-23", "factory": "3 공장", "quantity": 120.5, "total": 3526.8, "owner": "admin", "method": "Excel 입력", "input_time": "2025-05-23 17:45:22"},
            {"date": "2025-05-23", "factory": "4 공장", "quantity": 128.7, "total": 3724.9, "owner": "admin", "method": "Excel 입력", "input_time": "2025-05-23 17:45:22"},
            {"date": "2025-05-23", "factory": "5 공장", "quantity": 105.4, "total": 2991.8, "owner": "admin", "method": "직접 입력", "input_time": "2025-05-23 14:18:11"},
        ],
    }


def save_production_manual(payload: dict | None = None) -> dict:
    payload = payload or {}
    return {
        "status": "saved",
        "message": "더미 저장 완료",
        "received": payload,
    }


def save_production_excel(filename: str | None = None) -> dict:
    return {
        "status": "uploaded",
        "message": "더미 업로드 완료",
        "filename": filename,
        "written": 3,
    }


def register_production_dashboard_routes(app):
    app.add_url_rule(
        "/api/production-page/summary",
        "production_page_summary",
        production_page_summary,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/production-page/manual",
        "production_manual_input_data",
        production_manual_input_data,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/production-page/excel",
        "production_excel_upload_info",
        production_excel_upload_info,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/production-page/history",
        "production_input_history",
        production_input_history,
        methods=["GET"],
    )
