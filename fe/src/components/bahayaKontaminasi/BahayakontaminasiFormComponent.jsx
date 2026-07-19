import InputComponent from "../common/InputComponent";


export default function BahayaKontaminasiFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <InputComponent
                name="kodeRisiko" label="Kode Risiko" required
                value={form.kodeRisiko || ''}
                onChangeValue={(e) => onChange({ ...form, kodeRisiko: e.target.value })}
            />
            <InputComponent
                name="kontaminasiX" label="Kontaminasi atau Sesuatu yang Berpotensi Buruk Terhadap Kualitas Air (X)"
                value={form.kontaminasiX || ''}
                onChangeValue={(e) => onChange({ ...form, kontaminasiX: e.target.value })}
            />
            <InputComponent
                name="tipeBahaya" label="Tipe Bahaya"
                value={form.tipeBahaya || ''}
                onChangeValue={(e) => onChange({ ...form, tipeBahaya: e.target.value })}
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
