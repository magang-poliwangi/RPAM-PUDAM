import { columnGroup,  relationColumn, textColumn } from "../common/column-helpers";
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
      relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.komponenSpam', 'Komponen SPAM'),
      columnGroup('Kejadian Bahaya', [
        relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kontaminasiX', 'Kontaminasi (X)'),
        relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.penyebabZ', 'Penyebab (Z)'),
        relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.komponenSpamY', 'Komponen SPAM (Y)'),
        relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kejadianBahayaXYZ', 'Kejadian Bahaya (XYZ)'),
      ]),
      relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.tipeBahaya', 'Tipe Bahaya'),
    ],
  },
  penilaianRisiko: {
    label: 'Risiko Tanpa Tindakan Pengendalian',
    columns: [
      columnGroup('Risiko Tanpa Tindakan Pengendalian', skorTingkat('kajiUlangRisiko.penilaianRisiko')),
    ],
  },
  kajiUlangRisiko: {
    label: 'Kaji Ulang Risiko',
    columns: [
      relationColumn('kajiUlangRisiko.tindakanPengendalian', 'Tindakan Pengendalian', {
        render: (v) => <span className=" max-w-xs">{v ?? '-'}</span>,
      }),
      columnGroup('validasi', [
        textColumn('kajiUlangRisiko.referensi', 'Referensi'),
        {
          key: 'kajiUlangRisiko.validasi',
          label: 'Efektif',
          render: (v) => (v === 'EFEKTIF' ? '✓' : '-'),
        },
        {
          key: 'kajiUlangRisiko.validasi',
          label: 'Tidak Efektif',
          render: (v) => (v === 'TIDAK_EFEKTIF' ? '✓' : '-'),
        },
        {
          key: 'kajiUlangRisiko.validasi',
          label: 'Tidak Pasti',
          render: (v) => (v === 'TIDAK_PASTI' ? '✓' : '-'),
        },

      ]),

      columnGroup('Risiko Dengan Tindakan Pengendalian', skorTingkat('kajiUlangRisiko')),
    ],
  },
  pemantauanOperasional: {
    label: 'Pemantauan Operasional',
    columns: [
      relationColumn('kajiUlangRisiko.pemantauanOperasional.apaYangDimonitor', 'Apa Yang Dimonitor'),
      relationColumn('kajiUlangRisiko.pemantauanOperasional.dimana', 'Dimana'),
      relationColumn('kajiUlangRisiko.pemantauanOperasional.kapan', 'Kapan'),
      relationColumn('kajiUlangRisiko.pemantauanOperasional.bagaimana', 'Bagaimana'),
      relationColumn('kajiUlangRisiko.pemantauanOperasional.apaTindakanKoreksinya', 'Tindakan Koreksi'),
    ],
  },
};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);