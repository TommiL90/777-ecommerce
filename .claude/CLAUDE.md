# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

777-ecommerce is a NestJS-based e-commerce backend application built with TypeScript. The project uses pnpm for package management and enforces strict code quality standards through Ultracite (Biome-based linter and formatter).

## Development Commands

### Setup
```bash
pnpm install
```

### Running the Application
```bash
pnpm run start              # Start in production mode
pnpm run start:dev          # Start in development mode with watch
pnpm run start:debug        # Start in debug mode with watch
```

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

### Docker Services
```bash
docker compose up -d        # Start MySQL database
docker compose down         # Stop MySQL database
```

The MySQL database is configured with:
- Port: 3306
- Database: app_test
- User: app
- Password: app
- Root password: root
- Uses tmpfs for ephemeral storage (lightweight development)
- Initialization scripts can be placed in ./docker/mysql-init/

## Architecture

### NestJS Module Structure

The application follows NestJS modular architecture patterns:

- **Modules**: Encapsulate features by domain/route
  - One module per main domain
  - One primary controller per module route
  - Additional controllers for secondary routes

- **Models Folder Structure**:
  - DTOs validated with class-validator for inputs
  - Simple types for outputs

- **Services**:
  - Business logic and persistence layer
  - Entities with MikroORM for data persistence
  - One service per entity

- **Core Module** (planned): For NestJS artifacts
  - Global filters for exception handling
  - Global middlewares for request management
  - Guards for permission management
  - Interceptors for request management

- **Shared Module** (planned): For cross-module services
  - Utilities
  - Shared business logic

### TypeScript Configuration

- Module system: Node.js ESNext with `nodenext` module resolution
- Target: ES2023
- Strict null checks enabled
- Decorators enabled (required for NestJS)
- Output: `./dist`

## Code Style Guidelines

### Language and Documentation
- **Code**: English for all code
- **Documentation/Comments**: Spanish (as per project convention)

### Naming Conventions
- **Classes**: PascalCase
- **Variables/Functions/Methods**: camelCase
- **Files/Directories**: kebab-case
- **Environment Variables**: UPPERCASE
- **Boolean Variables**: Start with verbs (isLoading, hasError, canDelete)
- **Functions**: Start with verbs
- **Constants**: Avoid magic numbers, define named constants

### TypeScript Specifics
- Always declare types for variables and functions (parameters and return values)
- Avoid using `any` type
- Create necessary types
- Use JSDoc for public classes and methods
- One export per file

### Function Guidelines
- Keep functions short (less than 20 instructions)
- Single purpose per function
- Avoid nesting blocks:
  - Use early returns
  - Extract to utility functions
- Use higher-order functions (map, filter, reduce) instead of forEach
- Use arrow functions for simple functions (less than 3 instructions)
- Use named functions for complex functions
- Use default parameter values instead of null/undefined checks
- Use RO-RO pattern (Receive Object, Return Object) for multiple parameters
- Maintain single level of abstraction

### Class Guidelines (SOLID Principles)
- Follow SOLID principles
- Prefer composition over inheritance
- Declare interfaces to define contracts
- Keep classes small (less than 200 instructions, less than 10 public methods, less than 10 properties)
- Don't leave blank lines within functions

### Data Management
- Avoid primitive obsession, encapsulate data in composite types
- Use classes with internal validation instead of function-level validation
- Prefer immutability (use `readonly`, `as const`)

### Exception Handling
- Use exceptions for unexpected errors only
- Catch exceptions to:
  - Fix expected problems
  - Add context
- Use global exception handlers otherwise

### Testing Standards
- Follow Arrange-Act-Assert convention for tests
- Use clear variable names: inputX, mockX, actualX, expectedX
- Write unit tests for each public function
- Use test doubles for dependencies (except inexpensive third-party deps)
- Write acceptance tests for each module (Given-When-Then convention)
- Add admin/test method to each controller as smoke test

## Code Quality Enforcement

This project uses **Ultracite** (Biome-based) for code quality:
- Zero configuration required
- Subsecond performance
- Maximum type safety
- Strict accessibility standards
- Configuration extends from `ultracite` preset in biome.jsonc

Key enforcements:
- No TypeScript enums (use const objects with `as const`)
- Use `import type` and `export type` for types
- No `any` type
- No `@ts-ignore` comments
- Use `for...of` instead of `Array.forEach`
- Use `node:` protocol for Node.js builtins
- Always use `===` and `!==`
- No unused imports, variables, or parameters

## Current Project State

This is a fresh NestJS project with:
- Basic app module, controller, and service
- Jest testing configured
- Docker Compose setup for MySQL database
- No database ORM configured yet (MikroORM is planned per architecture)
- No additional modules beyond the root AppModule

The project is in its initial state and ready for e-commerce feature development following the modular architecture patterns described above.
