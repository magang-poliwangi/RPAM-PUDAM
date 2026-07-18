import { useEffect, useRef, useState } from "react";

export default function useDebouncedSearch(delay = 400) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const timeoutRef = useRef();

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [search, delay]);

  return {
    search,
    debouncedSearch,
    setSearch,
  };
}