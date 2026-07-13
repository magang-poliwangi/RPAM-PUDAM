import { useCallback, useEffect, useRef, useState } from 'react';

export default function usePaginatedFetch(fetchFn, { pageSize = 15 } = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef('');

  const load = useCallback(
    async (pageToLoad, searchValue, reset) => {
      setLoading(true);
      setError(null);
      try {
        const { items: newItems, pagination } = await fetchFn({ page: pageToLoad, pageSize, search: searchValue });
        setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
        setPage(pagination.page);
        setTotal(pagination.total);
      } catch (err) {
        setError(err);
        // Tidak dilempar ulang — cukup disimpan di state supaya UI bisa menampilkannya
        // dan tidak muncul sebagai unhandled promise rejection di console.
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, pageSize]
  );

  useEffect(() => { load(1, '', true); }, [load]);

  const search = useCallback((value) => { searchRef.current = value; load(1, value, true); }, [load]);
  const loadMore = useCallback(() => {
    if (!loading && items.length < total) load(page + 1, searchRef.current, false);
  }, [loading, items.length, total, page, load]);
  const refetch = useCallback(() => load(1, searchRef.current, true), [load]);

  return { items, loading, error, hasMore: items.length < total, search, loadMore, refetch };
}