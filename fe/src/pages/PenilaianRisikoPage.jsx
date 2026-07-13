import { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import RiskLevelBadge from '../components/common/RiskLevelBadge';
import IconButton from '../components/common/IconButton';
import AddButton from '../components/common/AddButton';
import SelectField from '../components/common/SelectField';
import InputComponent from '../components/common/InputComponent';
import { EditIcon, DeleteIcon } from '../components/common/icons';
import useModalForm from '../hooks/useModalForm';
import useConfirmDialog from '../hooks/useConfirmDialog';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import useDebouncedSearch from '../hooks/useDebouncedSearch';
import { omitFields } from '../utils/omitFields';
import { penilaianRisikoApi, identifikasiBahayaApi } from '../api/kaji-ulang-risiko';

const PAGE_SIZE = 15;
const EMPTY_FORM = { identifikasiBahayaId: '', peluangKejadianBahaya: '', dampakKeparahan: '' };
const READONLY_FIELDS = ['id', 'skorRisiko', 'tingkatRisiko', 'warnaTingkatRisiko', 'createdAt', 'updatedAt', 'identifikasiBahaya'];

function PrForm({ form, onChange, onSubmit, onCancel, loading, mode, ibOptions }) {
  const ibSelectOptions = ibOptions.map((ib) => ({ value: ib.id, label: `${ib.kodeRisiko} — ${ib.kejadianBahayaXYZ}` }));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <SelectField
        name="identifikasiBahayaId" label="Identifikasi Bahaya" required
        value={form.identifikasiBahayaId || ''}
        onChange={(e) => onChange({ ...form, identifikasiBahayaId: e.target.value })}
        options={ibSelectOptions}
      />
      <InputComponent
        name="peluangKejadianBahaya" label="Peluang (1–5)" type="number" required
        value={form.peluangKejadianBahaya || ''}
        onChangeValue={(e) => onChange({ ...form, peluangKejadianBahaya: Number(e.target.value) })}
      />
      <InputComponent
        name="dampakKeparahan" label="Dampak (1–5)" type="number" required
        value={form.dampakKeparahan || ''}
        onChangeValue={(e) => onChange({ ...form, dampakKeparahan: Number(e.target.value) })}
      />
      {form.skorRisiko != null && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Skor: <strong className="text-gray-900">{form.skorRisiko}</strong></span>
          <RiskLevelBadge level={form.tingkatRisiko} />
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="app-button-secondary">Batal</button>
        <button type="submit" disabled={loading} className="app-button-primary">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
}

export default function PenilaianRisikoPage() {
  const [ibOptions, setIbOptions] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);

  const fetchPage = useCallback(
    ({ page, pageSize, search }) => penilaianRisikoApi.getAll({ page, pageSize, search }).then((res) => res.data.data),
    []
  );
  const { items, loading, hasMore, loadMore, search: runSearch, refetch } = usePaginatedFetch(fetchPage, { pageSize: PAGE_SIZE });
  const { search, handleSearchChange } = useDebouncedSearch(runSearch, 400);

  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => penilaianRisikoApi.remove(row.id).then(refetch),
  });

  useEffect(() => {
    identifikasiBahayaApi.getAll({ pageSize: 200 }).then((res) => setIbOptions(res.data.data.items || [])).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const payload = omitFields(modal.form, READONLY_FIELDS);
      if (modal.mode === 'edit') {
        await penilaianRisikoApi.update(modal.form.id, payload);
      } else {
        await penilaianRisikoApi.create(payload);
      }
      closeModal();
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setSaveLoading(false);
    }
  };

  const columns = [
    { key: 'identifikasiBahaya', label: 'Kode Risiko', render: (_, row) => <span className="font-mono text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded">{row.identifikasiBahaya?.kodeRisiko || row.identifikasiBahayaId}</span> },
    { key: 'peluangKejadianBahaya', label: 'Peluang' },
    { key: 'dampakKeparahan', label: 'Dampak' },
    { key: 'skorRisiko', label: 'Skor', render: (v) => <span className="font-semibold text-gray-900">{v}</span> },
    { key: 'tingkatRisiko', label: 'Tingkat Risiko', render: (v) => <RiskLevelBadge level={v} /> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">M2 — Penilaian Risiko</h1>
        <p className="text-sm text-gray-500 mt-0.5">Penilaian peluang dan dampak untuk setiap bahaya</p>
      </div>
      <DataTable
        columns={columns} data={items} loading={loading} hasMore={hasMore}
        onLoadMore={loadMore} search={search} onSearchChange={handleSearchChange}
        searchPlaceholder="Cari data penilaian..." emptyMessage="Data tidak ditemukan"
        headerExtra={<AddButton id="btn-add-penilaian-risiko" onClick={openAdd} />}
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Penilaian Risiko' : 'Tambah Penilaian Risiko'}>
        <PrForm form={modal.form} onChange={setForm} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} ibOptions={ibOptions} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data penilaian risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </AppLayout>
  );
}