import { useState } from "react";
import { IoLockClosedOutline, IoPersonOutline } from "react-icons/io5";
import ModalComponent from "./common/ModalComponent";
import InputComponent from "./common/InputComponent";

export default function UserFormModalComponent({ open, onClose, onSubmit, initialData }) {
    return (
        <ModalComponent open={open} onClose={onClose} title={initialData ? "Edit User" : "Tambah User"}>
            {open && (
                <UserForm
                    key={initialData?.id ?? "new-user"}
                    onClose={onClose}
                    onSubmit={onSubmit}
                    initialData={initialData}
                />
            )}
        </ModalComponent>
    );
}

function UserForm({ onClose, onSubmit, initialData }) {
    const isEdit = Boolean(initialData);
    const [form, setForm] = useState(() => ({ username: initialData?.username || "", password: "" }));
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (key) => (event) => {
        setForm((previous) => ({ ...previous, [key]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { username: form.username.trim() };
        if (form.password) payload.password = form.password;

        try {
            setIsSubmitting(true);
            await onSubmit(payload, initialData?.id);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="-mt-1 text-sm leading-6 text-neutral-500">
                {isEdit ? "Perbarui informasi akun pengguna." : "Buat akun baru untuk mengakses sistem RPAM."}
            </p>
            <InputComponent
                name="username"
                label="Username"
                placeholder="Masukkan username"
                value={form.username}
                onChangeValue={handleChange("username")}
                leftIcon={IoPersonOutline}
                required
            />
            <InputComponent
                name="password"
                label={isEdit ? "Password baru (opsional)" : "Password"}
                type={showPassword ? "text" : "password"}
                placeholder={isEdit ? "Kosongkan bila tidak diubah" : "Masukkan password"}
                value={form.password}
                onChangeValue={handleChange("password")}
                leftIcon={IoLockClosedOutline}
                toggle
                onChangeToggle={() => setShowPassword((previous) => !previous)}
                required={!isEdit}
            />
            <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="rounded-lg border border-brand-100 px-4 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
                >
                    {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah User"}
                </button>
            </div>
        </form>
    );
}
