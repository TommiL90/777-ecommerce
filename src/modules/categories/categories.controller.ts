import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common"
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger"
import { CategoriesService } from "./categories.service"
import { CreateCategoryDto } from "./dto/create-category.dto"
import { UpdateCategoryDto } from "./dto/update-category.dto"

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post("")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Crear una nueva categoría",
    description:
      "Crea una nueva categoría en el sistema. Puede ser una categoría principal (sin parentId) o una subcategoría (con parentId).",
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: "Datos de la categoría a crear",
    examples: {
      categoriaPrincipal: {
        summary: "Categoría principal",
        value: {
          name: "Resto-Bar",
          slug: "resto-bar",
        },
      },
      subcategoria: {
        summary: "Subcategoría",
        value: {
          name: "Pizzas",
          slug: "pizzas",
          parentId: "550e8400-e29b-41d4-a716-446655440000",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Categoría creada exitosamente",
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Categoría padre no encontrada (si se proporcionó parentId)",
  })
  @ApiResponse({
    status: 409,
    description: "Ya existe una categoría con ese slug",
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Get("")
  @ApiOperation({
    summary: "Listar todas las categorías",
    description:
      "Obtiene el listado completo de categorías con sus relaciones (padre, hijos) y contadores de productos",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de categorías obtenida exitosamente",
  })
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(":id")
  @ApiOperation({
    summary: "Obtener una categoría por ID",
    description: "Busca y retorna una categoría específica con sus relaciones y contadores",
  })
  @ApiParam({
    name: "id",
    description: "ID único UUID de la categoría",
    example: "550e8400-e29b-41d4-a716-446655440000",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Categoría encontrada exitosamente",
  })
  @ApiResponse({
    status: 404,
    description: "Categoría no encontrada",
  })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id)
  }

  @Get("slug/:slug")
  @ApiOperation({
    summary: "Obtener una categoría por slug",
    description:
      "Busca y retorna una categoría específica utilizando su slug único. Útil para URLs amigables.",
  })
  @ApiParam({
    name: "slug",
    description: "Slug único de la categoría",
    example: "resto-bar",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Categoría encontrada exitosamente",
  })
  @ApiResponse({
    status: 404,
    description: "Categoría no encontrada",
  })
  findBySlug(@Param("slug") slug: string) {
    return this.categoriesService.findBySlug(slug)
  }

  @Get(":id/children")
  @ApiOperation({
    summary: "Obtener subcategorías de una categoría",
    description: "Retorna todas las subcategorías directas (hijos) de una categoría específica",
  })
  @ApiParam({
    name: "id",
    description: "ID único UUID de la categoría padre",
    example: "550e8400-e29b-41d4-a716-446655440000",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Lista de subcategorías obtenida exitosamente",
  })
  @ApiResponse({
    status: 404,
    description: "Categoría padre no encontrada",
  })
  findChildren(@Param("id") id: string) {
    return this.categoriesService.findChildren(id)
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Actualizar una categoría",
    description:
      "Actualiza parcialmente la información de una categoría existente. Solo se modificarán los campos proporcionados.",
  })
  @ApiParam({
    name: "id",
    description: "ID único UUID de la categoría a actualizar",
    example: "550e8400-e29b-41d4-a716-446655440000",
    type: String,
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: "Campos de la categoría a actualizar (todos opcionales)",
    examples: {
      actualizarNombre: {
        summary: "Actualizar nombre",
        value: {
          name: "Resto-Bar Premium",
        },
      },
      cambiarPadre: {
        summary: "Cambiar categoría padre",
        value: {
          parentId: "660e8400-e29b-41d4-a716-446655440001",
        },
      },
      actualizarCompleto: {
        summary: "Actualización completa",
        value: {
          name: "Alimentos y Bebidas",
          slug: "alimentos-bebidas",
          parentId: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Categoría actualizada exitosamente",
  })
  @ApiResponse({
    status: 400,
    description:
      "Datos inválidos o intento de crear referencia circular (categoría como su propio padre)",
  })
  @ApiResponse({
    status: 404,
    description: "Categoría no encontrada o categoría padre no encontrada",
  })
  @ApiResponse({
    status: 409,
    description: "El nuevo slug ya está en uso por otra categoría",
  })
  update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Eliminar una categoría",
    description:
      "Elimina permanentemente una categoría del sistema. No se puede eliminar si tiene productos asociados o subcategorías.",
  })
  @ApiParam({
    name: "id",
    description: "ID único UUID de la categoría a eliminar",
    example: "550e8400-e29b-41d4-a716-446655440000",
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: "Categoría eliminada exitosamente (sin contenido en respuesta)",
  })
  @ApiResponse({
    status: 400,
    description: "No se puede eliminar: la categoría tiene productos asociados o subcategorías",
  })
  @ApiResponse({
    status: 404,
    description: "Categoría no encontrada",
  })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id)
  }
}
