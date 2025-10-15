import { createZodDto } from "nestjs-zod";
import type { z } from "zod";
import { UpdateProductSchema } from "../schemas/product.schema";

/**
 * DTO para actualizar un producto
 * Genera clase compatible con NestJS y Swagger
 */
export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}

/**
 * Tipo inferido del schema para uso interno
 */
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
