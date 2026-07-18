import { formatRupiah } from "../../utils/format-rupiah";
import { badgeColumn, checkColumn, clampColumn, columnGroup, enumCheckGroup, relationColumn, textColumn } from "../common/column-helpers";
import Badge from "../../components/common/Badge";
const STATUS_LABEL = {
  BELUM_MULAI: 'Belum Mulai',
  SEDANG_BERJALAN: 'Sedang Berjalan',
  SELESAI: 'Selesai',
  TERTUNDA: 'Tertunda',
};
const STATUS_VARIANT = {
  BELUM_MULAI: 'gray',
  SEDANG_BERJALAN: 'blue',
  SELESAI: 'green',
  TERTUNDA: 'yellow',
};

export const rencanaPerbaikanColumns = [
  relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.lokasiSpam.kodeLokasi', 'Kode Lokasi'),
  relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kodeRisiko', 'Kode Risiko'),
  clampColumn('rencanaPerbaikan', 'Rencana Perbaikan'),
  textColumn('penanggungJawab', 'Penanggung Jawab'),
  textColumn('jadwalPelaksanaan', 'Jadwal Pelaksanaan'),
  { key: 'biaya', label: 'Biaya', render: (v) => <span className="text-xs">{formatRupiah(v)}</span> },
  textColumn('sumberPembiayaan', 'Sumber Pembiayaan'),
  badgeColumn('statusKemajuan', 'Status Kemajuan', { labelMap: STATUS_LABEL, variantMap: STATUS_VARIANT }, Badge),
  columnGroup('Kendala Sumber Daya', [
    checkColumn('kendalaKeuangan', 'Kendala Keuangan'),
    checkColumn('kendalaTenagaKerja', 'Kendala Tenaga Kerja'),
  ]),
  enumCheckGroup('prioritas', 'Skala Prioritas', [
    { value: 'PENDEK', label: 'Pendek' },
    { value: 'MENENGAH', label: 'Menengah' },
    { value: 'PANJANG', label: 'Panjang' },
  ]),
  {
    key: 'tingkatRisikoDenganPengendalian',
    label: 'Tingkat Risiko Dengan Pengendalian',
    render: (v) => v ?? '-',
  },
];