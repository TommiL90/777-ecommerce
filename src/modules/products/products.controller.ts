import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { CreateProductDto } from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("")
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get("")
  findAll() {
    return this.productsService.findAll();
  }

  @Get(":sku")
  findOne(@Param("sku") sku: string) {
    return this.productsService.findOne(sku);
  }

  @Patch(":sku")
  update(@Param("sku") sku: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(sku, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
