import type { CreateProductDto } from "../dto/create-product.dto";
import type { UpdateProductDto } from "../dto/update-product.dto";
import type { Product } from "../entities/product.entity";

export abstract class ProductsRepository {
  abstract create(createProductDto: CreateProductDto): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findOne(sku: string): Promise<Product>;
  abstract update(
    sku: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product>;

  abstract remove(sku: string): Promise<void>;
}
