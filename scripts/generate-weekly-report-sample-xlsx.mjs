import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "docs/samples";
const outputPath = `${outputDir}/weekly-report-sample.xlsx`;
const previewPath = `${outputDir}/weekly-report-sample-xlsx-preview.png`;

const workbook = Workbook.create();
const summary = workbook.worksheets.add("요약");
const factory = workbook.worksheets.add("공장별 실적");
const alarms = workbook.worksheets.add("알람 요약");
const chartData = workbook.worksheets.add("차트 데이터");

const colors = {
  blue: "#1A73E8",
  dark: "#111827",
  muted: "#64748B",
  lightBlue: "#EDF4FF",
  line: "#D9E2EF",
  green: "#22A447",
  orange: "#F59E0B",
  red: "#DC2626",
  purple: "#8E44D7",
  white: "#FFFFFF",
};

function setColumnWidths(sheet, widths) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  widths.forEach((width, index) => {
    sheet.getRange(`${letters[index]}1`).format.columnWidth = width;
  });
}

function styleTitle(range, fontSize = 18) {
  range.format = {
    font: { bold: true, color: colors.dark, size: fontSize },
    fill: colors.white,
  };
}

function styleHeader(range) {
  range.format = {
    fill: colors.lightBlue,
    font: { bold: true, color: colors.blue },
    horizontalAlignment: "center",
    verticalAlignment: "middle",
    borders: {
      all: { style: "continuous", color: colors.line, weight: "thin" },
    },
  };
}

function styleBody(range) {
  range.format = {
    verticalAlignment: "middle",
    borders: {
      all: { style: "continuous", color: colors.line, weight: "thin" },
    },
  };
}

function styleNote(range) {
  range.format = {
    fill: "#F8FBFF",
    font: { color: colors.muted },
    wrapText: true,
    borders: {
      all: { style: "continuous", color: colors.line, weight: "thin" },
    },
  };
}

// Summary sheet
summary.showGridLines = false;
setColumnWidths(summary, [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18]);
summary.getRange("A1:L1").merge();
summary.getRange("A1").values = [["FEMS 주간 리포트 샘플"]];
styleTitle(summary.getRange("A1"), 22);
summary.getRange("A1:L1").format.rowHeight = 34;
summary.getRange("A2:L2").merge();
summary.getRange("A2").values = [["보고 기간: 2025-05-18 ~ 2025-05-24    생성일: 2026-05-20    대상: 전체 공장"]];
summary.getRange("A2").format = { font: { color: colors.muted, size: 11 } };
summary.getRange("A2:L2").format.rowHeight = 24;

summary.getRange("A4").values = [["핵심 요약"]];
styleTitle(summary.getRange("A4"), 16);
summary.getRange("A4:L4").format.rowHeight = 30;
summary.getRange("A5:J10").values = [
  ["항목", "값", "전주 대비/비고", "", "항목", "값", "전주 대비/비고", "", "항목", "값"],
  ["총 전력량", 729674, "전주 대비 ▲ 3.4%", "", "총 생산량", 10612.2, "전주 대비 ▲ 1.5%", "", "평균 원단위", 19.68],
  ["최대 전력", 14820, "2025-05-22 14:00", "", "알람 발생", 10, "미확인 2건", "", "목표 원단위", 20.8],
  ["목표 달성률", 0.946, "전체 공장 기준", "", "경고 알람", 6, "확인 완료 4건", "", "정지 알람", 3],
  ["통신 이상", 1, "원인 확인 중", "", "보고 상태", "샘플", "실제 운영 데이터 아님", "", "", ""],
  ["InfluxDB", "bucket: gems_test", "measurement: gems_power", "", "", "", "", "", "", ""],
];
styleHeader(summary.getRange("A5:J5"));
styleBody(summary.getRange("A6:J10"));
summary.getRange("B6:B8").format.numberFormat = "#,##0";
summary.getRange("F6:F9").format.numberFormat = "#,##0.0";
summary.getRange("J6:J8").format.numberFormat = "0.00";
summary.getRange("B8").format.numberFormat = "0.0%";

summary.getRange("A12").values = [["공장별 주간 실적"]];
styleTitle(summary.getRange("A12"), 16);
summary.getRange("A12:L12").format.rowHeight = 30;
summary.getRange("A13:G18").formulas = [
  ["='공장별 실적'!A1", "='공장별 실적'!B1", "='공장별 실적'!C1", "='공장별 실적'!D1", "='공장별 실적'!E1", "='공장별 실적'!F1", "='공장별 실적'!G1"],
  ["='공장별 실적'!A2", "='공장별 실적'!B2", "='공장별 실적'!C2", "='공장별 실적'!D2", "='공장별 실적'!E2", "='공장별 실적'!F2", "='공장별 실적'!G2"],
  ["='공장별 실적'!A3", "='공장별 실적'!B3", "='공장별 실적'!C3", "='공장별 실적'!D3", "='공장별 실적'!E3", "='공장별 실적'!F3", "='공장별 실적'!G3"],
  ["='공장별 실적'!A4", "='공장별 실적'!B4", "='공장별 실적'!C4", "='공장별 실적'!D4", "='공장별 실적'!E4", "='공장별 실적'!F4", "='공장별 실적'!G4"],
  ["='공장별 실적'!A5", "='공장별 실적'!B5", "='공장별 실적'!C5", "='공장별 실적'!D5", "='공장별 실적'!E5", "='공장별 실적'!F5", "='공장별 실적'!G5"],
  ["", "", "", "", "", "", ""],
];
styleHeader(summary.getRange("A13:G13"));
styleBody(summary.getRange("A14:G17"));
summary.getRange("B14:C17").format.numberFormat = "#,##0.0";
summary.getRange("D14:E17").format.numberFormat = "0.00";
summary.getRange("F14:F17").format.numberFormat = "0.0%";

summary.getRange("A20").values = [["운영 메모"]];
styleTitle(summary.getRange("A20"), 16);
summary.getRange("A20:L20").format.rowHeight = 30;
summary.getRange("A21:L24").values = [
  ["1. 5공장은 생산량 입력 누락 및 원단위 상승 여부를 우선 확인합니다.", "", "", "", "", "", "", "", "", "", "", ""],
  ["2. 4공장 전기로 11의 온도 상승 경고는 정비 이력과 함께 교차 확인합니다.", "", "", "", "", "", "", "", "", "", "", ""],
  ["3. 주간 리포트 Excel 내보내기 연동 시 Flask API 집계 결과와 Grafana 패널 이미지를 조합합니다.", "", "", "", "", "", "", "", "", "", "", ""],
  ["4. 본 문서는 리포트 화면의 Excel 샘플이며 실제 운영 데이터가 아닙니다.", "", "", "", "", "", "", "", "", "", "", ""],
];
summary.getRange("A21:L21").merge(true);
summary.getRange("A22:L22").merge(true);
summary.getRange("A23:L23").merge(true);
summary.getRange("A24:L24").merge(true);
styleNote(summary.getRange("A21:L24"));
summary.freezePanes.freezeRows(4);

// Factory sheet
factory.showGridLines = false;
setColumnWidths(factory, [16, 18, 18, 16, 16, 16, 18, 20]);
factory.getRange("A1:H5").values = [
  ["공장", "전력량(kWh)", "생산량(ton)", "원단위", "목표", "달성률", "상태", "비고"],
  ["3공장", 245123, 3652.1, 19.58, 20.5, 0.955, "정상", "금주 추이 안정"],
  ["4공장", 268654, 3857.7, 18.82, 20.0, 0.941, "정상", "전력량 최고"],
  ["5공장", 215897, 3102.4, 20.73, 22.0, 0.942, "주의", "생산량 입력 확인 필요"],
  ["전체", 729674, 10612.2, 19.68, 20.8, 0.946, "정상", "공장 합산"],
];
styleHeader(factory.getRange("A1:H1"));
styleBody(factory.getRange("A2:H5"));
factory.getRange("B2:C5").format.numberFormat = "#,##0.0";
factory.getRange("D2:E5").format.numberFormat = "0.00";
factory.getRange("F2:F5").format.numberFormat = "0.0%";
factory.tables.add("A1:H5", true, "FactoryWeeklyTable");
factory.freezePanes.freezeRows(1);

// Alarm sheet
alarms.showGridLines = false;
setColumnWidths(alarms, [16, 12, 28, 24, 28]);
alarms.getRange("A1:E4").values = [
  ["구분", "건수", "대표 설비", "조치 상태", "비고"],
  ["경고", 6, "4공장 전기로 11", "4건 확인 완료", "온도 상승 경고 포함"],
  ["정지", 3, "5공장 전기로 17", "2건 조치 완료", "정지 이력 확인 필요"],
  ["통신이상", 1, "3공장 전기로 03", "원인 확인 중", "RTU 통신 상태 점검"],
];
styleHeader(alarms.getRange("A1:E1"));
styleBody(alarms.getRange("A2:E4"));
alarms.tables.add("A1:E4", true, "WeeklyAlarmTable");
alarms.freezePanes.freezeRows(1);

// Chart data sheet
chartData.showGridLines = false;
setColumnWidths(chartData, [14, 14, 14, 14, 18, 18, 18]);
chartData.getRange("A1:D8").values = [
  ["일자", "3공장", "4공장", "5공장"],
  ["05/18", 180, 210, 160],
  ["05/19", 205, 230, 175],
  ["05/20", 230, 255, 200],
  ["05/21", 260, 280, 215],
  ["05/22", 300, 320, 240],
  ["05/23", 285, 340, 252],
  ["05/24", 310, 300, 235],
];
chartData.getRange("F1:G4").values = [
  ["알람 구분", "건수"],
  ["경고", 6],
  ["정지", 3],
  ["통신이상", 1],
];
styleHeader(chartData.getRange("A1:D1"));
styleBody(chartData.getRange("A2:D8"));
styleHeader(chartData.getRange("F1:G1"));
styleBody(chartData.getRange("F2:G4"));

const powerChart = summary.charts.add("line", chartData.getRange("A1:D8"));
powerChart.title = "전력량 추이 샘플";
powerChart.hasLegend = true;
powerChart.xAxis = { axisType: "textAxis" };
powerChart.yAxis = { numberFormatCode: "#,##0" };
powerChart.setPosition("I13", "L24");

const alarmChart = summary.charts.add("bar", chartData.getRange("F1:G4"));
alarmChart.title = "알람 유형별 발생 건수";
alarmChart.hasLegend = false;
alarmChart.xAxis = { axisType: "textAxis" };
alarmChart.yAxis = { numberFormatCode: "#,##0" };
alarmChart.setPosition("I26", "L37");

const inspect = await workbook.inspect({
  kind: "table",
  range: "요약!A1:L24",
  include: "values,formulas",
  tableMaxRows: 24,
  tableMaxCols: 12,
  maxChars: 4000,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "요약",
  range: "A1:L37",
  scale: 1,
  format: "png",
});
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
process.exitCode = 0;
