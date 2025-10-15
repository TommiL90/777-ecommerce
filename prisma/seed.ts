import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main(): Promise<void> {
  console.log("🌱 Iniciando seed de categorías...")

  // Crear categorías principales con UUIDs
  console.log("📁 Creando categorías principales...")
  const restoBar = await prisma.category.create({
    data: {
      name: "Resto-Bar",
      slug: "resto-bar",
    },
  })

  const sexShop = await prisma.category.create({
    data: {
      name: "Sex-Shop",
      slug: "sex-shop",
    },
  })

  console.log("✅ Categorías principales creadas")

  // Subcategorías de Resto-Bar
  console.log("📂 Creando subcategorías de Resto-Bar...")
  const restoBarSubcategories = [
    { slug: "promocion", name: "Promoción" },
    { slug: "desayuno", name: "Desayuno" },
    { slug: "sandwich", name: "Sandwich" },
    { slug: "pizzas", name: "Pizzas" },
    { slug: "postres", name: "Postres" },
    { slug: "snack", name: "Snack" },
    { slug: "para-compartir", name: "Para Compartir" },
    { slug: "bebestibles", name: "Bebestibles" },
    { slug: "cervezas", name: "Cervezas" },
    { slug: "vinos", name: "Vinos" },
    { slug: "espumantes", name: "Espumantes" },
    { slug: "destilados", name: "Destilados" },
    { slug: "aperitivos", name: "Aperitivos" },
    { slug: "coctels", name: "Coctels" },
  ]

  const restoBarCategories: Array<{ id: string; slug: string }> = []
  for (const subcategory of restoBarSubcategories) {
    const category = await prisma.category.create({
      data: {
        name: subcategory.name,
        slug: subcategory.slug,
        parentId: restoBar.id,
      },
    })
    restoBarCategories.push(category)
  }

  console.log(`✅ ${restoBarSubcategories.length} subcategorías de Resto-Bar creadas`)

  // Subcategorías de Sex-Shop
  console.log("📂 Creando subcategorías de Sex-Shop...")
  const sexShopSubcategories = [
    { slug: "accesorios", name: "Accesorios" },
    { slug: "anillos", name: "Anillos" },
    { slug: "vibradores", name: "Vibradores" },
    { slug: "dildos", name: "Dildos" },
    { slug: "preservativos", name: "Preservativos" },
    { slug: "gel-lubricantes", name: "Gel Lubricantes" },
    { slug: "juguetes", name: "Juguetes" },
    { slug: "lenceria-femenina", name: "Lencería Femenina" },
    { slug: "lenceria-masculina", name: "Lencería Masculina" },
    { slug: "otros", name: "Otros" },
  ]

  const sexShopCategories: Array<{ id: string; slug: string }> = []
  for (const subcategory of sexShopSubcategories) {
    const category = await prisma.category.create({
      data: {
        name: subcategory.name,
        slug: subcategory.slug,
        parentId: sexShop.id,
      },
    })
    sexShopCategories.push(category)
  }

  console.log(`✅ ${sexShopSubcategories.length} subcategorías de Sex-Shop creadas`)

  const totalCategories = await prisma.category.count()
  console.log(`\n📊 Total de categorías creadas: ${totalCategories}`)
  console.log("🎉 Seed completado exitosamente")
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
