import { GoogleLoginBtn } from "@/components/auth/google-login-btn";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-900 font-sans">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl font-bold">CineQueue</h1>

        <p className="text-muted-foreground">Your personal Movie/Series/Anime tracker.</p>
      </div>

      <GoogleLoginBtn />
    </main>
  );
}
