import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
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
import { RELATION_COLUMN_GROUPS, RELATION_ORDER } from '../components/kajiUlangRisiko/kajiUlangRisiko.relationColumns';
import { kajiUlangRisikoColumns } from '../components/kajiUlangRisiko/kajiUlangRisiko.columns';
import Select from 'react-select';

const EMPTY_FORM = { penilaianRisikoId: '', tindakanPengendalian: '', referensi: '', validasi: '', peluangSetelah: 0, dampakSetelah: 0 };

// const VALIDASI_VARIANT = { EFEKTIF: 'green', TIDAK_EFEKTIF: 'red', TIDAK_PASTI: 'yellow' };
// const VALIDASI_LABEL = { EFEKTIF: 'Efektif', TIDAK_EFEKTIF: 'Tidak Efektif', TIDAK_PASTI: 'Tidak Pasti' };
const READONLY_FIELDS = ['id', 'skorSetelah', 'tingkatRisikoSetelah', 'createdAt', 'updatedAt', 'penilaianRisiko'];


export default function KajiUlangRisikoPage() {
  const dispatch = useDispatch();
  const { items, pagination } = useSelector(
    (state) => state.kajiUlangRisiko || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
  );

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(false);

  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeleteKajiUlangRisiko(row.id)),
  });
  const [selectedColumns, setSelectedColumns] = useState([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    dispatch(asyncReceiveKajiUlangRisiko({ page, limit: 10, search }))
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

  const columnOptions = Object.entries(RELATION_COLUMN_GROUPS).map(([value, group]) => ({
    value,
    label: group.label,
  }));
  const columns = useMemo(() => {
    const sorted = [...selectedColumns].sort(
      (a, b) => RELATION_ORDER.indexOf(a.value) - RELATION_ORDER.indexOf(b.value)
    );
    return [
      ...kajiUlangRisikoColumns,
      ...sorted.flatMap(({ value }) => RELATION_COLUMN_GROUPS[value]?.columns ?? []),
    ];
  }, [selectedColumns]);

  return (
    <>
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
        headerExtra={<>
          <div className="flex flex-wrap items-end gap-3">
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
        </>}
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Kaji Ulang Risiko' : 'Tambah Kaji Ulang Risiko'}>
        <KajiUlangRisikoFormComponent
          form={modal.form}
          onChange={setForm}
          mode={modal.mode}
          onSubmit={handleSave}
          onCancel={closeModal}
          loading={saveLoading}
        />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data kaji ulang risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </>
  );
}