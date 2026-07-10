import { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { pemantauanApi, kajiUlangApi } from '../api/rpamApi';

const PAGE_SIZE = 15;
const EMPTY_FORM = {
  kajiUlangRisikoId: '', batasKritis: '', apaYangDimonitor: '', dimana: '', kapan: '',
  bagaimana: '', siapaYangMelakukan: '', siapaYangAkanMenganalisisHasilnya: '',
  siapaYangMenerimaHasilAnalisisDanMengambilTindakan: '', apaTindakanKoreksinya: '',
  siapaYangMelakukanTindakanKoreksi: '', seberapaCepat: '',
  siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: '',
};

const FIELDS = [
  { name: 'batasKritis', label: 'Batas Kritis', required: true },
  { name: 'apaYangDimonitor', label: 'Apa yang Dipantau', required: true },
  { name: 'dimana', label: 'Dimana', required: true },
  { name: 'kapan', label: 'Kapan', required: true },
  { name: 'bagaimana', label: 'Bagaimana', required: true },
  { name: 'siapaYangMelakukan', label: 'Pelaksana', required: true },
  { name: 'siapaYangAkanMenganalisisHasilnya', label: 'Analis', required: false },
  { name: 'siapaYangMenerimaHasilAnalisisDanMengambilTindakan', label: 'Penerima Laporan', required: false },
  { name: 'apaTindakanKoreksinya', label: 'Tindakan Koreksi', required: false },
  { name: 'siapaYangMelakukanTindakanKoreksi', label: 'Pelaksana Koreksi', required: false },
  { name: 'seberapaCepat', label: 'Waktu Koreksi', required: false },
  { name: 'siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni', label: 'Penerima Laporan Koreksi', required: false },
];

function PmForm({ form, onChange, onSubmit, onCancel, loading, mode, kuOptions }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kaji Ulang Risiko <span className="text-red-500">*</span></label>
        <select required value={form.kajiUlangRisikoId || ''} onChange={(e) => onChange({ ...form, kajiUlangRisikoId: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors">
          <option value="">-- Pilih Kaji Ulang Risiko --</option>
          {kuOptions.map((ku) => (
            <option key={ku.id} value={ku.id}>{ku.tindakanPengendalian?.slice(0, 60)}</option>
          ))}
        </select>
      </div>
      {FIELDS.map(({ name, label, required }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <input type="text" required={required} value={form[name] || ''} onChange={(e) => onChange({ ...form, [name]: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
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

export default function PemantauanPage() {
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
      const res = await pemantauanApi.getAll({ page, pageSize: PAGE_SIZE, search: q });
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
      if (modal.mode === 'edit') { await pemantauanApi.update(id, payload); }
      else { await pemantauanApi.create(payload); }
      closeModal(); setItems([]); fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan data'); }
    finally { setSaveLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await pemantauanApi.remove(confirm.id);
      setConfirm({ open: false, id: null }); setItems([]); fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menghapus data'); }
  };

  const columns = [
    { key: 'apaYangDimonitor', label: 'Yang Dipantau', render: (v) => <span className="line-clamp-2 max-w-xs">{v}</span> },
    { key: 'batasKritis', label: 'Batas Kritis' },
    { key: 'dimana', label: 'Lokasi' },
    { key: 'kapan', label: 'Kapan' },
    { key: 'siapaYangMelakukan', label: 'Pelaksana' },
    { key: 'apaTindakanKoreksinya', label: 'Tindakan Koreksi', render: (v) => <span className="line-clamp-1 max-w-xs text-xs">{v || '-'}</span> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">M6 — Pemantauan Operasional</h1>
        <p className="text-sm text-gray-500 mt-0.5">Data pemantauan dan tindakan koreksi operasional</p>
      </div>
      <DataTable
        columns={columns} data={items} loading={loading} hasMore={hasMore} onLoadMore={handleLoadMore}
        search={search} onSearchChange={handleSearchChange} searchPlaceholder="Cari data pemantauan..." emptyMessage="Data tidak ditemukan"
        headerExtra={
          <button id="btn-add-pemantauan" onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg transition-colors">
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
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Pemantauan' : 'Tambah Pemantauan'} size="lg">
        <PmForm form={modal.form} onChange={(f) => setModal((m) => ({ ...m, form: f }))} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} kuOptions={kuOptions} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data pemantauan ini akan dihapus." onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} />
    </AppLayout>
  );
}
