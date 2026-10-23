"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import { GithubLogoIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

export function GitHubLoginBtn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGitHubLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
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
      variant="outline"
      disabled={isLoading}
      onClick={handleGitHubLogin}
      className="w-full h-10 space-x-1"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <GithubLogoIcon />
          <p>Sign in with GitHub</p>
        </>
      )}
    </Button>
  );
}
