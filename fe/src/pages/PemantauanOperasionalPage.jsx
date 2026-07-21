/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useMemo } from "react";
import AddButton from "../components/common/AddButton";
import ConfirmDialog from "../components/common/ConfirmDialog";
import DataTable from "../components/common/DataTable";
import IconButton from "../components/common/IconButton";
import { DeleteIcon, EditIcon } from "../components/common/icons";
import Modal from "../components/common/Modal";
import { asyncAddPemantauanOperasional, asyncDeletePemantauanOperasional, asyncReceivePemantauanOperasional, asyncGetPemantauanOperasionalOptions } from "../states/pemantauanOperasional/action";
import { omitFields } from "../utils/omit-fields";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useConfirmDialog from "../hooks/useConfirmDialog";
import useModalForm from "../hooks/useModalForm";
import PemantauanOperasionalFormComponent from "../components/pemantauanOperasional/PemantauanOperasionalFormComponent";
import { RELATION_COLUMN_GROUPS, RELATION_ORDER } from "../components/pemantauanOperasional/pemantauanOperasional.relationColumns";
import { pemantauanOperasionalColumns } from "../components/pemantauanOperasional/pemantauanOperasional.columns";
import Select from "react-select";

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


    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [saveLoading, setSaveLoading] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState([])
    const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
    const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
        delete: (row) => dispatch(asyncDeletePemantauanOperasional(row.id)),
    });
    const [kodeLokasi, setKodeLokasi] = useState("");
    const [kodeRisiko, setKodeRisiko] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [kodeLokasiOptions, setKodeLokasiOptions] = useState([]);
const [kodeRisikoOptions, setKodeRisikoOptions] = useState([]);

    useEffect(() => {
        setLoading(true);
        dispatch(asyncReceivePemantauanOperasional({ page, limit: 10, search }))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [dispatch, page, search]);

    useEffect(() => {
        dispatch(asyncGetPemantauanOperasionalOptions())
            .then((result) => {
                setKodeLokasiOptions(result.kodeLokasi);
                setKodeRisikoOptions(result.kodeRisiko);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch]);

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
    const columnOptions = Object.entries(RELATION_COLUMN_GROUPS).map(([value, group]) => ({
        value,
        label: group.label,
    }));
    const columns = useMemo(() => {
        const sorted = [...selectedColumns].sort(
            (a, b) => RELATION_ORDER.indexOf(a.value) - RELATION_ORDER.indexOf(b.value)
        );
        return [
            ...pemantauanOperasionalColumns,
            ...sorted.flatMap(({ value }) => RELATION_COLUMN_GROUPS[value]?.columns ?? []),
        ];
    }, [selectedColumns]);
    
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
                //showSearch={false}
                headerExtra={
                    <div className="flex flex-wrap items-end gap-3">

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                Kode Lokasi
                            </label>

                            <select
                                value={kodeLokasi}
                                onChange={(e) => setKodeLokasi(e.target.value)}
                                className="border rounded-md h-10 w-36 px-3"
                            >
                                <option value="">Semua Lokasi</option>

                                {kodeLokasiOptions.map((kode) => (
                                    <option key={kode} value={kode}>
                                        {kode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                Kode Risiko
                            </label>

                            <select
                                value={kodeRisiko}
                                onChange={(e) => setKodeRisiko(e.target.value)}
                                className="border rounded-md h-10 w-36 px-3"
                            >
                                <option value="">Semua Risiko</option>

                                {kodeRisikoOptions.map((kode) => (
                                    <option key={kode} value={kode}>
                                        {kode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                Dari Tanggal
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border rounded-md h-10 w-36 px-3"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                Sampai Tanggal
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border rounded-md h-10 w-36 px-3"
                            />
                        </div>

                        <div className="w-44">
                            <label className="block text-xs text-gray-500 mb-1">
                                Pilih Kolom
                            </label>

                            <Select
                                isMulti
                                options={columnOptions}
                                value={selectedColumns}
                                onChange={(value) => setSelectedColumns(value || [])}
                                placeholder="Pilih kolom..."
                            />
                        </div>

                        <AddButton
                            id="btn-add-kaji-ulang"
                            onClick={openAdd}
                        />

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
                title={modal.mode === "edit" ? "Edit Pemantauan Operasional" : "Tambah Pemantauan Operasional"}
            >
                <PemantauanOperasionalFormComponent
                    form={modal.form}
                    onChange={setForm}
                    onSubmit={handleSave}
                    onCancel={closeModal}
                    loading={saveLoading}
                    mode={modal.mode}
                />
            </Modal>
            <ConfirmDialog
                open={confirm.open} title="Hapus Data?" message="Data pemantauan operasional ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
        </>)

}