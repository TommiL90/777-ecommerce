/**
 * Entidad Category
 * Representa una categoría en el sistema con soporte para jerarquía (parent/children)
 */
export class Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date

  // Relaciones opcionales
  parent?: Category
  children?: Category[]
  _count?: {
    products: number
    children: number
  }
}
