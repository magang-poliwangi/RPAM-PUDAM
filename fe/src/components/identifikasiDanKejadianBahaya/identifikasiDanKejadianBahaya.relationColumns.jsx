import { formatRupiah } from "../../utils/format-rupiah";
import {  columnGroup, enumCheckGroup, relationColumn, } from "../common/column-helpers";
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
    label: 'Penilaian Risiko',
    columns: [
      columnGroup('Risiko Tanpa Tindakan Pengendalian', skorTingkat('penilaianRisiko')),
    ],
  },

  kajiUlangRisiko: {
    label: 'Kaji Ulang Risiko',
    columns: [
      relationColumn('penilaianRisiko.kajiUlangRisiko.tindakanPengendalian', 'Tindakan Pengendalian', {
        render: (v) => <span className="max-w-xs">{v ?? '-'}</span>,
      }),
      columnGroup('validasi', [
        relationColumn('penilaianRisiko.kajiUlangRisiko.referensi', 'Referensi'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.validasi', 'Validasi', {
          render: (v) => (v === 'EFEKTIF' ? '✓' : '-'),
        }),
        relationColumn('penilaianRisiko.kajiUlangRisiko.validasi', 'Validasi', {
          render: (v) => (v === 'TIDAK_EFEKTIF' ? '✓' : '-'),
        }),
        relationColumn('penilaianRisiko.kajiUlangRisiko.validasi', 'Validasi', {
          render: (v) => (v === 'TIDAK_PASTI' ? '✓' : '-'),
        }),

      ]),
      columnGroup('Risiko Dengan Tindakan Pengendalian', [
        relationColumn('penilaianRisiko.kajiUlangRisiko.peluangKejadianBahaya', 'Peluang Kejadian Bahaya'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.dampakKeparahan', 'Dampak Keparahan'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.skorRisiko', 'Skor Risiko', {
          render: (v) => <span className="font-semibold text-gray-900">{v ?? '-'}</span>,

        }),
        relationColumn('penilaianRisiko.kajiUlangRisiko.tingkatRisiko', 'Tingkat Risiko', {
          render: (v) => (v ? <RiskLevelBadge level={v} /> : '-'),
        }),
      ])
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
      relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.sumberPembiayaan', 'Sumber Pembiayaan'),
      relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.statusKemajuan', 'Status Kemajuan'),
      columnGroup('Kendala Sumber Daya', [
        
        relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.kendalaKeuangan', 'Kendala Keuangan',{
          render:(v)=>(v ? '✓' : '-')
        }),
        relationColumn('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.kendalaTenagaKerja', 'Kendala Tenaga Kerja',{
          render:(v)=>(v ? '✓' : '-')
        }),
      ]),
      enumCheckGroup('penilaianRisiko.kajiUlangRisiko.rencanaPerbaikan.prioritas', 'Skala Prioritas', [
        { value: 'PENDEK', label: 'Pendek' },
        { value: 'MENENGAH', label: 'Menengah' },
        { value: 'PANJANG', label: 'Panjang' },
      ]),
    ],
  },

  pemantauanOperasional: {
    label: 'Pemantauan Operasional',
    columns: [
      relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.batasKritis', 'Batas Kritis'),
      columnGroup('Pemantauan Operasional', [
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.apaYangDimonitor', 'Apa Yang Dimonitor'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.dimana', 'Dimana'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.kapan', 'Kapan'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.siapaYangMelakukan', 'Siapa Yang Melakukan'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.siapaYangAkanMenganalisisHasilnya', 'Siapa Yang Akan Menganalisis Hasilnya'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.siapaYangMenerimaHasilAnalisisDanMengambilTindakan', 'Siapa Yang Menerima Hasil Analisis Dan Mengambil Tindakan'),
      ]),
      columnGroup('Tindakan Koreksi', [
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.apaTindakanKoreksinya', 'Apa Tindakan Koreksinya'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.siapaYangMelakukanTindakanKoreksi', 'Siapa Yang Melakukan Tindakan Koreksi'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.seberapaCepat', 'Seberapa Cepat'),
        relationColumn('penilaianRisiko.kajiUlangRisiko.pemantauanOperasional.siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni', 'Siapa Yang Wajib Menerima Laporan Untuk Tindakan Koreksi Ini'),
      ]),

    ],
  },

};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);