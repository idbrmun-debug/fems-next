from __future__ import annotations

import sys
from pathlib import Path

from openpyxl import Workbook


def main() -> None:
    output_path = Path(sys.argv[1] if len(sys.argv) > 1 else "/app/tmp/production-upload-sample.xlsx")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "production"
    sheet.append(["factory", "process", "product", "shift", "quantity", "note"])
    sheet.append(["youngsin_quartz", "electric_furnace", "quartz_part_excel_a", "day", 301, "excel verification"])
    sheet.append(["youngsin_quartz", "electric_furnace", "quartz_part_excel_b", "night", 288, "excel verification"])
    workbook.save(output_path)


if __name__ == "__main__":
    main()
