import { formatRupiah } from "../../utils/format-rupiah";
import {  checkColumn, columnGroup, enumCheckGroup, relationColumn, textColumn } from "../common/column-helpers";

export const rencanaPerbaikanColumns = [
  relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kodeLokasi', 'Kode Lokasi'),
  relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kodeRisiko', 'Kode Risiko'),
  textColumn('rencanaPerbaikan', 'Rencana Perbaikan'),
  textColumn('penanggungJawab', 'Penanggung Jawab'),
  textColumn('jadwalPelaksanaan', 'Jadwal Pelaksanaan'),
  { key: 'biaya', label: 'Biaya', render: (v) => <span className="text-xs">{formatRupiah(v)}</span> },
  textColumn('sumberPembiayaan', 'Sumber Pembiayaan'),
  textColumn('statusKemajuan', 'Status Kemajuan'),
  columnGroup('Kendala Sumber Daya', [
    checkColumn('kendalaKeuangan', 'Kendala Keuangan'),
    checkColumn('kendalaTenagaKerja', 'Kendala Tenaga Kerja'),
  ]),
  enumCheckGroup('prioritas', 'Skala Prioritas', [
    { value: 'PENDEK', label: 'Pendek' },
    { value: 'MENENGAH', label: 'Menengah' },
    { value: 'PANJANG', label: 'Panjang' },
  ]),
];