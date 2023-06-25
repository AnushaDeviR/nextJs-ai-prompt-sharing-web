import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

// ref: https://next-auth.js.org/getting-started/example

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  //   updates to know which user is online
  async session({ session }) {
    const sessionUser = await User.findOne({
      email: session.user.email,
    });
    session.user.id = sessionUser._id.toString();
    return session;
  },
  async signIn({ profile }) {
    try {
      // serverless -> lambda -> only when it gets called
      await connectToDB();
      //   check if user exists:
      const userExists = await User.findOne({
        email: profile.email,
      });
      //   if not, then create a new user
      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(" ", "").toLowerCase(),
          image: profile.picture,
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export { handler as GET, handler as POST };
/*
[NOTE]: In order to get the provider details from google account, go to https://console.cloud.google.com
1. Create new project and select the project when done.
2. From the navigation menu, click 'APIs and services' then OAuth consent screen.
3. Click create, fill in the details in OAuth consent screen and save it.
4. Go to 'Credentials' from the side menu and create a credential (OAuth Client ID).
5. Choose application type as 'Web Application', fill the remaining details on the page and create the ID.
6. With the Client ID, we can now continue with Google Auth in our application by pasting in the Google ID and Google Client Secret in .env file.
*/
