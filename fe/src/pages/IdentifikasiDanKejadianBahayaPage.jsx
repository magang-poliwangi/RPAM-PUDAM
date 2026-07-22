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
import { omitFields } from "../utils/omit-fields";
import { DeleteIcon, EditIcon } from "../components/common/icons";
import { identifikasiDanKejadianBahayaColumns } from "../components/identifikasiDanKejadianBahaya/identifikasiDanKejadianBahaya.columns";
import { RELATION_COLUMN_GROUPS, RELATION_ORDER } from "../components/identifikasiDanKejadianBahaya/identifikasiDanKejadianBahaya.relationColumns";
import { bahayakontaminasiApi } from "../api/bahaya-kontaminasi";
import { lokasiSpamApi } from "../api/lokasi-spam";
import { createAsyncOptionsLoader } from "../utils/option-loader";
import FilterPanelComponent from "../components/common/FilterPanelComponent";

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


    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [saveLoading, setSaveLoading] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        // sortOrder: "",
        startDate: "",
        endDate: "",
        lokasi: null,
        bahaya: null
    });
    const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
    const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
        delete: (row) => dispatch(asyncDeleteIdentifikasiDanKejadianBahaya(row.id)),
    });


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        const params = {
            page,
            limit: 10,
            search: filters.search || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            kodeLokasi: filters.lokasi?.raw?.kodeLokasi || undefined,
            kodeRisiko: filters.bahaya?.raw?.kodeRisiko || undefined,
        };
        dispatch(asyncReceiveIdentifikasiDanKejadianBahaya(params))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [dispatch, page, filters]);


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
        // urutkan berdasar hierarki relasi
        const sorted = [...selectedColumns].sort(
            (a, b) => RELATION_ORDER.indexOf(a.value) - RELATION_ORDER.indexOf(b.value)
        );
        return [
            ...identifikasiDanKejadianBahayaColumns,
            ...sorted.flatMap(({ value }) => RELATION_COLUMN_GROUPS[value]?.columns ?? []),
        ];
    }, [selectedColumns]);

    const loadLokasiSpamOptions = useMemo(
        () =>
            createAsyncOptionsLoader(
                lokasiSpamApi,
                (item) => `${item.kodeLokasi} - ${item.namaLokasi} `
            ),
        []
    );
    const loadBahayaKontaminasiOptions = useMemo(
        () =>
            createAsyncOptionsLoader(
                bahayakontaminasiApi,
                (item) => `${item.kodeRisiko} - ${item.kontaminasiX} - ${item.tipeBahaya}`
            ),
        []
    );


    const handleResetFilter = () => {
        setFilters({
            search: "",
            // sortOrder: "",
            startDate: "",
            endDate: "",
            lokasi: null,
            bahaya: null,

        });
        setSelectedColumns([]);
        setPage(1);
    };
    const updateFilter = useCallback((key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        setPage(1);
    }, []);

    const handleSearchChange = useCallback(
        (value) => updateFilter("search", value),
        [updateFilter]
    );

    const handleSelectFilter = useCallback((key, e) => {
        updateFilter(key, e?.target?.selectedOption ?? null);
    }, [updateFilter]);


    return (
        <>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Identifikas Dan Kejadian Bahaya</h1>
                <p className="text-sm text-gray-500 mt-0.5">Tindakan pengendalian dan evaluasi efektivitas</p>
            </div>
            <FilterPanelComponent
                lokasiValue={filters.lokasi}
                onLokasiChange={(e) => handleSelectFilter("lokasi", e)}
                loadLokasiOptions={loadLokasiSpamOptions}
                bahayaValue={filters.bahaya}
                onBahayaChange={(e) => handleSelectFilter("bahaya", e)}
                loadBahayaOptions={loadBahayaKontaminasiOptions}
                // sortOrder={filters.sortOrder}
                // onSortOrderChange={(v) => updateFilter("sortOrder", v)}
                startDate={filters.startDate}
                onStartDateChange={(v) => updateFilter("startDate", v)}
                endDate={filters.endDate}
                onEndDateChange={(v) => updateFilter("endDate", v)}
                columnOptions={columnOptions}
                selectedColumns={selectedColumns}
                onSelectedColumnsChange={setSelectedColumns}
                onReset={handleResetFilter}
            />
            <DataTable
                columns={columns}
                data={items}
                loading={loading}
                pagination={pagination}
                onPageChange={setPage}
                search={filters.search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Cari..."
                emptyMessage="Data tidak ditemukan"
                headerExtra={(
                    <AddButton id="btn-add-kaji-ulang" onClick={openAdd} />
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