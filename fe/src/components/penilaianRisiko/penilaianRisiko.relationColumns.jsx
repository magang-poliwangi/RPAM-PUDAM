import { formatRupiah } from "../../utils/format-rupiah";
import { columnGroup, enumCheckGroup, relationColumn } from "../common/column-helpers";
import RiskLevelBadge from "../common/RiskLevelBadge";
export const RELATION_COLUMN_GROUPS = {
  detailKejadianBahaya: {
    label: 'Identifikasi Dan Kejadian Bahaya',
    columns: [
      columnGroup('Kejadian Bahaya', [
        relationColumn('identifikasiDanKejadianBahaya.bahayaKontaminasi.kontaminasiX', 'Kontaminasi (X)'),
        relationColumn('identifikasiDanKejadianBahaya.penyebabZ', 'Penyebab (Z)'),
        relationColumn('identifikasiDanKejadianBahaya.komponenSpamY', 'Komponen SPAM (Y)'),
        relationColumn('identifikasiDanKejadianBahaya.kejadianBahayaXYZ', 'Kejadian Bahaya (XYZ)'),
      ]),
      relationColumn('identifikasiDanKejadianBahaya.bahayaKontaminasi.tipeBahaya', 'Tipe Bahaya'),
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

  rencanaPerbaikan: {
    label: 'Rencana Perbaikan',
    columns: [

      relationColumn('kajiUlangRisiko.rencanaPerbaikan.rencanaPerbaikan', 'Rencana Perbaikan'),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.penanggungJawab', 'Penanggung Jawab'),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.jadwalPelaksanaan', 'Jadwal Pelaksanaan'),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.biaya', 'Biaya', {
        render: (v) => <span className="text-xs">{v ? formatRupiah(v) : '-'}</span>,
      }),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.sumberPembiayaan', 'Sumber Pembiayaan'),
      relationColumn('kajiUlangRisiko.rencanaPerbaikan.statusKemajuan', 'Status Kemajuan'),
      columnGroup('Kendala Sumber Daya', [

        relationColumn('kajiUlangRisiko.rencanaPerbaikan.kendalaKeuangan', 'Kendala Keuangan', {
          render: (v) => (v ? '✓' : '-')
        }),
        relationColumn('kajiUlangRisiko.rencanaPerbaikan.kendalaTenagaKerja', 'Kendala Tenaga Kerja', {
          render: (v) => (v ? '✓' : '-')
        }),
      ]),
      enumCheckGroup('kajiUlangRisiko.rencanaPerbaikan.prioritas', 'Skala Prioritas', [
        { value: 'PENDEK', label: 'Pendek' },
        { value: 'MENENGAH', label: 'Menengah' },
        { value: 'PANJANG', label: 'Panjang' },
      ]),
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