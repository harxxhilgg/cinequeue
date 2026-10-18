"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogoutBtn } from "./logout-btn";
import { LogOutIcon, TrashIcon } from "lucide-react";
import { DeleteAccBtn } from "./delete-acc-btn";

export function AuthDropdown() {
  const user = useAuthStore((state) => state.user);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState<boolean>(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="flex gap-2 h-10 rounded-lg select-none"
            >
              <Image
                src={user?.avatarUrl || "/default_user.png"}
                alt="User Image"
                height={25}
                width={25}
                className="rounded-full"
              />

              <p>{user?.name}</p>
            </Button>
          }
        />

        <DropdownMenuContent className="w-44" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Label One</DropdownMenuLabel>

            <DropdownMenuItem
              className="h-8"
              variant="default"
              onClick={() => console.log("Clicked Item One")}
            >
              Item One
            </DropdownMenuItem>

            <DropdownMenuItem
              className="h-8"
              variant="default"
              onClick={() => console.log("Clicked Item Two")}
            >
              Item Two
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Danger Zone */}
          <DropdownMenuGroup>
            <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>

            <DropdownMenuItem
              className="h-8"
              variant="default"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <LogOutIcon className="size-4" />
              Logout
            </DropdownMenuItem>

            <DropdownMenuItem
              className="h-8"
              variant="destructive"
              onClick={() => setIsDeleteAccountDialogOpen(true)}
            >
              <TrashIcon className="size-4" />
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutBtn
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        trigger={null}
      />

      <DeleteAccBtn
        open={isDeleteAccountDialogOpen}
        onOpenChange={setIsDeleteAccountDialogOpen}
        trigger={null}
      />
    </>
  );
}
