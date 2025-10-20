import { z } from "zod"

/**
 * Schema Zod base para la entidad Product
 * Define todos los campos del producto incluyendo metadatos de sistema
 * Este es el single source of truth para la estructura del producto
 */
export const ProductSchema = z.object({
  id: z.string().uuid().describe("Identificador único UUID del producto generado por el sistema"),
  sku: z
    .string({ message: "El SKU es requerido y debe ser un string" })
    .min(1, { message: "El SKU debe tener al menos 1 carácter" })
    .max(120, { message: "El SKU no puede exceder 120 caracteres" })
    .describe("Código SKU único del producto para identificación e inventario. Ejemplo: SKU048546"),
  name: z
    .string({ message: "El nombre es requerido y debe ser un string" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(120, { message: "El nombre no puede exceder 120 caracteres" })
    .describe(
      "Nombre comercial del producto que se mostrará en el catálogo. Ejemplo: Alimento para perros Royal Canin"
    ),
  description: z
    .string({ message: "La descripción es requerida y debe ser un string" })
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" })
    .describe(
      "Descripción detallada del producto con características, beneficios y especificaciones"
    ),
  price: z
    .number({ message: "El precio es requerido y debe ser un número" })
    .int({ message: "El precio debe ser un número entero" })
    .positive({ message: "El precio debe ser positivo" })
    .describe("Precio del producto en pesos chilenos (sin decimales). Ejemplo: 89990"),
  stock: z
    .number({ message: "El stock debe ser un número" })
    .int({ message: "El stock debe ser un número entero" })
    .nonnegative({ message: "El stock no puede ser negativo" })
    .describe("Cantidad de unidades disponibles en inventario. Ejemplo: 10"),
  brand: z
    .string({ message: "La marca debe ser un string" })
    .max(120, { message: "La marca no puede exceder 120 caracteres" })
    .nullable()
    .describe("Marca o fabricante del producto (opcional). Ejemplo: Royal Canin, Purina"),
  categoryId: z
    .string({ message: "El ID de categoría es requerido y debe ser un string" })
    .min(3, { message: "El ID de categoría debe tener al menos 3 caracteres" })
    .max(120, {
      message: "El ID de categoría no puede exceder 120 caracteres",
    })
    .describe(
      "Identificador de la categoría a la que pertenece el producto. Ejemplo: alimentos-mascotas"
    ),
  imgUrl: z
    .string()
    .url({ message: "La URL de imagen debe ser válida" })
    .nullable()
    .describe(
      "URL de la imagen principal del producto. Ejemplo: https://cdn.example.com/product.jpg"
    ),
  publicId: z
    .string({ message: "El public_id es requerido y debe ser un string" })
    .min(1, { message: "El public_id no puede estar vacío" })
    .max(255, { message: "El public_id no puede exceder 255 caracteres" })
    .describe(
      "Identificador público del recurso en servicios externos como Cloudinary. Ejemplo: abc123"
    ),
  createdAt: z.coerce.date().describe("Fecha y hora de creación del registro en el sistema"),
  updatedAt: z.coerce.date().describe("Fecha y hora de la última actualización del registro"),
})

/**
 * Tipo inferido del schema para uso en el código
 */
export type Product = z.infer<typeof ProductSchema>

/**
 * Schema de validación para crear un producto
 * Deriva del schema base omitiendo los campos generados por el sistema
 */
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Convertir campos nullable a optional para inputs con valores por defecto apropiados
  brand: z
    .string({ message: "La marca debe ser un string" })
    .max(120, { message: "La marca no puede exceder 120 caracteres" })
    .optional()
    .describe("Marca o fabricante del producto (opcional). Puede ser string vacío. Ejemplo: Royal Canin, Purina"),
  imgUrl: z
    .string()
    .url({ message: "La URL de imagen debe ser válida" })
    .optional()
    .nullable()
    .describe(
      "URL de la imagen principal del producto (opcional). Ejemplo: https://cdn.example.com/product.jpg"
    ),
  stock: z
    .number({ message: "El stock debe ser un número" })
    .int({ message: "El stock debe ser un número entero" })
    .nonnegative({ message: "El stock no puede ser negativo" })
    .optional()
    .default(0)
    .describe("Cantidad inicial en inventario (opcional, por defecto 0). Ejemplo: 10"),
  publicId: z
    .string({ message: "El public_id es requerido y debe ser un string" })
    .min(1, { message: "El public_id no puede estar vacío" })
    .max(255, { message: "El public_id no puede exceder 255 caracteres" })
    .describe(
      "Identificador público del recurso en servicios externos como Cloudinary. Ejemplo: products/abc123"
    ),
})

/**
 * Schema de validación para actualizar un producto
 * Todos los campos son opcionales (partial)
 */
export const UpdateProductSchema = CreateProductSchema.partial()
