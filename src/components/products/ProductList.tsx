import { ProductCard } from "./ProductCard"
import type { ProductWithImages } from "@/interfaces/products-with-image"

interface Props {
  products: ProductWithImages[] | undefined
}

export const ProductList = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-content-center">
      {products?.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}
