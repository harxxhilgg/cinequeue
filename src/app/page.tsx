import { GoogleLoginBtn } from "@/components/auth/google-login-btn";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-900 font-sans">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-2xl font-bold">CineQueue</h1>

        <p className="text-muted-foreground">Your personal Movie/Series/Anime tracker.</p>
      </div>

      <GoogleLoginBtn />
    </main>
  );
}
