import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import AppLayout from "../components/common/AppLayout";
import DataTable from "../components/common/DataTable";
import { asyncReceiveAuditLog } from "../states/auditLog/action";

const AKSI_OPTIONS = [
    { value: '', label: 'Semua Aksi' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'CREATE', label: 'Tambah Data' },
    { value: 'UPDATE', label: 'Ubah Data' },
    { value: 'DELETE', label: 'Hapus Data' },
];

const AKSI_BADGE_COLOR = {

    LOGIN: { label: 'Login', style: 'bg-blue-50 text-blue-700' },
    LOGOUT: { label: 'Logout', style: 'bg-gray-100 text-gray-600' },
    CREATE: { label: 'Tambah', style: 'bg-green-50 text-green-700' },
    UPDATE: { label: 'Perbarui', style: 'bg-amber-50 text-amber-700' },
    DELETE: { label: 'Hapus', style: 'bg-red-50 text-red-700' },
};


const NAMA_TABEL_OPTIONS = [
    { value: '', label: 'Semua Tabel' },
    { value: 'lokasi_spam', label: 'Lokasi SPAM' },
    { value: 'identifikasi_dan_kejadian_bahaya', label: 'Identifikasi Dan Kejadian Bahaya' },
    { value: 'penilaian_risiko', label: 'Penilaian Risiko' },
    { value: 'kaji_ulang_risiko', label: 'Kaji Ulang Risiko' },
    { value: 'rencana_perbaikan', label: 'Rencana Perbaikan' },
    { value: 'pemantauan_operasional', label: 'Pemantauan Operasional' },
    { value: 'users', label: 'User' },
];

const NAMA_TABEL_MAP = Object.fromEntries(
    NAMA_TABEL_OPTIONS.map((opt) => [opt.value, opt.label])
);

const EMPTY_FILTERS = { aksi: '', namaTabel: '', startDate: '', endDate: '' };
export default function AuditLogPage() {
    const dispatch = useDispatch();
    const { items, pagination } = useSelector((state) => state.auditLog);

    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        dispatch(asyncReceiveAuditLog({
            page,
            limit: 20,
            search,
            aksi: filters.aksi || undefined,
            namaTabel: filters.namaTabel || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
        }))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [dispatch, page, search, filters]);

    const handleSearchChange = useCallback((value) => {
        setSearch(value);
        setPage(1);
    }, []);

    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(EMPTY_FILTERS);
        setSearch('');
        setPage(1);
    }, []);

    const hasActiveFilters = search || filters.aksi || filters.namaTabel || filters.startDate || filters.endDate;

    const columns = [
        {
            key: 'createdAt',
            label: 'Waktu',
            render: (v) => new Date(v).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }),
        },
        {
            key: 'user',
            label: 'User',
            render: (v) => v?.username || '-',
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (v) => {
                const key = String(v).toUpperCase();

                const badge = AKSI_BADGE_COLOR[key] || {
                    label: key,
                    style: "bg-gray-100 text-gray-600",
                };

                return (
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.style}`}
                    >
                        {badge.label}
                    </span>
                );
            },
        },
        {
            key: 'namaTabel',
            label: 'Tabel',
            render: (v) => <span>{NAMA_TABEL_MAP[v] || v}</span>,
        },
        { key: 'keterangan', label: 'Keterangan' },
    ];

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Audit Log</h1>
                <p className="text-sm text-gray-500 mt-0.5">Riwayat aktivitas pengguna pada sistem</p>
            </div>

            {/* Filter bar */}
            <div className="app-card p-4 mb-4 flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Aksi</label>
                    <select
                        value={filters.aksi}
                        onChange={(e) => handleFilterChange('aksi', e.target.value)}
                        className="app-input text-sm min-w-[10rem]"
                    >
                        {AKSI_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Tabel</label>
                    <select
                        value={filters.namaTabel}
                        onChange={(e) => handleFilterChange('namaTabel', e.target.value)}
                        className="app-input text-sm min-w-[14rem]"
                    >
                        {NAMA_TABEL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Dari Tanggal</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="app-input text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Sampai Tanggal</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="app-input text-sm"
                    />
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-sm text-teal-700 hover:text-teal-800 font-medium px-3 py-2"
                    >
                        Reset Filter
                    </button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={items}
                loading={loading}
                pagination={pagination}
                onPageChange={setPage}
                search={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Cari keterangan..."
                emptyMessage="Belum ada aktivitas tercatat"
            />
        </AppLayout>
    );
}