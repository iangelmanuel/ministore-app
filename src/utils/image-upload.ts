import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET
})

export class ImageUpload {
  static async uploadImage(file: File) {
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const imageType = file.type.split("/")[1]
    const imageString = `data:image/${imageType};base64,${base64}`
    const res = await cloudinary.uploader.upload(imageString)

    return res.secure_url
  }

  static async deleteImage(image: string) {
    const imageName = image.split("/").pop() ?? ""
    const imageId = imageName.split(".")[0]

    try {
      await cloudinary.uploader.destroy(imageId)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
