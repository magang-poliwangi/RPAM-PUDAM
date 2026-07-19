import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import IconButton from '../components/common/IconButton';
import AddButton from '../components/common/AddButton';
import { EditIcon, DeleteIcon } from '../components/common/icons';
import useModalForm from '../hooks/useModalForm';
import useConfirmDialog from '../hooks/useConfirmDialog';

import { omitFields } from '../utils/omit-fields';
import ConfirmDialog from '../components/common/ConfirmDialog';
import BahayaKontaminasiFormComponent from '../components/bahayaKontaminasi/BahayakontaminasiFormComponent';
import { asyncAddBahayaKontaminasi, asyncDeleteBahayaKontaminasi, asyncReceiveBahayaKontaminasi, asyncUpdateBahayaKontaminasi } from '../states/BahayaKontaminasi/action';

const EMPTY_FORM = {
    kodeRisiko: "",
    kontaminasiX: "",
    tipeBahaya:""
};

const READONLY_FIELDS = ['id'];
export default function BahayaKontaminasiPage() {
    const dispatch = useDispatch();

    const { items, pagination } = useSelector(
        (state) => state.bahayaKontaminasi || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [saveLoading, setSaveLoading] = useState(false);

    const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
    const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
        delete: (row) => dispatch(asyncDeleteBahayaKontaminasi(row.id)),
    });
    console.log(items);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        dispatch(asyncReceiveBahayaKontaminasi({ page, limit: 10, search }))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [dispatch, page, search]);

    const handleSearchChange = useCallback((value) => {
        setSearch(value);
        setPage(1);
    }, []);

    const handleSave = useCallback(
        async (e) => {
            e.preventDefault();
            setSaveLoading(true);
            try {
                const payload = omitFields(modal.form, READONLY_FIELDS);
                console.log(modal.form);
                
                if (modal.mode === 'edit') {
                    await dispatch(asyncUpdateBahayaKontaminasi({ id: modal.form.id, payload }));
                } else {
                    await dispatch(asyncAddBahayaKontaminasi(payload));
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
            key: "kodeRisiko",
            label: "Kode Risiko",
        },
        {
            key: "kontaminasiX",
            label: "Kontaminasi atau Sesuatu yang Berpotensi Buruk Terhadap Kualitas Air (X)",
        },
        {
            key: "tipeBahaya",
            label: "Tipe Bahaya",
        },
    ];

    return (
        <>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Kontaminasi Bahaya</h1>
                <p className="text-sm text-gray-500 mt-0.5">Kelola Kontaminasi Bahaya sistem RPAM</p>
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
                headerExtra={<AddButton id="btn-add-kaji-ulang" onClick={openAdd} />}
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
                title={modal.mode === "edit" ? "Edit Kontaminasi Bahaya" : "Tambah Kontaminasi Bahaya"}
            >
                <BahayaKontaminasiFormComponent
                    form={modal.form}
                    onChange={setForm}
                    onSubmit={handleSave}
                    onCancel={closeModal}
                    loading={saveLoading}
                    mode={modal.mode}
                />
            </Modal>
            <ConfirmDialog
                open={confirm.open} title="Hapus Data?" message="Data Kontaminasi Bahaya ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
        </>
    );
}