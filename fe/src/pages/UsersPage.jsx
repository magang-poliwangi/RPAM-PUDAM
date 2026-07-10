import { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { usersApi } from '../api/usersApi';

const PAGE_SIZE = 15;
const EMPTY_FORM = { username: '', password: '', role: 'USER' };

function UserForm({ form, onChange, onSubmit, onCancel, loading, mode }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
        <input type="text" required value={form.username || ''} onChange={(e) => onChange({ ...form, username: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
      </div>
      {mode === 'add' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
          <input type="password" required value={form.password || ''} onChange={(e) => onChange({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
        <select required value={form.role || 'USER'} onChange={(e) => onChange({ ...form, role: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah User'}
        </button>
      </div>
    </form>
  );
}

export default function UsersPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', form: EMPTY_FORM });
  const [confirm, setConfirm] = useState({ open: false, id: null, action: 'delete' });
  const [saveLoading, setSaveLoading] = useState(false);
  const searchTimeout = useRef(null);

  const fetchData = useCallback(async (page, q, reset = false) => {
    setLoading(true);
    try {
      const res = await usersApi.getAll({ page, pageSize: PAGE_SIZE, search: q });
      const { items: newItems, pagination: pg } = res.data.data;
      setItems((prev) => reset ? newItems : [...prev, ...newItems]);
      setPagination({ page: pg.page, total: pg.total });
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(1, '', true); }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setItems([]); fetchData(1, val, true); }, 400);
  };

  const hasMore = items.length < pagination.total;
  const handleLoadMore = () => { if (!loading && hasMore) fetchData(pagination.page + 1, search); };

  const openAdd = () => setModal({ open: true, mode: 'add', form: EMPTY_FORM });
  const openEdit = (row) => setModal({ open: true, mode: 'edit', form: { username: row.username, role: row.role } });
  const closeModal = () => setModal({ open: false, mode: 'add', form: EMPTY_FORM });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      if (modal.mode === 'edit') {
        await usersApi.update(modal.form.id, { username: modal.form.username });
      } else {
        await usersApi.create(modal.form);
      }
      closeModal(); setItems([]); fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan data'); }
    finally { setSaveLoading(false); }
  };

  const handleConfirmAction = async () => {
    try {
      if (confirm.action === 'delete') await usersApi.remove(confirm.id);
      else if (confirm.action === 'activate') await usersApi.activate(confirm.id);
      else if (confirm.action === 'deactivate') await usersApi.deactivate(confirm.id);
      setConfirm({ open: false, id: null, action: 'delete' });
      setItems([]); fetchData(1, search, true);
    } catch (err) { alert(err.response?.data?.message || 'Gagal melakukan aksi'); }
  };

  const roleBadge = (role) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${role === 'ADMIN' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>{role}</span>
  );
  const activeBadge = (isActive) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{isActive ? 'Aktif' : 'Nonaktif'}</span>
  );

  const columns = [
    { key: 'username', label: 'Username', render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: 'role', label: 'Role', render: (v) => roleBadge(v) },
    { key: 'isActive', label: 'Status', render: (v) => activeBadge(v) },
    { key: 'createdAt', label: 'Dibuat', render: (v) => <span className="text-xs text-gray-400">{v ? new Date(v).toLocaleDateString('id-ID') : '-'}</span> },
  ];

  const CONFIRM_CONFIG = {
    delete: { title: 'Hapus User?', message: 'User ini akan dihapus secara permanen.', label: 'Hapus', danger: true },
    activate: { title: 'Aktifkan User?', message: 'User ini akan diaktifkan kembali.', label: 'Aktifkan', danger: false },
    deactivate: { title: 'Nonaktifkan User?', message: 'User ini tidak akan bisa login sampai diaktifkan kembali.', label: 'Nonaktifkan', danger: true },
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Manajemen User</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola akun pengguna sistem RPAM</p>
      </div>
      <DataTable
        columns={columns} data={items} loading={loading} hasMore={hasMore} onLoadMore={handleLoadMore}
        search={search} onSearchChange={handleSearchChange} searchPlaceholder="Cari username..." emptyMessage="Data tidak ditemukan"
        headerExtra={
          <button id="btn-add-user" onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Tambah User
          </button>
        }
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="p-1.5 text-gray-400 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors" title="Edit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            {row.isActive ? (
              <button onClick={() => setConfirm({ open: true, id: row.id, action: 'deactivate' })} className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors" title="Nonaktifkan">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              </button>
            ) : (
              <button onClick={() => setConfirm({ open: true, id: row.id, action: 'activate' })} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Aktifkan">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            )}
            <button onClick={() => setConfirm({ open: true, id: row.id, action: 'delete' })} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit User' : 'Tambah User'}>
        <UserForm form={modal.form} onChange={(f) => setModal((m) => ({ ...m, form: f }))} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} />
      </Modal>
      <ConfirmDialog
        open={confirm.open}
        title={CONFIRM_CONFIG[confirm.action]?.title}
        message={CONFIRM_CONFIG[confirm.action]?.message}
        confirmLabel={CONFIRM_CONFIG[confirm.action]?.label}
        danger={CONFIRM_CONFIG[confirm.action]?.danger}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirm({ open: false, id: null, action: 'delete' })}
      />
    </AppLayout>
  );
}
