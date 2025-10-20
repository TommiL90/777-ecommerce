# Project: 777 E-commerce API

## Project Overview

This is the backend API for an e-commerce system. It is built with **NestJS** (a Node.js framework) and **TypeScript**. The project uses **Prisma** as its Object-Relational Mapper (ORM) to interact with a **MySQL** database.

The API provides endpoints for managing products and categories. It uses **Zod** for data validation to ensure that incoming request bodies match the expected schemas. API documentation is automatically generated and served using **Swagger/OpenAPI**.

The project is configured to run with a MySQL database in a **Docker** container for local development, as defined in the `docker-compose.yml` file.

## Building and Running

The project uses `pnpm` as its package manager.

### Initial Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Configure environment variables:**
    Copy the `.env.example` file to a new file named `.env` and update the database credentials if necessary.
    ```bash
    cp .env.example .env
    ```
3.  **Start the database:**
    The project is configured to work with a MySQL database using Docker.
    ```bash
    docker compose up -d
    ```
4.  **Apply the database schema:**
    This command will synchronize the Prisma schema with the database.
    ```bash
    pnpm run db:push
    ```
5.  **Seed the database:**
    This command will populate the database with initial data (categories).
    ```bash
    pnpm run db:seed
    ```

### Running the Application

*   **Development mode:**
    Starts the application with hot-reloading enabled.
    ```bash
    pnpm run start:dev
    ```
    The server will be running at `http://localhost:3000`.
    The Swagger API documentation will be available at `http://localhost:3000/api`.

*   **Production mode:**
    ```bash
    # Build the project
    pnpm run build

    # Start the compiled application
    pnpm run start:prod
    ```

### Testing

*   **Unit tests:**
    ```bash
    pnpm run test
    ```
*   **End-to-end tests:**
    ```bash
    pnpm run test:e2e
    ```

## Development Conventions

### Code Style and Formatting

The project uses **Biome** (via `ultracite`) for code formatting and linting. The configuration is in the `biome.jsonc` file.

*   **Check for issues:**
    ```bash
    pnpm run lint
    ```
*   **Automatically fix issues:**
    ```bash
    pnpm run lint:fix
    ```

### Architecture

*   **Modular Structure:** The application is divided into modules for different features (e.g., `products`, `categories`). Each module contains its own controllers, services, repositories, and DTOs.
*   **Repository Pattern:** The project uses the repository pattern to separate the data access logic from the business logic. The `repositories` directory in each module contains the interfaces and implementations for accessing the database.
*   **Data Transfer Objects (DTOs):** DTOs are used to define the shape of data for requests and responses. They are defined using Zod schemas in the `dto` directory of each module.
*   **Global Exception Filter:** A global exception filter (`src/core/filters/global-exception.filter.ts`) is used to catch and handle all unhandled exceptions in a consistent manner.

## Production Deployment Notes

The production VPS uses a "Setup Node.js" interface (like the one in cPanel or Plesk) for managing Node.js applications. However, project management tasks like installing dependencies, building the project, and running database commands should be done using `pnpm` via the command line. The web interface is only used to start or stop the application.