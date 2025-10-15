import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import type { CreateCategoryDto } from "./dto/create-category.dto"
import type { UpdateCategoryDto } from "./dto/update-category.dto"
import { CategoriesRepository } from "./repositories/categories.repository"
import type { Category } from "./schemas/category.schema"

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Validar que el slug sea único
    const existingCategory = await this.categoriesRepository.findBySlug(createCategoryDto.slug)

    if (existingCategory) {
      throw new ConflictException(`Category with slug '${createCategoryDto.slug}' already exists`)
    }

    // Si tiene parentId, validar que la categoría padre exista
    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoriesRepository.findOne(createCategoryDto.parentId)

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with id '${createCategoryDto.parentId}' not found`
        )
      }
    }

    return this.categoriesRepository.create(createCategoryDto)
  }

  findAll() {
    return this.categoriesRepository.findAll()
  }

  async findOne(id: string) {
    console.log("findOne", id)  
    const category = await this.categoriesRepository.findOne(id)

    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`)
    }

    return category
  }

  async findBySlug(slug: string) {
    const category = await this.categoriesRepository.findBySlug(slug)

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`)
    }

    return category
  }

  async findChildren(parentId: string) {
    // Validar que la categoría padre exista
    const parentCategory = await this.categoriesRepository.findOne(parentId)

    if (!parentCategory) {
      throw new NotFoundException(`Category with id '${parentId}' not found`)
    }

    return this.categoriesRepository.findChildren(parentId)
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOne(id)

    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`)
    }

    await this.validateSlugUpdate(updateCategoryDto, category)
    await this.validateParentIdUpdate(updateCategoryDto, id)

    return this.categoriesRepository.update(id, updateCategoryDto)
  }

  private async validateSlugUpdate(updateCategoryDto: UpdateCategoryDto, category: Category) {
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoriesRepository.findBySlug(updateCategoryDto.slug)

      if (existingCategory) {
        throw new ConflictException(`Category with slug '${updateCategoryDto.slug}' already exists`)
      }
    }
  }

  private async validateParentIdUpdate(updateCategoryDto: UpdateCategoryDto, categoryId: string) {
    if (updateCategoryDto.parentId === undefined) {
      return
    }

    if (updateCategoryDto.parentId === categoryId) {
      throw new BadRequestException("A category cannot be its own parent")
    }

    if (updateCategoryDto.parentId) {
      const parentCategory = await this.categoriesRepository.findOne(updateCategoryDto.parentId)

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with id '${updateCategoryDto.parentId}' not found`
        )
      }

      if (parentCategory.parentId === categoryId) {
        throw new BadRequestException("Cannot set a child category as parent (circular reference)")
      }
    }
  }

  async remove(id: string) {
    // Validar que la categoría exista
    const category = await this.categoriesRepository.findOne(id)

    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`)
    }

    // Validar que no tenga productos asociados
    if (category._count && category._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category._count.products} associated products`
      )
    }

    // Validar que no tenga subcategorías
    if (category._count && category._count.children > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category._count.children} subcategories`
      )
    }

    await this.categoriesRepository.remove(id)
  }
}
