import { clampColumn, columnGroup, relationColumn, textColumn } from "../common/column-helpers";

export const pemantauanOperasionalColumns = [
  relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.lokasiSpam.kodeLokasi', 'Kode Lokasi'),
  relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kodeRisiko', 'Kode Risiko'),
  clampColumn('apaYangDimonitor', 'Apa Yang Dimonitor'),
  textColumn('batasKritis', 'Batas Kritis'),
  columnGroup('Pemantauan Operasional', [
    textColumn('dimana', 'Dimana'),
    textColumn('kapan', 'Kapan'),
    textColumn('bagaimana', 'Bagaimana'),
    textColumn('siapaYangMelakukan', 'Siapa Yang Melakukan'),
    textColumn('siapaYangAkanMenganalisisHasilnya', 'Siapa Yang Akan Menganalisis Hasilnya'),
    textColumn('siapaYangMenerimaHasilAnalisisDanMengambilTindakan', 'Siapa Yang Menerima Hasil Analisis Dan Mengambil Tindakan'),
  ]),
  columnGroup('Tindakan Koreksi', [
    textColumn('apaTindakanKoreksinya', 'Apa Tindakan Koreksinya'),
    textColumn('siapaYangMelakukanTindakanKoreksi', 'Siapa Yang Melakukan Tindakan Koreksi'),
    textColumn('seberapaCepat', 'Seberapa Cepat'),
    textColumn('siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni', 'Siapa Yang Wajib Menerima Laporan Untuk Tindakan Koreksi Ini'),
  ]),
];