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

export const SHEET_NAME = "M6.2 Pemantauan Operasional";

const TOTAL_COLUMNS = 19; // A-S
const WIDTHS = [12, 12, 18, 20, 16, 20, 30, 16, 26, 16, 14, 22, 20, 24, 28, 26, 24, 14, 30];

export function buildPemantauanOperasionalSheet(workbook, rows) {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  setTitle(sheet, "Tabel 6.2 Pemantauan Operasional", "S");

  singleColumnHeader(sheet, "A", "Kode Lokasi");
  singleColumnHeader(sheet, "B", "Kode Risiko");
  singleColumnHeader(sheet, "C", "Komponen SPAM");
  groupColumnHeader(sheet, "D", "G", "Kejadian Bahaya", [
    ["D", "Kontaminasi (X)"],
    ["E", "Komponen SPAM (Y)"],
    ["F", "Penyebab (Z)"],
    ["G", "Kejadian Bahaya (XYZ)"],
  ]);
  singleColumnHeader(sheet, "H", "Batas Kritis");
  groupColumnHeader(sheet, "I", "M", "Pemantauan", [
    ["I", "Apa yang Dimonitor"],
    ["J", "Dimana"],
    ["K", "Kapan"],
    ["L", "Bagaimana"],
    ["M", "Siapa yang Melakukan"],
  ]);
  groupColumnHeader(sheet, "N", "S", "Tindakan Koreksi", [
    ["N", "Siapa yang Akan Menganalisis Hasilnya"],
    ["O", "Siapa yang Menerima Hasil Analisis dan Mengambil Tindakan"],
    ["P", "Apa Tindakan Koreksinya"],
    ["Q", "Siapa yang Melakukan Tindakan Koreksi"],
    ["R", "Seberapa Cepat"],
    ["S", "Siapa yang Wajib Menerima Laporan untuk Tindakan Koreksi Ini"],
  ]);

  applyHeaderStyles(sheet);
  writeRefRow(sheet, TOTAL_COLUMNS);

  rows.forEach((item) => {
    const identifikasi = item.kajiUlangRisiko?.penilaianRisiko?.identifikasiDanKejadianBahaya;
    const row = sheet.addRow([
      identifikasi?.lokasiSpam?.kodeLokasi ?? "-",
      identifikasi?.kodeRisiko ?? "-",
      identifikasi?.komponenSpam ?? "-",
      identifikasi?.bahayaKontaminasi?.kontaminasiX ?? "-",
      identifikasi?.komponenSpamY ?? "-",
      identifikasi?.penyebabZ ?? "-",
      identifikasi?.kejadianBahayaXYZ ?? "-",
      item.batasKritis ?? "-",
      item.apaYangDimonitor ?? "-",
      item.dimana ?? "-",
      item.kapan ?? "-",
      item.bagaimana ?? "-",
      item.siapaYangMelakukan ?? "-",
      item.siapaYangAkanMenganalisisHasilnya ?? "-",
      item.siapaYangMenerimaHasilAnalisisDanMengambilTindakan ?? "-",
      item.apaTindakanKoreksinya ?? "-",
      item.siapaYangMelakukanTindakanKoreksi ?? "-",
      item.seberapaCepat ?? "-",
      item.siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni ?? "-",
    ]);
    row.eachCell(dataStyle);
  });

  setColumnWidths(sheet, WIDTHS);
  return sheet;
}

/** Kembalikan array object siap dipakai importer */
export function parsePemantauanOperasionalRows(sheet) {
  return readDataRows(sheet, TOTAL_COLUMNS).map(({ excelRowNumber, values }) => ({
    excelRowNumber,
    kodeRisiko: String(values[1]).trim(),
    batasKritis: values[7],
    apaYangDimonitor: values[8],
    dimana: values[9],
    kapan: values[10],
    bagaimana: values[11],
    siapaYangMelakukan: values[12],
    siapaYangAkanMenganalisisHasilnya: values[13],
    siapaYangMenerimaHasilAnalisisDanMengambilTindakan: values[14],
    apaTindakanKoreksinya: values[15],
    siapaYangMelakukanTindakanKoreksi: values[16],
    seberapaCepat: values[17],
    siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: values[18],
  }));
}