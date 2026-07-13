import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import IconButton from '../components/common/IconButton';
import AddButton from '../components/common/AddButton';
import InputComponent from '../components/common/InputComponent';
import { EditIcon, DeleteIcon, ActivateIcon, DeactivateIcon } from '../components/common/icons';
import useModalForm from '../hooks/useModalForm';
import useConfirmDialog from '../hooks/useConfirmDialog';
import useSearchFilter from '../hooks/useSearchFilter';
import {
  asyncReceiveUser,
  asyncAddUser,
  asyncUpdateUser,
  asyncToggleUserStatus,
  asyncDeleteUser,
} from '../states/user/action';
import { formatTime } from '../utils/format-time';

const EMPTY_FORM = { username: '', password: '', role: 'USER' };
const CONFIRM_CONFIG = {
  delete: { title: 'Hapus User?', message: 'User ini akan dihapus secara permanen.', label: 'Hapus', danger: true },
  activate: { title: 'Aktifkan User?', message: 'User ini akan diaktifkan kembali.', label: 'Aktifkan', danger: false },
  deactivate: { title: 'Nonaktifkan User?', message: 'User ini tidak akan bisa login sampai diaktifkan kembali.', label: 'Nonaktifkan', danger: true },
};

function UserForm({ form, onChange, onSubmit, onCancel, loading, mode }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <InputComponent
      placeholder='Isi username....'
        name="username" label="Username" required
        value={form.username || ''}
        onChangeValue={(e) => onChange({ ...form, username: e.target.value })}
      />
   
        <InputComponent
        placeholder='Isi password...'
          name="password" label="Password" type="password" required = {mode === "add"}
          value={form.password || ''}
          onChangeValue={(e) => onChange({ ...form, password: e.target.value })}
        />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="app-button-secondary cursor-pointer">Batal</button>
        <button type="submit" disabled={loading} className="app-button-primary cursor-pointer">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah User'}
        </button>
      </div>
    </form>
  );
}

export default function ManagementUserPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users || []);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeleteUser(row.id)),
    deactivate: (row) => dispatch(asyncToggleUserStatus({ id: row.id, isActive: true })),
    activate: (row) => dispatch(asyncToggleUserStatus({ id: row.id, isActive: false })),
  });

  useEffect(() => {
    setLoading(true);
    dispatch(asyncReceiveUser()).catch(() => {}).finally(() => setLoading(false));
  }, [dispatch]);

  const filteredUsers = useSearchFilter(users, search, (user) => user.username);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const { id, username, password} = modal.form;
      if (modal.mode === 'edit') {
        await dispatch(asyncUpdateUser({ id, username, password }));
      } else {
        await dispatch(asyncAddUser({ username, password}));
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setSaveLoading(false);
    }
  };

  const columns = [
    { key: 'username', label: 'Username', render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: 'role', label: 'Role', render: (v) => <Badge label={v} variant={v === 'ADMIN' ? 'teal' : 'gray'} /> },
    { key: 'isActive', label: 'Status', render: (v) => <Badge label={v ? 'Aktif' : 'Nonaktif'} variant={v ? 'green' : 'red'} /> },
    { key: 'createdAt', label: 'Dibuat', render: (v) => <span className="text-xs text-gray-400">{v ? formatTime(v) : '-'}</span> },
    { key: 'updatedAt', label: 'Diperbarui', render: (v) => <span className="text-xs text-gray-400">{v ? formatTime(v) : '-'}</span> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Manajemen User</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola akun pengguna sistem RPAM</p>
      </div>
      <DataTable
        columns={columns} data={filteredUsers} loading={loading} hasMore={false}
        search={search} onSearchChange={setSearch} searchPlaceholder="Cari username..." emptyMessage="Data tidak ditemukan"
        headerExtra={<AddButton id="btn-add-user" onClick={openAdd} label="Tambah User" />}
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            {row.isActive ? (
              <IconButton onClick={() => openConfirm(row, 'deactivate')} title="Nonaktifkan" colorClass="hover:text-yellow-600 hover:bg-yellow-50"><DeactivateIcon /></IconButton>
            ) : (
              <IconButton onClick={() => openConfirm(row, 'activate')} title="Aktifkan" colorClass="hover:text-green-600 hover:bg-green-50"><ActivateIcon /></IconButton>
            )}
            <IconButton onClick={() => openConfirm(row, 'delete')} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit User' : 'Tambah User'}>
        <UserForm form={modal.form} onChange={setForm} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} />
      </Modal>
      <ConfirmDialog
        open={confirm.open}
        title={CONFIRM_CONFIG[confirm.action]?.title}
        message={CONFIRM_CONFIG[confirm.action]?.message}
        confirmLabel={CONFIRM_CONFIG[confirm.action]?.label}
        danger={CONFIRM_CONFIG[confirm.action]?.danger}
        onConfirm={confirmAction}
        onCancel={closeConfirm}
      />
    </AppLayout>
  );
}