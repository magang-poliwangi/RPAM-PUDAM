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

};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);