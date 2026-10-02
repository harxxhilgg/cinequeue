import { createClient } from "@/lib/supabase/server";
import { getUserMedia } from "@/lib/data/user-media";
import { MediaBoardClient } from "./media-board-client";

export async function MediaBoard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const items = await getUserMedia(user.id);

  return <MediaBoardClient items={items} />;
}