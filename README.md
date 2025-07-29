# Brain-Ag API

A robust agro management API built with NestJS, Prisma, and PostgreSQL.

## 🧱 Visão Geral

- 🎯 Advanced filters (with `between`) for queries
- 📑 Documentation via Swagger
- 🧪 Automated testing with Jest
- 📦 Running with Docker Compose
- 🧼 SOLID and Clean Code patterns
- 🧰 Patterns: Factory, Repository, Interface Segregation

---

## 🚀 Tecnologias

- **NestJS** – main framework
- **Prisma ORM** – database access
- **PostgreSQL** – relational database
- **Swagger** – automatic documentation
- **Docker / Docker Compose** – containerised environment
- **Jest** – automated testing

---

## 🧭 Estrutura do Projeto

````bash
📦 src/
│
├── contexts/                # Módulos principais da aplicação
│   ├── culture/             # CRUD de cultura
│   ├── dashboard/           # dashboard query
│   ├── farm/                # CRUD de fazendas
│   ├── harvest/             # CRUD de colheitas
│   ├── health/              # Health check
│   ├── producer/            # CRUD de produtor
│   └── contexts.module.ts
│
├── resources/               # Recursos compartilhados
│   ├── database/            # Configuração do Prisma
│   ├── swagger/             # Setup da documentação Swagger
│   ├── errors-handler.ts    # Manipulação global de erros
│   └── resources.module.ts
│
├── app.module.ts
├── main.ts
│
📦 prisma/
│   ├── schema.prisma        # Modelo do banco
│   ├── migrations/          # Migrations geradas
│   └── seed.ts              # Popula base de dados

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
cd comunicados-api

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
npm run t
```

- Tests cover controllers and services, using mocks for external dependencies.
