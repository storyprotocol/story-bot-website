import { getSession } from "@/auth";
import { storeSocials } from "@/lib/functions/supabase/storeSocials";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const allCookies = cookies();
    const discordAccessToken = allCookies.get(
      "storybot_discordAccessToken"
    )?.value;
    const twitterAccessToken = allCookies.get(
      "storybot_twitterAccessToken"
    )?.value;

    // Use Discord access token to verify Discord user
    const discordResponse = await fetch(`https://discord.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${discordAccessToken}`,
      },
    });
    const discordData = await discordResponse.json();
    const discordId = discordData.id;

    // Use Twitter access token to verify Twitter user
    const twitterResponse = await fetch(`https://api.twitter.com/2/users/me`, {
      headers: {
        Authorization: `Bearer ${twitterAccessToken}`,
      },
    });
    const twitterData = await twitterResponse.json();
    const twitterId = twitterData.data.id;
    const twitterName = twitterData.data.name;

    // save to DB
    await storeSocials(discordId, twitterId, twitterName);

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving usernames:", error);
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
