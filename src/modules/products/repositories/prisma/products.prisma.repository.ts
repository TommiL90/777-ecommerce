import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { z } from "zod"
import type { CreateProductDto } from "../../dto/create-product.dto"
import type { UpdateProductDto } from "../../dto/update-product.dto"
import { type Product, ProductSchema } from "../../schemas/product.schema"
import type { ProductsRepository } from "../products.repository"

@Injectable()
export class ProductsPrismaRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data,
    })

    return ProductSchema.parse(newProduct)
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: { category: true },
    })

    return z.array(ProductSchema).parse(products)
  }

  async findOne(sku: string): Promise<Product> {
    const retrieveProduct = await this.prisma.product.findUnique({
      where: { sku },
    })

    return ProductSchema.parse(retrieveProduct)
  }

  async update(sku: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updateProduct = await this.prisma.product.update({
      where: { sku },
      data: { ...updateProductDto },
    })

    return ProductSchema.parse(updateProduct)
  }

  async remove(sku: string): Promise<void> {
    await this.prisma.product.delete({ where: { sku } })
  }
}
