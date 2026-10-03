"use client";

import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import Image from "next/image";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getTmdbImageUrl } from "@/lib/tmdb/image";
import { Spinner } from "../ui/spinner";
import { delay } from "@/lib/utils";

type UserMediaItem = {
  id: number;
  userId: string;
  mediaId: number;
  status:
  | "WATCHLIST"
  | "WATCHING"
  | "UPCOMING"
  | "WATCHED";
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
  onDelete?: (id: number) => Promise<boolean>;
};

export function MediaCard({
  item,
  isDragging = false,
  onDelete,
}: MediaCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.id,
  });

  const posterUrl = getTmdbImageUrl(
    item.media.posterUrl,
    "w185",
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function handleDelete() {
    if (!onDelete || isDeleting) return;

    setIsDeleting(true);
    await delay(1000); // KEEP THIS DELAY

    try {
      await onDelete(item.id); // returns boolean
    } catch (error) {
      console.error("Error deleting item: ", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    };
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`
          group
          relative
          flex cursor-grab items-center gap-3
          rounded-lg border p-2
          transition-colors
          hover:bg-zinc-800/50
          active:cursor-grabbing
          ${isDragging ? "border-orange-500/50 bg-zinc-800 opacity-80" : ""}
        `}
      >
        {!isDragging && onDelete ? (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={`Remove ${item.media.title}`}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="
              absolute -right-2 -top-2 z-10
              size-7
              opacity-0
              transition-opacity duration-150
              group-hover:opacity-100
              bg-red-800!
            "
          >
            <X className="size-4 text-zinc-200" />
          </Button>
        ) : null}

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

        <div className="min-w-0 pr-8">
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

      {/* media item delete confirm alert-dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {item.media.title}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will remove this item from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row gap-3">
            <AlertDialogCancel disabled={isDeleting} className="flex-1 m-0">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
              className="flex-1 m-0"
            >
              {isDeleting ? (
                <Spinner />
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}