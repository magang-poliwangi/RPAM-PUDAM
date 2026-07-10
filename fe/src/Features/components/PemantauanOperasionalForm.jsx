import { useState, useEffect } from "react";

const FIELD_LABELS = {
  batasKritis: "Batas Kritis",
  apaYangDimonitor: "Apa yang Dipantau",
  dimana: "Dimana",
  kapan: "Kapan",
  bagaimana: "Bagaimana",
  siapaYangMelakukan: "Pelaksana",
  siapaYangAkanMenganalisisHasilnya: "Analis",
  siapaYangMenerimaHasilAnalisisDanMengambilTindakan: "Penerima Laporan",
  apaTindakanKoreksinya: "Tindakan Koreksi",
  siapaYangMelakukanTindakanKoreksi: "Pelaksana Koreksi",
  seberapaCepat: "Waktu Koreksi",
  siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni:
    "Penerima Laporan Tindakan Koreksi",
};

const EMPTY_FORM = {
  kajiUlangRisikoId: "",
  batasKritis: "",
  apaYangDimonitor: "",
  dimana: "",
  kapan: "",
  bagaimana: "",
  siapaYangMelakukan: "",
  siapaYangAkanMenganalisisHasilnya: "",
  siapaYangMenerimaHasilAnalisisDanMengambilTindakan: "",
  apaTindakanKoreksinya: "",
  siapaYangMelakukanTindakanKoreksi: "",
  seberapaCepat: "",
  siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: "",
};

const textareaFields = [
  "batasKritis",
  "apaYangDimonitor",
  "bagaimana",
  "apaTindakanKoreksinya",
];

function PemantauanOperasionalForm({
  initialValues,
  dropdownOptions = [],
  onSubmit,
  onCancel,
  submitting,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const isEdit = Boolean(initialValues);

  useEffect(() => {
    if (initialValues) {
      setForm({
        kajiUlangRisikoId:
          initialValues.kajiUlangRisikoId ||
          initialValues.kajiUlangRisiko?.id ||
          "",

        batasKritis: initialValues.batasKritis || "",
        apaYangDimonitor: initialValues.apaYangDimonitor || "",
        dimana: initialValues.dimana || "",
        kapan: initialValues.kapan || "",
        bagaimana: initialValues.bagaimana || "",
        siapaYangMelakukan: initialValues.siapaYangMelakukan || "",
        siapaYangAkanMenganalisisHasilnya:
          initialValues.siapaYangAkanMenganalisisHasilnya || "",
        siapaYangMenerimaHasilAnalisisDanMengambilTindakan:
          initialValues.siapaYangMenerimaHasilAnalisisDanMengambilTindakan || "",
        apaTindakanKoreksinya:
          initialValues.apaTindakanKoreksinya || "",
        siapaYangMelakukanTindakanKoreksi:
          initialValues.siapaYangMelakukanTindakanKoreksi || "",
        seberapaCepat: initialValues.seberapaCepat || "",
        siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni:
          initialValues.siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni ||
          "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialValues]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Dropdown */}

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Kaji Ulang Risiko
          <span className="text-red-500"> *</span>
        </label>

        <select
          value={form.kajiUlangRisikoId}
          onChange={handleChange("kajiUlangRisikoId")}
          disabled={isEdit}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none"
        >
          <option value="">-- Pilih Kaji Ulang Risiko --</option>

          {!isEdit &&
            dropdownOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.penilaianRisiko?.identifikasiBahaya?.kodeRisiko}
                {" - "}
                {
                  item.penilaianRisiko?.identifikasiBahaya
                    ?.kejadianBahayaXYZ
                }
              </option>
            ))}

          {isEdit && (
            <option value={form.kajiUlangRisikoId}>
              {
                initialValues?.kajiUlangRisiko?.penilaianRisiko
                  ?.identifikasiBahaya?.kodeRisiko
              }
              {" - "}
              {
                initialValues?.kajiUlangRisiko?.penilaianRisiko
                  ?.identifikasiBahaya?.kejadianBahayaXYZ
              }
            </option>
          )}
        </select>
      </div>

      {/* Semua Field */}

      <div className="grid grid-cols-1 gap-4">

        {Object.entries(FIELD_LABELS).map(([field, label]) => (

          <div key={field}>

            <label className="mb-2 block text-sm font-semibold">
              {label}
              {field !== "batasKritis" && (
                <span className="text-red-500"> *</span>
              )}
            </label>

            {textareaFields.includes(field) ? (

              <textarea
                rows={3}
                value={form[field]}
                onChange={handleChange(field)}
                required={field !== "batasKritis"}
                placeholder={`Masukkan ${label.toLowerCase()}`}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none"
              />

            ) : (

              <input
                type="text"
                value={form[field]}
                onChange={handleChange(field)}
                required
                placeholder={`Masukkan ${label.toLowerCase()}`}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none"
              />

            )}

          </div>

        ))}

      </div>

      {/* Tombol */}

      <div className="flex justify-end gap-3 border-t pt-5">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-gray-200 px-5 py-2 font-medium hover:bg-gray-300"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>

      </div>

    </form>
  );
}

export default PemantauanOperasionalForm;