"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useId, useState } from "react";
import { MediaCard } from "./media-card";
import { MediaColumn } from "./media-column";

const columns = [
  {
    status: "WATCHLIST" as const,
    title: "Watchlist",
  },
  {
    status: "WATCHING" as const,
    title: "Watching",
  },
  {
    status: "UPCOMING" as const,
    title: "Upcoming",
  },
  {
    status: "WATCHED" as const,
    title: "Watched",
  },
];

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

type MediaBoardClientProps = {
  items: UserMediaItem[];
};

export function MediaBoardClient({
  items: initialItems,
}: MediaBoardClientProps) {
  const dndContextId = useId();

  const [items, setItems] = useState(initialItems);
  const [activeItem, setActiveItem] =
    useState<UserMediaItem | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const item = items.find(
      (item) => item.id === Number(event.active.id)
    );

    if (item) {
      setActiveItem(item);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveItem(null);

    if (!over) {
      return;
    }

    const draggedItemId = Number(active.id);
    const targetStatus = over.id as UserMediaItem["status"];

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === draggedItemId
          ? {
            ...item,
            status: targetStatus,
          }
          : item
      )
    );
  }

  function handleDragCancel() {
    setActiveItem(null);
  }

  return (
    <DndContext
      id={dndContextId}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const columnItems = items
            .filter((item) => item.status === column.status)
            .sort((a, b) => a.position - b.position);

          return (
            <MediaColumn
              key={column.status}
              id={column.status}
              title={column.title}
              items={columnItems}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeItem ? (
          <MediaCard item={activeItem} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}