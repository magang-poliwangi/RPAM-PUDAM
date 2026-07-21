import { useDispatch, useSelector } from "react-redux";
import AddButton from "../components/common/AddButton";
import ConfirmDialog from "../components/common/ConfirmDialog";
import DataTable from "../components/common/DataTable";
import IconButton from "../components/common/IconButton";
import Modal from "../components/common/Modal";
import IdentifikasiDanKejadianBahayaFormComponent from "../components/identifikasiDanKejadianBahaya/IdentifikasiDanKejadianBahayaFormComponent";
import { useCallback, useEffect, useMemo, useState } from "react";
import useModalForm from "../hooks/useModalForm";
import useConfirmDialog from "../hooks/useConfirmDialog";
import { asyncAddIdentifikasiDanKejadianBahaya, asyncDeleteIdentifikasiDanKejadianBahaya, asyncReceiveIdentifikasiDanKejadianBahaya, asyncUpdateIdentifikasiDanKejadianBahaya } from "../states/indentifikasiDanKejadianBahaya/action";
import { asyncReceiveLokasiSpam } from "../states/lokasiSpam/action";
import { omitFields } from "../utils/omit-fields";
import { DeleteIcon, EditIcon } from "../components/common/icons";
import Select from "react-select";
import { identifikasiDanKejadianBahayaColumns } from "../components/identifikasiDanKejadianBahaya/identifikasiDanKejadianBahaya.columns";
import { RELATION_COLUMN_GROUPS, RELATION_ORDER } from "../components/identifikasiDanKejadianBahaya/identifikasiDanKejadianBahaya.relationColumns";

const EMPTY_FORM = {
    lokasiSpamId: "",
    bahayaKontaminasiId: "",
    komponenSpam: "",
    komponenSpamY: "",
    penyebabZ: "",
    kejadianBahayaXYZ: "",
};

const READONLY_FIELDS = ['id', 'penilaianRisiko'];

export default function IdentifikasiDanKejadianBahayaPage() {
    const dispatch = useDispatch();
    const { items, pagination } = useSelector(
        (state) => state.identifikasiDanKejadianBahaya || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );
    const lokasiSpamState = useSelector((state) => state.lokasiSpam || { items: [] });

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [saveLoading, setSaveLoading] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [filters, setFilters] = useState({ kodeLokasi: '', kodeRisiko: '', sortOrder: 'asc', startDate: '', endDate: '' });

    const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
    const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
        delete: (row) => dispatch(asyncDeleteIdentifikasiDanKejadianBahaya(row.id)),
    });

    useEffect(() => {
        dispatch(asyncReceiveLokasiSpam()).catch(() => { });
    }, [dispatch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        dispatch(asyncReceiveIdentifikasiDanKejadianBahaya({
            page,
            limit: 10,
            search,
            kodeLokasi: filters.kodeLokasi || undefined,
            kodeRisiko: filters.kodeRisiko || undefined,
            sortBy: 'kodeRisiko',
            sortOrder: filters.sortOrder,
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

    const kodeRisikoOptions = useMemo(() => {
        const unique = [...new Set(items.map((item) => item.kodeRisiko).filter(Boolean))];
        return unique.sort();
    }, [items]);

    const handleSave = useCallback(
        async (e) => {
            e.preventDefault();
            setSaveLoading(true);
            try {
                const payload = omitFields(modal.form, READONLY_FIELDS);
                if (modal.mode === 'edit') {
                    await dispatch(asyncUpdateIdentifikasiDanKejadianBahaya({ id: modal.form.id, payload }));
                } else {
                    await dispatch(asyncAddIdentifikasiDanKejadianBahaya(payload));
                }
                closeModal();
            } catch (err) {
                console.error('ERROR ASLI:', err);
                alert(err.response?.data?.message || 'Gagal menyimpan data');
            } finally {
                setSaveLoading(false);
            }
        },
        [dispatch, modal, closeModal]
    );
   const columnOptions = Object.entries(RELATION_COLUMN_GROUPS).map(([value, group]) => ({
  value,
  label: group.label,
}));
   const columns = useMemo(() => {
  // urutkan berdasar hierarki relasi, bukan urutan klik user
  const sorted = [...selectedColumns].sort(
    (a, b) => RELATION_ORDER.indexOf(a.value) - RELATION_ORDER.indexOf(b.value)
  );
  return [
    ...identifikasiDanKejadianBahayaColumns, 
    ...sorted.flatMap(({ value }) => RELATION_COLUMN_GROUPS[value]?.columns ?? []),
  ];
}, [selectedColumns]);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Identifikas Dan Kejadian Bahaya</h1>
                <p className="text-sm text-gray-500 mt-0.5">Tindakan pengendalian dan evaluasi efektivitas</p>
            </div>
            <DataTable
                columns={columns}
                data={items}
                loading={loading}
                pagination={pagination}
                onPageChange={setPage}
                search={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Cari..."
                emptyMessage="Data tidak ditemukan"
                headerExtra={(
                    <>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500">Kode Lokasi</label>
                                <select
                                    value={filters.kodeLokasi}
                                    onChange={(e) => handleFilterChange('kodeLokasi', e.target.value)}
                                    className="app-input text-sm min-w-[8rem]"
                                >
                                    <option value="">Semua</option>
                                    {(lokasiSpamState.items || []).map((lok) => (
                                        <option key={lok.id} value={lok.kodeLokasi}>{lok.kodeLokasi}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500">Kode Risiko</label>
                                <select
                                    value={filters.kodeRisiko}
                                    onChange={(e) => handleFilterChange('kodeRisiko', e.target.value)}
                                    className="app-input text-sm min-w-[8rem]"
                                >
                                    <option value="">Semua</option>
                                    {kodeRisikoOptions.map((kode) => (
                                        <option key={kode} value={kode}>{kode}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500">Urutan Risiko</label>
                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                                    className="app-input text-sm"
                                >
                                    <option value="asc">ASC (A-Z)</option>
                                    <option value="desc">DESC (Z-A)</option>
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

                            <Select
                                className="z-50"
                                isMulti
                                options={columnOptions}
                                value={selectedColumns}
                                onChange={(value) => setSelectedColumns(value || [])}
                                placeholder="Pilih kolom..."
                            />
                            <AddButton id="btn-add-kaji-ulang" onClick={openAdd} />
                        </div>
                    </>
                )
                }
                actions={(row) => (
                    <>
                        <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
                        <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
                    </>
                )}
            />
            <Modal
                open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Kaji Ulang Risiko' : 'Tambah Kaji Ulang Risiko'}>
                <IdentifikasiDanKejadianBahayaFormComponent form={modal.form} onChange={setForm} mode={modal.mode} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} prOptions={[]} />
            </Modal>
            <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data kaji ulang risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
        </>
    );
}