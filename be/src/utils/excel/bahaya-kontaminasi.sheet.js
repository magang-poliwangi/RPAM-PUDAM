import { dataStyle } from "./styles.js";
import {
  setTitle,
  simpleHeaderRow,
  setColumnWidths,
  readDataRows,
  SIMPLE_DATA_START_ROW,
} from "./sheet-kit.js";

export const SHEET_NAME = "Bahaya Kontaminasi";

const TOTAL_COLUMNS = 3; // A-C
const WIDTHS = [16, 20, 34];

export function buildBahayaKontaminasiSheet(workbook, rows) {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  setTitle(sheet, "Tabel Master Bahaya Kontaminasi", "C");

  simpleHeaderRow(sheet, ["Kode Risiko (Prefix)", "Tipe Bahaya", "Kontaminasi (X)"]);

  rows.forEach((item) => {
    const row = sheet.addRow([item.kodeRisiko, item.tipeBahaya ?? "-", item.kontaminasiX ?? "-"]);
    row.eachCell(dataStyle);
  });

  setColumnWidths(sheet, WIDTHS);
  return sheet;
}

/** Kembalikan array object siap dipakai importer */
export function parseBahayaKontaminasiRows(sheet) {
  return readDataRows(sheet, TOTAL_COLUMNS, SIMPLE_DATA_START_ROW).map(({ excelRowNumber, values }) => ({
    excelRowNumber,
    kodeRisiko: String(values[0]).trim(),
    tipeBahaya: values[1],
    kontaminasiX: values[2],
  }));
}