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
    label: 'Identifikasi Dan Kejadian Bahaya',
    columns: [
      relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.komponenSpam', 'Komponen SPAM'),
      columnGroup('Kejadian Bahaya', [
        relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.bahayaKontaminasi.kontaminasiX', 'Kontaminasi (X)'),
        relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.penyebabZ', 'Penyebab (Z)'),
        relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.komponenSpamY', 'Komponen SPAM (Y)'),
        relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kejadianBahayaXYZ', 'Kejadian Bahaya (XYZ)'),
      ]),
      relationColumn('kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.bahayaKontaminasi.tipeBahaya', 'Tipe Bahaya'),
    ],
  },
  penilaianRisiko: {
    label: 'Penilaian Risiko',
    columns: [
      columnGroup('Risiko Tanpa Tindakan Pengendalian', skorTingkat('kajiUlangRisiko.penilaianRisiko')),
    ],
  },
  kajiUlangRisiko: {
    label: 'Kaji Ulang Risiko',
    columns: [
      relationColumn('kajiUlangRisiko.tindakanPengendalian', 'Tindakan Pengendalian', {
        render: (v) => <span className="max-w-xs">{v ?? '-'}</span>,
      }),
      columnGroup('validasi', [
        relationColumn('kajiUlangRisiko.referensi', 'Referensi'),
        relationColumn('kajiUlangRisiko.validasi', 'Validasi', {
          render: (v) => (v === 'EFEKTIF' ? '✓' : '-'),
        }),
        relationColumn('kajiUlangRisiko.validasi', 'Validasi', {
          render: (v) => (v === 'TIDAK_EFEKTIF' ? '✓' : '-'),
        }),
        relationColumn('kajiUlangRisiko.validasi', 'Validasi', {
          render: (v) => (v === 'TIDAK_PASTI' ? '✓' : '-'),
        }),

      ]),
      columnGroup('Risiko Dengan Tindakan Pengendalian', [
        relationColumn('kajiUlangRisiko.peluangKejadianBahaya', 'Peluang Kejadian Bahaya'),
        relationColumn('kajiUlangRisiko.dampakKeparahan', 'Dampak Keparahan'),
        relationColumn('kajiUlangRisiko.skorRisiko', 'Skor Risiko', {
          render: (v) => <span className="font-semibold text-gray-900">{v ?? '-'}</span>,

        }),
        relationColumn('kajiUlangRisiko.tingkatRisiko', 'Tingkat Risiko', {
          render: (v) => (v ? <RiskLevelBadge level={v} /> : '-'),
        }),
      ])
    ],
  },

  pemantauanOperasional: {
    label: 'Pemantauan Operasional',
    columns: [
      relationColumn('kajiUlangRisiko.pemantauanOperasional.batasKritis', 'Batas Kritis'),
      columnGroup('Pemantauan Operasional', [
        relationColumn('kajiUlangRisiko.pemantauanOperasional.apaYangDimonitor', 'Apa Yang Dimonitor'),
        relationColumn('kajiUlangRisiko.pemantauanOperasional.dimana', 'Dimana'),
        relationColumn('kajiUlangRisiko.pemantauanOperasional.kapan', 'Kapan'),
        relationColumn('kajiUlangRisiko.pemantauanOperasional.siapaYangMelakukan', 'Siapa Yang Melakukan'),
        relationColumn('kajiUlangRisiko.pemantauanOperasional.siapaYangAkanMenganalisisHasilnya', 'Siapa Yang Akan Menganalisis Hasilnya'),
        relationColumn('kajiUlangRisiko.pemantauanOperasional.siapaYangMenerimaHasilAnalisisDanMengambilTindakan', 'Siapa Yang Menerima Hasil Analisis Dan Mengambil Tindakan'),
      ]),
      columnGroup('Tindakan Koreksi', [
        relationColumn('kajiUlangRisiko.pemantauanOperasional.apaTindakanKoreksinya', 'Apa Tindakan Koreksinya'),
        relationColumn('kajiUlangRisiko.pemantauanOperasional.siapaYangMelakukanTindakanKoreksi', 'Siapa Yang Melakukan Tindakan Koreksi'),
        relationColumn('kajiUlangRisiko.pemantauanOperasional.seberapaCepat', 'Seberapa Cepat'),
        relationColumn('kajiUlangRisiko.pemantauanOperasional.siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni', 'Siapa Yang Wajib Menerima Laporan Untuk Tindakan Koreksi Ini'),
      ]),

    ],
  },

};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);