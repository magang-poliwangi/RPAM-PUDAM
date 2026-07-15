import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import RiskLevelBadge from '../components/common/RiskLevelBadge';
import Badge from '../components/common/Badge';
import IconButton from '../components/common/IconButton';
import AddButton from '../components/common/AddButton';
import { EditIcon, DeleteIcon } from '../components/common/icons';
import useModalForm from '../hooks/useModalForm';
import useConfirmDialog from '../hooks/useConfirmDialog';
import { omitFields } from '../utils/omit-fields';
import {
  asyncAddKajiUlangRisiko,
  asyncDeleteKajiUlangRisiko,
  asyncReceiveKajiUlangRisiko,
  asyncUpdateKajiUlangRisiko,
} from '../states/kajiUlangRisiko/action';
import KajiUlangRisikoFormComponent from '../components/kajiUlangRisiko/KajiUlangRisikoFormComponent';
import { asyncReceivePenilaianRisiko } from '../states/penilaianRisiko/action';

const EMPTY_FORM = { penilaianRisikoId: '', tindakanPengendalian: '', referensi: '', validasi: '', peluangSetelah: '', dampakSetelah: '' };

const VALIDASI_VARIANT = { EFEKTIF: 'green', TIDAK_EFEKTIF: 'red', TIDAK_PASTI: 'yellow' };
const VALIDASI_LABEL = { EFEKTIF: 'Efektif', TIDAK_EFEKTIF: 'Tidak Efektif', TIDAK_PASTI: 'Tidak Pasti' };
const READONLY_FIELDS = ['id', 'skorSetelah', 'tingkatRisikoSetelah', 'createdAt', 'updatedAt', 'penilaianRisiko'];


export default function KajiUlangRisikoPage() {
  const dispatch = useDispatch();
  const { items, pagination } = useSelector(
    (state) => state.kajiUlangRisiko || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
  );
  const penilaianRisikoState = useSelector(
    (state) => state.penilaianRisiko
  );

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(false);

  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeleteKajiUlangRisiko(row.id)),
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    dispatch(asyncReceiveKajiUlangRisiko({ page, limit: 10, search }))
      .catch(() => { })
      .finally(() => setLoading(false));
       dispatch(asyncReceivePenilaianRisiko())
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
          await dispatch(asyncUpdateKajiUlangRisiko({ id: modal.form.id, payload }));
        } else {
          await dispatch(asyncAddKajiUlangRisiko(payload));
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
    { key: 'tindakanPengendalian', label: 'Tindakan Pengendalian', render: (v) => <span className="line-clamp-2 max-w-xs">{v}</span> },
    { key: 'referensi', label: 'Referensi', render: (v) => <span className="line-clamp-2 max-w-xs">{v}</span> },
    { key: 'validasi', label: 'Validasi', render: (v) => <Badge label={VALIDASI_LABEL[v] || v} variant={VALIDASI_VARIANT[v]} /> },
    { key: 'peluangSetelah', label: 'Peluang Kejadian Bahaya' },
    { key: 'dampakSetelah', label: 'Dampak Keparahan' },
    { key: 'skorSetelah', label: 'Skor Risiko', render: (v) => <span className="font-semibold">{v}</span> },
    { key: 'tingkatRisikoSetelah', label: 'Tingkat Risiko', render: (v) => <RiskLevelBadge level={v} /> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kaji Ulang Risiko</h1>
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
        headerExtra={<AddButton id="btn-add-kaji-ulang" onClick={openAdd} />}
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Kaji Ulang Risiko' : 'Tambah Kaji Ulang Risiko'}>
        <KajiUlangRisikoFormComponent penilaianRisiko={penilaianRisikoState} form={modal.form} onChange={setForm} mode={modal.mode} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} prOptions={[]} />
      </Modal>
      <ConfirmDialog open={confirm.open}  title="Hapus Data?" message="Data kaji ulang risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </AppLayout>
  );
}