import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import type { CreateProductDto } from "./dto/create-product.dto"
import type { UpdateProductDto } from "./dto/update-product.dto"
import { ProductsRepository } from "./repositories/products.repository"

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    const findProduct = await this.productsRepository.findOne(createProductDto.sku)

    if (findProduct) {
      throw new ConflictException("Product already exists")
    }

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

  update(sku: string, updateProductDto: UpdateProductDto) {
    const product = this.productsRepository.update(sku, updateProductDto)
    if (!product) {
      throw new NotFoundException("Product not found")
    }
    return product
  }

  remove(sku: string) {
    const deletedProduct = this.productsRepository.remove(sku)
    if (!deletedProduct) {
      throw new NotFoundException("Product not found")
    }
    return deletedProduct
  }
}
