# 777 E-commerce API

API Backend para sistema de e-commerce desarrollada con **NestJS**, **Prisma ORM** y **MySQL**.

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Ejecución](#-ejecución)
- [Scripts Disponibles](#-scripts-disponibles)
- [Documentación API](#-documentación-api)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Deployment](#-deployment)

## 🛠 Stack Tecnológico

- **Framework**: NestJS 11.x con TypeScript 5.7
- **Base de Datos**: MySQL 8.0 con Prisma ORM 6.17
- **Validación**: Zod 4.1 con nestjs-zod integration
- **Documentación**: Swagger/OpenAPI vía @nestjs/swagger
- **Linter/Formatter**: Ultracite (Biome 2.2.6)
- **Testing**: Jest 30.x
- **Package Manager**: pnpm

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **MySQL** 8.0 (o Docker para ejecutar MySQL en contenedor)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd 777-ecommerce
```

### 2. Instalar dependencias

```bash
pnpm install
```

Este comando automáticamente ejecutará `prisma generate` gracias al script `postinstall`.

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configúralo según tu entorno:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_db"
NODE_ENV="dev"
PORT=3000
APP_NAME="777 E-commerce API"
APP_VERSION="1.0.0"
```

## ⚙️ Configuración

### Opción A: Usar MySQL local

Si tienes MySQL instalado localmente, crea la base de datos:

```sql
CREATE DATABASE app_test;
CREATE USER 'app'@'localhost' IDENTIFIED BY 'app';
GRANT ALL PRIVILEGES ON app_test.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

### Opción B: Usar Docker (Recomendado)

El proyecto incluye un `docker-compose.yml` para MySQL:

```bash
# Iniciar MySQL en contenedor
docker compose up -d

# Verificar que está corriendo
docker compose ps
```

La configuración de Docker usa:
- Puerto: `3306`
- Base de datos: `app_test`
- Usuario: `app` / Password: `app`
- Root: `root` / Password: `root`
- Storage: tmpfs (datos efímeros)

## 🔄 Sincronización de Base de Datos

### Primera vez / Desarrollo

Sincroniza el esquema de Prisma con la base de datos:

```bash
pnpm run db:push
```

⚠️ **Importante**: Este proyecto usa `prisma db push` en lugar de migraciones porque el usuario MySQL no tiene permisos para crear shadow database.

### Ejecutar Seed (Primera vez)

Popula la base de datos con categorías iniciales:

```bash
pnpm run db:seed
```

Esto creará:
- **Resto-Bar** con 14 subcategorías (Promoción, Desayuno, Sandwich, Pizzas, Postres, etc.)
- **Sex-Shop** con 10 subcategorías (Accesorios, Anillos, Vibradores, Preservativos, etc.)

## 🏃 Ejecución

### Modo Desarrollo

```bash
pnpm run start:dev
```

El servidor iniciará en `http://localhost:3000` con hot-reload activado.

### Modo Producción

```bash
# 1. Compilar el proyecto
pnpm run build

# 2. Ejecutar la versión compilada
pnpm run start:prod
```

### Modo Debug

```bash
pnpm run start:debug
```

Permite conectar un debugger en el puerto `9229`.

## 📜 Scripts Disponibles

### Desarrollo

| Script | Descripción |
|--------|-------------|
| `pnpm run start` | Inicia el servidor en modo producción |
| `pnpm run start:dev` | Inicia el servidor con hot-reload |
| `pnpm run start:debug` | Inicia el servidor en modo debug |
| `pnpm run build` | Compila el proyecto TypeScript |

### Base de Datos

| Script | Descripción |
|--------|-------------|
| `pnpm run db:push` | Sincroniza esquema Prisma con MySQL (desarrollo) |
| `pnpm run db:push:prod` | Sincroniza esquema con `--accept-data-loss` (producción) |
| `pnpm run db:migrate:deploy` | Aplica migraciones en producción (cuando se usen) |
| `pnpm run db:seed` | Ejecuta el seed para poblar datos iniciales |
| `pnpm run db:studio` | Abre Prisma Studio para visualizar la BD |
| `pnpm run db:generate` | Regenera Prisma Client |

### Testing

| Script | Descripción |
|--------|-------------|
| `pnpm run test` | Ejecuta tests unitarios |
| `pnpm run test:watch` | Ejecuta tests en modo watch |
| `pnpm run test:cov` | Ejecuta tests con cobertura |
| `pnpm run test:e2e` | Ejecuta tests end-to-end |

### Calidad de Código

| Script | Descripción |
|--------|-------------|
| `pnpm run lint` | Verifica código con Ultracite/Biome |
| `pnpm run lint:fix` | Auto-corrige problemas de código |

## 📚 Documentación API

Una vez el servidor esté corriendo, accede a la documentación interactiva Swagger:

```
http://localhost:3000/api
```

La documentación incluye:
- Todos los endpoints disponibles
- Schemas de validación con ejemplos
- Códigos de respuesta HTTP
- Posibilidad de probar los endpoints directamente

## 📁 Estructura del Proyecto

```
777-ecommerce/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.ts                # Script de seed
├── src/
│   ├── config/
│   │   └── env.schema.ts      # Validación de variables de entorno
│   ├── core/
│   │   └── filters/
│   │       └── global-exception.filter.ts  # Manejo global de errores
│   ├── database/
│   │   └── prisma.service.ts  # Servicio de Prisma Client
│   ├── modules/
│   │   ├── products/          # Módulo de productos
│   │   │   ├── dto/           # DTOs con validación Zod
│   │   │   ├── entities/      # Entidades de dominio
│   │   │   ├── repositories/  # Patrón repositorio
│   │   │   │   ├── products.repository.ts
│   │   │   │   └── prisma/
│   │   │   │       └── products.prisma.repository.ts
│   │   │   ├── schemas/       # Schemas de validación Zod
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   └── products.module.ts
│   │   └── categories/        # Módulo de categorías (misma estructura)
│   ├── app.module.ts          # Módulo raíz
│   └── main.ts                # Punto de entrada
├── test/                      # Tests E2E
├── .env                       # Variables de entorno (no commitear)
├── .env.example               # Template de variables de entorno
├── docker-compose.yml         # Configuración de MySQL
├── package.json               # Dependencias y scripts
└── README.md                  # Este archivo
```

## 🚀 Deployment

### Preparación para Producción

1. **Configurar variables de entorno**:
   ```bash
   # En el servidor de producción
   NODE_ENV=production
   DATABASE_URL=mysql://user:pass@host:3306/db_prod
   PORT=3000
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install --prod
   ```

3. **Compilar el proyecto**:
   ```bash
   pnpm run build
   ```

4. **Sincronizar base de datos**:
   ```bash
   pnpm run db:push:prod
   ```

5. **Ejecutar seed** (solo primera vez):
   ```bash
   pnpm run db:seed
   ```

6. **Iniciar aplicación**:
   ```bash
   pnpm run start:prod
   ```

### Usando PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar con PM2
pm2 start dist/main.js --name "777-ecommerce"

# Guardar configuración PM2
pm2 save

# Configurar PM2 para iniciar en boot
pm2 startup
```

### Variables de Entorno Críticas

Asegúrate de configurar correctamente en producción:

- `NODE_ENV=production` (Importante para optimizaciones)
- `DATABASE_URL` (Credenciales de producción)
- `PORT` (Puerto del servidor)

## ⚠️ Notas Importantes

1. **Prisma db push vs Migrations**:
   - Este proyecto usa `prisma db push` por limitaciones de permisos MySQL
   - Para producción con migraciones, configura permisos de shadow database

2. **Docker MySQL**:
   - Los datos son efímeros (tmpfs)
   - Se pierden al reiniciar el contenedor
   - Para persistencia, modifica `docker-compose.yml`

3. **Seed**:
   - Solo crea categorías, NO productos
   - Ejecutar solo la primera vez o después de reset de BD

## 📝 Licencia

UNLICENSED - Proyecto privado

## 👥 Equipo

777 Team
