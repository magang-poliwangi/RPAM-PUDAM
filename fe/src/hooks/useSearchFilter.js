import { useMemo } from 'react';

export default function useSearchFilter(items, search, getSearchableText) {
  return useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => getSearchableText(item)?.toLowerCase().includes(query));
  }, [items, search, getSearchableText]);
}