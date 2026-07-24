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
    label: 'Identifikasi Dan Kejadian Bahaya',
    columns: [
      relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.komponenSpam', 'Komponen SPAM'),
      columnGroup('Kejadian Bahaya', [
        relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.bahayaKontaminasi.kontaminasiX', 'Kontaminasi (X)'),
        relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.penyebabZ', 'Penyebab (Z)'),
        relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.komponenSpamY', 'Komponen SPAM (Y)'),
        relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.kejadianBahayaXYZ', 'Kejadian Bahaya (XYZ)'),
      ]),
      relationColumn('penilaianRisiko.identifikasiDanKejadianBahaya.bahayaKontaminasi.tipeBahaya', 'Tipe Bahaya'),
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

      relationColumn('rencanaPerbaikan.rencanaPerbaikan', 'Rencana Perbaikan'),
      relationColumn('rencanaPerbaikan.penanggungJawab', 'Penanggung Jawab'),
      relationColumn('rencanaPerbaikan.jadwalPelaksanaan', 'Jadwal Pelaksanaan'),
      relationColumn('rencanaPerbaikan.biaya', 'Biaya', {
        render: (v) => <span className="text-xs">{v ? formatRupiah(v) : '-'}</span>,
      }),
      relationColumn('rencanaPerbaikan.sumberPembiayaan', 'Sumber Pembiayaan'),
      relationColumn('rencanaPerbaikan.statusKemajuan', 'Status Kemajuan'),
      columnGroup('Kendala Sumber Daya', [
        
        relationColumn('rencanaPerbaikan.kendalaKeuangan', 'Kendala Keuangan',{
          render:(v)=>(v ? '✓' : '-')
        }),
        relationColumn('rencanaPerbaikan.kendalaTenagaKerja', 'Kendala Tenaga Kerja',{
          render:(v)=>(v ? '✓' : '-')
        }),
      ]),
      enumCheckGroup('rencanaPerbaikan.prioritas', 'Skala Prioritas', [
        { value: 'PENDEK', label: 'Pendek' },
        { value: 'MENENGAH', label: 'Menengah' },
        { value: 'PANJANG', label: 'Panjang' },
      ]),
    ],
  },


  pemantauanOperasional: {
    label: 'Pemantauan Operasional',
    columns: [
      relationColumn('pemantauanOperasional.batasKritis', 'Batas Kritis'),
      columnGroup('Pemantauan Operasional', [
        relationColumn('pemantauanOperasional.apaYangDimonitor', 'Apa Yang Dimonitor'),
        relationColumn('pemantauanOperasional.dimana', 'Dimana'),
        relationColumn('pemantauanOperasional.kapan', 'Kapan'),
        relationColumn('pemantauanOperasional.siapaYangMelakukan', 'Siapa Yang Melakukan'),
        relationColumn('pemantauanOperasional.siapaYangAkanMenganalisisHasilnya', 'Siapa Yang Akan Menganalisis Hasilnya'),
        relationColumn('pemantauanOperasional.siapaYangMenerimaHasilAnalisisDanMengambilTindakan', 'Siapa Yang Menerima Hasil Analisis Dan Mengambil Tindakan'),
      ]),
      columnGroup('Tindakan Koreksi', [
        relationColumn('pemantauanOperasional.apaTindakanKoreksinya', 'Apa Tindakan Koreksinya'),
        relationColumn('pemantauanOperasional.siapaYangMelakukanTindakanKoreksi', 'Siapa Yang Melakukan Tindakan Koreksi'),
        relationColumn('pemantauanOperasional.seberapaCepat', 'Seberapa Cepat'),
        relationColumn('pemantauanOperasional.siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni', 'Siapa Yang Wajib Menerima Laporan Untuk Tindakan Koreksi Ini'),
      ]),

    ],
  },
};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);