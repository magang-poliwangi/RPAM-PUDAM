import { useCallback, useState } from "react";
import InputComponent from "../common/InputComponent";
import SelectField from "../common/SelectField";
import { getPayload } from "../../utils/response";
import { kajiUlangRisikoApi } from "../../api/kaji-ulang-risiko";
import AsyncSelectField from "../common/AsyncSelectField";
import CheckboxField from "../common/CheckboxField";

const PRIORITAS_OPTIONS = [
  { value: 'PENDEK', label: 'Pendek' },
  { value: 'MENENGAH', label: 'Menengah' },
  { value: 'PANJANG', label: 'Panjang' },
];


export default function RencanaPerbaikanFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const loadKajiUlangOptions = useCallback(async (inputValue) => {
    const result = getPayload(
      await kajiUlangRisikoApi.getAll({ search: inputValue, limit: 20, tanpaPemantauanOperasional: 'true' })
    );
    return (result.items || []).map((item) => ({
      value: item.id,
      label: `${item.penilaianRisiko.identifikasiDanKejadianBahaya.kodeRisiko} - ${item.penilaianRisiko.identifikasiDanKejadianBahaya.kejadianBahayaXYZ} - ${item.tindakanPengendalian}`,
    }));
  }, []);


  const handleKajiUlangChange = (e) => {
    setSelectedOption(e.target.selectedOption || null);
    onChange({ ...form, kajiUlangRisikoId: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {mode === 'edit' ? (
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Kaji Ulang Risiko: </span>
          <span className="font-medium text-gray-900">
            {form.kajiUlangRisiko?.penilaianRisiko?.identifikasiDanKejadianBahaya
              ? `${form.kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kodeRisiko} — ${form.kajiUlangRisiko.penilaianRisiko.identifikasiDanKejadianBahaya.kejadianBahayaXYZ} (Tindakan: ${form.kajiUlangRisiko.tindakanPengendalian})`
              : form.kajiUlangRisikoId}
          </span>
        </div>
      ) : (
        <AsyncSelectField
          name="kajiUlangRisikoid"
          label="Data Penilaian Risiko"
          required
          value={selectedOption}
          loadOptions={loadKajiUlangOptions}
          onChange={handleKajiUlangChange}
          placeholder="Ketik kode risiko,kejadian Bahaya(XYZ) atau Tindakan Pengendalian  untuk mencari..."
        />
      )}
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
        name="jadwalPelaksanaan" label="Jadwal Pelaksanaan" required
        value={form.jadwalPelaksanaan || ''}
        onChangeValue={(e) => onChange({ ...form, jadwalPelaksanaan: e.target.value })}
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
      <InputComponent
        name="statusKemajuan" label="Status Kemajuan"
        value={form.statusKemajuan || ''}
        onChangeValue={(e) => onChange({ ...form, statusKemajuan: e.target.value })}
      />
      <SelectField
        name="prioritas"
        label="Prioritas"
        required
        placeholder="-- Prioritas --"
        value={PRIORITAS_OPTIONS.find((opt) => opt.value === form.prioritas) || null}
        onChange={(opt) => onChange({ ...form, prioritas: opt ? opt.value : '' })}
        options={PRIORITAS_OPTIONS}

      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Kendala Sumber Daya</label>
        <div className="grid grid-cols-2 gap-3">
          <CheckboxField
            name="kendalaKeuangan"
            label="Kendala Keuangan"
            checked={form.kendalaKeuangan}
            onChange={(e) => onChange({ ...form, kendalaKeuangan: e.target.checked })}
          />
          <CheckboxField
            name="kendalaTenagaKerja"
            label="Kendala Tenaga Kerja"
            checked={form.kendalaTenagaKerja}
            onChange={(e) => onChange({ ...form, kendalaTenagaKerja: e.target.checked })}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="app-button-secondary">Batal</button>
        <button type="submit" disabled={loading} className="app-button-primary">
          {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
}