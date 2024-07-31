import { supabaseClient } from "@/lib/client/supabase/supabaseClient";

export async function storeSocials(
  discord_id: string,
  twitter_id: string,
  twitter_name: string
) {
  const { data: InsertData, error: InsertError } = await supabaseClient
    .from("user_twitters")
    .upsert(
      {
        twitter_id,
        discord_id,
        twitter_name,
      },
      { ignoreDuplicates: false, onConflict: "discord_id" }
    );
  console.log({ InsertData, InsertError });
}
