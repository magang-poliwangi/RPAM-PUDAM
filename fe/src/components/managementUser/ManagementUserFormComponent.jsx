import { useState } from "react";
import InputComponent from "../common/InputComponent";
import { IoLockClosedOutline, IoPersonOutline } from "react-icons/io5";


export default function ManagementUserFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <InputComponent
        leftIcon={IoPersonOutline}
        placeholder='Isi username....'
        name="username" label="Username" required
        value={form.username || ''}
        onChangeValue={(e) => onChange({ ...form, username: e.target.value })}
      />
      <InputComponent name="password" placeholder='Masukkan password' label="Password" type={showPassword ? "text" : "password"} value={form.password} onChangeValue={(e) => onChange({ ...form, password: e.target.value })} required={mode === "add"} leftIcon={IoLockClosedOutline} toggle onChangeToggle={() => setShowPassword((value) => !value)} />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="app-button-secondary cursor-pointer">Batal</button>
        <button type="submit" disabled={loading} className="app-button-primary cursor-pointer">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah User'}
        </button>
      </div>
    </form>
  );
}