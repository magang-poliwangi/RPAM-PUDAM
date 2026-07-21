import { dataStyle } from "./styles.js";
import {
  setTitle,
  singleColumnHeader,
  groupColumnHeader,
  applyHeaderStyles,
  writeRefRow,
  setColumnWidths,
  readDataRows,
} from "./sheet-kit.js";

// PENTING: nama tab worksheet Excel dibatasi MAKSIMAL 31 KARAKTER.
// "M3.1 Identifikasi dan kejadian bahaya " aslinya 38 karakter -> kalau dipakai
// apa adanya, ExcelJS diam-diam memotongnya jadi 31 karakter saat writeBuffer(),
// tapi kode ini tetap mencari sheet pakai nama yang belum dipotong -> getWorksheet()
// gagal cocok -> sheet M3.1 dianggap "tidak ada" dan SELALU DILEWATI saat import.
// Nilai di bawah ini SUDAH dipotong ke 31 karakter (persis versi yang otomatis
// dihasilkan Excel/ExcelJS) supaya build & baca-balik konsisten.
// -> Kalau Gus import dari file template resmi (bukan hasil export app ini),
//    cek dulu nama tab persis di file itu (klik kanan tab -> Rename, lihat isinya)
//    dan samakan string di bawah kalau beda.
export const SHEET_NAME = "M3.1 Identifikasi dan kejadian ";

const TOTAL_COLUMNS = 8; // A-H
const WIDTHS = [12, 12, 18, 22, 18, 22, 34, 14];

export function buildIdentifikasiDanKejadianBahayaSheet(workbook, rows) {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  setTitle(sheet, "Tabel 3.1 Identifikasi Bahaya dan Kejadian Bahaya", "H");

  singleColumnHeader(sheet, "A", "Kode Lokasi");
  singleColumnHeader(sheet, "B", "Kode Risiko");
  singleColumnHeader(sheet, "C", "Komponen SPAM");
  groupColumnHeader(sheet, "D", "G", "Kejadian Bahaya", [
    ["D", "Kontaminasi atau Sesuatu yang Berpotensi Buruk Terhadap Kualitas Air (X)"],
    ["E", "Komponen SPAM (Y)"],
    ["F", "Penyebab (Z)"],
    ["G", "Kejadian Bahaya (XYZ)"],
  ]);
  singleColumnHeader(sheet, "H", "Tipe Bahaya");

  applyHeaderStyles(sheet);
  writeRefRow(sheet, TOTAL_COLUMNS);

  rows.forEach((item) => {
    const row = sheet.addRow([
      item.lokasiSpam?.kodeLokasi ?? item.kodeLokasi ?? "-",
      item.kodeRisiko,
      item.komponenSpam,
      item.bahayaKontaminasi?.kontaminasiX ?? "-",
      item.komponenSpamY,
      item.penyebabZ,
      item.kejadianBahayaXYZ,
      item.bahayaKontaminasi?.tipeBahaya ?? "-",
    ]);
    row.eachCell(dataStyle);
  });

  setColumnWidths(sheet, WIDTHS);
  return sheet;
}

/** Kembalikan array object siap dipakai importer (field mentah, belum di-resolve ke id) */
export function parseIdentifikasiDanKejadianBahayaRows(sheet) {
  return readDataRows(sheet, TOTAL_COLUMNS).map(({ excelRowNumber, values }) => ({
    excelRowNumber,
    kodeLokasi: String(values[0]).trim(),
    kodeRisiko: String(values[1]).trim(),
    komponenSpam: values[2],
    kontaminasiX: values[3],
    komponenSpamY: values[4],
    penyebabZ: values[5],
    kejadianBahayaXYZ: values[6],
    tipeBahaya: values[7],
  }));
}