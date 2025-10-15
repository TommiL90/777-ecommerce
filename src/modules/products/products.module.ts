import { Module } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { CategoriesModule } from "../categories/categories.module"
import { ProductsController } from "./products.controller"
import { ProductsService } from "./products.service"
import { ProductsPrismaRepository } from "./repositories/prisma/products.prisma.repository"
import { ProductsRepository } from "./repositories/products.repository"

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    {
      provide: ProductsRepository,
      useClass: ProductsPrismaRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
