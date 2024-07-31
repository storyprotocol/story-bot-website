import { AuthOptions, getServerSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: "identify email" } },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // Set session max age (e.g., 30 days)
  },
  callbacks: {
    // first
    async jwt({ token, account, profile }) {
      // Attach provider-specific data to the JWT token
      if (account?.provider === "discord") {
        token.discordAccessToken = account.access_token;
        token.discordId = profile.id;
        token.discordUsername = profile.username;
      }
      if (account?.provider === "twitter") {
        token.twitterAccessToken = account.access_token;
        token.twitterId = profile.data.id; // Use id_str for Twitter ID
        token.twitterUsername = profile.data.username;
      }
      return token;
    },
    // second
    async session({ session, token }) {
      // so we can store in http-only cookies
      session.user.discordAccessToken = token.discordAccessToken;
      session.user.twitterAccessToken = token.twitterAccessToken;
      // so we can display on frontend
      session.user.discordId = token.discordId;
      session.user.discordUsername = token.discordUsername;
      session.user.twitterId = token.twitterId;
      session.user.twitterUsername = token.twitterUsername;
      return session;
    },
    async redirect({ baseUrl, url }) {
      // Redirect to the set-token route after login
      return `${baseUrl}/api/set-token?redirect=${baseUrl}`;
    },
  },
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
