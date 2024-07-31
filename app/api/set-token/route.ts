import { NextResponse } from "next/server";
import { getSession } from "@/auth";

export async function GET(request: Request) {
  const session = await getSession();
  const redirectUrl = new URL(request.url).searchParams.get("redirect") || "/";
  const response = NextResponse.redirect(redirectUrl);

  // if user signs out, expire the http-only cookies
  if (!session) {
    response.cookies.set("storybot_discordAccessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // Set to 0 to expire the cookie
    });
    response.cookies.set("storybot_twitterAccessToken", "", {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 0, // Set to 0 to expire the cookie
    });
    return response;
  }

  if (session.user.discordAccessToken) {
    response.cookies.set(
      "storybot_discordAccessToken",
      session.user.discordAccessToken,
      {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
    );
  }
  if (session.user.twitterAccessToken) {
    response.cookies.set(
      "storybot_twitterAccessToken",
      session.user.twitterAccessToken,
      {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
    );
  }

  return response;
}
