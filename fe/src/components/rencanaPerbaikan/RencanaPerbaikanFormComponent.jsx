import InputComponent from "../common/InputComponent";
import SelectField from "../common/SelectField";
const STATUS_OPTIONS = [
  { value: 'BELUM_MULAI', label: 'Belum Mulai' },
  { value: 'SEDANG_BERJALAN', label: 'Sedang Berjalan' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'TERTUNDA', label: 'Tertunda' },
];
const PRIORITAS_OPTIONS = [
  { value: 'PENDEK', label: 'Pendek' },
  { value: 'MENENGAH', label: 'Menengah' },
  { value: 'PANJANG', label: 'Panjang' },
];


export default function RencanaPerbaikanFormComponent({ form, onChange, onSubmit, onCancel, loading, mode, kuOptions }) {
  // const kuSelectOptions = kuOptions.map((ku) => ({
  //   value: ku.id,
  //   label: `${ku.tindakanPengendalian?.slice(0, 50)} (Skor: ${ku.skorSetelah} — ${ku.tingkatRisikoSetelah})`,
  // }));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* <SelectField
        name="kajiUlangRisikoId" label="Kaji Ulang Risiko" required
        value={form.kajiUlangRisikoId || ''}
        onChange={(e) => onChange({ ...form, kajiUlangRisikoId: e.target.value })}
        options={kuSelectOptions}
      /> */}
      <InputComponent
        name="rencanaPerbaikan" label="Rencana Perbaikan" required
        value={form.rencanaPerbaikan || ''}
        onChangeValue={(e) => onChange({ ...form, rencanaPerbaikan: e.target.value })}
      />
      <InputComponent
        name="penanggungJawab" label="Penanggung Jawab" required
        value={form.penanggungJawab || ''}
        onChangeValue={(e) => onChange({ ...form, penanggungJawab: e.target.value })}
      />
      <InputComponent
        name="jadwal" label="Jadwal Pelaksanaan" required
        value={form.jadwal || ''}
        onChangeValue={(e) => onChange({ ...form, jadwal: e.target.value })}
      />
      <InputComponent
        name="sumberPembiayaan" label="Sumber Pembiayaan"
        value={form.sumberPembiayaan || ''}
        onChangeValue={(e) => onChange({ ...form, sumberPembiayaan: e.target.value })}
      />
      <InputComponent
        name="biaya" label="Biaya (Rp)" type="number"
        value={form.biaya || ''}
        onChangeValue={(e) => onChange({ ...form, biaya: Number(e.target.value) })}
      />
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          name="statusKemajuan" label="Status Kemajuan" required placeholder="-- Status --"
          value={form.statusKemajuan || ''}
          onChange={(e) => onChange({ ...form, statusKemajuan: e.target.value })}
          options={STATUS_OPTIONS}
        />
        <SelectField
          name="prioritas" label="Prioritas" required placeholder="-- Prioritas --"
          value={form.prioritas || ''}
          onChange={(e) => onChange({ ...form, prioritas: e.target.value })}
          options={PRIORITAS_OPTIONS}
        />
      </div>
      <InputComponent
        name="kendala" label="Kendala (opsional)" placeholder="Contoh: Keuangan, Tenaga Kerja..."
        value={form.kendala || ''}
        onChangeValue={(e) => onChange({ ...form, kendala: e.target.value })}
      />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="app-button-secondary">Batal</button>
        <button type="submit" disabled={loading} className="app-button-primary">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
}