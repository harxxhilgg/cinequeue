"use client";

import { searchTmdb } from "@/lib/tmdb/search";
import { SearchResult } from "@/types/tmdb";
import { useEffect, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

export function useTmdbSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setIsLoading(false);
      setError(null);

      return;
    }

    let cancelled = false;

    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const SearchResults = await searchTmdb(trimmedQuery);

        if (!cancelled) {
          setResults(SearchResults);
        }
      } catch (error) {
        console.error("TMDB search error: ", error);

        if (!cancelled) {
          setResults([]);
          setError("Something went wrong while searching.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  return {
    results,
    isLoading,
    error,
  };
}
