import { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../components/common/AppLayout';
import DataTable from '../components/common/DataTable';
import { auditLogApi } from '../api/rpamApi';

const PAGE_SIZE = 20;
const AKSI_LABEL = { LOGIN: 'Login', LOGOUT: 'Logout', CREATE: 'Tambah', UPDATE: 'Ubah', DELETE: 'Hapus' };
const AKSI_CLASS = {
  LOGIN: 'bg-blue-100 text-blue-700',
  LOGOUT: 'bg-gray-100 text-gray-600',
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function AuditLogPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', action: '' });
  const [expanded, setExpanded] = useState(null);
  const searchTimeout = useRef(null);

  const fetchData = useCallback(async (page, q, f, reset = false) => {
    setLoading(true);
    try {
      const params = { page, pageSize: PAGE_SIZE, search: q, ...f };
      const res = await auditLogApi.getAll(params);
      const { items: newItems, pagination: pg } = res.data.data;
      setItems((prev) => reset ? newItems : [...prev, ...newItems]);
      setPagination({ page: pg.page, total: pg.total });
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(1, '', filters, true); }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setItems([]); fetchData(1, val, filters, true); }, 400);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setItems([]);
    fetchData(1, search, newFilters, true);
  };

  const hasMore = items.length < pagination.total;
  const handleLoadMore = () => { if (!loading && hasMore) fetchData(pagination.page + 1, search, filters); };

  const columns = [
    { key: 'createdAt', label: 'Waktu', render: (v) => <span className="text-xs text-gray-500 whitespace-nowrap">{v ? new Date(v).toLocaleString('id-ID') : '-'}</span> },
    { key: 'user', label: 'User', render: (v) => <span className="font-medium text-gray-800">{v?.username || '-'}</span> },
    { key: 'aksi', label: 'Aksi', render: (v) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${AKSI_CLASS[v] || 'bg-gray-100 text-gray-500'}`}>{AKSI_LABEL[v] || v}</span> },
    { key: 'module', label: 'Modul', render: (v) => <span className="text-xs font-mono text-gray-600">{v || '-'}</span> },
    { key: 'keterangan', label: 'Keterangan', render: (v) => <span className="text-xs text-gray-500">{v || '-'}</span> },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-sm text-gray-500 mt-0.5">Riwayat aktivitas seluruh pengguna</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Dari Tanggal</label>
          <input type="date" value={filters.dateFrom}
            onChange={(e) => handleFilter({ ...filters, dateFrom: e.target.value })}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sampai Tanggal</label>
          <input type="date" value={filters.dateTo}
            onChange={(e) => handleFilter({ ...filters, dateTo: e.target.value })}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Jenis Aksi</label>
          <select value={filters.action}
            onChange={(e) => handleFilter({ ...filters, action: e.target.value })}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors">
            <option value="">Semua Aksi</option>
            {Object.entries(AKSI_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={() => { const f = { dateFrom: '', dateTo: '', action: '' }; handleFilter(f); setFilters(f); }}
            className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Reset Filter
          </button>
        </div>
      </div>

      <DataTable
        columns={columns} data={items} loading={loading} hasMore={hasMore} onLoadMore={handleLoadMore}
        search={search} onSearchChange={handleSearchChange} searchPlaceholder="Cari user atau modul..." emptyMessage="Tidak ada log aktivitas"
        actions={(row) => (
          (row.oldValue || row.newValue) ? (
            <button
              onClick={() => setExpanded(expanded === row.id ? null : row.id)}
              className="p-1.5 text-gray-400 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors" title="Lihat detail"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expanded === row.id ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
            </button>
          ) : null
        )}
      />

      {/* Expanded detail */}
      {expanded && (() => {
        const row = items.find((i) => i.id === expanded);
        if (!row) return null;
        return (
          <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Detail Perubahan</h3>
            <div className="grid grid-cols-2 gap-4">
              {row.oldValue && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Sebelum</p>
                  <pre className="text-xs bg-red-50 text-red-700 p-3 rounded-lg overflow-auto max-h-40 scrollbar-thin">{JSON.stringify(row.oldValue, null, 2)}</pre>
                </div>
              )}
              {row.newValue && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Sesudah</p>
                  <pre className="text-xs bg-green-50 text-green-700 p-3 rounded-lg overflow-auto max-h-40 scrollbar-thin">{JSON.stringify(row.newValue, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </AppLayout>
  );
}
