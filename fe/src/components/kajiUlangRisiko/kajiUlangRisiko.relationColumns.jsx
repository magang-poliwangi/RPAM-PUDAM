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
  detailKejadianBahaya: {
    label: 'Detail Kejadian Bahaya',
    columns: [
      relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.komponenSpam', 'Komponen SPAM'),
      columnGroup('Kejadian Bahaya', [
        relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.kontaminasiX', 'Kontaminasi (X)'),
        relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.penyebabZ', 'Penyebab (Z)'),
        relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.komponenSpamY', 'Komponen SPAM (Y)'),
        relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.kejadianBahayaXYZ', 'Kejadian Bahaya (XYZ)'),
      ]),
      relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.tipeBahaya', 'Tipe Bahaya'),
    ],
  },
  penilaianRisiko: {
    label: 'Risiko Tanpa Tindakan Pengendalian',
    columns: [
      columnGroup('Risiko Tanpa Tindakan Pengendalian', skorTingkat('penilaianRisiko')),
    ],
  },
  rencanaPerbaikan: {
    label: 'Rencana Perbaikan',
    columns: [
      relationColumn('rencanaPerbaikan.rencanaPerbaikan', 'Rencana Perbaikan', {
        render: (v) => <span className=" max-w-xs">{v ?? '-'}</span>,
      }),
      relationColumn('rencanaPerbaikan.penanggungJawab', 'Penanggung Jawab'),
      relationColumn('rencanaPerbaikan.jadwalPelaksanaan', 'Jadwal Pelaksanaan'),
      relationColumn('rencanaPerbaikan.biaya', 'Biaya', {
        render: (v) => <span className="text-xs">{v ? formatRupiah(v) : '-'}</span>,
      }),
      relationColumn('rencanaPerbaikan.sumberPembiayaan', 'Sumber Pembiayaan'),
      relationColumn('rencanaPerbaikan.statusKemajuan', 'Status Kemajuan'),
    ],
  },
  pemantauanOperasional: {
    label: 'Pemantauan Operasional',
    columns: [
      relationColumn('pemantauanOperasional.apaYangDimonitor', 'Apa Yang Dimonitor'),
      relationColumn('pemantauanOperasional.dimana', 'Dimana'),
      relationColumn('pemantauanOperasional.kapan', 'Kapan'),
      relationColumn('pemantauanOperasional.bagaimana', 'Bagaimana'),
      relationColumn('pemantauanOperasional.apaTindakanKoreksinya', 'Tindakan Koreksi'),
    ],
  },
};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);