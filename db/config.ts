import { column, defineDb, defineTable } from "astro:db"

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    email: column.text(),
    password: column.text(),
    createdAt: column.date({ default: new Date() }),
    role: column.text({ references: () => Role.columns.id })
  }
})

const Role = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text()
  }
})

const Product = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    description: column.text(),
    gender: column.text(),
    price: column.number(),
    sizes: column.text(),
    slug: column.text({ unique: true }),
    stock: column.number(),
    tags: column.text(),
    title: column.text(),
    type: column.text(),

    user: column.text({ references: () => User.columns.id })
  }
})

const ProductImage = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    url: column.text(),
    productId: column.text({ references: () => Product.columns.id })
  }
})

export default defineDb({
  tables: {
    User,
    Role,
    Product,
    ProductImage
  }
})
