"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

import { getTmdbImageUrl } from "@/lib/tmdb/image";

type UserMediaItem = {
  id: number;
  userId: string;
  mediaId: number;
  status: "WATCHLIST" | "WATCHING" | "UPCOMING" | "WATCHED";
  position: number;
  media: {
    id: number;
    title: string;
    posterUrl: string | null;
    mediaType: "MOVIE" | "TV";
  };
};

type MediaCardProps = {
  item: UserMediaItem;
  isDragging?: boolean;
};

export function MediaCard({
  item,
  isDragging = false,
}: MediaCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: item.id,
  });

  const posterUrl = getTmdbImageUrl(
    item.media.posterUrl,
    "w185"
  );

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex cursor-grab items-center gap-3
        rounded-lg border p-2
        transition-colors
        hover:bg-zinc-800/50
        active:cursor-grabbing
        ${isDragging
          ? "border-orange-500/50 bg-zinc-800 opacity-80"
          : ""
        }
      `}
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.media.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No poster
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate font-medium">
          {item.media.title}
        </p>

        <p className="text-xs text-muted-foreground">
          {item.media.mediaType === "MOVIE"
            ? "Movie"
            : "TV Show"}
        </p>
      </div>
    </div>
  );
}