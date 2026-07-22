import { useRef, useState } from "react";
import { excelApi } from "../api/excel";
import { downloadFile } from "../utils/download-file";

const ICONS = {
    download: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
    ),
    upload: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12" />
        </svg>
    ),
    check: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    alert: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
    ),
    file: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
};

function formatBytes(bytes) {
    if (bytes === null || bytes === undefined) return "";
    const units = ["B", "KB", "MB"];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export default function ExcelImportExportPage() {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleExport = async () => {
        setExporting(true);
        setErrorMessage(null);
        try {
            const blob = await excelApi.exportExcel();
            downloadFile(blob, "rpam-data.xlsx");
        } catch {
            setErrorMessage("Gagal mengunduh data. Coba lagi beberapa saat lagi.");
        } finally {
            setExporting(false);
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0] ?? null;
        setFile(selected);
        setResult(null);
        setErrorMessage(null);
    };

    const handleImport = async () => {
        if (!file) return;
        setImporting(true);
        setErrorMessage(null);
        setResult(null);
        try {
            const response = await excelApi.importExcel(file);
            setResult(response?.data ?? response);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            setErrorMessage(err?.response?.data?.message || "Import gagal diproses. Periksa kembali file Excel Anda.");
        } finally {
            setImporting(false);
        }
    };

    const totalBaris = result ? Object.values(result.summary ?? {}).reduce((acc, s) => acc + s.total, 0) : 0;
    const totalGagal = result?.errors?.length ?? 0;

    return (
        <div>
            <div className="app-page-header">
                <h1 className="app-page-title">Export &amp; Import Excel</h1>
                <p className="app-page-subtitle">
                    Unduh seluruh data RPAM ke satu file Excel, atau unggah file Excel untuk memperbarui data secara massal.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Export */}
                <section className="app-card p-6">
                    <div className="flex items-start gap-3">
                        <span className="app-icon-button bg-app-primary-soft text-app-primary">{ICONS.download}</span>
                        <div>
                            <h2 className="text-sm font-semibold text-app-text">Export Data</h2>
                            <p className="mt-1 text-sm text-app-text-muted">
                                Mengunduh seluruh data Lokasi SPAM, Bahaya Kontaminasi, dan modul M3.1–M6.2 dalam satu file{" "}
                                <code className="rounded bg-app-surface-muted px-1 py-0.5 text-xs">rpam-data.xlsx</code>.
                            </p>
                        </div>
                    </div>
                    <button type="button" onClick={handleExport} disabled={exporting} className="app-button-primary mt-4">
                        {ICONS.download}
                        {exporting ? "Menyiapkan file..." : "Download Excel"}
                    </button>
                </section>

                {/* Import */}
                <section className="app-card p-6">
                    <div className="flex items-start gap-3">
                        <span className="app-icon-button bg-app-primary-soft text-app-primary">{ICONS.upload}</span>
                        <div>
                            <h2 className="text-sm font-semibold text-app-text">Import Data</h2>
                            <p className="mt-1 text-sm text-app-text-muted">
                                Unggah file Excel dengan format yang sama seperti hasil export. Sheet master data (Lokasi SPAM,
                                Bahaya Kontaminasi) diproses lebih dulu sebelum modul turunan (M3.1–M6.2).
                            </p>
                        </div>
                    </div>

                    <label
                        htmlFor="excel-import-input"
                        className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-app-border p-6 text-center transition-colors hover:border-app-primary hover:bg-app-primary-soft"
                    >
                        <span className="text-app-text-muted">{ICONS.file}</span>
                        {file ? (
                            <span className="text-sm font-medium text-app-text">
                                {file.name} <span className="text-app-text-muted">({formatBytes(file.size)})</span>
                            </span>
                        ) : (
                            <span className="text-sm text-app-text-muted">Klik untuk pilih file .xlsx, maks. 10MB</span>
                        )}
                        <input
                            id="excel-import-input"
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    <button type="button" onClick={handleImport} disabled={!file || importing} className="app-button-primary mt-4">
                        {ICONS.upload}
                        {importing ? "Memproses..." : "Proses Import"}
                    </button>
                </section>
            </div>

            {errorMessage && (
                <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {ICONS.alert}
                    {errorMessage}
                </div>
            )}

            {result && (
                <div className="mt-6 space-y-4">
                    <div
                        className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${totalGagal === 0
                                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                    >
                        {totalGagal === 0 ? ICONS.check : ICONS.alert}
                        {totalGagal === 0
                            ? `Import selesai. ${totalBaris} baris berhasil diproses.`
                            : `Import selesai. ${totalBaris} baris diproses, ${totalGagal} baris gagal — lihat detail di bawah.`}
                    </div>

                    <div className="app-card overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="app-table-head">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-app-text-muted">Sheet</th>
                                    <th className="px-4 py-2 text-right font-medium text-app-text-muted">Total Baris</th>
                                    <th className="px-4 py-2 text-right font-medium text-app-text-muted">Gagal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(result.summary ?? {}).map(([sheetName, s]) => (
                                    <tr key={sheetName} className="app-table-row border-t border-app-border">
                                        <td className="px-4 py-2 text-app-text">{sheetName.trim()}</td>
                                        <td className="px-4 py-2 text-right text-app-text">{s.total}</td>
                                        <td className={`px-4 py-2 text-right ${s.gagal > 0 ? "font-medium text-red-600" : "text-app-text-muted"}`}>
                                            {s.gagal}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {result.errors?.length > 0 && (
                        <div className="app-card overflow-hidden">
                            <div className="border-b border-app-border px-4 py-3">
                                <h3 className="text-sm font-semibold text-app-text">Detail Baris Gagal</h3>
                            </div>
                            <div className="max-h-80 overflow-auto scrollbar-thin">
                                <table className="w-full text-sm">
                                    <thead className="app-table-head sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-app-text-muted">Sheet</th>
                                            <th className="px-4 py-2 text-left font-medium text-app-text-muted">Baris</th>
                                            <th className="px-4 py-2 text-left font-medium text-app-text-muted">Pesan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.errors.map((err, idx) => (
                                            <tr key={`${err.sheet}-${err.baris}-${idx}`} className="app-table-row border-t border-app-border">
                                                <td className="px-4 py-2 text-app-text">{typeof err.sheet === "string" ? err.sheet.trim() : err.sheet}</td>
                                                <td className="px-4 py-2 text-app-text">{err.baris}</td>
                                                <td className="px-4 py-2 text-app-text-muted">{err.pesan}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}