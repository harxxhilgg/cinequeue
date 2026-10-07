import { GoogleLoginBtn } from "@/components/auth/google-login-btn";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getDailyQuote } from "@/lib/dumb-apis/quote";
import { Film, MinusIcon } from "lucide-react";
import { DemoLoginBtn } from "@/components/auth/demo-login-btn";

export default async function Home() {
  // check if user is already logged in or not
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const quote = await getDailyQuote();

  return (
    <main className="flex min-h-screen bg-[#111111] text-white font-sans selection:bg-zinc-800">
      {/* Left side */}
      <div className="flex flex-col w-full lg:w-[45%] xl:w-[40%] p-8 lg:p-12 relative border-r border-zinc-800/50 bg-[#1c1c1c]/20 justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Film className="size-8 text-orange-500" />

          <div className="text-3xl font-semibold font-monst tracking-tight flex items-center gap-2">
            PlotQ
          </div>
        </div>

        {/* Login Form Area */}
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-[28px] font-medium mb-2 text-zinc-100 tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-zinc-400 mb-8">
            Sign in to your account
          </p>

          <div className="space-y-3">
            <div className="space-y-3">
              <GoogleLoginBtn />
            </div>

            <div className="space-y-3">
              <DemoLoginBtn />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full">
          <p className="text-[13px] text-zinc-500 max-w-sm mx-auto text-center leading-relaxed">
            By continuing, you agree to PlotQ&apos;s{" "}
            <Link
              href="/service"
              className="underline hover:text-zinc-300 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </Link>
            , and to receive periodic emails with updates.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden lg:flex flex-col flex-1 bg-[#18181B] p-12 justify-center relative">
        <div className="max-w-md mx-auto relative">
          <div className="text-zinc-800 absolute -top-18 -left-10 z-0">
            <svg
              className="w-32 h-32"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <p className="text-2xl font-medium text-zinc-300 leading-snug mb-8 tracking-tight relative z-10">
            {quote.quote}
          </p>

          <div className="flex text-muted-foreground items-center italic">
            <MinusIcon strokeWidth={1} />
            <p className="font-medium">{quote.author}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
