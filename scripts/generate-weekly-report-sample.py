from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


BASE_DIR = Path(__file__).resolve().parents[1]
OUT_DIR = BASE_DIR / "docs" / "samples"
PDF_PATH = OUT_DIR / "weekly-report-sample.pdf"
PNG_PATH = OUT_DIR / "weekly-report-sample-preview.png"

REGULAR_FONT = "C:/Windows/Fonts/malgun.ttf"
BOLD_FONT = "C:/Windows/Fonts/malgunbd.ttf"

PAGE_WIDTH = 2480
PAGE_HEIGHT = 3508
MARGIN = 140

COLORS = {
    "blue": "#1a73e8",
    "dark": "#111827",
    "muted": "#64748b",
    "line": "#d9e2ef",
    "light": "#f4f8ff",
    "green": "#22a447",
    "orange": "#f59e0b",
    "red": "#dc2626",
    "purple": "#8e44d7",
}


def get_font(size, bold=False):
    return ImageFont.truetype(BOLD_FONT if bold else REGULAR_FONT, size)


def draw_text(draw, x, y, value, size=36, fill="dark", bold=False, anchor=None):
    draw.text(
        (x, y),
        value,
        font=get_font(size, bold),
        fill=COLORS.get(fill, fill),
        anchor=anchor,
    )


def draw_rect(draw, x1, y1, x2, y2, fill=None, outline="line", width=2, radius=0):
    outline_color = COLORS.get(outline, outline)
    if radius:
        draw.rounded_rectangle(
            (x1, y1, x2, y2),
            radius=radius,
            fill=fill,
            outline=outline_color,
            width=width,
        )
    else:
        draw.rectangle((x1, y1, x2, y2), fill=fill, outline=outline_color, width=width)


def draw_table(draw, x, y, headers, rows, col_widths, row_height=78):
    total_width = sum(col_widths)
    draw_rect(draw, x, y, x + total_width, y + row_height, fill="#edf4ff")
    cursor_x = x
    for idx, header in enumerate(headers):
        draw_text(
            draw,
            cursor_x + col_widths[idx] // 2,
            y + row_height // 2,
            header,
            24,
            "blue",
            True,
            "mm",
        )
        if idx:
            draw.line(
                (cursor_x, y, cursor_x, y + row_height * (len(rows) + 1)),
                fill=COLORS["line"],
                width=2,
            )
        cursor_x += col_widths[idx]

    draw.line((x, y + row_height, x + total_width, y + row_height), fill=COLORS["line"], width=2)
    for row_idx, row in enumerate(rows):
        row_y = y + row_height * (row_idx + 1)
        if row_idx % 2 == 1:
            draw.rectangle((x, row_y, x + total_width, row_y + row_height), fill="#fbfdff")
        cursor_x = x
        for col_idx, value in enumerate(row):
            color = "dark"
            text_value = str(value)
            if text_value.startswith("▲") or text_value == "주의":
                color = "orange"
            if text_value.startswith("▼") or text_value == "정상":
                color = "green"
            draw_text(
                draw,
                cursor_x + col_widths[col_idx] // 2,
                row_y + row_height // 2,
                text_value,
                23,
                color,
                False,
                "mm",
            )
            cursor_x += col_widths[col_idx]
        draw.line((x, row_y + row_height, x + total_width, row_y + row_height), fill=COLORS["line"], width=2)

    draw_rect(draw, x, y, x + total_width, y + row_height * (len(rows) + 1), fill=None, width=2)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    image = Image.new("RGB", (PAGE_WIDTH, PAGE_HEIGHT), "white")
    draw = ImageDraw.Draw(image)

    draw_text(draw, MARGIN, 120, "FEMS 주간 리포트 샘플", 62, "dark", True)
    draw_text(
        draw,
        MARGIN,
        205,
        "보고 기간: 2025-05-18 ~ 2025-05-24    생성일: 2026-05-20    대상: 전체 공장",
        31,
        "muted",
    )
    draw.line((MARGIN, 270, PAGE_WIDTH - MARGIN, 270), fill=COLORS["line"], width=3)

    draw_text(draw, MARGIN, 340, "핵심 요약", 40, "dark", True)
    cards = [
        ("총 전력량", "729,674 kWh", "전주 대비 ▲ 3.4%"),
        ("총 생산량", "10,612.2 ton", "전주 대비 ▲ 1.5%"),
        ("평균 원단위", "19.68 kWh/ton", "목표 20.80 대비 양호"),
        ("최대 전력", "14,820 kW", "2025-05-22 14:00"),
        ("알람 발생", "10건", "미확인 2건"),
    ]
    card_width = 410
    card_height = 210
    gap = 30
    for idx, (title, value, note) in enumerate(cards):
        x = MARGIN + idx * (card_width + gap)
        draw_rect(draw, x, 405, x + card_width, 405 + card_height, fill="#fbfdff", radius=18)
        draw_text(draw, x + 35, 445, title, 28, "muted", True)
        draw_text(draw, x + 35, 500, value, 38, "dark", True)
        color = "green" if "양호" in note or "▲" in note else "muted"
        if "미확인" in note:
            color = "orange"
        draw_text(draw, x + 35, 565, note, 25, color)

    draw_text(draw, MARGIN, 700, "공장별 주간 실적", 40, "dark", True)
    draw_table(
        draw,
        MARGIN,
        765,
        ["공장", "전력량(kWh)", "생산량(ton)", "원단위", "목표", "달성률", "상태"],
        [
            ["3공장", "245,123", "3,652.1", "19.58", "20.50", "95.5%", "정상"],
            ["4공장", "268,654", "3,857.7", "18.82", "20.00", "94.1%", "정상"],
            ["5공장", "215,897", "3,102.4", "20.73", "22.00", "94.2%", "주의"],
            ["전체", "729,674", "10,612.2", "19.68", "20.80", "94.6%", "정상"],
        ],
        [220, 330, 330, 250, 230, 230, 260],
        76,
    )

    draw_text(draw, MARGIN, 1210, "전력량 추이 샘플", 40, "dark", True)
    chart_x = MARGIN
    chart_y = 1285
    chart_width = 1030
    chart_height = 520
    draw_rect(draw, chart_x, chart_y, chart_x + chart_width, chart_y + chart_height, fill="#fbfdff", radius=12)
    for idx in range(6):
        y = chart_y + 80 + idx * 70
        draw.line((chart_x + 90, y, chart_x + chart_width - 50, y), fill="#e5edf7", width=2)

    labels = ["05/18", "05/19", "05/20", "05/21", "05/22", "05/23", "05/24"]
    series = [
        ("3공장", COLORS["blue"], [180, 205, 230, 260, 300, 285, 310]),
        ("4공장", COLORS["green"], [210, 230, 255, 280, 320, 340, 300]),
        ("5공장", COLORS["purple"], [160, 175, 200, 215, 240, 252, 235]),
    ]

    def map_point(index, value):
        return chart_x + 120 + index * 125, chart_y + chart_height - 70 - value

    for name, color, values in series:
        points = [map_point(idx, value) for idx, value in enumerate(values)]
        draw.line(points, fill=color, width=6, joint="curve")
        for x, y in points:
            draw.ellipse((x - 7, y - 7, x + 7, y + 7), fill=color)

    for idx, label in enumerate(labels):
        x, _ = map_point(idx, 0)
        draw_text(draw, x, chart_y + chart_height - 35, label, 22, "muted", anchor="mm")

    for idx, (name, color, _values) in enumerate(series):
        legend_x = chart_x + chart_width - 330 + idx * 105
        draw.rectangle((legend_x, chart_y + 35, legend_x + 20, chart_y + 55), fill=color)
        draw_text(draw, legend_x + 28, chart_y + 30, name, 22, "dark")

    right_x = MARGIN + 1120
    draw_text(draw, right_x, 1210, "원단위 및 알람 요약", 40, "dark", True)
    draw_rect(draw, right_x, 1285, PAGE_WIDTH - MARGIN, 1285 + 520, fill="#fbfdff", radius=12)
    summary_lines = [
        ("평균 원단위", "19.68 kWh/ton", "green"),
        ("목표 원단위", "20.80 kWh/ton", "blue"),
        ("목표 달성률", "94.6%", "green"),
        ("경고 알람", "6건", "orange"),
        ("정지 알람", "3건", "red"),
        ("통신 이상", "1건", "purple"),
    ]
    for idx, (key, value, color) in enumerate(summary_lines):
        y = 1350 + idx * 70
        draw_text(draw, right_x + 50, y, key, 28, "muted", True)
        draw_text(draw, PAGE_WIDTH - MARGIN - 40, y, value, 30, color, True, "ra")

    draw_text(draw, MARGIN, 1910, "주간 알람 및 조치 요약", 40, "dark", True)
    draw_table(
        draw,
        MARGIN,
        1975,
        ["구분", "건수", "대표 설비", "조치 상태"],
        [
            ["경고", "6", "4공장 전기로 11", "4건 확인 완료"],
            ["정지", "3", "5공장 전기로 17", "2건 조치 완료"],
            ["통신이상", "1", "3공장 전기로 03", "원인 확인 중"],
        ],
        [300, 260, 610, 650],
        78,
    )

    draw_text(draw, MARGIN, 2370, "운영 메모", 40, "dark", True)
    notes = [
        "1. 5공장은 생산량 입력 누락 및 원단위 상승 여부를 우선 확인합니다.",
        "2. 4공장 전기로 11의 온도 상승 경고는 정비 이력과 함께 교차 확인합니다.",
        "3. 주간 리포트 PDF 내보내기 연동 시 Flask API 집계 결과와 Grafana 패널 이미지를 조합합니다.",
        "4. 본 문서는 리포트 화면의 PDF 샘플이며 실제 운영 데이터가 아닙니다.",
    ]
    for idx, note in enumerate(notes):
        draw_text(draw, MARGIN, 2445 + idx * 58, note, 30, "dark")

    draw_rect(draw, MARGIN, PAGE_HEIGHT - 260, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 150, fill=COLORS["light"], radius=14)
    draw_text(
        draw,
        MARGIN + 35,
        PAGE_HEIGHT - 225,
        "FEMS Next | Weekly Report Sample | InfluxDB bucket: gems_test | measurement: gems_power",
        26,
        "muted",
    )
    draw_text(
        draw,
        PAGE_WIDTH - MARGIN - 35,
        PAGE_HEIGHT - 225,
        "Generated by Flask report prototype",
        26,
        "muted",
        anchor="ra",
    )

    image.save(PNG_PATH, quality=95)
    image.save(PDF_PATH, "PDF", resolution=300.0)
    print(PDF_PATH)
    print(PDF_PATH.stat().st_size)
    print(PNG_PATH)
    print(PNG_PATH.stat().st_size)


if __name__ == "__main__":
    main()
