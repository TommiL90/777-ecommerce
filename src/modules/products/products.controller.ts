import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common"
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { ProductsService } from "./products.service"

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Crear un nuevo producto",
    description:
      "Crea un nuevo producto en el catálogo con la información proporcionada. El sistema generará automáticamente el ID y las fechas de auditoría.",
  })
  @ApiBody({
    type: CreateProductDto,
    description: "Datos del producto a crear",
    examples: {
      ejemplo1: {
        summary: "Alimento para mascotas",
        value: {
          sku: "SKU-RC-MINI-001",
          name: "Royal Canin Mini Adult",
          description:
            "Alimento completo para perros adultos de razas pequeñas (hasta 10kg) de 10 meses a 8 años",
          price: 89_990,
          stock: 25,
          brand: "Royal Canin",
          categoryId: "alimentos-perros",
          imgUrl: "https://cdn.example.com/royal-canin-mini.jpg",
          publicId: "products/royal-canin-mini-001",
        },
      },
      ejemplo2: {
        summary: "Producto sin stock inicial",
        value: {
          sku: "SKU-COLLAR-001",
          name: "Collar ajustable nylon",
          description: "Collar ajustable de nylon resistente para perros",
          price: 15_500,
          categoryId: "accesorios-perros",
          publicId: "products/collar-nylon-001",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Producto creado exitosamente",
  })
  @ApiResponse({
    status: 400,
    description:
      "Datos de entrada inválidos. Verifique que todos los campos requeridos estén presentes y cumplan con las validaciones.",
  })
  @ApiResponse({
    status: 409,
    description: "El SKU ya existe en el sistema",
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get("")
  @ApiOperation({
    summary: "Listar todos los productos",
    description: "Obtiene el listado completo de productos del catálogo con toda su información",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de productos obtenida exitosamente",
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  findAll() {
    return this.productsService.findAll()
  }

  @Get(":sku")
  @ApiOperation({
    summary: "Obtener un producto por SKU",
    description: "Busca y retorna un producto específico utilizando su código SKU único",
  })
  @ApiParam({
    name: "sku",
    description: "Código SKU único del producto",
    example: "SKU-RC-MINI-001",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Producto encontrado exitosamente",
  })
  @ApiResponse({
    status: 404,
    description: "Producto no encontrado con el SKU proporcionado",
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  findOne(@Param("sku") sku: string) {
    return this.productsService.findOne(sku)
  }

  @Patch(":sku")
  @ApiOperation({
    summary: "Actualizar un producto",
    description:
      "Actualiza parcialmente la información de un producto existente. Solo se modificarán los campos proporcionados.",
  })
  @ApiParam({
    name: "sku",
    description: "Código SKU único del producto a actualizar",
    example: "SKU-RC-MINI-001",
    type: String,
  })
  @ApiBody({
    type: UpdateProductDto,
    description:
      "Campos del producto a actualizar (todos son opcionales para actualización parcial)",
    examples: {
      ejemplo1: {
        summary: "Actualizar precio y stock",
        value: {
          price: 95_990,
          stock: 30,
        },
      },
      ejemplo2: {
        summary: "Actualizar descripción completa",
        value: {
          name: "Royal Canin Mini Adult 3kg",
          description:
            "Alimento completo para perros adultos de razas pequeñas. Nueva presentación 3kg.",
          price: 95_990,
          stock: 30,
        },
      },
      ejemplo3: {
        summary: "Actualizar public_id de imagen",
        value: {
          publicId: "products/royal-canin-mini-new-001",
          imgUrl: "https://cdn.example.com/royal-canin-mini-new.jpg",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Producto actualizado exitosamente",
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Producto no encontrado con el SKU proporcionado",
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  update(@Param("sku") sku: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(sku, updateProductDto)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Eliminar un producto",
    description: "Elimina permanentemente un producto del catálogo utilizando su ID único",
  })
  @ApiParam({
    name: "id",
    description: "ID único UUID del producto a eliminar",
    example: "550e8400-e29b-41d4-a716-446655440000",
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: "Producto eliminado exitosamente (sin contenido en respuesta)",
  })
  @ApiResponse({
    status: 404,
    description: "Producto no encontrado con el ID proporcionado",
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id)
  }
}
