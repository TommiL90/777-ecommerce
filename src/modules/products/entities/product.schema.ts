import { z } from "zod";

/**
 * Schema Zod para la entidad Product
 * Valida los datos que vienen de Prisma en tiempo de ejecución
 */
export const ProductSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number().int().nonnegative(),
  brand: z.string().nullable(),
  categoryId: z.string(),
  imgUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Tipo inferido del schema para uso en el código
 */
export type Product = z.infer<typeof ProductSchema>;
