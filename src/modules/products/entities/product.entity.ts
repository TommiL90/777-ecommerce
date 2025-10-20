import { randomUUID } from "node:crypto"

export class Product {
  readonly id: string
  name: string
  price: number // Int en Prisma - pesos chilenos sin decimales
  brand: string
  description: string
  stock: number
  sku: string
  categoryId: string
  imgUrl: string | null
  publicId: string
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = randomUUID()
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
