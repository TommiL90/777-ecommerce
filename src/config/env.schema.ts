import { z } from "zod"

/**
 * Logger simple para evitar el uso directo de console
 */
const logger = {
  error: (message: string) => {
    // biome-ignore lint/suspicious/noConsole: Necesario para mostrar errores de configuración
    console.error(message)
  },
}

/**
 * Schema de validación para variables de entorno
 * Valida y transforma las variables de entorno al inicio de la aplicación
 */
export const envSchema = z.object({
  // Base de datos
  DATABASE_URL: z.string().url("DATABASE_URL debe ser una URL válida"),

  // Configuración del servidor
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3333),

  // Configuración de la aplicación
  APP_NAME: z.string().default("777 E-commerce API"),
  APP_VERSION: z.string().default("1.0.0"),
})

/**
 * Tipo inferido del schema de variables de entorno
 */
export type EnvConfig = z.infer<typeof envSchema>

/**
 * Valida las variables de entorno y retorna la configuración validada
 * @throws {ZodError} Si alguna variable de entorno no cumple con el schema
 */
export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`)

      logger.error("❌ Error de validación de variables de entorno:")
      for (const message of errorMessages) {
        logger.error(`  - ${message}`)
      }
      logger.error("\n💡 Asegúrate de configurar todas las variables requeridas en tu archivo .env")

      process.exit(1)
    }

    throw error
  }
}
