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
  const [finished, setFinished] = useState(true);
  const [loading, setLoading] = useState(false);

  // Retrieve usernames from local storage on component mount
  useEffect(() => {
    const storedDiscordUsername = localStorage.getItem("discordUsername");
    const storedTwitterUsername = localStorage.getItem("twitterUsername");

    if (storedDiscordUsername) setDiscordUsername(storedDiscordUsername);
    if (storedTwitterUsername) setTwitterUsername(storedTwitterUsername);
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
      <Card className="w-[300px] md:w-[400px] mt-[50px]">
        <CardHeader>
          <CardTitle>Connect</CardTitle>
          <CardDescription>
            Connect your Discord and Twitter/X accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <button
              type="button"
              className={`w-full py-2 px-4 border ${
                discordUsername ? "border-[#7289da]" : "border-gray-300"
              } rounded-md`}
              onClick={() => signIn("discord")}
            >
              {discordUsername
                ? `Discord: ${discordUsername}`
                : "Connect Discord"}
            </button>
            <button
              type="button"
              className={`w-full py-2 px-4 border ${
                twitterUsername ? "border-[#14171A]" : "border-gray-300"
              } rounded-md`}
              onClick={() => signIn("twitter")}
            >
              {twitterUsername
                ? `Twitter/X: ${twitterUsername}`
                : "Connect Twitter/X"}
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          {session && discordUsername && twitterUsername && !finished && (
            <button
              onClick={handleSubmit}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
          {finished && (
            <>
              <p className="text-center">
                Done! Go back to the Story Discord to see your new role.
              </p>
            </>
          )}
          {session && (
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
            >
              Sign out
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
