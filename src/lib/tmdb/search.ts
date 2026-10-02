import { SearchResult } from "@/types/tmdb";

type SearchResponse = {
  results: SearchResult[];
};

export async function searchTmdb(query: string) {
  const response = await fetch(
    `/api/tmdb/search?q=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to search TMDB");
  }

  const data: SearchResponse = await response.json();

  return data.results;
}
