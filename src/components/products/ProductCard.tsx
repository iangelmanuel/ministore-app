import type { ProductWithImages } from "@/interfaces/products-with-image"
import { useState } from "react"

interface Props {
  product: ProductWithImages
}

export const ProductCard = ({ product }: Props) => {
  const images = product.url.split(",").map((img) => {
    return img.startsWith("http")
      ? img
      : `${import.meta.env.PUBLIC_URL}/images/products/${img}`
  })

  const [currentImage, setCurrentImage] = useState(images[0])

  return (
    <a href={`/products/${product.slug}`}>
      <img
        src={currentImage}
        alt={`Image of ${product.title}`}
        onMouseLeave={() => setCurrentImage(images[0])}
        onMouseEnter={() => setCurrentImage(images[1] ?? images[0])}
        className="h-[350px] object-cover"
      />
      <h4>{product.title}</h4>
      <p>${product.price}</p>
    </a>
  )
}
