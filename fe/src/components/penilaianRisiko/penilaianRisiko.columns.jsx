import { columnGroup, relationColumn, textColumn } from "../common/column-helpers";
import RiskLevelBadge from "../common/RiskLevelBadge";

export const penilaianRisikoColumns = [
    relationColumn('identifikasiDanKejadianBahaya.kodeLokasi', 'Kode Lokasi'),
    relationColumn('identifikasiDanKejadianBahaya.kodeRisiko', 'Kode Risiko'),
    columnGroup('Risiko Tanpa Tindakan Pengendalian', [
        textColumn('peluangKejadianBahaya', 'Peluang Kejadian Bahaya'),
        textColumn('dampakKeparahan', 'Dampak Keparahan'),
        {
            key: 'skorRisiko',
            label: 'Skor Risiko',
            render: (v) => <span className="font-semibold text-gray-900">{v ?? '-'}</span>,
        },
        {
            key: 'tingkatRisiko',
            label: 'Tingkat Risiko',
            render: (v) => (v ? <RiskLevelBadge level={v} /> : '-'),
        },
    ]),
];