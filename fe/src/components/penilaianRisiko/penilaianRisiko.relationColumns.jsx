import { formatRupiah } from "../../utils/format-rupiah";
import { columnGroup, enumCheckGroup, relationColumn } from "../common/column-helpers";
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
      columnGroup('Kejadian Bahaya', [
        relationColumn('identifikasiDanKejadianBahaya.kontaminasiX', 'Kontaminasi (X)'),
        relationColumn('identifikasiDanKejadianBahaya.penyebabZ', 'Penyebab (Z)'),
        relationColumn('identifikasiDanKejadianBahaya.komponenSpamY', 'Komponen SPAM (Y)'),
        relationColumn('identifikasiDanKejadianBahaya.kejadianBahayaXYZ', 'Kejadian Bahaya (XYZ)'),
      ]),
      relationColumn('identifikasiDanKejadianBahaya.tipeBahaya', 'Tipe Bahaya'),
    ],
  },
  detailLokasi: {
    label: 'Detail Lokasi SPAM',
    columns: [
      relationColumn('identifikasiDanKejadianBahaya.lokasiSpam.namaLokasi', 'Nama Lokasi'),
      relationColumn('identifikasiDanKejadianBahaya.lokasiSpam.penanggungJawabNama', 'Penanggung Jawab'),
      relationColumn('identifikasiDanKejadianBahaya.lokasiSpam.penanggungJawabTelepon', 'Telepon PJ'),
    ],
  },
  kajiUlangRisiko: {
    label: 'Kaji Ulang Risiko',
    columns: [
      relationColumn('kajiUlangRisiko.tindakanPengendalian', 'Tindakan Pengendalian', {
        render: (v) => <span className=" max-w-xs">{v ?? '-'}</span>,
      }),
      relationColumn('kajiUlangRisiko.referensi', 'Referensi'),
      enumCheckGroup('kajiUlangRisiko.validasi', 'Validasi', [
        { value: 'EFEKTIF', label: 'Efektif' },
        { value: 'TIDAK_EFEKTIF', label: 'Tidak Efektif', width: '100px' },
        { value: 'TIDAK_PASTI', label: 'Tidak Pasti' },
      ]),

      columnGroup('Risiko Dengan Tindakan Pengendalian', skorTingkat('kajiUlangRisiko')),
    ],
  },
  rencanaPerbaikan: {
    label: 'Rencana Perbaikan',
    columns: [
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.rencanaPerbaikan', 'Rencana Perbaikan'),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.penanggungJawab', 'Penanggung Jawab'),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.jadwalPelaksanaan', 'Jadwal Pelaksanaan'),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.biaya', 'Biaya', {
        render: (v) => <span className="text-xs">{v ? formatRupiah(v) : '-'}</span>,
      }),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.statusKemajuan', 'Status Kemajuan'),
    ],
  },
  pemantauanOperasional: {
    label: 'Pemantauan Operasional',
    columns: [
      relationColumn('kajiUlangRisiko.pemantauanOperasional.apaYangDimonitor', 'Apa Yang Dimonitor'),
      relationColumn('kajiUlangRisiko.pemantauanOperasional.dimana', 'Dimana'),
      relationColumn('kajiUlangRisiko.pemantauanOperasional.kapan', 'Kapan'),
      relationColumn('kajiUlangRisiko.pemantauanOperasional.bagaimana', 'Bagaimana'),
    ],
  },
};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);