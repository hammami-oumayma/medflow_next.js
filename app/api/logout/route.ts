import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUrl = `${url.origin}/auth/login`;

  const res = NextResponse.redirect(redirectUrl);

  res.cookies.set("token", "", {
    expires: new Date(0),
    path: "/",
  });

  return res;
}
