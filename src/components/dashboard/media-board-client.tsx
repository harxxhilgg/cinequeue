"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useId, useState } from "react";

import { persistMediaBoard, deleteMediaFromCollection } from "@/actions/media";

import { MediaCard } from "./media-card";
import { MediaColumn } from "./media-column";
import { toast } from "../ui/toast";

const columns = [
  { status: "WATCHLIST" as const, title: "Watchlist" },
  { status: "WATCHING" as const, title: "Watching" },
  { status: "UPCOMING" as const, title: "Upcoming" },
  { status: "WATCHED" as const, title: "Watched" },
];

type MediaStatus =
  | "WATCHLIST"
  | "WATCHING"
  | "UPCOMING"
  | "WATCHED";

type UserMediaItem = {
  id: number;
  userId: string;
  mediaId: number;
  status: MediaStatus;
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

const statusLabels: Record<MediaStatus, string> = {
  WATCHLIST: "Watchlist",
  WATCHING: "Watching",
  UPCOMING: "Upcoming",
  WATCHED: "Watched",
};

function normalizePositions(items: UserMediaItem[]) {
  const grouped = new Map<MediaStatus, UserMediaItem[]>();

  for (const column of columns) {
    grouped.set(column.status, []);
  }

  for (const item of items) {
    grouped.get(item.status)?.push(item);
  }

  const normalized: UserMediaItem[] = [];

  for (const column of columns) {
    const columnItems = grouped.get(column.status) ?? [];

    columnItems
      .sort((a, b) => a.position - b.position)
      .forEach((item, index) => {
        normalized.push({
          ...item,
          position: index,
        });
      });
  }

  return normalized;
}

export function MediaBoardClient({
  items: initialItems,
}: MediaBoardClientProps) {
  const dndContextId = useId();

  const [items, setItems] = useState(initialItems);
  const [activeItem, setActiveItem] =
    useState<UserMediaItem | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(initialItems);
  }, [initialItems]);

  async function handleDeleteItem(id: number) {
    const previousItems = items;

    const deletedItem = items.find(
      (item) => item.id === id,
    );

    if (!deletedItem) {
      return false;
    }

    // optimistically remove the item and clean up positions
    const nextItems = normalizePositions(
      items.filter((item) => item.id !== id),
    );

    setItems(nextItems);

    try {
      const resposne = await deleteMediaFromCollection(id);

      if (!resposne.deleted) {
        setItems(previousItems);

        toast.add({
          type: "error",
          title: "Couldn't remove the item.",
          description: "The item could not be removed form your collection",
          timeout: 3000,
        });

        return false;
      }

      toast.add({
        type: "success",
        title: `${deletedItem.media.title} removed.`,
        description: "Removed from your collection.",
        timeout: 1500,
      });

      return true;
    } catch {
      // restore the previous board if the server operation failed
      setItems(previousItems);

      toast.add({
        type: "error",
        title: "Couldn't remove item.",
        description: "Your board was restored. Please try again.",
        timeout: 3000,
      });

      return false;
    };
  };

  function handleDragStart(event: DragStartEvent) {
    const item = items.find(
      (item) => item.id === Number(event.active.id),
    );

    if (item) {
      setActiveItem(item);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveItem(null);

    if (!over) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    const currentActiveItem = items.find(
      (item) => item.id === activeId,
    );

    if (!currentActiveItem) return;

    const previousItems = items;

    let nextItems: UserMediaItem[] | null = null;

    // --------------------------------------------------
    // Dropped on a column itself
    // --------------------------------------------------

    if (Number.isNaN(overId)) {
      const targetStatus = over.id as MediaStatus;

      if (currentActiveItem.status !== targetStatus) {
        const sourceItems = items
          .filter(
            (item) => item.status === currentActiveItem.status,
          )
          .sort((a, b) => a.position - b.position)
          .filter((item) => item.id !== activeId);

        const targetItems = items
          .filter((item) => item.status === targetStatus)
          .sort((a, b) => a.position - b.position);

        const movedItem = {
          ...currentActiveItem,
          status: targetStatus,
        };

        targetItems.push(movedItem);

        nextItems = [
          ...items.filter(
            (item) =>
              item.status !== currentActiveItem.status &&
              item.status !== targetStatus,
          ),
          ...sourceItems.map((item, index) => ({
            ...item,
            position: index,
          })),
          ...targetItems.map((item, index) => ({
            ...item,
            position: index,
          })),
        ];
      }
    }

    // --------------------------------------------------
    // Dropped on another media card
    // --------------------------------------------------

    if (!nextItems) {
      const overItem = items.find(
        (item) => item.id === overId,
      );

      if (!overItem) return;

      // Same column → reorder.
      if (currentActiveItem.status === overItem.status) {
        const columnItems = items
          .filter(
            (item) => item.status === currentActiveItem.status,
          )
          .sort((a, b) => a.position - b.position);

        const oldIndex = columnItems.findIndex(
          (item) => item.id === activeId,
        );

        const newIndex = columnItems.findIndex(
          (item) => item.id === overId,
        );

        if (oldIndex === -1 || newIndex === -1) return;

        if (oldIndex !== newIndex) {
          const reorderedItems = arrayMove(
            columnItems,
            oldIndex,
            newIndex,
          );

          const positionMap = new Map(
            reorderedItems.map((item, index) => [
              item.id,
              index,
            ]),
          );

          nextItems = items.map((item) => {
            const newPosition = positionMap.get(item.id);

            if (newPosition === undefined) {
              return item;
            }

            return {
              ...item,
              position: newPosition,
            };
          });
        }
      }

      // Different column → move into target position.
      if (currentActiveItem.status !== overItem.status) {
        const sourceStatus = currentActiveItem.status;
        const targetStatus = overItem.status;

        const sourceItems = items
          .filter((item) => item.status === sourceStatus)
          .sort((a, b) => a.position - b.position)
          .filter((item) => item.id !== activeId);

        const targetItems = items
          .filter((item) => item.status === targetStatus)
          .sort((a, b) => a.position - b.position);

        const targetIndex = targetItems.findIndex(
          (item) => item.id === overId,
        );

        const movedItem = {
          ...currentActiveItem,
          status: targetStatus,
        };

        targetItems.splice(
          targetIndex === -1
            ? targetItems.length
            : targetIndex,
          0,
          movedItem,
        );

        nextItems = [
          ...items.filter(
            (item) =>
              item.status !== sourceStatus &&
              item.status !== targetStatus,
          ),
          ...sourceItems.map((item, index) => ({
            ...item,
            position: index,
          })),
          ...targetItems.map((item, index) => ({
            ...item,
            position: index,
          })),
        ];
      }
    }

    if (!nextItems) {
      return;
    }

    // Keep all columns' positions clean and sequential.
    nextItems = normalizePositions(nextItems);

    // Find only rows whose status or position actually changed.
    const changes = nextItems
      .filter((nextItem) => {
        const previousItem = previousItems.find(
          (item) => item.id === nextItem.id,
        );

        if (!previousItem) return false;

        return (
          previousItem.status !== nextItem.status ||
          previousItem.position !== nextItem.position
        );
      })
      .map((item) => ({
        id: item.id,
        status: item.status,
        position: item.position,
      }));

    if (changes.length === 0) {
      return;
    }

    // --------------------------------------------------
    // Optimistic UI
    // --------------------------------------------------

    setItems(nextItems);

    const movedToDifferentColumn =
      currentActiveItem.status !==
      nextItems.find((item) => item.id === activeId)?.status;

    // Show the status-change toast immediately.
    if (movedToDifferentColumn) {
      const nextItem = nextItems.find(
        (item) => item.id === activeId,
      );

      if (nextItem) {
        toast.add({
          title: `${currentActiveItem.media.title} moved`,
          description: `${statusLabels[currentActiveItem.status]} → ${statusLabels[nextItem.status]}`,
          timeout: 1500,
        });
      }
    }

    // --------------------------------------------------
    // Persist
    // --------------------------------------------------

    try {
      await persistMediaBoard(changes);
    } catch {
      // Server failed → restore the previous UI state.
      setItems(previousItems);

      toast.add({
        title: "Couldn't save changes",
        description:
          "Your board was restored. Please try again.",
        timeout: 3000,
      });
    }
  }

  function handleDragCancel() {
    setActiveItem(null);
  }

  return (
    <DndContext
      id={dndContextId}
      collisionDetection={closestCenter}
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
              onDelete={handleDeleteItem}
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