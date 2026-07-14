export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  pagination = { total: 0, page: 1, limit: 10, totalPages: 1 },
  onPageChange,
  search = '',
  onSearchChange,
  searchPlaceholder = 'Cari...',
  emptyMessage = 'Data tidak ditemukan',
  actions,
  headerExtra,
}) {
  const { total, page, limit, totalPages } = pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePrev = () => {
    if (page > 1) onPageChange?.(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange?.(page + 1);
  };

  // bikin daftar nomor halaman yang ditampilin (maks 5 tombol biar gak kepanjangan)
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="app-input w-64 pl-9 pr-4"
          />
        </div>
        {headerExtra && <div className="flex items-center gap-2">{headerExtra}</div>}
      </div>

      {/* Table */}
      <div className="app-card">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="app-table-head">
                <th className="w-8 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-app-text-muted">#</th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-app-text-muted"
                  >
                    {col.label}
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-app-text-muted">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 && !loading ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 2 : 1)} className="text-center py-12 text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span>{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={row.id || idx} className="app-table-row">
                    <td className="px-4 py-3 text-xs text-app-text-muted">{startItem + idx}</td>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-app-text">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">{actions(row)}</div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-4 gap-2 text-sm text-gray-400 border-t border-gray-100">
            <svg className="animate-spin w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Memuat data...
          </div>
        )}

        {/* Pagination controls */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between gap-3 flex-wrap px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-app-text-muted">
              Menampilkan {startItem}-{endItem} dari {total} data
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                disabled={page <= 1}
                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-200 text-app-text-muted disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors"
              >
                Sebelumnya
              </button>

              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange?.(p)}
                  className={`min-w-[2rem] px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
                    p === page
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-gray-200 text-app-text-muted hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={handleNext}
                disabled={page >= totalPages}
                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-200 text-app-text-muted disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}