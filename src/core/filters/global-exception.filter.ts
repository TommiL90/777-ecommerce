import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let status: number
    let message: string | object

    // Manejar errores de Zod
    if (this.isZodError(exception)) {
      status = HttpStatus.BAD_REQUEST
      message = {
        error: "Validation Error",
        details: exception.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      }
      this.logger.warn(`Zod validation error: ${JSON.stringify(exception.issues)}`)
    }
    // Manejar errores de Prisma
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception)
      status = prismaError.status
      message = prismaError.message
      this.logger.error(`Prisma error [${exception.code}]: ${prismaError.message}`)
    }
    // Manejar excepciones HTTP de NestJS
    else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      // Si la respuesta es un string, usarla directamente
      if (typeof exceptionResponse === "string") {
        message = exceptionResponse
      } else {
        // Si es un objeto, extraer el mensaje
        message = (exceptionResponse as Record<string, unknown>).message || exceptionResponse
      }
    }
    // Error no manejado
    else {
      this.logger.error("Unhandled exception:", exception)
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = "Internal server error"
    }

    // Log del error para debugging
    this.logger.error(
      `HTTP ${status} Error: ${JSON.stringify(message)} - ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined
    )

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    })
  }

  /**
   * Type guard para verificar si es un error de Zod
   */
  private isZodError(exception: unknown): exception is ZodError {
    return (
      typeof exception === "object" &&
      exception !== null &&
      "issues" in exception &&
      Array.isArray((exception as { issues: unknown }).issues)
    )
  }

  /**
   * Convierte errores de Prisma en respuestas HTTP apropiadas
   */
  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number
    message: string
  } {
    switch (error.code) {
      case "P2002": {
        // Unique constraint violation
        const target = (error.meta?.target as string[]) || []
        return {
          status: HttpStatus.CONFLICT,
          message: `A record with this ${target.join(", ")} already exists`,
        }
      }
      case "P2025": {
        // Record not found
        return {
          status: HttpStatus.NOT_FOUND,
          message: "Record not found",
        }
      }
      case "P2003": {
        // Foreign key constraint violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: "Invalid reference to related record",
        }
      }
      case "P2014": {
        // Required relation violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: "The change violates a required relation",
        }
      }
      default: {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Database error occurred",
        }
      }
    }
  }
}

