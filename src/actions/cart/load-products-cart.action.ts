import type { CartItem } from "@/interfaces/cart-item"
import { defineAction } from "astro:actions"
import { db, eq, inArray, Product, ProductImage } from "astro:db"

export const loadProductCart = defineAction({
  accept: "json",
  // input: z.string(),
  handler: async (_, { cookies }) => {
    const cart = JSON.parse(cookies.get("cart")?.value ?? "[]") as CartItem[]
    console.log("cart", cart)

    if (cart.length === 0) return []

    // Load products
    const productIds = cart.map((item) => item.id)

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productIds))

    return cart.map((item) => {
      const dbProduct = dbProducts.find((p) => p.Product.id === item.id)
      if (!dbProduct) {
        throw new Error(`Product with id ${item.id} not found`)
      }

      const { title, price, slug } = dbProduct.Product
      const image = dbProduct.ProductImage.url

      return {
        productId: item.id,
        title: title,
        size: item.size,
        quantity: item.quantity,
        image: image.startsWith("http")
          ? image
          : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
        price: price,
        slug: slug
      }
    })
  }
})
