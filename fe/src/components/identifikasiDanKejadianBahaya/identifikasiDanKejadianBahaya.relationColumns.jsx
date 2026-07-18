import { formatRupiah } from "../../utils/format-rupiah";
import { columnGroup, relationColumn } from "../common/column-helpers";
import RiskLevelBadge from "../common/RiskLevelBadge";

const skorTingkat = (basePath) => [
  relationColumn(`${basePath}.peluangKejadianBahaya`, 'Peluang Kejadian Bahaya'),
  relationColumn(`${basePath}.dampakKeparahan`, 'Dampak Keparahan'),
  relationColumn(`${basePath}.skorRisiko`, 'Skor Risiko', {
    render: (v) => <span className="font-semibold text-gray-900">{v ?? '-'}</span>,
  }),
  relationColumn(`${basePath}.tingkatRisiko`, 'Tingkat Risiko', {
    render: (v) => (v ? <RiskLevelBadge level={v} /> : '-'),
  }),
];

export const RELATION_COLUMN_GROUPS = {
  penilaianRisiko: {
    label: 'Risiko Tanpa Tindakan Pengendalian',
    columns: [
      columnGroup('Risiko Tanpa Tindakan Pengendalian', skorTingkat('penilaianRisiko')),
    ],
  },
  kajiUlangRisiko: {
    label: 'Kaji Ulang Risiko',
    columns: [
      relationColumn('penilaianRisiko.kajiUlangRisiko.tindakanPengendalian', 'Tindakan Pengendalian', {
        render: (v) => <span className="line-clamp-2 max-w-xs">{v ?? '-'}</span>,
      }),
      relationColumn('penilaianRisiko.kajiUlangRisiko.referensi', 'Referensi'),
      relationColumn('penilaianRisiko.kajiUlangRisiko.validasi', 'Validasi'),
      columnGroup('Risiko Dengan Tindakan Pengendalian', skorTingkat('penilaianRisiko.kajiUlangRisiko')),
    ],
  },
  rencanaPerbaikan: {
    label: 'Rencana Perbaikan',
    columns: [
      relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.rencanaPerbaikan', 'Rencana Perbaikan'),
      relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.penanggungJawab', 'Penanggung Jawab'),
      relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.jadwalPelaksanaan', 'Jadwal Pelaksanaan'),
      relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.biaya', 'Biaya', {
        render: (v) => <span className="text-xs">{v ? formatRupiah(v) : '-'}</span>,
      }),
      relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.statusKemajuan', 'Status Kemajuan'),
    ],
  },
  pemantauanOperasional: {
    label: 'Pemantauan Operasional',
    columns: [
      relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.apaYangDimonitor', 'Apa Yang Dimonitor'),
      relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.dimana', 'Dimana'),
      relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.kapan', 'Kapan'),
      relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.bagaimana', 'Bagaimana'),
    ],
  },
};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);