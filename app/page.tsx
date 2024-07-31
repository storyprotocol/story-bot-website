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
      if (session.user?.discordUsername) {
        setDiscordUsername(session.user.discordUsername);
        localStorage.setItem("discordUsername", session.user.discordUsername);
      }
      if (session.user?.twitterUsername) {
        setTwitterUsername(session.user.twitterUsername);
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
        alert("Usernames saved successfully!");
      } else {
        alert("Failed to save usernames.");
      }
    } catch (error) {
      console.error("Error saving usernames:", error);
      alert("An error occurred while saving usernames.");
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
          {session && (
            <>
              <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
              >
                Sign out
              </button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
