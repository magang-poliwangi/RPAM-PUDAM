import InputComponent from "../common/InputComponent";
import SelectField from "../common/SelectField";

export default function IdentifikasiDanKejadianBahayaFormComponent({ form, lokasiSpam, onChange, onSubmit, onCancel, loading, mode }) {

  
  const lokasiSpamOptions = (lokasiSpam?.items || []).map((item) => ({
    value: item.id,
    label: item.namaLokasi,
  }));

  const handleChange = (e) => {
    onChange({
      ...form,
      [e.target.name]: e.target.value,
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
          <SelectField
          name="lokasiSpamId" label="Lokasi SPAM" required
          value={form.lokasiSpamId || ''}
          onChange={(e) => onChange({ ...form, lokasiSpamId: e.target.value })}
          options={lokasiSpamOptions}
        />
      )}

      <InputComponent
        label="Kode Risiko"
        name="kodeRisiko"
        placeholder="Masukkan kode risiko"
        required
        value={form.kodeRisiko || ""}
        onChangeValue={handleChange}
      />

      <InputComponent
        label="Komponen SPAM"
        name="komponenSpam"
        placeholder="Masukkan komponen SPAM"
        required
        value={form.komponenSpam || ""}
        onChangeValue={handleChange}
      />

      <InputComponent
        label="Kontaminasi (X)"
        name="kontaminasiX"
        placeholder="Masukkan kontaminasi (X)"
        required
        value={form.kontaminasiX || ""}
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
        placeholder="Masukkan kejadian bahaya (XYZ)"
        required
        value={form.kejadianBahayaXYZ || ""}
        onChangeValue={handleChange}
      />

      <InputComponent
        label="Tipe Bahaya"
        name="tipeBahaya"
        placeholder="Masukkan tipe bahaya"
        required
        value={form.tipeBahaya || ""}
        onChangeValue={handleChange}
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="app-button-secondary cursor-pointer"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="app-button-primary cursor-pointer"
        >
          {loading
            ? "Menyimpan..."
            : mode === "edit"
              ? "Simpan Perubahan"
              : "Tambah Data"}
        </button>
      </div>

    </form>
  );
}