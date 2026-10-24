import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    const params = new URLSearchParams();
    params.set("error", error);
    if (errorDescription) params.set("error_description", errorDescription);
    return NextResponse.redirect(`${origin}/#${params.toString()}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Auth callback error:", exchangeError);
    const params = new URLSearchParams();
    params.set("error", "auth_exchange_error");
    params.set("error_description", exchangeError.message);
    return NextResponse.redirect(`${origin}/#${params.toString()}`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
