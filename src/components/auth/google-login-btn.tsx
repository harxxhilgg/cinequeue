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

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    await delay(1500); //! REMOVE LATER

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
      className="w-50 space-x-1"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <GoogleLogoIcon />
          <p>Sign in with Google</p>
        </>
      )}
    </Button>
  );
};