"use client";

import { useTmdbSearch } from "@/hooks/use-tmdb-search";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { getTmdbImageUrl } from "@/lib/tmdb/image";
import Image from "next/image";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Check, Plus } from "lucide-react";
import {
  addMediaToWatchlist,
  getCurrentUserMediaIds,
} from "@/actions/media";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";

export function MediaSearch() {
  const router = useRouter();

  const [query, setQuery] = useState<string>("");
  const { results, isLoading, error } = useTmdbSearch(query);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [userMediaIds, setUserMediaIds] = useState<Set<string> | null>(null);

  // click outside the dropdown area should hide the dropdown
  const searchRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (isOpen && (isLoading || results.length > 0 || error)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDropdownVisible(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isOpen, isLoading, results.length, error]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // load user media items
  useEffect(() => {
    async function loadUserMedia() {
      try {
        const mediaIds = await getCurrentUserMediaIds();

        setUserMediaIds(new Set(mediaIds));
      } catch (error) {
        console.error("Failed to load user media: ", error);
        setUserMediaIds(new Set());
      }
    }

    loadUserMedia();
  }, []);

  async function handleAddToWatchlist(
    result: (typeof results)[number]
  ) {
    try {
      setAddingId(result.id);

      const response = await addMediaToWatchlist({
        externalId: result.id.toString(),
        title: result.title,
        posterUrl: result.posterPath,
        mediaType: result.mediaType,
      });

      if (response.added) {
        toast.add({
          type: "success",
          title: "Added to watchlist",
          description: `${result.title} was added to your watchlist.`,
        });

        router.refresh();
      } else {
        toast.add({
          type: "info",
          title: "Already added",
          description: `${result.title} is already in your collection.`,
        });
      }

      setUserMediaIds((current) => {
        const next = new Set(current ?? []);
        next.add(result.id.toString());

        return next;
      });
    } catch (error) {
      console.error("Failed to add media: ", error);

      toast.add({
        type: "error",
        title: "Failed to add this item to your wishlist.",
      });
    } finally {
      setAddingId(null);
    }
  }

  return (
    <>
      {/* Background dimmer */}
      {isDropdownVisible && (
        <div
          className={`
            fixed inset-0 z-40 bg-black/40 backdrop-blur-xs
            transition-all duration-300 ease-out
            ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
          `}
        />
      )}

      <div
        ref={searchRef}
        className="relative z-50 w-full max-w-3xl"
      >
        <Input
          value={query}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search movie, TV show or anime..."
          className="relative z-50 h-auto rounded-none border-x-0 border-t-0 border-b-2 border-b-muted-foreground/50 bg-transparent! px-1 py-2 text-3xl! font-light shadow-none placeholder:text-muted-foreground focus-visible:border-b-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0 font-monst"
        />

        {error && (
          <p className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {isDropdownVisible && (
          <div
            className={`
              absolute left-0 top-full z-50 mt-2 w-full
              overflow-hidden rounded-lg border
              bg-zinc-800
              shadow-lg
              transition-all duration-200 ease-out
              ${isOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-1 opacity-0"
              }
            `}
          >
            {isLoading ? (
              <div className="flex h-20 items-center justify-center">
                <Spinner className="size-7" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-sm text-destructive">
                {error}
              </div>
            ) : (
              results.map((result) => {
                const posterUrl = getTmdbImageUrl(
                  result.posterPath,
                  "w92"
                );

                const isAdding = addingId === result.id;

                const isAlreadyAdded =
                  userMediaIds?.has(result.id.toString()) ?? false;

                return (
                  <div
                    key={`${result.mediaType}-${result.id}`}
                    className="flex items-center gap-3 border-b p-3 last:border-b-0 hover:bg-zinc-900/20"
                  >
                    <div className="size-12 shrink-0 overflow-hidden rounded bg-muted">
                      {posterUrl && (
                        <Image
                          src={posterUrl}
                          alt={result.title}
                          width={40}
                          height={40}
                          className="size-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {result.title}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {result.mediaType === "MOVIE"
                          ? "Movie"
                          : "TV Show"}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      disabled={
                        isAdding ||
                        userMediaIds === null ||
                        isAlreadyAdded
                      }
                      onClick={() => handleAddToWatchlist(result)}
                      className="hover:bg-transparent! hover:text-orange-500"
                    >
                      {isAdding ? (
                        <Spinner
                          className="size-6"
                          strokeWidth={1}
                        />
                      ) : isAlreadyAdded ? (
                        <Check
                          className="size-6"
                          strokeWidth={1}
                        />
                      ) : (
                        <Plus
                          className="size-6"
                          strokeWidth={1}
                        />
                      )}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}