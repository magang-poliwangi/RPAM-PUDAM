import { useRef, useCallback } from 'react';

/**
 * Generic data table: search box, sortable headers, infinite scroll.
 * No API calls, no useSelector/useDispatch — parent (feature page) owns all state/handlers.
 *
 * columns: [{ key, header, render?: (row) => node }]
 * items: array of row objects (must each have an `id`)
 * renderActions?: (row) => node — optional trailing actions column (edit/delete buttons, dst)
 */
function DataTable({
  columns,
  items = [],
  searchValue = '',
  onSearchChange,
  sortBy,
  sortOrder = 'desc',
  onSortChange,
  hasMore = false,
  loading = false,
  onLoadMore,
  renderActions,
  emptyMessage = 'Belum ada data',
}) {
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) onLoadMore?.();
  }, [loading, hasMore, onLoadMore]);

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-100 shadow-sm">
      <div className="border-b border-neutral-200 p-3">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Cari..."
          className="w-full max-w-xs rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="max-h-[60vh] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-neutral-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2 font-semibold text-neutral-900">
                  {onSortChange ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(col.key)}
                      className="flex items-center gap-1 hover:text-brand-700"
                    >
                      {col.header}
                      {sortBy === col.key && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  ) : col.header}
                </th>
              ))}
              {renderActions && <th className="px-3 py-2" />}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-3 py-6 text-center text-neutral-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {items.map((row) => (
              <tr key={row.id} className="border-t border-neutral-200 hover:bg-white">
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 align-top text-neutral-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-3 py-2 align-top">{renderActions(row)}</td>
                )}
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-3 py-3 text-center text-neutral-500">
                  Memuat...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;