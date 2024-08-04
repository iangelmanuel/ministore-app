import { db, Role, User } from "astro:db"
import bcrypt from "bcryptjs"

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: "admin", name: "Administrator" },
    { id: "user", name: "User" }
  ]

  const hashedPassword = bcrypt.hashSync("123456", 10)

  const johnDoe = {
    id: crypto.randomUUID(),
    name: "Jane Doe",
    email: "jane.doe@google.com",
    password: hashedPassword,
    role: "admin"
  }

  const janeDoe = {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@google.com",
    password: hashedPassword,
    role: "user"
  }

  await db.insert(Role).values(roles)
  await db.insert(User).values([johnDoe, janeDoe])

  console.log("Database seeded successfully")
}
