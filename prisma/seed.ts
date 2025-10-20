import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categories = [
  {
    id: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    name: "Resto-Bar",
    slug: "resto-bar",
    parentId: null,
    createdAt: new Date("2025-10-15T21:37:09.907Z"),
    updatedAt: new Date("2025-10-15T21:37:09.907Z"),
  },
  {
    id: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    name: "Sex-Shop",
    slug: "sex-shop",
    parentId: null,
    createdAt: new Date("2025-10-15T21:37:09.908Z"),
    updatedAt: new Date("2025-10-15T21:37:09.908Z"),
  },
  {
    id: "f3c35dc4-ec63-45f3-bd38-d027ca7aaefa",
    name: "Aperitivos",
    slug: "aperitivos",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.913Z"),
    updatedAt: new Date("2025-10-15T21:37:09.913Z"),
  },
  {
    id: "847023b7-68c6-4487-829b-89ba03f34314",
    name: "Bebestibles",
    slug: "bebestibles",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.911Z"),
    updatedAt: new Date("2025-10-15T21:37:09.911Z"),
  },
  {
    id: "45ce8620-5f25-4d60-89ae-2935f75a7a87",
    name: "Cervezas",
    slug: "cervezas",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.912Z"),
    updatedAt: new Date("2025-10-15T21:37:09.912Z"),
  },
  {
    id: "511d9c02-5a94-4916-b9a6-59e9a3defb45",
    name: "Coctels",
    slug: "coctels",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.913Z"),
    updatedAt: new Date("2025-10-15T21:37:09.913Z"),
  },
  {
    id: "59a1c801-708c-4503-afd4-15baa6df8b4a",
    name: "Desayuno",
    slug: "desayuno",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.909Z"),
    updatedAt: new Date("2025-10-15T21:37:09.909Z"),
  },
  {
    id: "7167e854-84fe-4252-bfc6-9bde58ade3ea",
    name: "Destilados",
    slug: "destilados",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.912Z"),
    updatedAt: new Date("2025-10-15T21:37:09.912Z"),
  },
  {
    id: "03f55610-d723-49fb-b9b3-103e069d1559",
    name: "Espumantes",
    slug: "espumantes",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.912Z"),
    updatedAt: new Date("2025-10-15T21:37:09.912Z"),
  },
  {
    id: "c5e0cbd8-32da-4b72-bd63-65d0566bc9f8",
    name: "Para Compartir",
    slug: "para-compartir",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.911Z"),
    updatedAt: new Date("2025-10-15T21:37:09.911Z"),
  },
  {
    id: "b553d318-2816-4c8f-985e-b220d1777387",
    name: "Pizzas",
    slug: "pizzas",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.910Z"),
    updatedAt: new Date("2025-10-15T21:37:09.910Z"),
  },
  {
    id: "45252e63-dddd-4040-8548-7cdf7a69e70e",
    name: "Postres",
    slug: "postres",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.910Z"),
    updatedAt: new Date("2025-10-15T21:37:09.910Z"),
  },
  {
    id: "99fc3765-dea6-4c2c-80a9-a31368ab2acc",
    name: "Promoción",
    slug: "promocion",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.909Z"),
    updatedAt: new Date("2025-10-15T21:37:09.909Z"),
  },
  {
    id: "53d224f4-1227-4889-88f9-f33f3b4e7469",
    name: "Sandwich",
    slug: "sandwich",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.910Z"),
    updatedAt: new Date("2025-10-15T21:37:09.910Z"),
  },
  {
    id: "2ec13012-54eb-4567-ba7e-4b1e365c1a12",
    name: "Snack",
    slug: "snack",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.911Z"),
    updatedAt: new Date("2025-10-15T21:37:09.911Z"),
  },
  {
    id: "d86b0fe7-3702-41d4-a756-972adbec3b06",
    name: "Vinos",
    slug: "vinos",
    parentId: "0d816ff3-c5a5-43f4-90cc-70457bb371db",
    createdAt: new Date("2025-10-15T21:37:09.912Z"),
    updatedAt: new Date("2025-10-15T21:37:09.912Z"),
  },
  {
    id: "5c695b40-04b7-4bc2-a6d4-133db710713f",
    name: "Accesorios",
    slug: "accesorios",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.913Z"),
    updatedAt: new Date("2025-10-15T21:37:09.913Z"),
  },
  {
    id: "47742abf-9c5b-4d64-95e8-8962c1d94e77",
    name: "Anillos",
    slug: "anillos",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.913Z"),
    updatedAt: new Date("2025-10-15T21:37:09.913Z"),
  },
  {
    id: "e635364c-3d5e-4867-a4ba-cf6e28874406",
    name: "Dildos",
    slug: "dildos",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.914Z"),
    updatedAt: new Date("2025-10-15T21:37:09.914Z"),
  },
  {
    id: "89de2867-33ee-480d-83fb-94ca0c0b976b",
    name: "Gel Lubricantes",
    slug: "gel-lubricantes",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.914Z"),
    updatedAt: new Date("2025-10-15T21:37:09.914Z"),
  },
  {
    id: "dab94b74-06bb-4fa2-babf-ff95907a8e9e",
    name: "Juguetes",
    slug: "juguetes",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.914Z"),
    updatedAt: new Date("2025-10-15T21:37:09.914Z"),
  },
  {
    id: "2db5f702-8852-4f4d-ba45-1abcfe0cffce",
    name: "Lencería Femenina",
    slug: "lenceria-femenina",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.915Z"),
    updatedAt: new Date("2025-10-15T21:37:09.915Z"),
  },
  {
    id: "295c3cdd-b32f-4990-bb59-e9db914c2bb5",
    name: "Lencería Masculina",
    slug: "lenceria-masculina",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.915Z"),
    updatedAt: new Date("2025-10-15T21:37:09.915Z"),
  },
  {
    id: "21742271-5983-4dc3-b2fe-f29867804328",
    name: "Otros Sex Shop",
    slug: "otros-sex-shop",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.915Z"),
    updatedAt: new Date("2025-10-15T21:37:09.915Z"),
  },
  {
    id: "e841074c-cc20-4b52-81a2-7fb901cd205d",
    name: "Preservativos",
    slug: "preservativos",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.914Z"),
    updatedAt: new Date("2025-10-15T21:37:09.914Z"),
  },
  {
    id: "a1b6bff5-cca6-4212-8be2-91aeb913f208",
    name: "Vibradores",
    slug: "vibradores",
    parentId: "5194429d-e6e9-4a7e-a1ac-8e4a2577845c",
    createdAt: new Date("2025-10-15T21:37:09.914Z"),
    updatedAt: new Date("2025-10-15T21:37:09.914Z"),
  },
]

async function main() {
  console.log("🌱 Seeding categories...")

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    })
    console.log(`✅ Created category: ${category.name}`)
  }

  console.log("✨ Seeding completed!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
