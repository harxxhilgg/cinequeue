"use client";

import { Button } from "../ui/button";
import { ConeIcon } from "lucide-react";
import { useState } from "react";
import { GoogleLoginBtn } from "./google-login-btn";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { GitHubLoginBtn } from "./github-login-btn";

export function DemoLoginBtn() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size="lg"
        variant="default"
        onClick={() => setIsOpen(true)}
        className="w-full h-10 space-x-1 bg-orange-600 hover:bg-orange-700/90 dark:hover:bg-orange-700 text-white"
      >
        <ConeIcon />
        <p>Try Demo</p>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Sorry! There is no demo. 😿
            </AlertDialogTitle>

            <AlertDialogDescription>
              If you really want to try PlotQ, just sign in with Google.
              It&apos;s secure, quick, and that&apos;s it.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <GoogleLoginBtn />
            <GitHubLoginBtn />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
