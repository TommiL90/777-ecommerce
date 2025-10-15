import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { cleanupOpenApiDoc, ZodValidationPipe } from "nestjs-zod"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configurar validación global con Zod
  app.useGlobalPipes(new ZodValidationPipe())

  // Configurar Swagger con soporte para Zod
  const config = new DocumentBuilder()
    .setTitle("777 E-commerce API")
    .setDescription("API para sistema de e-commerce")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, cleanupOpenApiDoc(document))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
