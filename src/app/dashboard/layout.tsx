import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthStoreHydrator } from "../auth/auth-store-hydrator";
import { LogoutBtn } from "@/components/auth/logout-btn";
import { UserInfo } from "@/components/auth/user-info";

export const metadata: Metadata = {
  title: "Dashboard - PlotQ",
  description: "PlotQ Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const appUser = {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata.full_name ?? null,
    avatarUrl: user.user_metadata.avatar_url ?? null,
  };

  return (
    <>
      <AuthStoreHydrator user={appUser} />

      <div className="absolute right-6 top-6 z-50 flex gap-2">
        <UserInfo />

        <LogoutBtn />
      </div>

      {children}
    </>
  );
}
