import { defineAction, z } from "astro:actions"
import { count, db, eq, Product, ProductImage, sql } from "astro:db"
import type { ProductWithImages } from "@/interfaces/products-with-image"

export const getProductsByPage = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(12)
  }),
  handler: async ({ page, limit }) => {
    page = page <= 0 ? 1 : page

    const [totalRecords] = await db.select({ count: count() }).from(Product)
    const totalPages = Math.ceil(totalRecords.count / limit)

    if (page > totalPages) {
      return { products: [] as ProductWithImages[], totalPages }
    }

    const productsQuery = sql`
select a.*,
( select GROUP_CONCAT(url,',') from 
	( select * from ${ProductImage} where productId = a.id limit 2 )
 ) as url
from ${Product} a
LIMIT ${limit} OFFSET ${(page - 1) * limit};
`

    // const products = await db
    //   .select()
    //   .from(Product)
    //   .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
    //   .limit(limit)
    //   .offset((page - 1) * 12)

    const { rows: products } = await db.run(productsQuery)

    return {
      products: products as unknown as ProductWithImages[],
      totalPages
    }
  }
})
