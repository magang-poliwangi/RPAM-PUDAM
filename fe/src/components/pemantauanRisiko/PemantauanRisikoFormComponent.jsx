import InputComponent from "../common/InputComponent";
import SelectField from "../common/SelectField";

export default function PemantauanOperasionalFormComponent({
    form,
    onChange,
    onSubmit,
    onCancel,
    loading,
    mode,
    kajiUlangRisiko
}) {
    const kajiUlangRisikoOptions = (kajiUlangRisiko?.items || []).map((item) => ({
        value: item.id,
        label: item.id,
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
                    name="penilaianRisikoId" label="Data Identifikasi Dan Kejadian Bahaya" required
                    value={form.penilaianRisikoId || ''}
                    onChange={(e) => onChange({ ...form, penilaianRisikoId: e.target.value })}
                    options={kajiUlangRisikoOptions}
                />
            )}

            <InputComponent
                label="Batas Kritis"
                name="batasKritis"
                placeholder="Masukkan batas kritis"
                value={form.batasKritis || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Apa yang Dimonitor"
                name="apaYangDimonitor"
                placeholder="Masukkan apa yang dimonitor"
                required
                value={form.apaYangDimonitor || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Dimana"
                name="dimana"
                placeholder="Masukkan lokasi"
                required
                value={form.dimana || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Kapan"
                name="kapan"
                placeholder="Masukkan waktu pemantauan"
                required
                value={form.kapan || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Bagaimana"
                name="bagaimana"
                placeholder="Masukkan cara pemantauan"
                required
                value={form.bagaimana || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Siapa yang Melakukan"
                name="siapaYangMelakukan"
                placeholder="Masukkan penanggung jawab"
                required
                value={form.siapaYangMelakukan || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Siapa yang Akan Menganalisis Hasilnya"
                name="siapaYangAkanMenganalisisHasilnya"
                placeholder="Masukkan nama"
                required
                value={form.siapaYangAkanMenganalisisHasilnya || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Siapa yang Menerima Hasil Analisis dan Mengambil Tindakan"
                name="siapaYangMenerimaHasilAnalisisDanMengambilTindakan"
                placeholder="Masukkan nama"
                required
                value={form.siapaYangMenerimaHasilAnalisisDanMengambilTindakan || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Apa Tindakan Koreksinya"
                name="apaTindakanKoreksinya"
                placeholder="Masukkan tindakan koreksi"
                required
                value={form.apaTindakanKoreksinya || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Siapa yang Melakukan Tindakan Koreksi"
                name="siapaYangMelakukanTindakanKoreksi"
                placeholder="Masukkan nama"
                required
                value={form.siapaYangMelakukanTindakanKoreksi || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Seberapa Cepat"
                name="seberapaCepat"
                placeholder="Masukkan waktu penyelesaian"
                required
                value={form.seberapaCepat || ""}
                onChangeValue={handleChange}
            />

            <InputComponent
                label="Siapa yang Wajib Menerima Laporan"
                name="siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni"
                placeholder="Masukkan nama"
                required
                value={form.siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni || ""}
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