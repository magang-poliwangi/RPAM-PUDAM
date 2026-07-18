import { useState, useCallback } from "react";
import AsyncSelectField from "../common/AsyncSelectField";
import InputComponent from "../common/InputComponent";
import { identifikasiDanKejadianBahayaApi } from "../../api/identifikasi-dan-kejadian-bahaya";
import { getPayload } from "../../utils/response";

export default function PenilaianRisikoFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const loadIdentifikasiOptions = useCallback(async (inputValue) => {
    const result = getPayload(
      await identifikasiDanKejadianBahayaApi.getAll({ search: inputValue, limit: 20,tanpaPenilaianRisiko : 'true', })
    );
    return (result.items || []).map((item) => ({
      value: item.id,
      
      label: `${item.lokasiSpam.kodeLokasi} - ${item.kodeRisiko} - ${item.kejadianBahayaXYZ}`,
    }));
  }, []);

  const handleChange = (e) => {
    onChange({ ...form, [e.target.name]: e.target.value });
  };

  const handleIdentifikasiChange = (e) => {
    setSelectedOption(e.target.selectedOption || null);
    onChange({ ...form, identifikasiDanKejadianBahayaId: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {mode === 'edit' ? (
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Identifikasi & Kejadian Bahaya: </span>
          <span className="font-medium text-gray-900">
            {selectedOption?.label || form.identifikasiDanKejadianBahayaId}
          </span>
        </div>
      ) : (
        <AsyncSelectField
          name="identifikasiDanKejadianBahayaId"
          label="Data Identifikasi Dan Kejadian Bahaya"
          required
          value={selectedOption}
          loadOptions={loadIdentifikasiOptions}
          onChange={handleIdentifikasiChange}
          placeholder="Ketik Kode Lokasi, Kode Risiko atau Kejadian Bahaya(XYZ) untuk mencari..."
        />
      )}

      <InputComponent
        label="Peluang Kejadian Bahaya (1-5)"
        name="peluangKejadianBahaya"
        type="number"
        required
        value={form.peluangKejadianBahaya || ""}
        onChangeValue={handleChange}
      />

      <InputComponent
        label="Dampak Keparahan (1-5)"
        name="dampakKeparahan"
        type="number"
        required
        value={form.dampakKeparahan || ""}
        onChangeValue={handleChange}
      />

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="app-button-secondary cursor-pointer">
          Batal
        </button>
        <button type="submit" disabled={loading} className="app-button-primary cursor-pointer">
          {loading ? "Menyimpan..." : mode === "edit" ? "Simpan Perubahan" : "Tambah Data"}
        </button>
      </div>
    </form>
  );
}