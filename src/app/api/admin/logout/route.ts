import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("admin-auth-token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: -1, // Expire the cookie immediately
  });

  return response;
} 