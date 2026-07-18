import { columnGroup, relationColumn, textColumn } from "../common/column-helpers";

export const identifikasiDanKejadianBahayaColumns = [
  relationColumn('lokasiSpam.kodeLokasi', 'Kode Lokasi'),
  textColumn('kodeRisiko', 'Kode Risiko'),
  textColumn('komponenSpam', 'Komponen SPAM'),
  columnGroup('Kejadian Bahaya', [
    textColumn('kontaminasiX', 'Kontaminasi atau Sesuatu yang Berpotensi Buruk Terhadap Kualitas Air (X)'),
    textColumn('penyebabZ', 'Penyebab (Z)'),
    textColumn('komponenSpamY', 'Komponen SPAM (Y)'),
    textColumn('kejadianBahayaXYZ', 'Kejadian Bahaya (XYZ)'),
  ]),
  textColumn('tipeBahaya', 'Tipe Bahaya'),
];