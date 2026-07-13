import { useEffect, useRef, useCallback } from 'react';


export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  search = '',
  onSearchChange,
  searchPlaceholder = 'Cari...',
  emptyMessage = 'Data tidak ditemukan',
  actions,
  headerExtra,
}) {
  const bottomRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore?.();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

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
        {headerExtra && <div className="flex  items-center gap-2">{headerExtra}</div>}
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
                    <td className="px-4 py-3 text-xs text-app-text-muted">{idx + 1}</td>
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

        {/* Infinite scroll trigger */}
        <div ref={bottomRef} className="h-4" />

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

        {!hasMore && data.length > 0 && !loading && (
          <div className="text-center py-3 text-xs text-gray-300 border-t border-gray-100">
            Semua data telah dimuat ({data.length} item)
          </div>
        )}
      </div>
    </div>
  );
}
