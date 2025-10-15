import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 Iniciando seed de categorías...");

  // Crear categorías principales
  const restoBar = await prisma.category.create({
    data: {
      id: "resto-bar",
      name: "Resto-Bar",
      slug: "resto-bar",
    },
  });

  const sexShop = await prisma.category.create({
    data: {
      id: "sex-shop",
      name: "Sex-Shop",
      slug: "sex-shop",
    },
  });

  console.log("✅ Categorías principales creadas");

  // Subcategorías de Resto-Bar
  const restoBarSubcategories = [
    "promocion",
    "desayuno",
    "sandwich",
    "pizzas",
    "postres",
    "snack",
    "para-compartir",
    "bebestibles",
    "cervezas",
    "vinos",
    "espumantes",
    "destilados",
    "aperitivos",
    "coctels",
  ];

  for (const subcategory of restoBarSubcategories) {
    await prisma.category.create({
      data: {
        id: `resto-bar-${subcategory}`,
        name:
          subcategory.charAt(0).toUpperCase() +
          subcategory.slice(1).replace("-", " "),
        slug: subcategory,
        parentId: restoBar.id,
      },
    });
  }

  console.log("✅ Subcategorías de Resto-Bar creadas");

  // Subcategorías de Sex-Shop
  const sexShopSubcategories = [
    "accesorios",
    "anillos",
    "vibradores",
    "dildos",
    "preservativos",
    "gel-lubricantes",
    "juguetes",
    "lenceria-femenina",
    "lenceria-masculina",
    "otros",
  ];

  for (const subcategory of sexShopSubcategories) {
    await prisma.category.create({
      data: {
        id: `sex-shop-${subcategory}`,
        name:
          subcategory.charAt(0).toUpperCase() +
          subcategory.slice(1).replace("-", " "),
        slug: subcategory,
        parentId: sexShop.id,
      },
    });
  }

  console.log("✅ Subcategorías de Sex-Shop creadas");

  console.log("🎉 Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
