import { createZodDto } from "nestjs-zod";
import type { z } from "zod";
import { CreateProductSchema } from "../schemas/product.schema";

/**
 * DTO para crear un producto
 * Genera clase compatible con NestJS y Swagger
 */
export class CreateProductDto extends createZodDto(CreateProductSchema) {}

/**
 * Tipo inferido del schema para uso interno
 */
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
