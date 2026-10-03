import { db } from "@/prisma/db";

export async function getUserMedia(userId: string) {
  return db.orm.public.UserMedia.where({
    userId,
  })
    .include("media")
    .all();
}

type AddToWatchlistInput = {
  userId: string;
  externalId: string;
  title: string;
  posterUrl: string | null;
  mediaType: "MOVIE" | "TV";
};

export async function addToWatchList({
  userId,
  externalId,
  title,
  posterUrl,
  mediaType,
}: AddToWatchlistInput) {
  // find the canonical Media record using the TMDB ID
  const existingMedia = await db.orm.public.Media.where({
    source: "TMDB",
    externalId,
  }).all();

  let media = existingMedia[0];

  // create the Media record if it doesn't exist yet
  if (!media) {
    media = await db.orm.public.Media.create({
      source: "TMDB",
      externalId,
      title,
      posterUrl,
      mediaType,
    });
  }

  // check whether this user already has this media
  const existingUserMedia = await db.orm.public.UserMedia.where({
    userId,
    mediaId: media.id,
  }).all();

  // do NOT create a duplicate UserMedia record
  if (existingUserMedia.length > 0) {
    return {
      added: false,
      mediaId: media.id,
    };
  }

  // add it to user's watchlist
  await db.orm.public.UserMedia.create({
    userId,
    mediaId: media.id,
    status: "WATCHLIST",
    position: 0,
  });

  return {
    added: true,
    mediaId: media.id,
  };
}

type PersistUserMediaInput = {
  id: number;
  status: "WATCHLIST" | "WATCHING" | "UPCOMING" | "WATCHED";
  position: number;
};

export async function persistUserMediaPositions(
  userId: string,
  changes: PersistUserMediaInput[],
) {
  if (changes.length === 0) {
    return;
  }

  // make sure every row being changed belongs to the authenticated user
  const userMedia = await db.orm.public.UserMedia.where({ userId }).all();

  const userMediaIds = new Set(userMedia.map((item) => item.id));

  const containsAuthorizedIds = changes.some(
    (change) => !userMediaIds.has(change.id),
  );

  if (containsAuthorizedIds) {
    throw new Error("Invalid item name.");
  }

  await db.transaction(async (tx) => {
    for (const change of changes) {
      await tx.orm.public.UserMedia.where({
        id: change.id,
        userId,
      }).update({
        status: change.status,
        position: change.position,
      });
    }
  });
}

export async function deleteUserMedia(userId: string, userMediaId: number) {
  return db.transaction(async (tx) => {
    const deletedItem = await tx.orm.public.UserMedia.where({
      id: userMediaId,
      userId,
    }).delete();

    if (!deletedItem) {
      return {
        deleted: false,
      };
    }

    // Re-number the remaining items in the same column
    const remainingItems = await tx.orm.public.UserMedia.where({
      userId,
      status: deletedItem.status,
    }).all();

    remainingItems.sort((a, b) => a.position - b.position);

    for (const [index, item] of remainingItems.entries()) {
      if (item.position !== index) {
        await tx.orm.public.UserMedia.where({
          id: item.id,
          userId,
        }).update({
          position: index,
        });
      }
    }

    return {
      deleted: true,
    };
  });
}
