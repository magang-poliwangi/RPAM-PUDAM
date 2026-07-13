import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoAddOutline, IoCreateOutline, IoPeopleOutline, IoPowerOutline, IoTrashOutline } from "react-icons/io5";
import {
    asyncReceiveUser,
    asyncToggleUserStatus,
    asyncAddUser,
    asyncUpdateUser,
    asyncDeleteUser,
} from "../../states/user/action";
import { formatTime } from "../../utils/format-time";
import StatusBadgeComponent from "../../components/common/StatusBadgeComponent";
import UserFormModalComponent from "../../components/UserFormModalComponent";
import LayoutMainContent from "../../components/common/LayoutMainContent";

export default function ManagementUserPage() {
    const { users = [] } = useSelector((states) => states);
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        dispatch(asyncReceiveUser());
    }, [dispatch]);

    const openAddModal = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleToggleStatus = (user) => {
        dispatch(asyncToggleUserStatus({ id: user.id, isActive: user.isActive }));
    };

    const handleSubmitForm = async (payload, id) => {
        if (id) await dispatch(asyncUpdateUser({ id, payload }));
        else await dispatch(asyncAddUser(payload));
        setModalOpen(false);
    };

    const handleDelete = async (id) => {
        await dispatch(asyncDeleteUser(id));
    };

    return (
        <LayoutMainContent>
            <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Administrasi</p>
                        <h1 className="mt-1 font-display text-2xl font-bold text-brand-900 sm:text-3xl">Manajemen User</h1>
                        <p className="mt-2 text-sm text-neutral-500">Atur akun dan status akses pengguna RPAM.</p>
                    </div>
                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    >
                        <IoAddOutline className="text-lg" />
                        Tambah User
                    </button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-brand-100 px-4 py-4 sm:px-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><IoPeopleOutline className="text-xl" /></div>
                        <div>
                            <h2 className="font-display text-base font-bold text-brand-900">Daftar Pengguna</h2>
                            <p className="text-xs text-neutral-500">{users.length} pengguna terdaftar</p>
                        </div>
                    </div>

                    {users.length === 0 ? (
                        <div className="px-6 py-14 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600"><IoPeopleOutline className="text-2xl" /></div>
                            <p className="mt-4 font-semibold text-brand-900">Belum ada pengguna</p>
                            <p className="mt-1 text-sm text-neutral-500">Tambahkan pengguna pertama untuk mulai mengelola akses.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-[760px] w-full text-left text-sm">
                                <thead className="bg-brand-50 text-xs uppercase tracking-wide text-brand-700">
                                    <tr>
                                        <th className="px-4 py-3.5 font-semibold sm:px-6">Username</th>
                                        <th className="px-4 py-3.5 font-semibold">Status</th>
                                        <th className="px-4 py-3.5 font-semibold">Role</th>
                                        <th className="px-4 py-3.5 font-semibold">Dibuat</th>
                                        <th className="px-4 py-3.5 font-semibold">Diperbarui</th>
                                        <th className="px-4 py-3.5 text-right font-semibold sm:px-6">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-100">
                                    {users.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-brand-50/60">
                                            <td className="whitespace-nowrap px-4 py-4 font-semibold text-brand-900 sm:px-6">{item.username}</td>
                                            <td className="px-4 py-4"><StatusBadgeComponent isActive={item.isActive} /></td>
                                            <td className="px-4 py-4 text-neutral-600">{item.role}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-neutral-500">{formatTime(item.createdAt)}</td>
                                            <td className="whitespace-nowrap px-4 py-4 text-neutral-500">{formatTime(item.updatedAt)}</td>
                                            <td className="px-4 py-4 sm:px-6">
                                                <div className="flex justify-end gap-1.5">
                                                    <button type="button" onClick={() => openEditModal(item)} className="rounded-lg p-2 text-brand-700 transition hover:bg-brand-100" aria-label={`Edit ${item.username}`} title="Edit"><IoCreateOutline className="text-lg" /></button>
                                                    <button type="button" onClick={() => handleToggleStatus(item)} className="rounded-lg p-2 text-neutral-600 transition hover:bg-neutral-100" aria-label={`${item.isActive ? "Nonaktifkan" : "Aktifkan"} ${item.username}`} title={item.isActive ? "Nonaktifkan" : "Aktifkan"}><IoPowerOutline className="text-lg" /></button>
                                                    <button type="button" onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-500 transition hover:bg-red-50" aria-label={`Hapus ${item.username}`} title="Hapus"><IoTrashOutline className="text-lg" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
            <UserFormModalComponent open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmitForm} initialData={editingUser} />
        </LayoutMainContent>
    );
}
