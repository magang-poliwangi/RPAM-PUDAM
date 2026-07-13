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
import SelectField from '../components/common/SelectField';
import InputComponent from '../components/common/InputComponent';
import { EditIcon, DeleteIcon } from '../components/common/icons';
import useModalForm from '../hooks/useModalForm';
import useConfirmDialog from '../hooks/useConfirmDialog';
import useSearchFilter from '../hooks/useSearchFilter';
import { omitFields } from '../utils/omitFields';
import {
  asyncAddKajiUlangRisiko,
  asyncDeleteKajiUlangRisiko,
  asyncReceiveKajiUlangRisikos,
  asyncUpdateKajiUlangRisiko,
} from '../states/kajiUlangRisiko/action';

const EMPTY_FORM = { penilaianRisikoId: '', tindakanPengendalian: '', referensi: '', validasi: '', peluangSetelah: '', dampakSetelah: '' };
const VALIDASI_OPTIONS = [
  { value: 'EFEKTIF', label: 'Efektif' },
  { value: 'TIDAK_EFEKTIF', label: 'Tidak Efektif' },
  { value: 'TIDAK_PASTI', label: 'Tidak Pasti' },
];
const VALIDASI_VARIANT = { EFEKTIF: 'green', TIDAK_EFEKTIF: 'red', TIDAK_PASTI: 'yellow' };
const VALIDASI_LABEL = { EFEKTIF: 'Efektif', TIDAK_EFEKTIF: 'Tidak Efektif', TIDAK_PASTI: 'Tidak Pasti' };
const READONLY_FIELDS = ['id', 'skorSetelah', 'tingkatRisikoSetelah', 'createdAt', 'updatedAt', 'penilaianRisiko'];

function KuForm({ form, onChange,  onSubmit, onCancel, loading, mode, prOptions }) {
  const prSelectOptions = prOptions.map((pr) => ({
    value: pr.id,
    label: `Skor ${pr.skorRisiko} — ${pr.tingkatRisiko} (${pr.identifikasiBahaya?.kodeRisiko || pr.identifikasiBahayaId})`,
  }));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {mode === 'edit' ? (
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Penilaian Risiko: </span>
          <span className="font-medium text-gray-900">
            {form.penilaianRisiko
              ? `Skor ${form.penilaianRisiko.skorRisiko} — ${form.penilaianRisiko.tingkatRisiko}`
              : form.penilaianRisikoId}
          </span>
        </div>
      ) : (
        <SelectField
          name="penilaianRisikoId" label="Penilaian Risiko" required
          value={form.penilaianRisikoId || ''}
          onChange={(e) => onChange({ ...form, penilaianRisikoId: e.target.value })}
          options={prSelectOptions}
        />
      )}
      <InputComponent
        name="tindakanPengendalian" label="Tindakan Pengendalian" required
        value={form.tindakanPengendalian || ''}
        onChangeValue={(e) => onChange({ ...form, tindakanPengendalian: e.target.value })}
      />
      <InputComponent
        name="referensi" label="Referensi"
        value={form.referensi || ''}
        onChangeValue={(e) => onChange({ ...form, referensi: e.target.value })}
      />
      <SelectField
        name="validasi" label="Validasi" required
        value={form.validasi || ''}
        onChange={(e) => onChange({ ...form, validasi: e.target.value })}
        options={VALIDASI_OPTIONS}
      />
      <InputComponent
        name="peluangSetelah" label="Peluang Setelah Pengendalian (1-5)" type="number" required
        value={form.peluangSetelah || ''}
        onChangeValue={(e) => onChange({ ...form, peluangSetelah: Number(e.target.value) })}
      />
      <InputComponent
        name="dampakSetelah" label="Dampak Setelah Pengendalian (1-5)" type="number" required
        value={form.dampakSetelah || ''}
        onChangeValue={(e) => onChange({ ...form, dampakSetelah: Number(e.target.value) })}
      />
      {form.skorSetelah != null && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Skor Setelah: <strong className="text-gray-900">{form.skorSetelah}</strong></span>
          <RiskLevelBadge level={form.tingkatRisikoSetelah} />
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

export default function KajiUlangRisikoPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.kajiUlangRisikos || []);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeleteKajiUlangRisiko(row.id)),
  });

  useEffect(() => {
    setLoading(true);
    dispatch(asyncReceiveKajiUlangRisikos({ page: 1, pageSize: 200 }))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [dispatch]);

  const filteredItems = useSearchFilter(items, search, (item) => item.tindakanPengendalian);

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
    { key: 'validasi', label: 'Validasi', render: (v) => <Badge label={VALIDASI_LABEL[v] || v} variant={VALIDASI_VARIANT[v]} /> },
    { key: 'peluangSetelah', label: 'Peluang Stlh' },
    { key: 'dampakSetelah', label: 'Dampak Stlh' },
    { key: 'skorSetelah', label: 'Skor Stlh', render: (v) => <span className="font-semibold">{v}</span> },
    { key: 'tingkatRisikoSetelah', label: 'Tingkat Stlh', render: (v) => <RiskLevelBadge level={v} /> },
  ];
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">M4 — Kaji Ulang Risiko</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tindakan pengendalian dan evaluasi efektivitas</p>
      </div>
      <DataTable
        columns={columns} data={filteredItems} loading={loading} hasMore={false}
        search={search} onSearchChange={setSearch} searchPlaceholder="Cari tindakan pengendalian..." emptyMessage="Data tidak ditemukan"
        headerExtra={<AddButton id="btn-add-kaji-ulang" onClick={openAdd} />}
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Kaji Ulang Risiko' : 'Tambah Kaji Ulang Risiko'}>
        <KuForm form={modal.form} onChange={setForm}  mode={modal.mode} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} prOptions={[]} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data kaji ulang risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </AppLayout>
  );
}