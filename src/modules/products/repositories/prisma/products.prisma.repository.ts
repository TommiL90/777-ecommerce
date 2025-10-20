import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { ZodError, z } from "zod"
import { CategorySchema } from "../../../categories/schemas/category.schema"
import type { CreateProductDto } from "../../dto/create-product.dto"
import type { UpdateProductDto } from "../../dto/update-product.dto"
import { type Product, ProductSchema } from "../../schemas/product.schema"
import type { ProductsRepository, ProductWithCategory } from "../products.repository"

// Schema para validar ProductWithCategory
const ProductWithCategorySchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  categoryId: z.string(),
  imgUrl: z.string().nullable(),
  publicId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  brand: z.string().nullable(),
  category: CategorySchema.extend({
    parent: CategorySchema.nullable(),
  }),
})

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

  async findByParentCategorySlug(parentSlug: string): Promise<ProductWithCategory[]> {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          parent: {
            slug: parentSlug,
          },
        },
      },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
      },
    })

    try {
      return z.array(ProductWithCategorySchema).parse(products)
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
