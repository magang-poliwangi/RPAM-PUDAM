import { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import RiskLevelBadge from '../components/common/RiskLevelBadge';
import { rencanaPerbaikanApi, kajiUlangApi } from '../api/rpamApi';

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
const STATUS_CLASS = {
  BELUM_MULAI: 'bg-gray-100 text-gray-600',
  SEDANG_BERJALAN: 'bg-blue-100 text-blue-700',
  SELESAI: 'bg-green-100 text-green-700',
  TERTUNDA: 'bg-yellow-100 text-yellow-700',
};

function RpForm({ form, onChange, onSubmit, onCancel, loading, mode, kuOptions }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kaji Ulang Risiko <span className="text-red-500">*</span></label>
        <select required value={form.kajiUlangRisikoId || ''} onChange={(e) => onChange({ ...form, kajiUlangRisikoId: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors">
          <option value="">-- Pilih Kaji Ulang Risiko --</option>
          {kuOptions.map((ku) => (
            <option key={ku.id} value={ku.id}>{ku.tindakanPengendalian?.slice(0, 50)} (Skor: {ku.skorSetelah} — {ku.tingkatRisikoSetelah})</option>
          ))}
        </select>
      </div>
      {[
        { name: 'rencanaPerbaikan', label: 'Rencana Perbaikan', required: true },
        { name: 'penanggungJawab', label: 'Penanggung Jawab', required: true },
        { name: 'jadwal', label: 'Jadwal Pelaksanaan', required: true },
        { name: 'sumberPembiayaan', label: 'Sumber Pembiayaan', required: false },
      ].map(({ name, label, required }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <input type="text" required={required} value={form[name] || ''} onChange={(e) => onChange({ ...form, [name]: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
        <input type="number" min={0} value={form.biaya || ''} onChange={(e) => onChange({ ...form, biaya: Number(e.target.value) })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Kemajuan <span className="text-red-500">*</span></label>
          <select required value={form.statusKemajuan || ''} onChange={(e) => onChange({ ...form, statusKemajuan: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors">
            <option value="">-- Status --</option>
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas <span className="text-red-500">*</span></label>
          <select required value={form.prioritas || ''} onChange={(e) => onChange({ ...form, prioritas: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors">
            <option value="">-- Prioritas --</option>
            {PRIORITAS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kendala (opsional)</label>
        <input type="text" value={form.kendala || ''} onChange={(e) => onChange({ ...form, kendala: e.target.value })}
          placeholder="Contoh: Keuangan, Tenaga Kerja..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
}

export default function RencanaPerbaikanPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [kuOptions, setKuOptions] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: 'add', form: EMPTY_FORM });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [saveLoading, setSaveLoading] = useState(false);
  const searchTimeout = useRef(null);

  const fetchData = useCallback(async (page, q, reset = false) => {
    setLoading(true);
    try {
      const res = await rencanaPerbaikanApi.getAll({ page, pageSize: PAGE_SIZE, search: q });
      const { items: newItems, pagination: pg } = res.data.data;
      setItems((prev) => reset ? newItems : [...prev, ...newItems]);
      setPagination({ page: pg.page, total: pg.total });
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData(1, '', true);
    kajiUlangApi.getAll({ pageSize: 200 }).then((res) => setKuOptions(res.data.data.items || [])).catch(() => {});
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setItems([]); fetchData(1, val, true); }, 400);
  };

  const hasMore = items.length < pagination.total;
  const handleLoadMore = () => { if (!loading && hasMore) fetchData(pagination.page + 1, search); };

  const openAdd = () => setModal({ open: true, mode: 'add', form: EMPTY_FORM });
  const openEdit = (row) => setModal({ open: true, mode: 'edit', form: { ...row } });
  const closeModal = () => setModal({ open: false, mode: 'add', form: EMPTY_FORM });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const { id, createdAt, updatedAt, kajiUlangRisiko, ...payload } = modal.form;
      if (modal.mode === 'edit') { await rencanaPerbaikanApi.update(id, payload); }
      else { await rencanaPerbaikanApi.create(payload); }
      closeModal(); setItems([]); fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan data'); }
    finally { setSaveLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await rencanaPerbaikanApi.remove(confirm.id);
      setConfirm({ open: false, id: null }); setItems([]); fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menghapus data'); }
  };

  const formatRupiah = (v) => v != null ? `Rp ${Number(v).toLocaleString('id-ID')}` : '-';

  const columns = [
    { key: 'rencanaPerbaikan', label: 'Rencana Perbaikan', render: (v) => <span className="line-clamp-2 max-w-xs">{v}</span> },
    { key: 'penanggungJawab', label: 'PIC' },
    { key: 'jadwal', label: 'Jadwal' },
    { key: 'statusKemajuan', label: 'Status', render: (v) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[v] || 'bg-gray-100 text-gray-500'}`}>{STATUS_LABEL[v] || v}</span> },
    { key: 'prioritas', label: 'Prioritas', render: (v) => <span className="text-xs capitalize">{v?.toLowerCase() || '-'}</span> },
    { key: 'biaya', label: 'Biaya', render: (v) => <span className="text-xs">{formatRupiah(v)}</span> },
    { key: 'kajiUlangRisiko', label: 'Tingkat Risiko', render: (_, row) => <RiskLevelBadge level={row.kajiUlangRisiko?.tingkatRisikoSetelah} /> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">M5 — Rencana Perbaikan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Perencanaan tindakan perbaikan risiko</p>
      </div>
      <DataTable
        columns={columns} data={items} loading={loading} hasMore={hasMore} onLoadMore={handleLoadMore}
        search={search} onSearchChange={handleSearchChange} searchPlaceholder="Cari rencana perbaikan..." emptyMessage="Data tidak ditemukan"
        headerExtra={
          <button id="btn-add-rencana-perbaikan" onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Tambah
          </button>
        }
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="p-1.5 text-gray-400 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors" title="Edit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button onClick={() => setConfirm({ open: true, id: row.id })} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Rencana Perbaikan' : 'Tambah Rencana Perbaikan'} size="lg">
        <RpForm form={modal.form} onChange={(f) => setModal((m) => ({ ...m, form: f }))} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} kuOptions={kuOptions} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data rencana perbaikan ini akan dihapus." onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} />
    </AppLayout>
  );
}
