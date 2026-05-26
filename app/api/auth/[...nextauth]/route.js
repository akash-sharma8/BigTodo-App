import NextAuth from "next-auth"
import UserModel from "@/models/User"
import connectDB from "@/config/Db"
import bcrypt from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials"
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
    })  ,

  ],
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


