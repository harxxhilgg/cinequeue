"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { MediaCard } from "./media-card";


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

type MediaColumnProps = {
  id: UserMediaItem["status"];
  title: string;
  items: UserMediaItem[];
  onDelete: (id: number) => Promise<boolean>;
};

export function MediaColumn({
  id,
  title,
  items,
  onDelete
}: MediaColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <section
      className={`
        flex h-full min-h-0 flex-col overflow-hidden rounded-xl
        border bg-zinc-900
        transition-colors duration-200
        ${isOver ? "border-orange-500/50" : ""}
      `}
    >
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-medium">{title}</h2>

        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-3"
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
              Nothing here yet.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <MediaCard key={item.id} item={item} onDelete={onDelete} />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </section>
  );
}