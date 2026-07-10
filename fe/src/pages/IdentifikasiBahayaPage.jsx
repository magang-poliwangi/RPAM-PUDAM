import { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { identifikasiBahayaApi } from '../api/rpamApi';

const PAGE_SIZE = 15;

const EMPTY_FORM = {
  lokasiSpamId: '', komponenSpam: '', kontaminasiX: '',
  komponenSpamY: '', penyebabZ: '', kejadianBahayaXYZ: '', tipeBahaya: '',
};

function IbForm({ form, onChange, onSubmit, onCancel, loading, mode }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {form.kodeRisiko && (
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
          Kode Risiko: <span className="font-mono font-semibold text-teal-700">{form.kodeRisiko}</span>
        </div>
      )}
      {[
        { name: 'lokasiSpamId', label: 'Kode Lokasi SPAM', required: true },
        { name: 'komponenSpam', label: 'Komponen SPAM (Y)', required: true },
        { name: 'kontaminasiX', label: 'Kontaminasi (X)', required: true },
        { name: 'komponenSpamY', label: 'Komponen SPAM Y (detail)', required: true },
        { name: 'penyebabZ', label: 'Penyebab (Z)', required: true },
        { name: 'kejadianBahayaXYZ', label: 'Kejadian Bahaya (XYZ)', required: true },
        { name: 'tipeBahaya', label: 'Tipe Bahaya', required: true },
      ].map(({ name, label, required }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <input
            type="text"
            required={required}
            value={form[name] || ''}
            onChange={(e) => onChange({ ...form, [name]: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
          />
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
}

export default function IdentifikasiBahayaPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', form: EMPTY_FORM });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [saveLoading, setSaveLoading] = useState(false);
  const searchTimeout = useRef(null);

  const fetchData = useCallback(async (page, q, reset = false) => {
    setLoading(true);
    try {
      const res = await identifikasiBahayaApi.getAll({ page, pageSize: PAGE_SIZE, search: q });
      const { items: newItems, pagination: pg } = res.data.data;
      setItems((prev) => reset ? newItems : [...prev, ...newItems]);
      setPagination({ page: pg.page, total: pg.total });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1, search, true);
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setItems([]);
      fetchData(1, val, true);
    }, 400);
  };

  const hasMore = items.length < pagination.total;
  const handleLoadMore = () => {
    if (!loading && hasMore) fetchData(pagination.page + 1, search);
  };

  const openAdd = () => setModal({ open: true, mode: 'add', form: EMPTY_FORM });
  const openEdit = (row) => setModal({ open: true, mode: 'edit', form: { 
    ...row, 
    lokasiSpamId: row.lokasiSpam?.kodeLokasi || row.lokasiSpamId 
  } });
  const closeModal = () => setModal({ open: false, mode: 'add', form: EMPTY_FORM });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const { id, kodeRisiko, createdAt, updatedAt, ...payload } = modal.form;
      if (modal.mode === 'edit') {
        await identifikasiBahayaApi.update(id, payload);
      } else {
        await identifikasiBahayaApi.create(payload);
      }
      closeModal();
      setItems([]);
      fetchData(1, search, true);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await identifikasiBahayaApi.remove(confirm.id);
      setConfirm({ open: false, id: null });
      setItems([]);
      fetchData(1, search, true);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    { key: 'kodeRisiko', label: 'Kode Risiko', render: (v) => <span className="font-mono text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded">{v || '-'}</span> },
    { key: 'lokasiSpam', label: 'Lokasi SPAM', render: (_, row) => <span>{row.lokasiSpam?.kodeLokasi || row.lokasiSpamId}</span> },
    { key: 'komponenSpam', label: 'Komponen SPAM' },
    { key: 'kontaminasiX', label: 'Kontaminasi (X)' },
    { key: 'tipeBahaya', label: 'Tipe Bahaya' },
    { key: 'kejadianBahayaXYZ', label: 'Kejadian Bahaya' },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">M1 — Identifikasi Bahaya</h1>
          <p className="text-sm text-gray-500 mt-0.5">Daftar identifikasi bahaya pada sistem SPAM</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari kode risiko, lokasi..."
        emptyMessage="Data tidak ditemukan"
        headerExtra={
          <button
            id="btn-add-identifikasi-bahaya"
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
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

      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.mode === 'edit' ? 'Edit Identifikasi Bahaya' : 'Tambah Identifikasi Bahaya'}
        size="md"
      >
        <IbForm
          form={modal.form}
          onChange={(f) => setModal((m) => ({ ...m, form: f }))}
          onSubmit={handleSave}
          onCancel={closeModal}
          loading={saveLoading}
          mode={modal.mode}
        />
      </Modal>

      <ConfirmDialog
        open={confirm.open}
        title="Hapus Data?"
        message="Data identifikasi bahaya ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
    </AppLayout>
  );
}
