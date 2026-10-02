"use client";

import { AppUser, useAuthStore } from "@/stores/use-auth-store";
import { useEffect } from "react";

type AuthStoreHydratorProps = {
  user: AppUser;
};

export function AuthStoreHydrator({ user }: AuthStoreHydratorProps) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
