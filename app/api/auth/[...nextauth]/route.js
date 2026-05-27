import NextAuth from "next-auth"
import UserModel from "@/models/User"
import connectDB from "@/config/Db"
import bcrypt from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email"
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password"
        }
      },
      async authorize(credentials) {
        await connectDB()
        const user = await UserModel.findOne({ email: credentials.email })
        if (!user) {
          throw new Error("No user found with the given email")
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }
        return {
          id: user._id.toString(),
          email: user.email,
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();

      if (account.provider === "github") {
        // Fallback if the user's email is set to private on GitHub
        const userEmail = user.email || `${profile.login}@github.com`;

        const existingUser = await UserModel.findOne({ email: userEmail });
        if (!existingUser) {
          const newUser = await UserModel.create({
            email: userEmail,
            name: profile.name || user.name,
            provider: "github", // No password for OAuth users
          });
          await newUser.save();
        }
        return true;
      }

      // CRITICAL FIX: Allow credentials login to pass through
      if (account.provider === "credentials") {
        return true;
      }

      return false; // Deny access for any unhandled providers
    },
async jwt({ token, user, account }) {

  await connectDB();

  // Credentials Login
  if (user?.id) {

    token.sub = user.id;

  }

  // GitHub Login
  if (account?.provider === "github") {

    const dbUser =
      await UserModel.findOne({
        email: token.email,
      });

    if (dbUser) {

      // overwrite github id
      // with mongodb id

      token.sub =
        dbUser._id.toString();

    }
  }

  return token;
},
 async session({ session, token }) {

  session.user.id = token.sub;

  return session;
}
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }