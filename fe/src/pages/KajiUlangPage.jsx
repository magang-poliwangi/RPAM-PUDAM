import { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import RiskLevelBadge from '../components/common/RiskLevelBadge';
import { kajiUlangApi, penilaianRisikoApi } from '../api/rpamApi';

const PAGE_SIZE = 15;
const EMPTY_FORM = { penilaianRisikoId: '', tindakanPengendalian: '', referensi: '', validasi: '', peluangSetelah: '', dampakSetelah: '' };
const VALIDASI_OPTIONS = [
  { value: 'EFEKTIF', label: 'Efektif' },
  { value: 'TIDAK_EFEKTIF', label: 'Tidak Efektif' },
  { value: 'TIDAK_PASTI', label: 'Tidak Pasti' },
];

function KuForm({ form, onChange, onSubmit, onCancel, loading, mode, prOptions }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Penilaian Risiko <span className="text-red-500">*</span></label>
        <select required value={form.penilaianRisikoId || ''} onChange={(e) => onChange({ ...form, penilaianRisikoId: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors">
          <option value="">-- Pilih Penilaian Risiko --</option>
          {prOptions.map((pr) => (
            <option key={pr.id} value={pr.id}>Skor {pr.skorRisiko} — {pr.tingkatRisiko} ({pr.identifikasiBahaya?.kodeRisiko || pr.identifikasiBahayaId})</option>
          ))}
        </select>
      </div>
      {[
        { name: 'tindakanPengendalian', label: 'Tindakan Pengendalian', required: true },
        { name: 'referensi', label: 'Referensi', required: false },
      ].map(({ name, label, required }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <input type="text" required={required} value={form[name] || ''} onChange={(e) => onChange({ ...form, [name]: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Validasi <span className="text-red-500">*</span></label>
        <select required value={form.validasi || ''} onChange={(e) => onChange({ ...form, validasi: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors">
          <option value="">-- Pilih Validasi --</option>
          {VALIDASI_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {[
        { name: 'peluangSetelah', label: 'Peluang Setelah Pengendalian (1–5)', min: 1, max: 5 },
        { name: 'dampakSetelah', label: 'Dampak Setelah Pengendalian (1–5)', min: 1, max: 5 },
      ].map(({ name, label, min, max }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
          <input type="number" min={min} max={max} required value={form[name] || ''} onChange={(e) => onChange({ ...form, [name]: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
        </div>
      ))}
      {form.skorSetelah != null && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Skor Setelah: <strong className="text-gray-900">{form.skorSetelah}</strong></span>
          <RiskLevelBadge level={form.tingkatRisikoSetelah} />
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

export default function KajiUlangPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [prOptions, setPrOptions] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: 'add', form: EMPTY_FORM });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [saveLoading, setSaveLoading] = useState(false);
  const searchTimeout = useRef(null);

  const fetchData = useCallback(async (page, q, reset = false) => {
    setLoading(true);
    try {
      const res = await kajiUlangApi.getAll({ page, pageSize: PAGE_SIZE, search: q });
      const { items: newItems, pagination: pg } = res.data.data;
      setItems((prev) => reset ? newItems : [...prev, ...newItems]);
      setPagination({ page: pg.page, total: pg.total });
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData(1, '', true);
    penilaianRisikoApi.getAll({ pageSize: 200 }).then((res) => setPrOptions(res.data.data.items || [])).catch(() => {});
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
      const { id, skorSetelah, tingkatRisikoSetelah, createdAt, updatedAt, penilaianRisiko, ...payload } = modal.form;
      if (modal.mode === 'edit') {
        await kajiUlangApi.update(id, payload);
      } else {
        await kajiUlangApi.create(payload);
      }
      closeModal(); setItems([]); fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan data'); }
    finally { setSaveLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await kajiUlangApi.remove(confirm.id);
      setConfirm({ open: false, id: null }); setItems([]); fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menghapus data'); }
  };

  const VALIDASI_LABEL = { EFEKTIF: 'Efektif', TIDAK_EFEKTIF: 'Tidak Efektif', TIDAK_PASTI: 'Tidak Pasti' };
  const validasiBadge = (v) => {
    const cls = { EFEKTIF: 'bg-green-100 text-green-700', TIDAK_EFEKTIF: 'bg-red-100 text-red-700', TIDAK_PASTI: 'bg-yellow-100 text-yellow-700' }[v] || 'bg-gray-100 text-gray-500';
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{VALIDASI_LABEL[v] || v}</span>;
  };

  const columns = [
    { key: 'tindakanPengendalian', label: 'Tindakan Pengendalian', render: (v) => <span className="line-clamp-2 max-w-xs">{v}</span> },
    { key: 'validasi', label: 'Validasi', render: (v) => validasiBadge(v) },
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
        columns={columns} data={items} loading={loading} hasMore={hasMore} onLoadMore={handleLoadMore}
        search={search} onSearchChange={handleSearchChange} searchPlaceholder="Cari tindakan pengendalian..." emptyMessage="Data tidak ditemukan"
        headerExtra={
          <button id="btn-add-kaji-ulang" onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg transition-colors">
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
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Kaji Ulang Risiko' : 'Tambah Kaji Ulang Risiko'}>
        <KuForm form={modal.form} onChange={(f) => setModal((m) => ({ ...m, form: f }))} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} prOptions={prOptions} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data kaji ulang risiko ini akan dihapus." onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} />
    </AppLayout>
  );
}
