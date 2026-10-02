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
