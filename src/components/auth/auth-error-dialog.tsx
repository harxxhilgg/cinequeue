"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AuthErrorInfo {
  title: string;
  description: string;
}

export function AuthErrorDialog() {
  const [errorInfo, setErrorInfo] = useState<AuthErrorInfo | null>(null);

  useEffect(() => {
    // Read error from hash (Supabase default on redirect) or query parameters
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;

    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(window.location.search);

    const error = hashParams.get("error") || searchParams.get("error");
    const rawDescription =
      hashParams.get("error_description") ||
      searchParams.get("error_description") ||
      "";

    if (!error && !rawDescription) return;

    // Decode error description (handles single and double URI encoding)
    let decodedDescription = rawDescription;
    try {
      decodedDescription = decodeURIComponent(rawDescription);
      if (decodedDescription.includes("%")) {
        decodedDescription = decodeURIComponent(decodedDescription);
      }
    } catch {
      // ignore decoding issues
    }

    const isDuplicateAccount =
      decodedDescription.toLowerCase().includes("multiple accounts") ||
      decodedDescription.toLowerCase().includes("same email") ||
      decodedDescription.toLowerCase().includes("linking domain");

    if (isDuplicateAccount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorInfo({
        title: "Account Already Exists",
        description:
          "An account with this email address is already registered using Google (or another provider). Please log in with Google using that email, or try a different GitHub account.",
      });
    } else {
      setErrorInfo({
        title: "Sign In Failed",
        description:
          decodedDescription ||
          "An unexpected error occurred during authentication. Please try again or use another login method.",
      });
    }
  }, []);

  const handleDismiss = () => {
    setErrorInfo(null);
    // Clear the error hash/search from URL only when user confirms
    window.history.replaceState(null, "", window.location.pathname);
  };

  if (!errorInfo) {
    return null;
  }

  return (
    <AlertDialog
      open={!!errorInfo}
      onOpenChange={(open) => {
        if (!open) {
          handleDismiss();
        }
      }}
    >
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          <AlertDialogTitle>{errorInfo.title}</AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-400 leading-relaxed text-sm">
            {errorInfo.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:flex-none">
          <AlertDialogAction
            autoFocus
            onClick={handleDismiss}
            className="w-full cursor-pointer"
          >
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
