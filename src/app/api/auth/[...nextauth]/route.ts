// imports
import NextAuth from "next-auth"

// importing providers

import GoogleProvider from "next-auth/providers/google";
import Github from "next-auth/providers/github";

const handler = NextAuth({
    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          }),
          Github({ clientId: process.env.GITHUB_CLIENT_ID as string, clientSecret: process.env.GITHUB_CLIENT_SECRET as string })
    ]
})

export { handler as GET, handler as POST }