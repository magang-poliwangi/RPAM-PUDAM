import InputComponent from "../common/InputComponent";
import RiskLevelBadge from "../common/RiskLevelBadge";
import SelectField from "../common/SelectField";

export default function PenilaianRisikoFormComponent({ form, onChange, onSubmit, onCancel, loading, mode, identifikasiDanKejadianBahaya }) {
    const identifikasiDanKejadianBahayaOptions = (identifikasiDanKejadianBahaya?.items || []).map((item) => ({
        value: item.id,
        label: item.id,
    }));

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
                    value={form.identifikasiDanKejadianBahayaId || ''}
                    onChange={(e) => onChange({ ...form, identifikasiDanKejadianBahayaId: e.target.value })}
                    options={identifikasiDanKejadianBahayaOptions}
                />
            )}
            <InputComponent
                name="peluangKejadianBahaya" label="Peluang (1-5)" type="number" required
                value={form.peluangKejadianBahaya || ''}
                onChangeValue={(e) => onChange({ ...form, peluangKejadianBahaya: Number(e.target.value) })}
            />
            <InputComponent
                name="dampakKeparahan" label="Dampak (1-5)" type="number" required
                value={form.dampakKeparahan || ''}
                onChangeValue={(e) => onChange({ ...form, dampakKeparahan: Number(e.target.value) })}
            />
            {form.skorRisiko != null && (
                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-500">Skor: <strong className="text-gray-900">{form.skorRisiko}</strong></span>
                    <RiskLevelBadge level={form.tingkatRisiko} />
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