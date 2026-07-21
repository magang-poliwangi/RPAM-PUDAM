import { dataStyle, tingkatFillStyle } from "./styles.js";
import { checkToBool, validasiChecks, prioritasChecks, prioritasFromChecks } from "./enum-checkbox.helper.js";
import {
  setTitle,
  singleColumnHeader,
  groupColumnHeader,
  applyHeaderStyles,
  writeRefRow,
  setColumnWidths,
  readDataRows,
} from "./sheet-kit.js";

export const SHEET_NAME = "M5 Rencana Perbaikan";

const TOTAL_COLUMNS = 25; // A-Y
const WIDTHS = [12, 12, 18, 20, 16, 20, 30, 16, 30, 9, 9, 9, 16, 22, 20, 16, 16, 16, 16, 16, 12, 12, 9, 9, 9];

export function buildRencanaPerbaikanSheet(workbook, rows) {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  setTitle(sheet, "Tabel 5.1 Rencana Perbaikan Penyelenggara SPAM", "Y");

  singleColumnHeader(sheet, "A", "Kode Lokasi");
  singleColumnHeader(sheet, "B", "Kode Risiko");
  singleColumnHeader(sheet, "C", "Komponen SPAM");
  groupColumnHeader(sheet, "D", "G", "Kejadian Bahaya", [
    ["D", "Kontaminasi (X)"],
    ["E", "Komponen SPAM (Y)"],
    ["F", "Penyebab (Z)"],
    ["G", "Kejadian Bahaya (XYZ)"],
  ]);
  singleColumnHeader(sheet, "H", "Tingkat Risiko Tanpa Pengendalian");
  singleColumnHeader(sheet, "I", "Tindakan Pengendalian Saat Ini");
  groupColumnHeader(sheet, "J", "M", "Validasi", [
    ["J", "Referensi"],
    ["K", "Efektif"],
    ["L", "Tidak Efektif"],
    ["M", "Tidak Pasti"],
  ]);
  singleColumnHeader(sheet, "N", "Tingkat Risiko Dengan Pengendalian");
  singleColumnHeader(sheet, "O", "Rencana Perbaikan");
  singleColumnHeader(sheet, "P", "Penanggung Jawab");
  singleColumnHeader(sheet, "Q", "Jadwal Pelaksanaan");
  singleColumnHeader(sheet, "R", "Biaya");
  singleColumnHeader(sheet, "S", "Sumber Pembiayaan");
  singleColumnHeader(sheet, "T", "Status Kemajuan");
  groupColumnHeader(sheet, "U", "V", "Kendala Sumber Daya", [
    ["U", "Keuangan"],
    ["V", "Tenaga Kerja"],
  ]);
  groupColumnHeader(sheet, "W", "Y", "Skala Prioritas", [
    ["W", "Pendek"],
    ["X", "Menengah"],
    ["Y", "Panjang"],
  ]);

  applyHeaderStyles(sheet);
  writeRefRow(sheet, TOTAL_COLUMNS);

  rows.forEach((item) => {
    const kaji = item.kajiUlangRisiko;
    const identifikasi = kaji?.penilaianRisiko?.identifikasiDanKejadianBahaya;
    const validasi = validasiChecks(kaji?.validasi);
    const prioritas = prioritasChecks(item.prioritas);

    const row = sheet.addRow([
      identifikasi?.lokasiSpam?.kodeLokasi ?? "-",
      identifikasi?.kodeRisiko ?? "-",
      identifikasi?.komponenSpam ?? "-",
      identifikasi?.bahayaKontaminasi?.kontaminasiX ?? "-",
      identifikasi?.komponenSpamY ?? "-",
      identifikasi?.penyebabZ ?? "-",
      identifikasi?.kejadianBahayaXYZ ?? "-",
      kaji?.penilaianRisiko?.tingkatRisiko ?? "-",
      kaji?.tindakanPengendalian ?? "-",
      kaji?.referensi ?? "-",
      validasi.efektif,
      validasi.tidakEfektif,
      validasi.tidakPasti,
      kaji?.tingkatRisiko ?? "-",
      item.rencanaPerbaikan ?? "-",
      item.penanggungJawab ?? "-",
      item.jadwalPelaksanaan ?? "-",
      item.biaya ?? 0,
      item.sumberPembiayaan ?? "-",
      item.statusKemajuan ?? "-",
      item.kendalaKeuangan ? "v" : "",
      item.kendalaTenagaKerja ? "v" : "",
      prioritas.pendek,
      prioritas.menengah,
      prioritas.panjang,
    ]);
    row.eachCell(dataStyle);
    tingkatFillStyle(row.getCell(8), kaji?.penilaianRisiko?.tingkatRisiko);
    tingkatFillStyle(row.getCell(14), kaji?.tingkatRisiko);
  });

  setColumnWidths(sheet, WIDTHS);
  return sheet;
}

/** Kembalikan array object siap dipakai importer (kendala jadi boolean, prioritas di-resolve dari checkbox) */
export function parseRencanaPerbaikanRows(sheet) {
  return readDataRows(sheet, TOTAL_COLUMNS).map(({ excelRowNumber, values }) => ({
    excelRowNumber,
    kodeRisiko: String(values[1]).trim(),
    rencanaPerbaikan: values[14],
    penanggungJawab: values[15],
    jadwalPelaksanaan: values[16],
    biaya: values[17],
    sumberPembiayaan: values[18],
    statusKemajuan: values[19],
    kendalaKeuangan: checkToBool(values[20]),
    kendalaTenagaKerja: checkToBool(values[21]),
    prioritas: prioritasFromChecks({
      pendek: values[22],
      menengah: values[23],
      panjang: values[24],
    }),
  }));
}