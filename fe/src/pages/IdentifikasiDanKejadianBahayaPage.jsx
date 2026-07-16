import { useDispatch, useSelector } from "react-redux";
import AddButton from "../components/common/AddButton";
import ConfirmDialog from "../components/common/ConfirmDialog";
import DataTable from "../components/common/DataTable";
import IconButton from "../components/common/IconButton";
import Modal from "../components/common/Modal";
import IdentifikasiDanKejadianBahayaFormComponent from "../components/identifikasiDanKejadianBahaya/IdentifikasiDanKejadianBahayaFormComponent";
import { useCallback, useEffect, useState } from "react";
import useModalForm from "../hooks/useModalForm";
import useConfirmDialog from "../hooks/useConfirmDialog";
import { asyncAddIdentifikasiDanKejadianBahaya, asyncDeleteIdentifikasiDanKejadianBahaya, asyncReceiveIdentifikasiDanKejadianBahaya, asyncUpdateIdentifikasiDanKejadianBahaya } from "../states/indentifikasiDanKejadianBahaya/action";
import { omitFields } from "../utils/omit-fields";
import { DeleteIcon, EditIcon } from "../components/common/icons";
import { asyncReceiveLokasiSpam } from "../states/lokasiSpam/action";

const EMPTY_FORM = {
    lokasiSpamId: "",
    kodeRisiko: "",
    komponenSpam: "",
    kontaminasiX: "",
    komponenSpamY: "",
    penyebabZ: "",
    kejadianBahayaXYZ: "",
    tipeBahaya: "",
};

const READONLY_FIELDS = ['id', 'penilaianRisiko'];

export default function IdentifikasiDanKejadianBahayaPage() {
    const dispatch = useDispatch();
    const { items, pagination } = useSelector(
        (state) => state.identifikasiDanKejadianBahaya || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );
    const lokasiSpamState = useSelector(
        (state) => state.lokasiSpam
    );
    
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [saveLoading, setSaveLoading] = useState(false);

    const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
    const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
        delete: (row) => dispatch(asyncDeleteIdentifikasiDanKejadianBahaya(row.id)),
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        dispatch(asyncReceiveIdentifikasiDanKejadianBahaya({ page, limit: 10, search }))
            .catch(() => { })
            .finally(() => setLoading(false));
        dispatch(asyncReceiveLokasiSpam())
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

    const columns = [
    {
        key: 'lokasiSpam',
        label: 'Kode Lokasi',
        render: (v) => v?.kodeLokasi ?? '-',
    },
        { key: 'kodeRisiko', label: 'Kode Risiko' },
        { key: 'komponenSpam', label: 'Komponen SPAM' },
        { key: 'kontaminasiX', label: 'Kontaminasi atau Sesuatu yang Berpotensi Buruk Terhadap Kualitas Air (X)' },
        { key: 'penyebabZ', label: 'Penyebab  (Z)' },
        { key: 'komponenSpamY', label: 'Penyebab  (Z)' },
        { key: 'kejadianBahayaXYZ', label: 'Kejadian Bahaya  (XYZ)' },
        { key: 'tipeBahaya', label: 'Tipe Bahaya' },
    ];

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
                searchPlaceholder="Cari tindakan pengendalian..."
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
                open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Kaji Ulang Risiko' : 'Tambah Kaji Ulang Risiko'}>
                <IdentifikasiDanKejadianBahayaFormComponent lokasiSpam={lokasiSpamState} form={modal.form} onChange={setForm} mode={modal.mode} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} prOptions={[]} />
            </Modal>
            <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data kaji ulang risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
        </>
    );
}