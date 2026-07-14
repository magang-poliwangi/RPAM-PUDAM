/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useModalForm from "../hooks/useModalForm";
import { asyncAddPenilaianRisiko, asyncDeletePenilaianRisiko, asyncReceivePenilaianRisiko, asyncUpdatePenilaianRisiko } from "../states/penilaianRisiko/action";
import { omitFields } from "../utils/omit-fields";
import RiskLevelBadge from "../components/common/RiskLevelBadge";
import AppLayout from "../components/common/AppLayout";
import DataTable from "../components/common/DataTable";
import AddButton from "../components/common/AddButton";
import IconButton from "../components/common/IconButton";
import Modal from "../components/common/Modal";
import PenilaianRisikoFormComponent from "../components/penilaianRisiko/PenilaianRisikoFormComponent";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { DeleteIcon, EditIcon } from "../components/common/icons";
import useConfirmDialog from "../hooks/useConfirmDialog";


const EMPTY_FORM = { identifikasiBahayaId: '', peluangKejadianBahaya: '', dampakKeparahan: '' };
const READONLY_FIELDS = ['id', 'skorRisiko', 'tingkatRisiko', 'warnaTingkatRisiko', 'createdAt', 'updatedAt', 'identifikasiBahaya'];


export default function PenilaianRisikoPage() {
  const dispatch = useDispatch();
  const { items, pagination } = useSelector(
    (state) => state.penilaianRisiko || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
  );

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(false);

  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeletePenilaianRisiko(row.id)),
  });

  useEffect(() => {
    setLoading(true);
    dispatch(asyncReceivePenilaianRisiko({ page, limit: 10, search }))
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
          await dispatch(asyncUpdatePenilaianRisiko({ id: modal.form.id, payload }));
        } else {
          await dispatch(asyncAddPenilaianRisiko(payload));
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
    { key: 'identifikasiBahaya', label: 'Kode Risiko', render: (_, row) => <span className="font-mono text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded">{row.identifikasiBahaya?.kodeRisiko || row.identifikasiBahayaId}</span> },
    { key: 'peluangKejadianBahaya', label: 'Peluang Kejadian Bahaya' },
    { key: 'dampakKeparahan', label: 'Dampak Keparahan' },
    { key: 'skorRisiko', label: 'Skor Risiko', render: (v) => <span className="font-semibold text-gray-900">{v}</span> },
    { key: 'tingkatRisiko', label: 'Tingkat Risiko', render: (v) => <RiskLevelBadge level={v} /> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Penilaian Risiko</h1>
        <p className="text-sm text-gray-500 mt-0.5">Penilaian peluang dan dampak untuk setiap bahaya</p>
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
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Penilaian Risiko' : 'Tambah Penilaian Risiko'}>
        <PenilaianRisikoFormComponent form={modal.form} onChange={setForm} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data penilaian risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </AppLayout>
  );
}