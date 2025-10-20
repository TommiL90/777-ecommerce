import { Injectable } from "@nestjs/common"
import type { Category } from "../../categories/schemas/category.schema"
import type { CreateProductDto } from "../dto/create-product.dto"
import type { UpdateProductDto } from "../dto/update-product.dto"
import type { Product } from "../schemas/product.schema"

export type ProductWithCategory = Omit<Product, "publicId" | "brand"> & {
  publicId: string | null
  brand: string | null
  category: Category & {
    parent?: Category | null
  }
}

export type SimplifiedProduct = {
  id: string
  sku: string
  name: string
  description: string
  price: number
  stock: number
  imgUrl: string | null
  brand: string | null
  categoryId: string
}

export type SimplifiedCategory = {
  id: string
  name: string
  slug: string
}

export type ProductsByParentCategoryResponse = {
  products: SimplifiedProduct[]
  categories: SimplifiedCategory[]
}

@Injectable()
export abstract class ProductsRepository {
  abstract create(createProductDto: CreateProductDto): Promise<Product>
  abstract findAll(): Promise<Product[]>
  abstract findOne(sku: string): Promise<Product | null>
  abstract update(sku: string, updateProductDto: UpdateProductDto): Promise<Product>
  abstract findByParentCategorySlug(parentSlug: string): Promise<ProductWithCategory[]>

  abstract remove(sku: string): Promise<void>
}
