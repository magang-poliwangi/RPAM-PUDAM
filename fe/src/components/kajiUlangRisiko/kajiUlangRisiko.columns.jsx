import { columnGroup,  relationColumn, textColumn } from "../common/column-helpers";
import RiskLevelBadge from "../common/RiskLevelBadge";

export const kajiUlangRisikoColumns = [
  relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.kodeLokasi', 'Kode Lokasi'),
  relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.kodeRisiko', 'Kode Risiko'),
  textColumn('tindakanPengendalian', 'Tindakan Pengendalian'),
  columnGroup('validasi', [
    textColumn('referensi', 'Referensi'),
    {
      key: 'validasi',
      label: 'Efektif',
      render: (v) => (v === 'EFEKTIF' ? '✓' : '-'),
    },
    {
      key: 'validasi',
      label: 'Tidak Efektif',
      render: (v) => (v === 'TIDAK_EFEKTIF' ? '✓' : '-'),
    },
    {
      key: 'validasi',
      label: 'Tidak Pasti',
      render: (v) => (v === 'TIDAK_PASTI' ? '✓' : '-'),
    },

  ]),
  columnGroup('Risiko Dengan Tindakan Pengendalian', [
    textColumn('peluangKejadianBahaya', 'Peluang Kejadian Bahaya'),
    textColumn('dampakKeparahan', 'Dampak Keparahan'),
    {
      key: 'skorRisiko',
      label: 'Skor Risiko',
      render: (v) => <span className="font-semibold text-gray-900">{v ?? '-'}</span>,
    },
    {
      key: 'tingkatRisiko',
      label: 'Tingkat Risiko',
      render: (v) => (v ? <RiskLevelBadge level={v} /> : '-'),
    },
  ]),];