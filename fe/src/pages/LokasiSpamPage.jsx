import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import IconButton from '../components/common/IconButton';
import AddButton from '../components/common/AddButton';
import { EditIcon, DeleteIcon } from '../components/common/icons';
import useModalForm from '../hooks/useModalForm';
import useConfirmDialog from '../hooks/useConfirmDialog';

import { asyncAddLokasiSpam, asyncDeleteLokasiSpam, asyncReceiveLokasiSpam, asyncUpdateLokasiSpam } from '../states/lokasiSpam/action';
import LokasiSpamFormComponent from '../components/lokasiSpam/LokasiSpamFormComponent';
import { omitFields } from '../utils/omit-fields';
import ConfirmDialog from '../components/common/ConfirmDialog';


const EMPTY_FORM = {
    kodeLokasi: "",
    simbol: "",
    deskripsi: "",
    penanggungJawabNama: "",
    penanggungJawabPosisi: "",
    penanggungJawabTelepon: "",
    penanggungJawabEmail: "",
    referensi: "",
};

const READONLY_FIELDS = ['id'];
export default function LokasiSpamPage() {
    const dispatch = useDispatch();

    const { items, pagination } = useSelector(
        (state) => state.lokasiSpam || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [saveLoading, setSaveLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        // sortOrder: "",
        startDate: "",
        endDate: "",
    })
    const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
    const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
        delete: (row) => dispatch(asyncDeleteLokasiSpam(row.id)),
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
        };

        dispatch(asyncReceiveLokasiSpam(params))
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
                    await dispatch(asyncUpdateLokasiSpam({ id: modal.form.id, payload }));
                } else {
                    await dispatch(asyncAddLokasiSpam(payload));
                }
                closeModal();
            } catch (err) {
                alert(err.response?.data?.message || 'Gagal menyimpan data');
            } finally {
                setSaveLoading(false);
            }
        },
        [dispatch, modal, closeModal]
    );
    const columns = [
        {
            key: "kodeLokasi",
            label: "Kode Lokasi",
        },
        {
            key: "simbol",
            label: "Simbol",
        },
        {
            key: "namaLokasi",
            label: "Nama Lokasi",
        },
        {
            key: "deskripsi",
            label: "Deskripsi",
        },
        {
            label: "Penanggung Jawab",
            children: [
                {
                    key: "penanggungJawabNama",
                    label: "Nama",
                },
                {
                    key: "penanggungJawabPosisi",
                    label: "Posisi",
                },
                {
                    key: "penanggungJawabTelepon",
                    label: "Telepon",
                },
                {
                    key: "penanggungJawabEmail",
                    label: "Email",
                },
            ]
        },
        {
            key: "referensi",
            label: "Referensi",
        },
    ];
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
    const handleResetFilter = () => {
        setFilters({
            search: "",
            // sortOrder: "",
            startDate: "",
            endDate: "",
            lokasi: null,
            bahaya: null,

        });
        setPage(1);
    };

    const activeCount = [
        filters.startDate || null,
        filters.endDate || null,
    ].filter(Boolean).length;

    return (
        <>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Lokasi Spam</h1>
                <p className="text-sm text-gray-500 mt-0.5">Kelola Lokasi Spam sistem RPAM</p>
            </div>
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

                headerExtra={
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-semibold text-gray-500">Dari Tanggal</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => updateFilter("startDate", e.target.value)}
                                className="app-input py-1.5 px-2 text-xs w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-semibold text-gray-500">Sampai Tanggal</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => updateFilter("endDate", e.target.value)}
                                className="app-input py-1.5 px-2 text-xs w-full"
                            />
                        </div>
                        {activeCount > 0 && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="text-sm text-teal-700 hover:text-teal-800 font-medium px-3 py-2"
                            >
                                Reset Filter
                            </button>
                        )}
                        <AddButton id="btn-add-lokasi" onClick={openAdd} />
                    </div>
                }

                actions={(row) => (
                    <>
                        <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
                        <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
                    </>
                )}
            />
            <Modal
                open={modal.open}
                onClose={closeModal}
                title={modal.mode === "edit" ? "Edit Lokasi Spam" : "Tambah Lokasi Spam"}
            >
                <LokasiSpamFormComponent
                    form={modal.form}
                    onChange={setForm}
                    onSubmit={handleSave}
                    onCancel={closeModal}
                    loading={saveLoading}
                    mode={modal.mode}
                />
            </Modal>
            <ConfirmDialog
                open={confirm.open} title="Hapus Data?" message="Data Lokasi Spam ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
        </>
    );
}