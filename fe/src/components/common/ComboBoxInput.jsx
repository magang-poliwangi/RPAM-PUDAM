import { useState, useRef, useEffect, useCallback } from "react";

/**
 * ComboboxCreatable
 * Input pencarian + dropdown pilihan. Jika data yang diketik belum ada,
 * muncul opsi "+ Tambah ... sebagai data baru" untuk simpan ke tabel master.
 * Tiap opsi juga bisa dihapus langsung dari dropdown lewat ikon tong sampah.
 *
 * Contoh pakai:
 * <ComboboxCreatable
 *   label="Catatan"
 *   value={catatanId}
 *   selectedLabel={catatanLabel}      // label awal saat mode edit
 *   options={catatanOptions}          // hasil pencarian dari parent/hook
 *   loading={isSearching}
 *   onSearch={(q) => searchCatatan(q)}
 *   onSelect={(opt) => setCatatanId(opt?.id ?? null)}
 *   onCreate={async (q) => {
 *     const res = await createCatatan({ nama: q }); // panggil API disini
 *     return res; // wajib return object option baru { id, nama }
 *   }}
 *   onDelete={async (opt) => {
 *     await deleteCatatan(opt.id); // panggil API delete disini
 *   }}
 * />
 */
export default function ComboboxCreatable({
    label,
    name,
    placeholder = "Cari atau tambah data...",
    value,
    selectedLabel = "",
    options = [],
    onSearch,
    onSelect,
    onCreate,
    onDelete,
    confirmDelete = true,
    loading = false,
    disabled = false,
    required = false,
    error,
    minCreateLength = 1,
    getOptionLabel = (opt) => opt.nama ?? opt.label ?? "",
    getOptionValue = (opt) => opt.id ?? opt.value,
    debounceMs = 300,
    emptyText = "Data tidak ditemukan",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(selectedLabel);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const containerRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuery(selectedLabel);
    }, [selectedLabel]);

    // tutup dropdown saat klik di luar komponen
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightIndex(-1);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const triggerSearch = useCallback(
        (q) => {
            if (!onSearch) return;
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => onSearch(q), debounceMs);
        },
        [onSearch, debounceMs]
    );

    function handleInputChange(e) {
        const q = e.target.value;
        setQuery(q);
        setIsOpen(true);
        setHighlightIndex(-1);
        triggerSearch(q);
    }

    function handleFocus() {
        setIsOpen(true);
        if (!options.length) triggerSearch(query);
    }

    function handleSelect(opt) {
        onSelect?.(opt);
        setQuery(getOptionLabel(opt));
        setIsOpen(false);
        setHighlightIndex(-1);
    }

    async function handleCreate() {
        if (!onCreate || creating) return;
        const trimmed = query.trim();
        if (trimmed.length < minCreateLength) return;
        try {
            setCreating(true);
            const newOption = await onCreate(trimmed);
            if (newOption) {
                onSelect?.(newOption);
                setQuery(getOptionLabel(newOption));
            }
            setIsOpen(false);
            setHighlightIndex(-1);
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(e, opt) {
        e.stopPropagation();
        if (!onDelete || deletingId) return;

        const optValue = getOptionValue(opt);
        if (confirmDelete) {
            const ok = window.confirm(`Hapus "${getOptionLabel(opt)}"?`);
            if (!ok) return;
        }

        try {
            setDeletingId(optValue);
            await onDelete(opt);

            // kalau item yang dihapus sedang jadi value terpilih, reset pilihan
            if (optValue === value) {
                onSelect?.(null);
                setQuery("");
            }

            // refresh list biar item yang dihapus langsung hilang dari dropdown
            onSearch?.(query);
        } catch (err) {
            console.error("Gagal menghapus data:", err);
        } finally {
            setDeletingId(null);
        }
    }

    const trimmedQuery = query.trim();
    const hasExactMatch = options.some(
        (opt) => getOptionLabel(opt).toLowerCase() === trimmedQuery.toLowerCase()
    );
    const showCreateOption =
        !!onCreate && trimmedQuery.length >= minCreateLength && !hasExactMatch && !loading;

    const flatList = showCreateOption ? [...options, { __create: true }] : options;

    function handleKeyDown(e) {
        if (!isOpen) {
            if (e.key === "ArrowDown") setIsOpen(true);
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((i) => Math.min(i + 1, flatList.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const item = flatList[highlightIndex];
            if (item?.__create) handleCreate();
            else if (item) handleSelect(item);
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setHighlightIndex(-1);
        }
    }

    return (
        <div ref={containerRef} className="relative w-full">
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}

            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={query}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    className={`w-full rounded-lg border px-3 py-2 pr-9 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40 ${error ? "border-red-400" : "border-gray-300 focus:border-blue-500"
                        } ${disabled ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
                />
                {(loading || creating) && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                    </span>
                )}
            </div>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

            {isOpen && !disabled && (
                <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {options.length === 0 && !showCreateOption && !loading && (
                        <li className="px-3 py-2 text-sm text-gray-400">{emptyText}</li>
                    )}

                    {options.map((opt, idx) => {
                        const optValue = getOptionValue(opt);
                        const isDeletingThis = deletingId === optValue;
                        return (
                            <li
                                key={optValue ?? idx}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => !isDeletingThis && handleSelect(opt)}
                                onMouseEnter={() => setHighlightIndex(idx)}
                                className={`group flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm ${highlightIndex === idx ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                                    } ${optValue === value ? "font-medium" : ""} ${isDeletingThis ? "opacity-50" : ""}`}
                            >
                                <span className="truncate">{getOptionLabel(opt)}</span>

                                {onDelete && (
                                    <button
                                        type="button"
                                        title="Hapus data"
                                        disabled={!!deletingId}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={(e) => handleDelete(e, opt)}
                                        className="shrink-0 rounded p-1 text-gray-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed group-hover:opacity-100 focus:opacity-100"
                                    >
                                        {isDeletingThis ? (
                                            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16zM10 11v6M14 11v6" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </li>
                        );
                    })}

                    {showCreateOption && (
                        <li
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleCreate}
                            onMouseEnter={() => setHighlightIndex(options.length)}
                            className={`cursor-pointer border-t border-gray-100 px-3 py-2 text-sm font-medium ${highlightIndex === options.length ? "bg-blue-50 text-blue-700" : "text-blue-600 hover:bg-blue-50"
                                }`}
                        >
                            + Tambah "{trimmedQuery}" sebagai data baru
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}