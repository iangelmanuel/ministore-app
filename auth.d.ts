import { DefaultSession, DefaultUser } from "@auth/core/types"

declare module "@auth/core/types" {
  interface User extends DefaultUser {
    role?: "admin" | "user"
  }

  interface Session extends DefaultSession {
    user: User
  }
}
