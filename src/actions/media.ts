"use server";

import { addToWatchList, getUserMedia } from "@/lib/data/user-media";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type AddToWatchlistInput = {
  externalId: string;
  title: string;
  posterUrl: string | null;
  mediaType: "MOVIE" | "TV";
};

export async function addMediaToWatchlist(input: AddToWatchlistInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const response = await addToWatchList({
    userId: user.id,
    externalId: input.externalId,
    title: input.title,
    posterUrl: input.posterUrl,
    mediaType: input.mediaType,
  });

  if (response.added) {
    revalidatePath("/dashboard");
  }

  return response;
}

export async function getCurrentUserMediaIds() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const userMedia = await getUserMedia(user.id);

  return userMedia.map((item) => item.media.externalId);
}

export async function getCurrentUserMedia() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  return getUserMedia(user.id);
}
