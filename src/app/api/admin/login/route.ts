import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, password } = body;

  if (email === "admin@deejahstrands.com" && password === "password") {
    const response = NextResponse.json({ success: true });

    // Set cookie for 7 days
    response.cookies.set("admin-auth-token", "secure-token", {
      path: "/",
      httpOnly: true, // makes it available in middleware
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
} 