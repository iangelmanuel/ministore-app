import { ImageUpload } from "@/utils/image-upload"
import { defineAction, z } from "astro:actions"
import { db, eq, Product, ProductImage } from "astro:db"
import { getSession } from "auth-astro/server"

const MAX_FILE_SIZE = 5_000_000 // 5MB
const ACEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/svg+xml"
]

export const createUpdateProduct = defineAction({
  accept: "form",
  input: z.object({
    id: z.string().optional(),
    description: z.string(),
    gender: z.string(),
    price: z.number(),
    sizes: z.string(),
    slug: z.string(),
    stock: z.number(),
    tags: z.string(),
    title: z.string(),
    type: z.string(),

    imageFiles: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size 5MB")
          .refine((file) => {
            if (!file.type) return true
            return ACEPTED_IMAGE_TYPES.includes(file.type)
          }, "Invalid image type")
      )
      .optional()
  }),
  handler: async (form, { request }) => {
    const session = await getSession(request)
    const user = session?.user

    if (!user) throw new Error("Unauthorized")

    const { id = crypto.randomUUID(), imageFiles, ...rest } = form

    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim()

    const product = {
      id,
      user: user.id!,
      ...rest
    }

    const queries: any = []

    if (!form.id) {
      queries.push(db.insert(Product).values(product))
    } else {
      queries.push(db.update(Product).set(product).where(eq(Product.id, id)))
    }

    const secureUrls: string[] = []

    if (
      form.imageFiles &&
      form.imageFiles.length > 0 &&
      form.imageFiles[0].size > 0
    ) {
      const urls = await Promise.all(
        form.imageFiles.map(async (file) => ImageUpload.uploadImage(file))
      )

      secureUrls.push(...urls)
    }

    secureUrls.forEach((url) => {
      const imageObj = {
        id: crypto.randomUUID(),
        url,
        productId: product.id
      }

      queries.push(db.insert(ProductImage).values(imageObj))
    })

    // imageFiles?.forEach(async (file) => {
    //   if (file.size <= 0) return

    //   const url = await ImageUpload.uploadImage(file)
    // })

    await db.batch(queries)
    return product
  }
})
