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
  actionsWidth,
  headerExtra,
}) {
  const { total, page, limit, totalPages } = pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const leafColumns = columns.flatMap((col) => (col.children ? col.children : [col]));
  const hasGroups = columns.some((col) => col.children);
  const totalColSpan = 1 + leafColumns.length + (actions ? 1 : 0);

  const handlePrev = () => {
    if (page > 1) onPageChange?.(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange?.(page + 1);
  };

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
        {headerExtra && <div className="flex items-center justify-end gap-2 flex-wrap flex-1">{headerExtra}</div>}
      </div>

      {/* Table */}
      <div className="app-card">
        <div className="overflow-auto scrollbar-thin" style={{ maxHeight: '73vh' }}>
          <table className="w-full text-sm">
            {/* colgroup nentuin lebar per kolom fisik, gak kebentur grouped header */}
            <colgroup>
              <col style={{ width: '2rem' }} />
              {leafColumns.map((col) => (
                <col key={col.key} style={col.width ? { width: col.width } : undefined} />
              ))}
              {actions && <col style={actionsWidth ? { width: actionsWidth } : undefined} />}
            </colgroup>

            <thead>
              {/* Baris header pertama */}
              <tr className="app-table-head h-11 sticky top-0 z-20">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-app-text-muted sticky top-0 bg-inherit"
                    rowSpan={hasGroups ? 2 : 1}>
                  #
                </th>
                {columns.map((col) =>
                  col.children ? (
                    <th
                      key={col.label}
                      colSpan={col.children.length}
                      className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-app-text-muted sticky top-0 bg-inherit border-b border-gray-100"
                    >
                      {col.label}
                    </th>
                  ) : (
                    <th
                      key={col.key}
                      rowSpan={hasGroups ? 2 : 1}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-app-text-muted sticky top-0 bg-inherit"
                    >
                      {col.label}
                    </th>
                  )
                )}
                {actions && (
                  <th
                    rowSpan={hasGroups ? 2 : 1}
                    className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-app-text-muted sticky top-0 bg-inherit"
                  >
                    Aksi
                  </th>
                )}
              </tr>

              {/* Baris header kedua — cuma muncul kalau ada grup */}
              {hasGroups && (
                <tr className="app-table-head h-11 sticky top-11 z-20">
                  {columns.map((col) =>
                    col.children
                      ? col.children.map((child) => (
                          <th
                            key={child.key}
                            className="whitespace-nowrap px-4 py-2 text-center text-xs font-medium text-app-text-muted sticky top-11 bg-inherit border-t border-gray-100"
                          >
                            {child.label}
                          </th>
                        ))
                      : null
                  )}
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 && !loading ? (
                <tr>
                  <td colSpan={totalColSpan} className="text-center py-12 text-gray-400 text-sm">
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
                    {leafColumns.map((col) => (
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