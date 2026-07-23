import { useCallback, useState } from "react";
import InputComponent from "../common/InputComponent";
import { getPayload } from "../../utils/response";
import AsyncSelectField from "../common/AsyncSelectField";
import { lokasiSpamApi } from "../../api/lokasi-spam";
import { bahayakontaminasiApi } from "../../api/bahaya-kontaminasi";
import { generateKejadianBahaya } from "../../utils/generate-kejadian-bahaya-xyz";

export default function IdentifikasiDanKejadianBahayaFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
  const [selected, setSelected] = useState({
    lokasi: null,
    bahaya: null
  });

  const [isXYZEdited, setIsXYZEdited] = useState(false);
  const loadLokasiSpamOptions = useCallback(async (inputValue) => {
    const result = getPayload(await lokasiSpamApi.getAll({ search: inputValue, limit: 20 }));
    return (result.items || []).map((item) => ({
      value: item.id,
      label: `${item.kodeLokasi} - ${item.namaLokasi ?? '-'}`,
      raw: item,
    }));
  }, []);

  const loadBahayaKontaminasiOptions = useCallback(async (inputValue) => {
    const result = getPayload(await bahayakontaminasiApi.getAll({ search: inputValue, limit: 20 }));
    return (result.items || []).map((item) => ({
      value: item.id,
      label: `${item.kodeRisiko} - ${item.tipeBahaya} - ${item.kontaminasiX}`,
      raw: item,
    }));
  }, []);

  const handleChange = (e) => {
    const newForm = {
      ...form,
      [e.target.name]: e.target.value,
    };

    if (
      (e.target.name === "komponenSpamY" ||
        e.target.name === "penyebabZ") &&
      !isXYZEdited
    ) {
      newForm.kejadianBahayaXYZ = generateKejadianBahaya(
        selected.bahaya?.raw?.kontaminasiX,
        newForm.komponenSpamY,
        newForm.penyebabZ
      );
    }

    onChange(newForm);
  };

  const handleXYZChange = (e) => {
    setIsXYZEdited(true);

    onChange({
      ...form,
      kejadianBahayaXYZ: e.target.value,
    });
  };
  const handleLokasiSpamChange = (e) => {
    const option = e.target.selectedOption || null;

    setSelected((prev) => ({
      ...prev,
      lokasi: option,
    }));

    onChange({
      ...form,
      lokasiSpamId: e.target.value,
    });
  };

  const handleBahayaKontaminasiChange = (e) => {
    const option = e.target.selectedOption || null;

    setSelected((prev) => ({
      ...prev,
      bahaya: option,
    }));

    onChange({
      ...form,
      bahayaKontaminasiId: e.target.value,
      kejadianBahayaXYZ: generateKejadianBahaya(
        option?.raw?.kontaminasiX,
        form.komponenSpamY,
        form.penyebabZ
      ),
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">

      {mode === 'edit' ? (
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">Penilaian Risiko: </span>
          <span className="font-medium text-gray-900">
            {form.penilaianRisiko
              ? `Skor ${form.penilaianRisiko.skorRisiko} — ${form.penilaianRisiko.tingkatRisiko}`
              : form.penilaianRisikoId}
          </span>
        </div>
      ) : (
        <>
          <AsyncSelectField
            name="lokasiSpamId"
            label="Data Lokasi SPAM"
            required
            value={selected.lokasi}
            loadOptions={loadLokasiSpamOptions}
            onChange={handleLokasiSpamChange}
            placeholder="Ketik kode lokasi atau nama lokasi untuk mencari..."
          />
          <AsyncSelectField
            name="bahayaKontaminasiId"
            label="Data Bahaya Kontaminasi"
            required
            value={selected.bahaya}
            loadOptions={loadBahayaKontaminasiOptions}
            onChange={handleBahayaKontaminasiChange}
            placeholder="Ketik kode risiko atau tipe bahaya untuk mencari..."
          />

          {selected.bahaya?.raw && (
            <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm flex flex-col gap-0.5">
              <span><span className="text-gray-500">Tipe Bahaya: </span><span className="font-medium text-gray-900">{selected.bahaya.raw.tipeBahaya}</span></span>
              <span><span className="text-gray-500">Kontaminasi (X): </span><span className="font-medium text-gray-900">{selected.bahaya.raw.kontaminasiX}</span></span>
            </div>
          )}
        </>
      )}

      {mode === 'edit' && (
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm flex flex-col gap-0.5">
          <span><span className="text-gray-500">Kode Risiko: </span><span className="font-medium text-gray-900">{form.kodeRisiko}</span></span>
          <span><span className="text-gray-500">Kode Lokasi: </span><span className="font-medium text-gray-900">{form.kodeLokasi}</span></span>
        </div>
      )}

      <InputComponent
        label="Komponen SPAM"
        name="komponenSpam"
        placeholder="Masukkan komponen SPAM"
        required
        value={form.komponenSpam || ""}
        onChangeValue={handleChange}
      />

      <InputComponent
        label="Komponen SPAM (Y)"
        name="komponenSpamY"
        placeholder="Masukkan komponen SPAM (Y)"
        required
        value={form.komponenSpamY || ""}
        onChangeValue={handleChange}
      />

      <InputComponent
        label="Penyebab (Z)"
        name="penyebabZ"
        placeholder="Masukkan penyebab (Z)"
        required
        value={form.penyebabZ || ""}
        onChangeValue={handleChange}
      />

      <InputComponent
        label="Kejadian Bahaya (XYZ)"
        name="kejadianBahayaXYZ"
        value={form.kejadianBahayaXYZ || ""}
        onChangeValue={handleXYZChange}
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