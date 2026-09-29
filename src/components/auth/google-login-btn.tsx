"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "../ui/toast";
import { delay } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

export function GoogleLoginBtn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin1 = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsLoading(false);

      toast.add({
        type: "error",
        title: "Login failed",
        description: error.message,
      });
    };
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    await delay(5000);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
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
      const message = err instanceof Error ? err.message : "An unexpected error occured.";

      toast.add({
        type: "error",
        title: "Login failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    };
  };

  return (
    <Button
      size="lg"
      variant="default"
      disabled={isLoading}
      onClick={handleGoogleLogin}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <GoogleLogoIcon />
          <p>Continue with Google</p>
        </>
      )}
    </Button>
  );
};