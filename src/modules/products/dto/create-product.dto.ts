import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * Schema de validación para crear un producto
 */
export const CreateProductSchema = z.object({
  name: z
    .string({ message: "El nombre es requerido y debe ser un string" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(120, { message: "El nombre no puede exceder 120 caracteres" }),

  brand: z
    .string({ message: "La marca debe ser un string" })
    .min(3, { message: "La marca debe tener al menos 3 caracteres" })
    .max(120, { message: "La marca no puede exceder 120 caracteres" })
    .optional(),

  description: z
    .string({ message: "La descripción es requerida y debe ser un string" })
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" }),

  price: z
    .number({ message: "El precio es requerido y debe ser un número" })
    .positive({ message: "El precio debe ser positivo" }),

  stock: z
    .number({ message: "El stock debe ser un número" })
    .int({ message: "El stock debe ser un número entero" })
    .nonnegative({ message: "El stock no puede ser negativo" })
    .optional()
    .default(0),

  categoryId: z
    .string({ message: "El ID de categoría es requerido y debe ser un string" })
    .min(3, { message: "El ID de categoría debe tener al menos 3 caracteres" })
    .max(120, {
      message: "El ID de categoría no puede exceder 120 caracteres",
    }),

  sku: z
    .string({ message: "El SKU es requerido y debe ser un string" })
    .min(3, { message: "El SKU debe tener al menos 3 caracteres" })
    .max(120, { message: "El SKU no puede exceder 120 caracteres" }),

  imgUrl: z
    .string()
    .url({ message: "La URL de imagen debe ser válida" })
    .optional()
    .nullable(),
});

/**
 * DTO para crear un producto
 * Genera clase compatible con NestJS y Swagger
 */
export class CreateProductDto extends createZodDto(CreateProductSchema) {}

/**
 * Tipo inferido del schema para uso interno
 */
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
