import { db } from "@/prisma/db";

export async function getUserMedia(userId: string) {
  return db.orm.public.UserMedia
    .where({
      userId
    })
    .include("media")
    .all();
};

export async function addToWatchList({
  userId,
  mediaId,
}: {
  userId: string,
  mediaId: number,
}) {
  return db.orm.public.UserMedia.create({
    userId,
    mediaId,
    status: "WATCHLIST",
    position: 0,
  });
};