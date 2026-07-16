/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback } from "react";
import AddButton from "../components/common/AddButton";
import ConfirmDialog from "../components/common/ConfirmDialog";
import DataTable from "../components/common/DataTable";
import IconButton from "../components/common/IconButton";
import { DeleteIcon, EditIcon } from "../components/common/icons";
import Modal from "../components/common/Modal";
import PemantauanOperasionalFormComponent from "../components/pemantauanRisiko/PemantauanRisikoFormComponent";
import { asyncAddPemantauanOperasional, asyncDeletePemantauanOperasional, asyncReceivePemantauanOperasional } from "../states/pemantauanOperasional/action";
import { omitFields } from "../utils/omit-fields";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useConfirmDialog from "../hooks/useConfirmDialog";
import useModalForm from "../hooks/useModalForm";
import { asyncReceiveKajiUlangRisiko } from "../states/kajiUlangRisiko/action";

const EMPTY_FORM = {
    kajiUlangRisikoId: "",
    batasKritis: "",
    apaYangDimonitor: "",
    dimana: "",
    kapan: "",
    bagaimana: "",
    siapaYangMelakukan: "",
    siapaYangAkanMenganalisisHasilnya: "",
    siapaYangMenerimaHasilAnalisisDanMengambilTindakan: "",
    apaTindakanKoreksinya: "",
    siapaYangMelakukanTindakanKoreksi: "",
    seberapaCepat: "",
    siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: "",
};

const READONLY_FIELDS = ['id'];

export default function PemantauanOperasionalPage() {
    const dispatch = useDispatch();
    const { items, pagination } = useSelector(
        (state) => state.pemantauanOperasional || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
    );
    const kajiUlangRisikoState = useSelector(
        (state) => state.kajiUlangRisiko
    );

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [saveLoading, setSaveLoading] = useState(false);

    const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
    const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
        delete: (row) => dispatch(asyncDeletePemantauanOperasional(row.id)),
    });

    useEffect(() => {
        setLoading(true);
        dispatch(asyncReceivePemantauanOperasional({ page, limit: 10, search }))
            .catch(() => { })
            .finally(() => setLoading(false));
        dispatch(asyncReceiveKajiUlangRisiko())
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
                    await dispatch(asyncReceivePemantauanOperasional({ id: modal.form.id, payload }));
                } else {
                    await dispatch(asyncAddPemantauanOperasional(payload));
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
        { key: 'apaYangDimonitor', label: 'Apa Yang Dimonitor', render: (v) => <span className="line-clamp-2 max-w-xs">{v}</span> },
        { key: 'dimana', label: 'Dimana' },
        { key: 'kapan', label: 'Kapan' },
        { key: 'bagaimana', label: 'Bagaimana' },
        { key: 'siapaYangMelakukan', label: 'Siapa Yang Melakukanan' },
        { key: 'siapaYangAkanMenganalisisHasilnya', label: 'Siapa Yang Akan Menganalisis Hasilnya' },
        { key: 'siapaYangMenerimaHasilAnalisisDanMengambilTindakan', label: 'Siapa Yang Menerima Hasil Analisis Dan Mengambil Tindakan' },
        { key: 'apaTindakanKoreksinya', label: 'Apa Tindakan Koreksinya' },
        { key: 'siapaYangMelakukanTindakanKoreksi', label: 'Siapa Yang Melakukan Tindakan Koreksi' },
        { key: 'seberapaCepat', label: 'Seberapa Cepat' },
        { key: 'siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni', label: 'Siapa Yang Wajib Menerima Laporan Untuk Tindakan Koreksi Ini' },
    ];

    return (
        <>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">
                    Pemantauan Operasional
                </h1>

                <p className="text-sm text-gray-500 mt-0.5">
                    Kelola data pemantauan operasional RPAM
                </p>
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
                title={modal.mode === "edit" ? "Edit Pemantauan Operasional" : "Tambah Pemantauan Operasional"}
            >
                <PemantauanOperasionalFormComponent
                    form={modal.form}
                    onChange={setForm}
                    onSubmit={handleSave}
                    onCancel={closeModal}
                    loading={saveLoading}
                    mode={modal.mode}
                    kajiUlangRisiko={kajiUlangRisikoState}
                />
            </Modal>
            <ConfirmDialog
                open={confirm.open} title="Hapus Data?" message="Data pemantauan operasional ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
        </>)

}