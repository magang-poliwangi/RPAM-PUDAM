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
                render: (v) => <span className="line-clamp-2 max-w-xs">{v ?? '-'}</span>,
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
            relationColumn('kajiUlangRisiko.rencanaPerbaikan.rencanaPerbaikan', 'Rencana Perbaikan', {
                render: (v) => <span className="line-clamp-2 max-w-xs">{v ?? '-'}</span>,
            }),
            relationColumn('kajiUlangRisiko.rencanaPerbaikan.penanggungJawab', 'Penanggung Jawab'),
            relationColumn('kajiUlangRisiko.rencanaPerbaikan.jadwalPelaksanaan', 'Jadwal Pelaksanaan'),
            relationColumn('kajiUlangRisiko.rencanaPerbaikan.biaya', 'Biaya', {
                render: (v) => <span className="text-xs">{v ? formatRupiah(v) : '-'}</span>,
            }),
            relationColumn('kajiUlangRisiko.rencanaPerbaikan.sumberPembiayaan', 'Sumber Pembiayaan'),
            relationColumn('kajiUlangRisiko.rencanaPerbaikan.statusKemajuan', 'Status Kemajuan'),
        ],
    },
};

export const RELATION_ORDER = Object.keys(RELATION_COLUMN_GROUPS);