"use client";

import { delay } from "@/lib/utils";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/toast";
import { createClient } from "@/lib/supabase/client";
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
import { Spinner } from "../ui/spinner";
import { LogOutIcon } from "lucide-react";

export function LogoutBtn() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);
    await delay(1000); // KEEP THIS DELAY

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        setIsLoading(false);
        return;
      }

      clearUser();

      toast.add({
        type: "success",
        title: "Logged out succesfully",
      });

      router.replace("/");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occured.";

      toast.add({
        type: "error",
        title: "Logout failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive" size="lg" className="h-10.25" />}
      >
        <LogOutIcon className="size-4" />
        Logout
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row gap-3">
          <AlertDialogCancel disabled={isLoading} className="flex-1 m-0">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            variant="destructive"
            className="flex-1 m-0"
          >
            {isLoading ? <Spinner /> : "Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
