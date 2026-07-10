import { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import RiskLevelBadge from '../components/common/RiskLevelBadge';
import { penilaianRisikoApi, identifikasiBahayaApi } from '../api/rpamApi';

const PAGE_SIZE = 15;
const EMPTY_FORM = { identifikasiBahayaId: '', peluangKejadianBahaya: '', dampakKeparahan: '' };

function PrForm({ form, onChange, onSubmit, onCancel, loading, mode, ibOptions }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Identifikasi Bahaya <span className="text-red-500">*</span></label>
        <select
          required
          value={form.identifikasiBahayaId || ''}
          onChange={(e) => onChange({ ...form, identifikasiBahayaId: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
        >
          <option value="">-- Pilih Identifikasi Bahaya --</option>
          {ibOptions.map((ib) => (
            <option key={ib.id} value={ib.id}>{ib.kodeRisiko} — {ib.kejadianBahayaXYZ}</option>
          ))}
        </select>
      </div>
      {[
        { name: 'peluangKejadianBahaya', label: 'Peluang (1–5)', min: 1, max: 5 },
        { name: 'dampakKeparahan', label: 'Dampak (1–5)', min: 1, max: 5 },
      ].map(({ name, label, min, max }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
          <input
            type="number"
            min={min}
            max={max}
            required
            value={form[name] || ''}
            onChange={(e) => onChange({ ...form, [name]: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
          />
        </div>
      ))}
      {form.skorRisiko != null && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Skor: <strong className="text-gray-900">{form.skorRisiko}</strong></span>
          <RiskLevelBadge level={form.tingkatRisiko} />
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
}

export default function PenilaianRisikoPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [ibOptions, setIbOptions] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: 'add', form: EMPTY_FORM });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [saveLoading, setSaveLoading] = useState(false);
  const searchTimeout = useRef(null);

  const fetchData = useCallback(async (page, q, reset = false) => {
    setLoading(true);
    try {
      const res = await penilaianRisikoApi.getAll({ page, pageSize: PAGE_SIZE, search: q });
      const { items: newItems, pagination: pg } = res.data.data;
      setItems((prev) => reset ? newItems : [...prev, ...newItems]);
      setPagination({ page: pg.page, total: pg.total });
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData(1, '', true);
    identifikasiBahayaApi.getAll({ pageSize: 200 }).then((res) => setIbOptions(res.data.data.items || [])).catch(() => {});
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
      const { id, skorRisiko, tingkatRisiko, warnaTingkatRisiko, createdAt, updatedAt, identifikasiBahaya, ...payload } = modal.form;
      if (modal.mode === 'edit') {
        await penilaianRisikoApi.update(id, payload);
      } else {
        await penilaianRisikoApi.create(payload);
      }
      closeModal();
      setItems([]);
      fetchData(1, search, true);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    } finally { setSaveLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await penilaianRisikoApi.remove(confirm.id);
      setConfirm({ open: false, id: null });
      setItems([]);
      fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menghapus data'); }
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
        onLoadMore={handleLoadMore} search={search} onSearchChange={handleSearchChange}
        searchPlaceholder="Cari data penilaian..." emptyMessage="Data tidak ditemukan"
        headerExtra={
          <button id="btn-add-penilaian-risiko" onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg transition-colors">
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
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Penilaian Risiko' : 'Tambah Penilaian Risiko'}>
        <PrForm form={modal.form} onChange={(f) => setModal((m) => ({ ...m, form: f }))} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} ibOptions={ibOptions} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data penilaian risiko ini akan dihapus." onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} />
    </AppLayout>
  );
}
