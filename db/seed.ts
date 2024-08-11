import { db, Role, User, Product, ProductImage } from "astro:db"
import bcrypt from "bcryptjs"
import { seedProducts } from "./seed-data"

export default async function seed() {
  const roles = [
    { id: "admin", name: "Administrator" },
    { id: "user", name: "User" }
  ]

  const hashedPassword = bcrypt.hashSync("123456", 10)

  const johnDoe = {
    id: "abc-jane-doe",
    name: "Jane Doe",
    email: "jane.doe@google.com",
    password: hashedPassword,
    role: "admin"
  }

  const janeDoe = {
    id: "abc-john-doe",
    name: "John Doe",
    email: "john.doe@google.com",
    password: hashedPassword,
    role: "user"
  }

  await db.insert(Role).values(roles)
  await db.insert(User).values([johnDoe, janeDoe])

  const queries: any = []

  seedProducts.forEach((p) => {
    const product = {
      id: crypto.randomUUID(),
      description: p.description,
      gender: p.gender,
      price: p.price,
      sizes: p.sizes.join(","),
      slug: p.slug,
      stock: p.stock,
      tags: p.tags.join(","),
      title: p.title,
      type: p.type,
      user: johnDoe.id
    }

    queries.push(db.insert(Product).values(product))

    p.images.forEach((img) => {
      const image = {
        id: crypto.randomUUID(),
        url: img,
        productId: product.id
      }

      queries.push(db.insert(ProductImage).values(image))
    })
  })
  await db.batch(queries)
  console.log("Database seeded successfully")
}
