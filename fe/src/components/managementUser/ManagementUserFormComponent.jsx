import InputComponent from "../common/InputComponent";


export default function ManagementUserFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
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