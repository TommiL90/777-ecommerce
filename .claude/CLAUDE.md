# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

777-ecommerce is a NestJS-based e-commerce backend application built with TypeScript. The project uses pnpm for package management and enforces strict code quality standards through Ultracite (Biome-based linter and formatter).

Key technologies:
- **Framework**: NestJS 11.x with TypeScript 5.7
- **Database**: MySQL 8.0 via Prisma ORM 6.17
- **Validation**: Zod with nestjs-zod integration
- **Documentation**: Swagger/OpenAPI via @nestjs/swagger
- **Linter/Formatter**: Ultracite (Biome 2.2.6)
- **Testing**: Jest 30.x

## Development Commands

### Setup
```bash
pnpm install                # Install dependencies
docker compose up -d        # Start MySQL database
npx prisma db push          # Sync database schema (development)
```

### Running the Application
```bash
pnpm run start              # Start in production mode
pnpm run start:dev          # Start in development mode with watch
pnpm run start:debug        # Start in debug mode with watch
```

Server runs on `http://localhost:3000` by default. Swagger UI is available at `http://localhost:3000/api`.

### Building
```bash
pnpm run build              # Build the application
```

### Testing
```bash
pnpm run test               # Run unit tests
pnpm run test:watch         # Run tests in watch mode
pnpm run test:cov           # Run tests with coverage
pnpm run test:e2e           # Run end-to-end tests
pnpm run test:debug         # Run tests in debug mode
```

### Code Quality
```bash
npx ultracite check         # Check for code issues
npx ultracite fix           # Auto-fix code issues
```

### Database Management
```bash
npx prisma db push          # Sync schema to database (development, no migrations)
npx prisma generate         # Regenerate Prisma Client
npx prisma studio           # Open Prisma Studio GUI
pnpm run prisma:seed        # Seed database with initial data
```

**Important**: Use `prisma db push` for development instead of `prisma migrate dev` as the MySQL user doesn't have shadow database permissions.

### Docker Services
```bash
docker compose up -d        # Start MySQL database
docker compose down         # Stop MySQL database
docker compose ps           # Check container status
```

The MySQL database is configured with:
- Port: 3306
- Database: app_test
- User: app / Password: app
- Root: root / Password: root
- Uses tmpfs for ephemeral storage (data is lost on container restart)
- Initialization scripts can be placed in ./docker/mysql-init/

## Architecture

### NestJS Module Structure

The application follows a domain-driven modular architecture:

```
src/
├── main.ts                 # Application entry point with Swagger setup
├── app.module.ts           # Root module
├── database/
│   └── prisma.service.ts   # Prisma client service (implements OnModuleInit, OnModuleDestroy)
└── modules/
    └── [domain]/           # One module per business domain
        ├── [domain].module.ts
        ├── [domain].controller.ts
        ├── [domain].service.ts
        ├── dto/
        │   ├── create-[entity].dto.ts    # Zod schemas with createZodDto()
        │   └── update-[entity].dto.ts    # Partial schemas
        ├── entities/
        │   └── [entity].entity.ts        # Domain entities
        └── repositories/
            ├── [domain].repository.ts          # Abstract repository interface
            └── prisma/
                └── [domain].prisma.repository.ts
```

### Key Architectural Patterns

**Repository Pattern**:
- Abstract repository class defines the contract (marked with `@Injectable()`)
- Prisma implementation injected via custom provider in module
- Services depend on the abstraction, not the implementation

**DTO Validation with Zod**:
- All DTOs use Zod schemas wrapped with `createZodDto()` from `nestjs-zod`
- Schemas must align with Prisma models (field types, optional/required)
- Global `ZodValidationPipe` configured in `main.ts`
- Swagger documentation generated automatically from Zod schemas via `cleanupOpenApiDoc()`

**Dependency Injection Critical Rules**:
- Classes used in DI (services, repositories) MUST use normal `import`, NOT `import type`
- Only pure type imports (interfaces, type aliases for inference) should use `import type`
- Biome's `useImportType` rule is disabled to prevent this issue
- Abstract repository classes MUST have `@Injectable()` decorator

### Modules

Current modules:
- **ProductsModule**: Product catalog management with full CRUD operations

Planned modules (per architecture):
- **Core Module**: Global filters, guards, interceptors, middlewares
- **Shared Module**: Cross-module utilities and business logic

### Services

- One service per entity
- Business logic and orchestration
- Depend on repository abstractions
- Use NestJS exceptions (`NotFoundException`, `ConflictException`, etc.)

### TypeScript Configuration

- Module system: Node.js ESNext with `nodenext` module resolution
- Target: ES2023
- Strict null checks enabled
- Decorators enabled (required for NestJS)
- Output: `./dist`
- Path aliases configured in tsconfig.json

## Code Style Guidelines

### Language and Documentation
- **Code**: English for all code (variables, functions, classes, comments)
- **Documentation/Comments**: Spanish (JSDoc, inline explanations)

### Naming Conventions
- **Classes**: PascalCase
- **Variables/Functions/Methods**: camelCase
- **Files/Directories**: kebab-case
- **Environment Variables**: UPPERCASE
- **Boolean Variables**: Start with verbs (isLoading, hasError, canDelete)
- **Functions**: Start with verbs (get, create, update, delete, check, validate)
- **Constants**: Named constants instead of magic numbers

### TypeScript Specifics
- Always declare types for variables and functions (parameters and return values)
- Avoid using `any` type (disabled by Biome)
- Create necessary types
- Use JSDoc for public classes and methods (in Spanish)
- One export per file
- Don't use TypeScript enums (use const objects with `as const`)
- Use `export type` and `import type` for type-only imports (except for DI classes)

### Function Guidelines
- Keep functions short (less than 20 instructions)
- Single purpose per function
- Avoid nesting blocks:
  - Use early returns
  - Extract to utility functions
- Use higher-order functions (map, filter, reduce) instead of `for...of` (Biome enforces this)
- Use arrow functions for simple functions (less than 3 instructions)
- Use named functions for complex functions
- Use default parameter values instead of null/undefined checks
- Use RO-RO pattern (Receive Object, Return Object) for multiple parameters
- Maintain single level of abstraction
- Don't leave blank lines within functions

### Class Guidelines (SOLID Principles)
- Follow SOLID principles
- Prefer composition over inheritance
- Declare interfaces to define contracts
- Keep classes small (less than 200 instructions, less than 10 public methods, less than 10 properties)

### Data Management
- Avoid primitive obsession, encapsulate data in composite types
- Use classes with internal validation (Zod schemas for DTOs)
- Prefer immutability (use `readonly`, `as const`)

### Exception Handling
- Use exceptions for unexpected errors only
- Catch exceptions to:
  - Fix expected problems
  - Add context
- Use NestJS built-in exceptions (`NotFoundException`, `ConflictException`, etc.)
- Let global exception handler deal with unhandled exceptions

### Testing Standards
- Follow Arrange-Act-Assert convention for tests
- Use clear variable names: inputX, mockX, actualX, expectedX
- Write unit tests for each public function
- Use test doubles for dependencies (except inexpensive third-party deps)
- Write acceptance tests for each module (Given-When-Then convention)
- Add admin/test method to each controller as smoke test

## Code Quality Enforcement

This project uses **Ultracite** (Biome-based) for code quality with strict rules:

Key disabled rules for NestJS compatibility:
- `useImportType`: OFF (required for dependency injection)
- `useHookAtTopLevel`: OFF (conflicts with NestJS method names like `useGlobalPipes`)
- `noParameterProperties`: OFF (NestJS uses constructor parameter properties)
- `noMagicNumbers`: OFF
- `useConst`: OFF
- `useReadonlyClassProperties`: OFF
- `noExplicitAny`: OFF (warn level)

Strict enforcements:
- No TypeScript enums (use const objects with `as const`)
- No `@ts-ignore` comments
- Use `for...of` instead of `Array.forEach`
- Use `node:` protocol for Node.js builtins
- Always use `===` and `!==`
- No unused imports, variables, or parameters (warn level)
- No console statements (except in development utilities)

Formatter settings:
- Indent: 2 spaces
- Quote style: double quotes
- Semicolons: as needed
- Trailing commas: ES5
- Line width: 100 characters

## Critical Patterns and Gotchas

### Dependency Injection with Abstract Classes

**MUST DO**:
```typescript
// Abstract repository MUST have @Injectable()
@Injectable()
export abstract class ProductsRepository { ... }

// Service MUST import class normally, NOT as type
import { ProductsRepository } from "./repositories/products.repository"

export class ProductsService {
  constructor(private repository: ProductsRepository) {}
}
```

**DO NOT**:
```typescript
// ❌ Missing @Injectable() on abstract class
export abstract class ProductsRepository { ... }

// ❌ Using import type for DI classes
import type { ProductsRepository } from "..."
```

### Zod DTO Pattern

```typescript
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

// 1. Define schema
export const CreateProductSchema = z.object({
  name: z.string().min(3).max(120),
  price: z.number().positive(),
  stock: z.number().int().nonnegative().optional().default(0),
})

// 2. Create DTO class for NestJS/Swagger
export class CreateProductDto extends createZodDto(CreateProductSchema) {}

// 3. Optional: Infer type for internal use
export type CreateProductInput = z.infer<typeof CreateProductSchema>
```

### Prisma Schema Alignment

DTOs must match Prisma schema:
- Optional fields in Prisma → `.optional()` in Zod
- Default values in Prisma → `.optional().default(value)` in Zod
- Field types must match exactly (String → string, Int → number, Float → number)

### Database Operations

- Use `npx prisma db push` for schema synchronization (not `prisma migrate dev`)
- Always run `npx prisma generate` after schema changes
- Prisma Client is injected as `PrismaService` (implements lifecycle hooks)

## Current Project State

Implemented features:
- **ProductsModule**: Complete CRUD with Zod validation and Swagger docs
  - GET /products - List all products
  - GET /products/:sku - Get product by SKU
  - POST /products - Create product
  - PATCH /products/:sku - Update product
  - DELETE /products/:id - Delete product
- Swagger UI at `/api`
- MySQL database with Docker
- Prisma ORM with repository pattern
- Global Zod validation

Ready for:
- Additional domain modules following the same pattern
- Core module for global filters/guards/interceptors
- Shared module for cross-cutting concerns
- Authentication/authorization module
