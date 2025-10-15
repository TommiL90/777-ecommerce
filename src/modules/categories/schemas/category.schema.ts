import { z } from "zod"

/**
 * Schema Zod base para la entidad Category
 * Define todos los campos de la categoría incluyendo metadatos de sistema
 * Este es el single source of truth para la estructura de la categoría
 */
export const CategorySchema = z.object({
  id: z
    .string()
    .uuid()
    .describe("Identificador único UUID de la categoría generado por el sistema"),
  name: z
    .string({ message: "El nombre es requerido y debe ser un string" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(120, { message: "El nombre no puede exceder 120 caracteres" })
    .describe(
      "Nombre de la categoría que se mostrará en el catálogo. Ejemplo: Resto-Bar, Sex-Shop"
    ),
  slug: z
    .string({ message: "El slug es requerido y debe ser un string" })
    .min(3, { message: "El slug debe tener al menos 3 caracteres" })
    .max(120, { message: "El slug no puede exceder 120 caracteres" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "El slug debe ser en minúsculas, sin espacios y separado por guiones",
    })
    .describe(
      "Identificador único amigable para URLs. Ejemplo: resto-bar, sex-shop, gel-lubricantes"
    ),
  parentId: z
    .string()
    .uuid()
    .nullable()
    .describe("ID de la categoría padre si es una subcategoría. Null para categorías principales"),
  createdAt: z.coerce.date().describe("Fecha y hora de creación del registro en el sistema"),
  updatedAt: z.coerce.date().describe("Fecha y hora de la última actualización del registro"),
  _count: z
    .object({
      products: z.number().int().nonnegative(),
      children: z.number().int().nonnegative(),
    })
    .optional()
    .describe("Contadores de relaciones (productos y subcategorías)"),
})

/**
 * Tipo inferido del schema para uso en el código
 */
export type Category = z.infer<typeof CategorySchema>

/**
 * Schema de validación para crear una categoría
 * Deriva del schema base omitiendo los campos generados por el sistema
 */
export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  parentId: z
    .string()
    .uuid({ message: "El ID de categoría padre debe ser un UUID válido" })
    .optional()
    .nullable()
    .describe("ID de la categoría padre (opcional). Dejar vacío para categorías principales"),
})

/**
 * Schema de validación para actualizar una categoría
 * Todos los campos son opcionales (partial)
 */
export const UpdateCategorySchema = CreateCategorySchema.partial()
