import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    // ── Google OAuth ──────────────────────────────────────────────────────────
    // Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
    // Get them from: https://console.cloud.google.com/
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    // ── Credentials (email + password) ────────────────────────────────────
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect()

        // 1. Find the user by email
        const user = await User.findOne({ email: credentials?.email })
        if (!user) {
          throw new Error('No user found with this email')
        }

        // 2. Compare passwords
        const isPasswordMatch = await bcrypt.compare(credentials?.password, user.password)
        if (!isPasswordMatch) {
          throw new Error('Invalid password')
        }

        // 3. Return user object — NextAuth stores it in the JWT token
        return { id: user._id.toString(), name: user.name, email: user.email }
      },
    }),
  ],

  // ── Session strategy ───────────────────────────────────────────────────────
  session: {
    strategy: 'jwt',       // JWT (no DB required)
    maxAge:   30 * 24 * 60 * 60, // 30 days
  },

  // ── JWT callbacks ──────────────────────────────────────────────────────────
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id
      return session
    },
  },

  // ── Custom pages ───────────────────────────────────────────────────────────
  // We handle login via our own <LoginAlert> modal, so no redirect needed
  pages: {
    signIn:  '/',   // stay on home page — LoginAlert opens as a modal
    error:   '/',   // auth errors also stay on home
  },

  // ── Secret ─────────────────────────────────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)
