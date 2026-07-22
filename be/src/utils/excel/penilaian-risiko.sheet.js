import { dataStyle, riskFillStyle, tingkatFillStyle } from "./styles.js";
import {
  setTitle,
  singleColumnHeader,
  groupColumnHeader,
  applyHeaderStyles,
  writeRefRow,
  setColumnWidths,
  readDataRows,
} from "./sheet-kit.js";

export const SHEET_NAME = "M3.5 Penilaian Resiko";

const TOTAL_COLUMNS = 12; // A-L
const WIDTHS = [12, 12, 18, 22, 18, 22, 34, 14, 10, 10, 10, 14];

export function buildPenilaianRisikoSheet(workbook, rows) {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  setTitle(sheet, "Tabel 3.5 Penilaian Risiko (Tanpa Tindakan Pengendalian)", "L");

  singleColumnHeader(sheet, "A", "Kode Lokasi");
  singleColumnHeader(sheet, "B", "Kode Risiko");
  singleColumnHeader(sheet, "C", "Komponen SPAM");
  groupColumnHeader(sheet, "D", "G", "Kejadian Bahaya", [
    ["D", "Kontaminasi (X)"],
    ["E", "Komponen SPAM (Y)"],
    ["F", "Penyebab (Z)"],
    ["G", "Kejadian Bahaya (XYZ)"],
  ]);
  singleColumnHeader(sheet, "H", "Tipe Bahaya");
  groupColumnHeader(sheet, "I", "L", "Risiko Tanpa Tindakan Pengendalian", [
    ["I", "Peluang"],
    ["J", "Dampak"],
    ["K", "Skor Risiko"],
    ["L", "Tingkat Risiko"],
  ]);

  applyHeaderStyles(sheet);
  writeRefRow(sheet, TOTAL_COLUMNS);

  rows.forEach((item) => {
    const identifikasi = item.identifikasiDanKejadianBahaya;
    const row = sheet.addRow([
      identifikasi?.kodeLokasi ?? "-",
      identifikasi?.kodeRisiko ?? "-",
      identifikasi?.komponenSpam ?? "-",
      identifikasi?.bahayaKontaminasi?.kontaminasiX ?? "-",
      identifikasi?.komponenSpamY ?? "-",
      identifikasi?.penyebabZ ?? "-",
      identifikasi?.kejadianBahayaXYZ ?? "-",
      identifikasi?.bahayaKontaminasi?.tipeBahaya ?? "-",
      item.peluangKejadianBahaya ?? "-",
      item.dampakKeparahan ?? "-",
      item.skorRisiko ?? "-",
      item.tingkatRisiko ?? "-",
    ]);
    row.eachCell(dataStyle);
    riskFillStyle(row.getCell(11), item.skorRisiko);
    tingkatFillStyle(row.getCell(12), item.tingkatRisiko);
  });

  setColumnWidths(sheet, WIDTHS);
  return sheet;
}

/** Kembalikan array object siap dipakai importer */
export function parsePenilaianRisikoRows(sheet) {
  return readDataRows(sheet, TOTAL_COLUMNS).map(({ excelRowNumber, values }) => ({
    excelRowNumber,
    kodeRisiko: String(values[1]).trim(),
    peluangKejadianBahaya: values[8],
    dampakKeparahan: values[9],
    skorRisiko: values[10],
    tingkatRisiko: values[11],
  }));
}