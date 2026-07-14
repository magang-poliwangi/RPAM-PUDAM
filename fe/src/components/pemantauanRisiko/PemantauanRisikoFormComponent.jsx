import InputComponent from "../common/InputComponent";

const FORM_FIELDS = [
    {
        name: "kajiUlangRisikoId",
        label: "Kaji Ulang Risiko",
        placeholder: "Masukkan ID Kaji Ulang Risiko",
        required: true,
    },
    {
        name: "batasKritis",
        label: "Batas Kritis",
        placeholder: "Masukkan batas kritis",
        required: false,
    },
    {
        name: "apaYangDimonitor",
        label: "Apa yang Dimonitor",
        placeholder: "Masukkan apa yang dimonitor",
        required: true,
    },
    {
        name: "dimana",
        label: "Dimana",
        placeholder: "Masukkan lokasi",
        required: true,
    },
    {
        name: "kapan",
        label: "Kapan",
        placeholder: "Masukkan waktu pemantauan",
        required: true,
    },
    {
        name: "bagaimana",
        label: "Bagaimana",
        placeholder: "Masukkan cara pemantauan",
        required: true,
    },
    {
        name: "siapaYangMelakukan",
        label: "Siapa yang Melakukan",
        placeholder: "Masukkan penanggung jawab",
        required: true,
    },
    {
        name: "siapaYangAkanMenganalisisHasilnya",
        label: "Siapa yang Akan Menganalisis Hasilnya",
        placeholder: "Masukkan nama",
        required: true,
    },
    {
        name: "siapaYangMenerimaHasilAnalisisDanMengambilTindakan",
        label: "Siapa yang Menerima Hasil Analisis dan Mengambil Tindakan",
        placeholder: "Masukkan nama",
        required: true,
    },
    {
        name: "apaTindakanKoreksinya",
        label: "Apa Tindakan Koreksinya",
        placeholder: "Masukkan tindakan koreksi",
        required: true,
    },
    {
        name: "siapaYangMelakukanTindakanKoreksi",
        label: "Siapa yang Melakukan Tindakan Koreksi",
        placeholder: "Masukkan nama",
        required: true,
    },
    {
        name: "seberapaCepat",
        label: "Seberapa Cepat",
        placeholder: "Masukkan waktu penyelesaian",
        required: true,
    },
    {
        name: "siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni",
        label: "Siapa yang Wajib Menerima Laporan",
        placeholder: "Masukkan nama",
        required: true,
    },
];



export default function PemantauanOperasionalFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
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