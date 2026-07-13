import { useCallback, useEffect, useState } from "react";
import InputComponent from "../components/common/InputComponent";
import SelectField from "../components/common/SelectField";
import useModalForm from "../hooks/useModalForm";
import usePaginatedFetch from "../hooks/usePaginatedFetch";
import useDebouncedSearch from "../hooks/useDebouncedSearch";
import rencanaPerbaikanApi from "../api/rencana-perbaikan";
import { kajiUlangRisikoApi } from "../api/kaji-ulang-risiko";
import useConfirmDialog from "../hooks/useConfirmDialog";
import { omitFields } from "../utils/omitFields";
import AppLayout from "../components/common/AppLayout";
import DataTable from "../components/common/DataTable";
import AddButton from "../components/common/AddButton";
import IconButton from "../components/common/IconButton";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Badge from "../components/common/Badge";
import { formatRupiah } from "../utils/format-rupiah";
import RiskLevelBadge from "../components/common/RiskLevelBadge";
import { DeleteIcon, EditIcon } from "../components/common/icons";


const PAGE_SIZE = 15;
const EMPTY_FORM = {
  kajiUlangRisikoId: '', rencanaPerbaikan: '', penanggungJawab: '',
  jadwal: '', biaya: '', sumberPembiayaan: '',
  statusKemajuan: '', kendala: '', prioritas: '',
};

const STATUS_OPTIONS = [
  { value: 'BELUM_MULAI', label: 'Belum Mulai' },
  { value: 'SEDANG_BERJALAN', label: 'Sedang Berjalan' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'TERTUNDA', label: 'Tertunda' },
];
const PRIORITAS_OPTIONS = [
  { value: 'PENDEK', label: 'Pendek' },
  { value: 'MENENGAH', label: 'Menengah' },
  { value: 'PANJANG', label: 'Panjang' },
];
const STATUS_LABEL = { BELUM_MULAI: 'Belum Mulai', SEDANG_BERJALAN: 'Sedang Berjalan', SELESAI: 'Selesai', TERTUNDA: 'Tertunda' };
const STATUS_VARIANT = { BELUM_MULAI: 'gray', SEDANG_BERJALAN: 'blue', SELESAI: 'green', TERTUNDA: 'yellow' };
const READONLY_FIELDS = ['id', 'createdAt', 'updatedAt', 'kajiUlangRisiko'];

function RpForm({ form, onChange, onSubmit, onCancel, loading, mode, kuOptions }) {
  const kuSelectOptions = kuOptions.map((ku) => ({
    value: ku.id,
    label: `${ku.tindakanPengendalian?.slice(0, 50)} (Skor: ${ku.skorSetelah} — ${ku.tingkatRisikoSetelah})`,
  }));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <SelectField
        name="kajiUlangRisikoId" label="Kaji Ulang Risiko" required
        value={form.kajiUlangRisikoId || ''}
        onChange={(e) => onChange({ ...form, kajiUlangRisikoId: e.target.value })}
        options={kuSelectOptions}
      />
      <InputComponent
        name="rencanaPerbaikan" label="Rencana Perbaikan" required
        value={form.rencanaPerbaikan || ''}
        onChangeValue={(e) => onChange({ ...form, rencanaPerbaikan: e.target.value })}
      />
      <InputComponent
        name="penanggungJawab" label="Penanggung Jawab" required
        value={form.penanggungJawab || ''}
        onChangeValue={(e) => onChange({ ...form, penanggungJawab: e.target.value })}
      />
      <InputComponent
        name="jadwal" label="Jadwal Pelaksanaan" required
        value={form.jadwal || ''}
        onChangeValue={(e) => onChange({ ...form, jadwal: e.target.value })}
      />
      <InputComponent
        name="sumberPembiayaan" label="Sumber Pembiayaan"
        value={form.sumberPembiayaan || ''}
        onChangeValue={(e) => onChange({ ...form, sumberPembiayaan: e.target.value })}
      />
      <InputComponent
        name="biaya" label="Biaya (Rp)" type="number"
        value={form.biaya || ''}
        onChangeValue={(e) => onChange({ ...form, biaya: Number(e.target.value) })}
      />
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          name="statusKemajuan" label="Status Kemajuan" required placeholder="-- Status --"
          value={form.statusKemajuan || ''}
          onChange={(e) => onChange({ ...form, statusKemajuan: e.target.value })}
          options={STATUS_OPTIONS}
        />
        <SelectField
          name="prioritas" label="Prioritas" required placeholder="-- Prioritas --"
          value={form.prioritas || ''}
          onChange={(e) => onChange({ ...form, prioritas: e.target.value })}
          options={PRIORITAS_OPTIONS}
        />
      </div>
      <InputComponent
        name="kendala" label="Kendala (opsional)" placeholder="Contoh: Keuangan, Tenaga Kerja..."
        value={form.kendala || ''}
        onChangeValue={(e) => onChange({ ...form, kendala: e.target.value })}
      />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="app-button-secondary">Batal</button>
        <button type="submit" disabled={loading} className="app-button-primary">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
}

export default function RencanaPerbaikanPage() {
  const [kuOptions, setKuOptions] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);

  const fetchPage = useCallback(
    ({ page, pageSize, search }) => rencanaPerbaikanApi.getAll({ page, pageSize, search }).then((res) => res.data.data),
    []
  );
  const { items, loading, hasMore, loadMore, search: runSearch, refetch } = usePaginatedFetch(fetchPage, { pageSize: PAGE_SIZE });
  const { search, handleSearchChange } = useDebouncedSearch(runSearch, 400);

  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => rencanaPerbaikanApi.remove(row.id).then(refetch),
  });

  useEffect(() => {
    kajiUlangRisikoApi.getAll({ pageSize: 200 }).then((res) => setKuOptions(res.data.data.items || [])).catch(() => { });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const payload = omitFields(modal.form, READONLY_FIELDS);
      if (modal.mode === 'edit') {
        await rencanaPerbaikanApi.update(modal.form.id, payload);
      } else {
        await rencanaPerbaikanApi.create(payload);
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
    { key: 'rencanaPerbaikan', label: 'Rencana Perbaikan', render: (v) => <span className="line-clamp-2 max-w-xs">{v}</span> },
    { key: 'penanggungJawab', label: 'PIC' },
    { key: 'jadwal', label: 'Jadwal' },
    { key: 'statusKemajuan', label: 'Status', render: (v) => <Badge label={STATUS_LABEL[v] || v} variant={STATUS_VARIANT[v]} /> },
    { key: 'prioritas', label: 'Prioritas', render: (v) => <span className="text-xs capitalize">{v?.toLowerCase() || '-'}</span> },
    { key: 'biaya', label: 'Biaya', render: (v) => <span className="text-xs">{formatRupiah(v)}</span> },
    { key: 'kajiUlangRisiko', label: 'Tingkat Risiko', render: (_, row) => <RiskLevelBadge level={row.tingkatRisikoDenganPengendalian} /> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">M5 — Rencana Perbaikan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Perencanaan tindakan perbaikan risiko</p>
      </div>
      <DataTable
        columns={columns} data={items} loading={loading} hasMore={hasMore} onLoadMore={loadMore}
        search={search} onSearchChange={handleSearchChange} searchPlaceholder="Cari rencana perbaikan..." emptyMessage="Data tidak ditemukan"
        headerExtra={<AddButton id="btn-add-rencana-perbaikan" onClick={openAdd} />}
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Rencana Perbaikan' : 'Tambah Rencana Perbaikan'} size="lg">
        <RpForm form={modal.form} onChange={setForm} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} kuOptions={kuOptions} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data rencana perbaikan ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </AppLayout>
  );
}