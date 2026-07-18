import { clampColumn, columnGroup, enumCheckGroup, relationColumn, textColumn } from "../common/column-helpers";
import RiskLevelBadge from "../common/RiskLevelBadge";

export const kajiUlangRisikoColumns = [
  relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.lokasiSpam.kodeLokasi', 'Kode Lokasi'),
  relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.kodeRisiko', 'Kode Risiko'),
  clampColumn('tindakanPengendalian', 'Tindakan Pengendalian'),
  clampColumn('referensi', 'Referensi'),
  enumCheckGroup('validasi', 'Validasi', [
    { value: 'EFEKTIF', label: 'Efektif' },
    { value: 'TIDAK_EFEKTIF', label: 'Tidak Efektif', width: '100px' },
    { value: 'TIDAK_PASTI', label: 'Tidak Pasti' },
  ]),
  columnGroup('Risiko Dengan Tindakan Pengendalian', [
    textColumn('peluangSetelah', 'Peluang Kejadian Bahaya'),
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