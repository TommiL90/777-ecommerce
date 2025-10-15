import { createZodDto } from "nestjs-zod";
import type { z } from "zod";
import { CreateProductSchema } from "./create-product.dto";

/**
 * Schema de validación para actualizar un producto
 * Todos los campos son opcionales (partial)
 */
export const UpdateProductSchema = CreateProductSchema.partial();

/**
 * DTO para actualizar un producto
 * Genera clase compatible con NestJS y Swagger
 */
export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}

/**
 * Tipo inferido del schema para uso interno
 */
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
