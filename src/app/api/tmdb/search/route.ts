import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import tmdb from "@/lib/tmdb/client";
import { redis } from "@/lib/redis/client";

type SearchResult = {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: "MOVIE" | "TV";
};

type SearchResponse = {
  results: SearchResult[];
};

const CACHE_TTL = 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 },
    );
  }

  const normalizedQuery = query.toLowerCase();
  const cacheKey = `tmdb:search:${normalizedQuery}`;

  try {
    const cached = await redis.get<SearchResponse>(cacheKey);

    if (cached) {
      // console.log(`Redis cache HIT: ${cacheKey}`);
      return NextResponse.json(cached);
    }

    // console.log(`Redis cache MISS: ${cacheKey}`);

    const { data } = await tmdb.get("/search/multi", {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page: 1,
      },
    });

    const results: SearchResult[] = data.results
      .filter(
        (item: {
          media_type: string;
          id: number;
          title?: string;
          name?: string;
          poster_path?: string | null;
        }) => item.media_type === "movie" || item.media_type === "tv",
      )
      .slice(0, 5)
      .map(
        (item: {
          media_type: string;
          id: number;
          title?: string;
          name?: string;
          poster_path?: string | null;
        }) => ({
          id: item.id,
          title: item.title ?? item.name ?? "",
          posterPath: item.poster_path ?? null,
          mediaType: item.media_type === "movie" ? "MOVIE" : "TV",
        }),
      );

    const response: SearchResponse = {
      results,
    };

    await redis.set(cacheKey, response, {
      ex: CACHE_TTL,
    });

    // console.log(`Redis cache SET: ${cacheKey}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error("TMDB search error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: "TMDB search failed",
          details: error.response?.data ?? null,
        },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    return NextResponse.json({ error: "TMDB search failed" }, { status: 500 });
  }
}
