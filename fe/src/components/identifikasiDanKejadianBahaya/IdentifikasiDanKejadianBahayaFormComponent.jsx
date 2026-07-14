import InputComponent from "../common/InputComponent";

const FORM_FIELDS = [
  {
    name: "lokasiSpamId",
    label: "Lokasi SPAM",
    placeholder: "Pilih lokasi SPAM",
    required: true,
  },
  {
    name: "kodeRisiko",
    label: "Kode Risiko",
    placeholder: "Masukkan kode risiko",
    required: true,
  },
  {
    name: "komponenSpam",
    label: "Komponen SPAM",
    placeholder: "Masukkan komponen SPAM",
    required: true,
  },
  {
    name: "kontaminasiX",
    label: "Kontaminasi (X)",
    placeholder: "Masukkan kontaminasi (X)",
    required: true,
  },
  {
    name: "komponenSpamY",
    label: "Komponen SPAM (Y)",
    placeholder: "Masukkan komponen SPAM (Y)",
    required: true,
  },
  {
    name: "penyebabZ",
    label: "Penyebab (Z)",
    placeholder: "Masukkan penyebab (Z)",
    required: true,
  },
  {
    name: "kejadianBahayaXYZ",
    label: "Kejadian Bahaya (XYZ)",
    placeholder: "Masukkan kejadian bahaya (XYZ)",
    required: true,
  },
  {
    name: "tipeBahaya",
    label: "Tipe Bahaya",
    placeholder: "Masukkan tipe bahaya",
    required: true,
  },
];

export default function IdentifikasiDanKejadianBahayaFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
    const handleChange = (e) => {
        onChange({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">

            {FORM_FIELDS.map((field) => (
                <InputComponent
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={form[field.name] || ""}
                    onChangeValue={handleChange}
                />
            ))}

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