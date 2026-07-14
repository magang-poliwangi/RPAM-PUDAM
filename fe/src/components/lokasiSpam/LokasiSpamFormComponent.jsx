import InputComponent from "../common/InputComponent";


export default function lokasiSpamFormComponent({ form, onChange, onSubmit, onCancel, loading, mode }) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <InputComponent
                name="kodeLokasi" label="Kode Lokasi" required
                value={form.kodeLokasi || ''}
                onChangeValue={(e) => onChange({ ...form, kodeLokasi: e.target.value })}
            />
            <InputComponent
                name="namaLokasi" label="Nama Lokasi(opsional)"
                value={form.namaLokasi || ''}
                onChangeValue={(e) => onChange({ ...form, namaLokasi: e.target.value })}
            />
            <InputComponent
                name="simbol" label="Simbol(opsional)"
                value={form.simbol || ''}
                onChangeValue={(e) => onChange({ ...form, simbol: e.target.value })}
            />
            <InputComponent
                name="deskripsi" label="Deskripsi(opsional)" 
                value={form.deskripsi || ''}
                onChangeValue={(e) => onChange({ ...form, deskripsi: e.target.value })}
            />
            <InputComponent
                name="penanggungJawabNama" label="Penanggung Jawab Nama(opsional)" 
                value={form.penanggungJawabNama || ''}
                onChangeValue={(e) => onChange({ ...form, penanggungJawabNama: e.target.value })}
            />
            <InputComponent
                name="penanggungJawabPosisi" label="Penanggung Jawab Posisi(opsional)" 
                value={form.penanggungJawabPosisi || ''}
                onChangeValue={(e) => onChange({ ...form, penanggungJawabPosisi: e.target.value })}
            />

            <InputComponent
                name="penanggungJawabTelepon" label="Penanggung Jawab Telepon(opsional)" 
                value={form.penanggungJawabTelepon || ''}
                onChangeValue={(e) => onChange({ ...form, penanggungJawabTelepon: e.target.value })}
            />

            <InputComponent
                name="penanggungJawabEmail" label="Penanggung Jawab Email(opsional) " 
                value={form.penanggungJawabEmail || ''}
                onChangeValue={(e) => onChange({ ...form, penanggungJawabEmail: e.target.value })}
            />

            <InputComponent
                name="referensi" label="Referensi(opsional)" 
                value={form.referensi || ''}
                onChangeValue={(e) => onChange({ ...form, referensi: e.target.value })}
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
