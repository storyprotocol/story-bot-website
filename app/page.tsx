"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HomepageForm() {
  const { data: session } = useSession();
  const [discordUsername, setDiscordUsername] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [clickedFollowStory, setClickedFollowStory] = useState(false);
  const [clickedJoinTelegram, setClickedJoinTelegram] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // Retrieve usernames from local storage on component mount
  useEffect(() => {
    const storedDiscordUsername = localStorage.getItem("discordUsername");
    const storedTwitterUsername = localStorage.getItem("twitterUsername");
    const followedStoryOnTwitter = localStorage.getItem(
      "followedStoryOnTwitter"
    );
    const joinedStoryTelegram = localStorage.getItem("joinedStoryTelegram");

    if (storedDiscordUsername) setDiscordUsername(storedDiscordUsername);
    if (storedTwitterUsername) setTwitterUsername(storedTwitterUsername);
    if (followedStoryOnTwitter) setClickedFollowStory(true);
    if (joinedStoryTelegram) setClickedJoinTelegram(true);
  }, []);

  // Update local storage when session data changes
  useEffect(() => {
    if (session) {
      //@ts-ignore
      if (session.user?.discordUsername) {
        //@ts-ignore
        setDiscordUsername(session.user.discordUsername);
        //@ts-ignore
        localStorage.setItem("discordUsername", session.user.discordUsername);
      }
      //@ts-ignore
      if (session.user?.twitterUsername) {
        //@ts-ignore
        setTwitterUsername(session.user.twitterUsername);
        //@ts-ignore
        localStorage.setItem("twitterUsername", session.user.twitterUsername);
      }
    }
  }, [session]);

  const handleSignOut = () => {
    // Clear local storage on sign out
    localStorage.removeItem("discordUsername");
    localStorage.removeItem("twitterUsername");
    localStorage.removeItem("followedStoryOnTwitter");
    localStorage.removeItem("joinedStoryTelegram");
    signOut();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      if (result.success) {
        setFinished(true);
      } else {
        alert(
          "Failed to save usernames. Please contact us in the Story Discord server."
        );
      }
    } catch (error) {
      console.error("Error saving usernames:", error);
      alert(
        "Failed to save usernames. Please contact us in the Story Discord server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-[100px]">
      <Card className="w-[300px] md:w-[500px] mt-[50px]">
        <CardHeader>
          <CardTitle>Connect</CardTitle>
          <CardDescription>
            Connect your Discord and Twitter/X accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center gap-[10px]">
              <p className="min-w-[60px] font-bold">Step 1</p>
              <button
                type="button"
                className={`w-full py-2 px-4 border ${
                  discordUsername
                    ? "bg-[#7289da] text-white"
                    : "border-gray-300"
                } rounded-md`}
                onClick={() => signIn("discord")}
                disabled={!!discordUsername}
              >
                {discordUsername
                  ? `Discord: ${discordUsername}`
                  : "Connect Discord"}
              </button>
            </div>

            <div className="flex items-center gap-[10px]">
              <p className="min-w-[60px] font-bold">Step 2</p>
              <button
                type="button"
                className={`w-full py-2 px-4 border ${
                  twitterUsername
                    ? "bg-[#14171A] text-white"
                    : "border-gray-300"
                } rounded-md`}
                onClick={() => signIn("twitter")}
                disabled={!!twitterUsername}
              >
                {twitterUsername
                  ? `Twitter/X: ${twitterUsername}`
                  : "Connect Twitter/X"}
              </button>
            </div>
            <div className="flex items-center gap-[10px]">
              <p className="min-w-[60px] font-bold">Step 3</p>
              <button
                type="button"
                className={`w-full py-2 px-4 border ${
                  clickedFollowStory ? "bg-black text-white" : "border-gray-300"
                } rounded-md`}
                onClick={() => {
                  window.open("https://twitter.com/StoryProtocol", "_blank");
                  localStorage.setItem("followedStoryOnTwitter", "true");
                  setClickedFollowStory(true);
                }}
                disabled={clickedFollowStory}
              >
                {clickedFollowStory
                  ? "Followed Story"
                  : "Follow @StoryProtocol on Twitter/X"}
              </button>
            </div>
            <div className="flex items-center gap-[10px]">
              <p className="min-w-[60px] font-bold">Step 4</p>
              <button
                type="button"
                className={`w-full py-2 px-4 border ${
                  clickedJoinTelegram
                    ? "bg-[#26a4e2] text-white"
                    : "border-gray-300"
                } rounded-md`}
                onClick={() => {
                  window.open("https://t.me/+gInJTVTz2mcwZWZh", "_blank");
                  localStorage.setItem("joinedStoryTelegram", "true");
                  setClickedJoinTelegram(true);
                }}
                disabled={clickedJoinTelegram}
              >
                {clickedJoinTelegram
                  ? "Joined Telegram"
                  : "Join Story's Telegram"}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          {session &&
            discordUsername &&
            twitterUsername &&
            clickedFollowStory &&
            clickedJoinTelegram &&
            !finished && (
              <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 text-white rounded-md relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-shine"></span>
                <span className="relative z-10">
                  {loading ? "Saving..." : "Get my ꧁IP꧂ role"}
                </span>
              </button>
            )}
          {finished && (
            <>
              <p className="text-center">
                Success! Go to the Story Discord to see your new role.
              </p>
            </>
          )}
          {session && !finished && (
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 border border-red-600 text-red-600 rounded-md"
            >
              Restart
            </button>
          )}
        </CardFooter>
      </Card>
      <style jsx>{`
        .animate-shine {
          background-size: 200% 200%;
          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
