import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { ZodError, z } from "zod"
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

    try {
      return ProductSchema.parse(newProduct)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid product data format")
      }
      throw error
    }
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: { category: true },
    })

    try {
      return z.array(ProductSchema).parse(products)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid product data format in database")
      }
      throw error
    }
  }

  async findOne(sku: string): Promise<Product | null> {
    const retrieveProduct = await this.prisma.product.findUnique({
      where: { sku },
    })

    if (!retrieveProduct) {
      return null
    }

    try {
      return ProductSchema.parse(retrieveProduct)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid product data format")
      }
      throw error
    }
  }

  async update(sku: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updateProduct = await this.prisma.product.update({
      where: { sku },
      data: { ...updateProductDto },
    })

    try {
      return ProductSchema.parse(updateProduct)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid product data format")
      }
      throw error
    }
  }

  async remove(sku: string): Promise<void> {
    await this.prisma.product.delete({ where: { sku } })
  }
}
