# Brain-Ag API

A robust agro management API built with NestJS, Prisma, and PostgreSQL.

## 🧱 Overview

- 🎯 Advanced filters (with `between`) for queries
- 📑 Documentation via Swagger
- 🧪 Automated testing with Jest
- 📦 Running with Docker Compose
- 🧼 SOLID and Clean Code patterns
- 🧰 Patterns: Factory, Repository, Interface Segregation

---

## 🚀 Technologies

- **NestJS** – main framework
- **Prisma ORM** – database access
- **PostgreSQL** – relational database
- **Swagger** – automatic documentation
- **Docker / Docker Compose** – containerised environment
- **Jest** – automated testing

---

## 🧭 Project Structure

````bash
📦 src/
│
├── contexts/                # Main modules of the application
│   ├── crops/               # CRUD of crops
│   ├── dashboard/           # dashboard query
│   ├── farm/                # CRUD of farm
│   ├── harvest/             # CRUD of harvest
│   ├── health/              # Health check
│   ├── producer/            # CRUD of producer
│   └── contexts.module.ts
│
├── resources/               # Shared resources
│   ├── database/            # Prisma Configuration
│   ├── swagger/             # Swagger documentation setup
│   ├── errors-handler.ts    # Global error handling
│   └── resources.module.ts
│
├── app.module.ts
├── error-response.dto.ts
├── main.ts
│
📦 prisma/
│   ├── schema.prisma        # Schema database
│   ├── migrations/          # Migrations 
│   └── seed.ts              # seeds for test

---

## 📋 Notes

- Follow the `.env.example` pattern for environment configuration.
- The project is ready for both production and development; just adjust `DATABASE_URL` as needed.
- For Clean Code and SOLID examples, check the service, repository, and controller files.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/seu-usuario/Brain-Ag.git
cd Brain-Ag

# Copy the envs
cp .env.example .env
````

### 2. Run with Docker

```bash
docker-compose up --build
```

- This will start the database, run migrations, and launch the API.
- To run migrations manually:

  ```bash
  docker-compose run --rm migrate
  ```

  - To run seed manually:

  ```bash
  docker-compose run --rm seed
  ```

  - To run tests manually:

  ```bash
  docker-compose run --rm test
  ```

---

### 4. Access Swagger Documentation

After starting the app, visit:

```
http://localhost:3000/swagger
```

You can interact with all API endpoints here.

---

## 🧑‍💻 Project Patterns

### Clean Code

- Small, clear, and well-named methods.
- Clear separation of concerns: Controller, Service, Repository, DTOs, and Entities.
- Comments only where necessary.

### SOLID Principles

- **S**ingle Responsibility: Each class has one responsibility.
- **O**pen/Closed: Classes are open for extension, closed for modification.
- **L**iskov Substitution: Use of abstractions for repositories and services.
- **I**nterface Segregation: Small, specific interfaces.
- **D**ependency Inversion: Depend on abstractions, not concrete implementations.

---

## 🧪 Running Tests

Run unit tests with:

```bash
npm run test
```

- Tests cover controllers and services, using mocks for external dependencies for unit and for e2e we use seeds and data
