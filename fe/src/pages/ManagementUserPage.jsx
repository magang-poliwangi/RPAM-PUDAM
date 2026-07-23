import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import IconButton from '../components/common/IconButton';
import AddButton from '../components/common/AddButton';
import { EditIcon, DeleteIcon, ActivateIcon, DeactivateIcon } from '../components/common/icons';
import useModalForm from '../hooks/useModalForm';
import useConfirmDialog from '../hooks/useConfirmDialog'; import {
  asyncReceiveUser,
  asyncAddUser,
  asyncUpdateUser,
  asyncToggleUserStatus,
  asyncDeleteUser,
} from '../states/user/action';
import { formatTime } from '../utils/format-time';
import ManagementUserFormComponent from '../components/managementUser/ManagementUserFormComponent';

const EMPTY_FORM = { username: '', password: '' };
const CONFIRM_CONFIG = {
  delete: { title: 'Hapus User?', message: 'User ini akan dihapus secara permanen.', label: 'Hapus', danger: true },
  activate: { title: 'Aktifkan User?', message: 'User ini akan diaktifkan kembali.', label: 'Aktifkan', danger: false },
  deactivate: { title: 'Nonaktifkan User?', message: 'User ini tidak akan bisa login sampai diaktifkan kembali.', label: 'Nonaktifkan', danger: true },
};

const AKSI_OPTIONS = [
  { value: '', label: 'Semua Aksi' },
  { value: true, label: 'Aktif' },
  { value: false, label: 'Nonaktif' },
];

const PAGE_LIMIT = 10; // pagination cuma di FE (slice array), asyncReceiveUser tetap ambil semua data sekali di awal

export default function ManagementUserPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users || []);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeleteUser(row.id)),
    deactivate: (row) => dispatch(asyncToggleUserStatus({ id: row.id, isActive: true })),
    activate: (row) => dispatch(asyncToggleUserStatus({ id: row.id, isActive: false })),
  });


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    dispatch(asyncReceiveUser()).catch(() => { }).finally(() => setLoading(false));
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch = user.username
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === ""
          ? true
          : user.isActive === (statusFilter === "true");

      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  // total halaman ngikutin hasil filter, bukan `users` mentah
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_LIMIT));

  // kalau filter/search bikin hasil lebih dikit dan page saat ini jadi kebesaran
  // (misal lagi di halaman 3 terus search dipersempit jadi cuma 1 halaman), balikin ke 1
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_LIMIT;
    return filteredUsers.slice(start, start + PAGE_LIMIT);
  }, [filteredUsers, page]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const { id, username, password } = modal.form;
      if (modal.mode === 'edit') {
        await dispatch(asyncUpdateUser({ id, username, password }));
      } else {
        await dispatch(asyncAddUser({ username, password }));
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
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Manajemen User</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola akun pengguna sistem RPAM</p>
      </div>
      <DataTable
        columns={columns}
        data={paginatedUsers}
        loading={loading}
        pagination={{ total: filteredUsers.length, page, limit: PAGE_LIMIT, totalPages }}
        onPageChange={setPage}
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari username..."
        emptyMessage="Data tidak ditemukan"
        headerExtra={(
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="app-input text-sm min-w-[10rem]"
              >
                {AKSI_OPTIONS.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <AddButton
              id="btn-add-user"
              onClick={openAdd}
              label="Tambah User"
            />
          </div>

        )
        }
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
        <ManagementUserFormComponent form={modal.form} onChange={setForm} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} />
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
    </>
  );
}