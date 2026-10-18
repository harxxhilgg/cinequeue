"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function deleteAccount() {
  // 1. Verify the authenticated user.
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You must be logged in to delete your account.",
    };
  }

  // 2. Delete all UserMedia rows belonging to this user.
  let deletedCount = 0;

  try {
    deletedCount = await db.transaction(async (tx) => {
      const userMedia = await tx.orm.public.UserMedia.where({
        userId: user.id,
      }).all();

      for (const item of userMedia) {
        await tx.orm.public.UserMedia.where({
          id: item.id,
          userId: user.id,
        }).delete();
      }

      return userMedia.length;
    });

    console.info(`[Account deletion] Deleted ${deletedCount} UserMedia rows.`);
  } catch (error) {
    console.error("[Account deletion] Failed to delete UserMedia:", error);

    return {
      success: false,
      error: "Couldn't delete your collection. Please try again.",
    };
  }

  // 3. Delete the Supabase Auth user.
  const admin = createAdminClient();

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error(
      "[Account deletion] Failed to delete Auth user:",
      deleteError,
    );

    return {
      success: false,
      error:
        "Your collection was deleted, but your account couldn't be deleted. Please try again.",
    };
  }

  // 4. Revalidate and return success.
  revalidatePath("/", "layout");

  return {
    success: true,
    deletedCount,
  };
}
