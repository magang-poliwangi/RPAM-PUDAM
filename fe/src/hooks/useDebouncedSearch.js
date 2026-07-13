import { useCallback, useEffect, useRef, useState } from 'react';

export default function useDebouncedSearch(onSearch, delay = 400) {
  const [search, setSearch] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => onSearch(value), delay);
    },
    [onSearch, delay]
  );

  return { search, handleSearchChange };
}