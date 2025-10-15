import { createZodDto } from "nestjs-zod"
import type { z } from "zod"
import { CreateCategorySchema } from "../schemas/category.schema"

/**
 * DTO para crear una categoría
 * Genera clase compatible con NestJS y Swagger
 */
export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}

/**
 * Tipo inferido del schema para uso interno
 */
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
