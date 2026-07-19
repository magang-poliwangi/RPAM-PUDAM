import { columnGroup, relationColumn, textColumn } from "../common/column-helpers";

export const identifikasiDanKejadianBahayaColumns = [
  relationColumn('kodeLokasi', 'Kode Lokasi'),
  textColumn('kodeRisiko', 'Kode Risiko'),
  textColumn('komponenSpam', 'Komponen SPAM'),
  columnGroup('Kejadian Bahaya', [
    relationColumn('bahayaKontaminasi.kontaminasiX', 'Kontaminasi atau Sesuatu yang Berpotensi Buruk Terhadap Kualitas Air (X)'),
    textColumn('penyebabZ', 'Penyebab (Z)'),
    textColumn('komponenSpamY', 'Komponen SPAM (Y)'),
    textColumn('kejadianBahayaXYZ', 'Kejadian Bahaya (XYZ)'),
  ]),
  relationColumn('bahayaKontaminasi.tipeBahaya', 'Tipe Bahaya'),
];