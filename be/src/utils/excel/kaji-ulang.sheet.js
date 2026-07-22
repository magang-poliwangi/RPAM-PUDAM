import { dataStyle, riskFillStyle, tingkatFillStyle } from "./styles.js";
import { validasiChecks, validasiFromChecks } from "./enum-checkbox.helper.js";
import {
  setTitle,
  singleColumnHeader,
  groupColumnHeader,
  applyHeaderStyles,
  writeRefRow,
  setColumnWidths,
  readDataRows,
} from "./sheet-kit.js";

export const SHEET_NAME = "M4 Kaji Ulang Risiko";

const TOTAL_COLUMNS = 21; // A-U
const WIDTHS = [12, 12, 18, 20, 16, 20, 30, 14, 9, 9, 9, 12, 30, 16, 9, 9, 9, 9, 9, 9, 12];

export function buildKajiUlangRisikoSheet(workbook, rows) {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  setTitle(sheet, "Tabel 4.1 Kaji Ulang Risiko dengan Mempertimbangkan Tindakan Pengendalian", "U");

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
  groupColumnHeader(sheet, "I", "L", "Risiko Tanpa Pengendalian", [
    ["I", "Peluang"],
    ["J", "Dampak"],
    ["K", "Skor"],
    ["L", "Tingkat"],
  ]);
  singleColumnHeader(sheet, "M", "Tindakan Pengendalian Saat Ini");
  groupColumnHeader(sheet, "N", "Q", "Validasi", [
    ["N", "Referensi"],
    ["O", "Efektif"],
    ["P", "Tidak Efektif"],
    ["Q", "Tidak Pasti"],
  ]);
  groupColumnHeader(sheet, "R", "U", "Risiko Dengan Pengendalian", [
    ["R", "Peluang"],
    ["S", "Dampak"],
    ["T", "Skor"],
    ["U", "Tingkat"],
  ]);

  applyHeaderStyles(sheet);
  writeRefRow(sheet, TOTAL_COLUMNS);

  rows.forEach((item) => {
    const identifikasi = item.penilaianRisiko?.identifikasiDanKejadianBahaya;
    const validasi = validasiChecks(item.validasi);

    const row = sheet.addRow([
      identifikasi?.lokasiSpam?.kodeLokasi ?? "-",
      identifikasi?.kodeRisiko ?? "-",
      identifikasi?.komponenSpam ?? "-",
      identifikasi?.bahayaKontaminasi?.kontaminasiX ?? "-",
      identifikasi?.komponenSpamY ?? "-",
      identifikasi?.penyebabZ ?? "-",
      identifikasi?.kejadianBahayaXYZ ?? "-",
      identifikasi?.bahayaKontaminasi?.tipeBahaya ?? "-",
      item.penilaianRisiko?.peluangKejadianBahaya ?? "-",
      item.penilaianRisiko?.dampakKeparahan ?? "-",
      item.penilaianRisiko?.skorRisiko ?? "-",
      item.penilaianRisiko?.tingkatRisiko ?? "-",
      item.tindakanPengendalian ?? "-",
      item.referensi ?? "-",
      validasi.efektif,
      validasi.tidakEfektif,
      validasi.tidakPasti,
      item.peluangKejadianBahaya ?? "-",
      item.dampakKeparahan ?? "-",
      item.skorRisiko ?? "-",
      item.tingkatRisiko ?? "-",
    ]);
    row.eachCell(dataStyle);
    riskFillStyle(row.getCell(11), item.penilaianRisiko?.skorRisiko);
    tingkatFillStyle(row.getCell(12), item.penilaianRisiko?.tingkatRisiko);
    riskFillStyle(row.getCell(20), item.skorRisiko);
    tingkatFillStyle(row.getCell(21), item.tingkatRisiko);
  });

  setColumnWidths(sheet, WIDTHS);
  return sheet;
}

/** Kembalikan array object siap dipakai importer (validasi sudah di-resolve dari 3 kolom checkbox) */
export function parseKajiUlangRisikoRows(sheet) {
  return readDataRows(sheet, TOTAL_COLUMNS).map(({ excelRowNumber, values }) => ({
    excelRowNumber,
    kodeRisiko: String(values[1]).trim(),
    tindakanPengendalian: values[12],
    referensi: values[13],
    validasi: validasiFromChecks({
      efektif: values[14],
      tidakEfektif: values[15],
      tidakPasti: values[16],
    }),
    peluangKejadianBahaya: values[17],
    dampakKeparahan: values[18],
    skorRisiko: values[19],
    tingkatRisiko: values[20],
  }));
}