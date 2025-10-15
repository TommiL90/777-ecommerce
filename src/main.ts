import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { cleanupOpenApiDoc, ZodValidationPipe } from "nestjs-zod"
import { AppModule } from "./app.module"
import { validateEnv } from "./config/env.schema"
import { GlobalExceptionFilter } from "./core/filters/global-exception.filter"

/**
 * Logger simple para evitar el uso directo de console
 */
const logger = {
  log: (message: string) => {
    // biome-ignore lint/suspicious/noConsole: Necesario para mostrar información de inicio
    console.log(message)
  },
}

async function bootstrap() {
  // Validar variables de entorno al inicio
  const env = validateEnv()

  logger.log(`🚀 Iniciando ${env.APP_NAME} v${env.APP_VERSION}`)
  logger.log(`📊 Entorno: ${env.NODE_ENV}`)
  logger.log(`🌐 Puerto: ${env.PORT}`)

  const app = await NestFactory.create(AppModule)

  // Configurar filtro global de excepciones
  app.useGlobalFilters(new GlobalExceptionFilter())

  // Configurar validación global con Zod
  app.useGlobalPipes(new ZodValidationPipe())

  // Configurar Swagger con soporte para Zod
  const config = new DocumentBuilder()
    .setTitle(env.APP_NAME)
    .setDescription("API para sistema de e-commerce")
    .setVersion(env.APP_VERSION)
    .addTag("products", "Gestión de productos del catálogo")
    .addTag("categories", "Gestión de categorías del catálogo")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  // cleanupOpenApiDoc procesa el documento para compatibilidad con Zod
  SwaggerModule.setup("api", app, cleanupOpenApiDoc(document))

  await app.listen(env.PORT)
  logger.log(`✅ Servidor ejecutándose en http://localhost:${env.PORT}`)
  logger.log(`📚 Documentación API disponible en http://localhost:${env.PORT}/api`)
}
bootstrap()
