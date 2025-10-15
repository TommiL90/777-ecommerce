import { createZodDto } from "nestjs-zod"
import type { z } from "zod"
import { UpdateCategorySchema } from "../schemas/category.schema"

/**
 * DTO para actualizar una categoría
 * Todos los campos son opcionales para actualización parcial
 */
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}

/**
 * Tipo inferido del schema para uso interno
 */
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
