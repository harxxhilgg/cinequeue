"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import { DiscordLogoIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

export function DiscordLoginBtn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDiscordLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // Note: If successful, signInWithOAuth redirects the window,
      // so code here may not execute before the browser navigates away.
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occured.";

      toast.add({
        type: "error",
        title: "Login failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      variant="default"
      disabled={isLoading}
      onClick={handleDiscordLogin}
      className="w-full h-10 space-x-1 bg-[#5865F2] hover:bg-[#5865F295] text-primary"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <DiscordLogoIcon />
          <p>Sign in with Discord</p>
        </>
      )}
    </Button>
  );
}
