import { z } from "zod";

/**
 * Schema Zod base para la entidad Product
 * Define todos los campos del producto incluyendo metadatos de sistema
 * Este es el single source of truth para la estructura del producto
 */
export const ProductSchema = z.object({
  id: z.string().uuid(),
  sku: z
    .string({ message: "El SKU es requerido y debe ser un string" })
    .min(3, { message: "El SKU debe tener al menos 3 caracteres" })
    .max(120, { message: "El SKU no puede exceder 120 caracteres" }),
  name: z
    .string({ message: "El nombre es requerido y debe ser un string" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(120, { message: "El nombre no puede exceder 120 caracteres" }),
  description: z
    .string({ message: "La descripción es requerida y debe ser un string" })
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" }),
  price: z
    .number({ message: "El precio es requerido y debe ser un número" })
    .positive({ message: "El precio debe ser positivo" }),
  stock: z
    .number({ message: "El stock debe ser un número" })
    .int({ message: "El stock debe ser un número entero" })
    .nonnegative({ message: "El stock no puede ser negativo" }),
  brand: z
    .string({ message: "La marca debe ser un string" })
    .min(3, { message: "La marca debe tener al menos 3 caracteres" })
    .max(120, { message: "La marca no puede exceder 120 caracteres" })
    .nullable(),
  categoryId: z
    .string({ message: "El ID de categoría es requerido y debe ser un string" })
    .min(3, { message: "El ID de categoría debe tener al menos 3 caracteres" })
    .max(120, {
      message: "El ID de categoría no puede exceder 120 caracteres",
    }),
  imgUrl: z
    .string()
    .url({ message: "La URL de imagen debe ser válida" })
    .nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Tipo inferido del schema para uso en el código
 */
export type Product = z.infer<typeof ProductSchema>;

/**
 * Schema de validación para crear un producto
 * Deriva del schema base omitiendo los campos generados por el sistema
 */
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Convertir campos nullable a optional para inputs
  brand: z
    .string({ message: "La marca debe ser un string" })
    .min(3, { message: "La marca debe tener al menos 3 caracteres" })
    .max(120, { message: "La marca no puede exceder 120 caracteres" })
    .optional(),
  imgUrl: z
    .string()
    .url({ message: "La URL de imagen debe ser válida" })
    .optional()
    .nullable(),
  stock: z
    .number({ message: "El stock debe ser un número" })
    .int({ message: "El stock debe ser un número entero" })
    .nonnegative({ message: "El stock no puede ser negativo" })
    .optional()
    .default(0),
});

/**
 * Schema de validación para actualizar un producto
 * Todos los campos son opcionales (partial)
 */
export const UpdateProductSchema = CreateProductSchema.partial();
