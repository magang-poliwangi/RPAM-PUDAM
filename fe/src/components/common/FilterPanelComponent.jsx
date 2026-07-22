import { useState } from 'react';
import AsyncSelectField from './AsyncSelectField';
import SelectField from './SelectField';

function FilterIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
        </svg>
    );
}

function ChevronIcon({ open }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
    );
}

export default function FilterPanelComponent({
    lokasiValue,
    onLokasiChange,
    loadLokasiOptions,
    bahayaValue,
    onBahayaChange,
    loadBahayaOptions,
    sortOrder,
    // onSortOrderChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    columnOptions,
    selectedColumns,
    onSelectedColumnsChange,
    onReset,
}) {
    const [open, setOpen] = useState(true);

    const activeCount = [
        lokasiValue,
        bahayaValue,
        sortOrder || null,
        startDate || null,
        endDate || null,
        selectedColumns?.length ? 'cols' : null,
    ].filter(Boolean).length;

    return (
        <div className="app-card mb-4">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full  flex items-center justify-between px-4 py-3 text-left"
            >
                <span className="flex items-center gap-2">
                    <FilterIcon className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-semibold text-gray-800">Filter</span>
                    {activeCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-teal-600 text-white text-[10px] font-semibold">
                            {activeCount}
                        </span>
                    )}
                </span>
                <ChevronIcon open={open} />
            </button>

            {open && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-semibold text-gray-500">Data Lokasi SPAM</label>
                            <AsyncSelectField
                                value={lokasiValue}
                                loadOptions={loadLokasiOptions}
                                onChange={onLokasiChange}
                                placeholder="Ketik kode lokasi..."
                                size="32px"
                            />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-semibold text-gray-500">Data Bahaya Kontaminasi</label>
                            <AsyncSelectField
                                value={bahayaValue}
                                loadOptions={loadBahayaOptions}
                                onChange={onBahayaChange}
                                placeholder="Ketik kode risiko / tipe bahaya..."
                                size="32px"
                            />
                        </div>

                        {/* <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-semibold text-gray-500">Urutan Risiko</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => onSortOrderChange(e.target.value)}
                                className="app-input py-1.5 px-2 text-xs w-full"
                            >
                                <option value="">Bawaan</option>
                                <option value="asc">ASC (A-Z)</option>
                                <option value="desc">DESC (Z-A)</option>
                            </select>
                        </div> */}

                        <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-semibold text-gray-500">Dari Tanggal</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                                className="app-input py-1.5 px-2 text-xs w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-semibold text-gray-500">Sampai Tanggal</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => onEndDateChange(e.target.value)}
                                className="app-input py-1.5 px-2 text-xs w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-semibold text-gray-500">Kolom Tambahan</label>
                            <SelectField
                                isMulti
                                size="sm"
                                options={columnOptions}
                                value={selectedColumns}
                                onChange={(value) => onSelectedColumnsChange(value || [])}
                                placeholder="Pilih kolom..."
                            />
                        </div>
                    </div>

                    {activeCount > 0 && (
                        <div className="flex justify-end mt-3">
                            <button
                                type="button"
                                onClick={onReset}
                                className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}