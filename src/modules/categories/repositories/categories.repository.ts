import { Injectable } from "@nestjs/common"
import type { CreateCategoryDto } from "../dto/create-category.dto"
import type { UpdateCategoryDto } from "../dto/update-category.dto"
import type { Category } from "../schemas/category.schema"

@Injectable()
export abstract class CategoriesRepository {
  abstract create(createCategoryDto: CreateCategoryDto): Promise<Category>
  abstract findAll(): Promise<Category[]>
  abstract findOne(id: string): Promise<Category | null>
  abstract findBySlug(slug: string): Promise<Category | null>
  abstract findChildren(parentId: string): Promise<Category[]>
  abstract update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>
  abstract remove(id: string): Promise<void>
}
