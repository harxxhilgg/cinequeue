export type MediaType = "MOVIE" | "TV";

export type SearchResult = {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: MediaType;
};
