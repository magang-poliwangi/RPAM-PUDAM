import { dataStyle } from "./styles.js";
import {
  setTitle,
  simpleHeaderRow,
  setColumnWidths,
  readDataRows,
  SIMPLE_DATA_START_ROW,
} from "./sheet-kit.js";

export const SHEET_NAME = "Lokasi SPAM";

const TOTAL_COLUMNS = 9; // A-I
const WIDTHS = [14, 10, 22, 30, 20, 18, 16, 24, 24];

export function buildLokasiSpamSheet(workbook, rows) {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  setTitle(sheet, "Tabel Lokasi SPAM (Sistem Penyediaan Air Minum)", "I");

  simpleHeaderRow(sheet, [
    "Kode Lokasi",
    "Simbol",
    "Nama Lokasi",
    "Deskripsi",
    "Penanggung Jawab (Nama)",
    "Penanggung Jawab (Posisi)",
    "Penanggung Jawab (Telepon)",
    "Penanggung Jawab (Email)",
    "Referensi",
  ]);

  rows.forEach((item) => {
    const row = sheet.addRow([
      item.kodeLokasi,
      item.simbol ?? "-",
      item.namaLokasi ?? "-",
      item.deskripsi ?? "-",
      item.penanggungJawabNama ?? "-",
      item.penanggungJawabPosisi ?? "-",
      item.penanggungJawabTelepon ?? "-",
      item.penanggungJawabEmail ?? "-",
      item.referensi ?? "-",
    ]);
    row.eachCell(dataStyle);
  });

  setColumnWidths(sheet, WIDTHS);
  return sheet;
}

/** Kembalikan array object siap dipakai importer */
export function parseLokasiSpamRows(sheet) {
  return readDataRows(sheet, TOTAL_COLUMNS, SIMPLE_DATA_START_ROW).map(({ excelRowNumber, values }) => ({
    excelRowNumber,
    kodeLokasi: String(values[0]).trim(),
    simbol: values[1],
    namaLokasi: values[2],
    deskripsi: values[3],
    penanggungJawabNama: values[4],
    penanggungJawabPosisi: values[5],
    penanggungJawabTelepon: values[6],
    penanggungJawabEmail: values[7],
    referensi: values[8],
  }));
}