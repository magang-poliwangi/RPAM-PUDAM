import InputComponent from "../common/InputComponent";
import RiskLevelBadge from "../common/RiskLevelBadge";
import SelectField from "../common/SelectField";

const VALIDASI_OPTIONS = [
  { value: 'EFEKTIF', label: 'Efektif' },
  { value: 'TIDAK_EFEKTIF', label: 'Tidak Efektif' },
  { value: 'TIDAK_PASTI', label: 'Tidak Pasti' },
];
export default function KajiUlangRisikoFormComponent({ form, onChange, onSubmit, onCancel, loading, mode, penilaianRisiko, usedPenilaianRisikoIds = [] }) {
  const penilaianRisikoOptions = (penilaianRisiko?.items || [])
    .filter(item => mode === 'edit' || !usedPenilaianRisikoIds.includes(item.id))
    .map((item) => {
      const identifikasi = item.identifikasiDanKejadianBahaya;
      const labelText = identifikasi 
        ? `${identifikasi.kodeRisiko} — ${identifikasi.kejadianBahayaXYZ} (Skor: ${item.skorRisiko} [${item.tingkatRisiko}])`
        : `ID: ${item.id} — Skor: ${item.skorRisiko}`;
      return {
        value: item.id,
        label: labelText,
      };
    });
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {mode === 'edit' ? (
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Penilaian Risiko: </span>
          <span className="font-medium text-gray-900">
            {form.penilaianRisiko?.identifikasiDanKejadianBahaya
              ? `${form.penilaianRisiko.identifikasiDanKejadianBahaya.kodeRisiko} — ${form.penilaianRisiko.identifikasiDanKejadianBahaya.kejadianBahayaXYZ} (Skor: ${form.penilaianRisiko.skorRisiko} [${form.penilaianRisiko.tingkatRisiko}])`
              : form.penilaianRisikoId}
          </span>
        </div>
      ) : (
        <SelectField
          name="penilaianRisikoId" label="Penilaian Risiko" required
          value={form.penilaianRisikoId || ''}
          onChange={(e) => onChange({ ...form, penilaianRisikoId: e.target.value })}
          options={penilaianRisikoOptions}
        />
      )}
      <InputComponent
        name="tindakanPengendalian" label="Tindakan Pengendalian" required
        value={form.tindakanPengendalian || ''}
        onChangeValue={(e) => onChange({ ...form, tindakanPengendalian: e.target.value })}
      />
      <InputComponent
        name="referensi" label="Referensi"
        value={form.referensi || ''}
        onChangeValue={(e) => onChange({ ...form, referensi: e.target.value })}
      />
      <SelectField
        name="validasi" label="Validasi" required
        value={form.validasi || ''}
        onChange={(e) => onChange({ ...form, validasi: e.target.value })}
        options={VALIDASI_OPTIONS}
      />
      <InputComponent
        name="peluangSetelah" label="Peluang Setelah Pengendalian (1-5)" type="number" required
        value={form.peluangSetelah || ''}
        onChangeValue={(e) => onChange({ ...form, peluangSetelah: Number(e.target.value) })}
      />
      <InputComponent
        name="dampakSetelah" label="Dampak Setelah Pengendalian (1-5)" type="number" required
        value={form.dampakSetelah || ''}
        onChangeValue={(e) => onChange({ ...form, dampakSetelah: Number(e.target.value) })}
      />
      {form.skorSetelah != null && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Skor Setelah: <strong className="text-gray-900">{form.skorSetelah}</strong></span>
          <RiskLevelBadge level={form.tingkatRisikoSetelah} />
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="app-button-secondary">Batal</button>
        <button type="submit" disabled={loading} className="app-button-primary">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
}
