import { defineConfig } from "auth-astro"
import Credentials from "@auth/core/providers/credentials"
import { db, eq, User } from "astro:db"
import bcrypt from "bcryptjs"
import type { AdapterUser } from "@auth/core/adapters"

export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      authorize: async ({ email, password }) => {
        const [user] = await db.select().from(User).where(eq(User.email, email))

        if (!user) {
          throw new Error("User not found")
        }

        if (!bcrypt.compareSync(`${password}`, user.password)) {
          throw new Error("Invalid password")
        }

        const { password: _, ...restUser } = user
        return restUser
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user
      }

      return token
    },
    session: ({ session, token }) => {
      session.user = token.user as AdapterUser
      return session
    }
  }
})
