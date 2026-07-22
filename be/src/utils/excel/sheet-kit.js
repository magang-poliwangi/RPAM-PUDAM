import { headerStyle, columnNumberStyle } from "./styles.js";

// ===== Layout baris baku dipakai SEMUA sheet (biar builder & reader selalu sinkron) =====
export const TITLE_ROW = 1;
export const HEADER_ROW_1 = 3; // baris judul grup (mis. "Kejadian Bahaya")
export const HEADER_ROW_2 = 4; // baris judul anak (mis. "Penyebab (Z)")
export const REF_ROW = 5; // baris nomor referensi kolom: (1) (2) (3) ...
export const DATA_START_ROW = 6;

// layout khusus master data (Lokasi SPAM, Bahaya Kontaminasi) -> header 1 tingkat, tanpa baris ref
export const SIMPLE_HEADER_ROW = 3;
export const SIMPLE_DATA_START_ROW = 4;

export function setTitle(sheet, title, lastColLetter) {
  sheet.mergeCells(`A${TITLE_ROW}:${lastColLetter}${TITLE_ROW}`);
  const cell = sheet.getCell(`A${TITLE_ROW}`);
  cell.value = title;
  cell.font = { bold: true, size: 12 };
}

/** Kolom tunggal (tanpa anak) -> merge vertikal HEADER_ROW_1:HEADER_ROW_2 */
export function singleColumnHeader(sheet, col, label) {
  sheet.mergeCells(`${col}${HEADER_ROW_1}:${col}${HEADER_ROW_2}`);
  sheet.getCell(`${col}${HEADER_ROW_1}`).value = label;
}

/**
 * Kolom grup (punya anak) -> merge horizontal di HEADER_ROW_1, lalu isi label anak
 * satu-satu di HEADER_ROW_2 (bukan row.values array, supaya nggak salah geser kalau
 * ada kolom lain yang di-merge vertikal).
 */
export function groupColumnHeader(sheet, startCol, endCol, label, children) {
  sheet.mergeCells(`${startCol}${HEADER_ROW_1}:${endCol}${HEADER_ROW_1}`);
  sheet.getCell(`${startCol}${HEADER_ROW_1}`).value = label;
  children.forEach(([col, childLabel]) => {
    sheet.getCell(`${col}${HEADER_ROW_2}`).value = childLabel;
  });
}

export function applyHeaderStyles(sheet, rows = [HEADER_ROW_1, HEADER_ROW_2]) {
  rows.forEach((rowNum) => {
    sheet.getRow(rowNum).eachCell({ includeEmpty: true }, headerStyle);
  });
}

export function writeRefRow(sheet, totalColumns, refRow = REF_ROW) {
  const row = sheet.getRow(refRow);
  for (let i = 1; i <= totalColumns; i++) {
    row.getCell(i).value = `(${i})`;
  }
  row.eachCell(columnNumberStyle);
}

/**
 * Header 1 baris tanpa grup, dipakai sheet master data (Lokasi SPAM, Bahaya
 * Kontaminasi) yang nggak butuh baris ref angka (1)(2)(3)...
 */
export function simpleHeaderRow(sheet, headers, headerRow = SIMPLE_HEADER_ROW) {
  const row = sheet.getRow(headerRow);
  headers.forEach((label, idx) => {
    row.getCell(idx + 1).value = label;
  });
  row.eachCell({ includeEmpty: true }, headerStyle);
}

export function setColumnWidths(sheet, widths) {
  sheet.columns.forEach((col, idx) => {
    col.width = widths[idx] ?? 15;
  });
}

/**
 * Baca semua baris data dari `startRow` sampai baris terakhir yang terisi.
 * Baris dianggap kosong (berhenti membaca) kalau kolom pertama (biasanya Kode Lokasi/Kode Risiko) kosong.
 * Mengembalikan array of array nilai mentah per kolom (1-indexed -> index 0 dibuang).
 */
export function readDataRows(sheet, columnCount, startRow = DATA_START_ROW) {
  const rows = [];
  const lastRow = Math.max(sheet.rowCount, sheet.actualRowCount || 0);
  for (let r = startRow; r <= lastRow; r++) {
    const row = sheet.getRow(r);
    const firstCellValue = row.getCell(1).value;
    if (firstCellValue === null || firstCellValue === undefined || firstCellValue === "") continue;
    const values = [];
    for (let c = 1; c <= columnCount; c++) {
      const raw = row.getCell(c).value;
      values.push(raw === null || raw === undefined ? "" : raw);
    }
    rows.push({ excelRowNumber: r, values });
  }
  return rows;
}