import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { ZodError, z } from "zod"
import type { CreateCategoryDto } from "../../dto/create-category.dto"
import type { UpdateCategoryDto } from "../../dto/update-category.dto"
import { type Category, CategorySchema } from "../../schemas/category.schema"
import type { CategoriesRepository } from "../categories.repository"

@Injectable()
export class CategoriesPrismaRepository implements CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const newCategory = await this.prisma.category.create({
      data,
    })

    try {
      return CategorySchema.parse(newCategory)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid category data format")
      }
      throw error
    }
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
    })

    try {
      return z.array(CategorySchema).parse(categories)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid category data format in database")
      }
      throw error
    }
  }

  async findOne(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    })

    if (!category) {
      return null
    }

    try {
      return CategorySchema.parse(category)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid category data format")
      }
      throw error
    }
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    })

    if (!category) {
      return null
    }

    try {
      return CategorySchema.parse(category)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid category data format")
      }
      throw error
    }
  }

  async findChildren(parentId: string): Promise<Category[]> {
    const children = await this.prisma.category.findMany({
      where: { parentId },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    try {
      return z.array(CategorySchema).parse(children)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid category data format in database")
      }
      throw error
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    })

    try {
      return CategorySchema.parse(updatedCategory)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException("Invalid category data format")
      }
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } })
  }
}
