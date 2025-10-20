import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { CategoriesService } from "../categories/categories.service"
import type { CreateProductDto } from "./dto/create-product.dto"
import type { UpdateProductDto } from "./dto/update-product.dto"
import {
  type ProductsByParentCategoryResponse,
  ProductsRepository,
} from "./repositories/products.repository"

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesService: CategoriesService
  ) {}

  async create(createProductDto: CreateProductDto) {
    const findProduct = await this.productsRepository.findOne(createProductDto.sku)

    if (findProduct) {
      throw new ConflictException("Product already exists")
    }

    // Validar que la categoría exista
    await this.categoriesService.findOne(createProductDto.categoryId)

    return this.productsRepository.create(createProductDto)
  }

  findAll() {
    return this.productsRepository.findAll()
  }

  findOne(sku: string) {
    const product = this.productsRepository.findOne(sku)
    if (!product) {
      throw new NotFoundException("Product not found")
    }
    return product
  }

  async update(sku: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.update(sku, updateProductDto)
    if (!product) {
      throw new NotFoundException("Product not found")
    }

    // Si se actualiza la categoría, validar que exista
    if (updateProductDto.categoryId) {
      await this.categoriesService.findOne(updateProductDto.categoryId)
    }

    return product
  }

  async findByParentCategory(parentSlug: string): Promise<ProductsByParentCategoryResponse> {
    const products = await this.productsRepository.findByParentCategorySlug(parentSlug)

    // Extraer categorías únicas de los productos
    const categories = Array.from(
      new Map(products.map((p) => [p.category.id, p.category])).values()
    )

    // Crear respuesta simplificada
    const simplifiedProducts = products.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: product.imgUrl,
      brand: product.brand,
      categoryId: product.category.id,
    }))

    const simplifiedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }))

    return {
      products: simplifiedProducts,
      categories: simplifiedCategories,
    }
  }

  remove(sku: string) {
    const deletedProduct = this.productsRepository.remove(sku)
    if (!deletedProduct) {
      throw new NotFoundException("Product not found")
    }
    return deletedProduct
  }
}
