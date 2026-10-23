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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogoutBtn } from "./logout-btn";
import { LogOutIcon, TrashIcon } from "lucide-react";
import { DeleteAccBtn } from "./delete-acc-btn";
import { useTheme } from "next-themes";

export function AuthDropdown() {
  const { theme, setTheme } = useTheme();

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
              className="flex gap-2 h-12 px-3 rounded-lg select-none"
            >
              <Image
                src={user?.avatarUrl || "/default_user.png"}
                alt="User Image"
                height={26}
                width={26}
                className="rounded-full"
              />

              <p className="text-[16px]">{user?.name}</p>
            </Button>
          }
        />

        <DropdownMenuContent className="w-44" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>

              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={theme ?? "system"}
                  onValueChange={(value) => {
                    setTheme(value as "system" | "light" | "dark");
                  }}
                >
                  <DropdownMenuRadioItem value="system">
                    System
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="light">
                    Light
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="dark">
                    Dark
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
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
