"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { DeleteIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { deleteAccount } from "@/actions/account";
import { cn } from "cn";
import { toast } from "../ui/toast";

export interface DeleteAccBtnProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement | null;
}

export function DeleteAccBtn({
  open,
  onOpenChange,
  trigger,
}: DeleteAccBtnProps) {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);
  const [openCount, setOpenCount] = useState<number>(0);

  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(false);
  const isOpen = isControlled ? open : uncontrolledOpen;
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    setCountdown(10);
    if (isOpen) {
      setOpenCount((c) => c + 1);
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleDeleteAccount = async () => {
    if (isDeleting || countdown > 0) return;

    setIsDeleting(true);

    try {
      const result = await deleteAccount();

      if (!result.success) {
        toast.add({
          type: "error",
          title: "Account deletion failed",
          description: result.error,
        });

        return;
      }

      clearUser();

      // Clear local supabase client session - need this because the local session might not know about user is deleted from server
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      await supabase.auth.signOut({ scope: "local" });

      toast.add({
        type: "success",
        title: "Account deleted",
        description: "Your PlotQ account has been deleted.",
      });

      router.replace("/");
      router.refresh();
    } catch {
      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger !== undefined ? (
        trigger ? (
          <AlertDialogTrigger render={trigger} />
        ) : null
      ) : (
        <AlertDialogTrigger
          render={
            <Button variant="destructive" size="lg" className="h-10.25" />
          }
        >
          <DeleteIcon className="size-4" />
          Delete Account
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete account?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row gap-3">
          <AlertDialogCancel disabled={isDeleting} className="flex-1 m-0">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            autoFocus
            onClick={handleDeleteAccount}
            disabled={isDeleting || countdown > 0}
            variant="destructive"
            className={cn(
              "flex-1 m-0 relative overflow-hidden",
              countdown > 0 &&
                "bg-destructive/10 dark:bg-destructive/15 text-destructive disabled:opacity-100",
            )}
          >
            {countdown > 0 && (
              <span
                key={openCount}
                aria-hidden="true"
                className="absolute inset-y-0 left-0 bg-destructive/30 dark:bg-destructive/40 pointer-events-none rounded-lg animate-countdown-drain"
              />
            )}

            <span className="relative z-10 flex items-center justify-center">
              {isDeleting ? (
                <Spinner />
              ) : countdown > 0 ? (
                `${countdown}`
              ) : (
                "Yes, Delete :("
              )}
            </span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
