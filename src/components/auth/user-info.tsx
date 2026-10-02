"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import Image from "next/image";

export function UserInfo() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex gap-2 bg-secondary py-2 px-3 rounded-lg select-none">
      <Image
        src={user?.avatarUrl || "/default_user.png"}
        alt="User Image"
        height={25}
        width={25}
        className="rounded-full"
      />

      <p>{user?.name}</p>
    </div>
  );
}
