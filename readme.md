# Task Management Application

A robust and modern task management application built with a separate frontend and backend architecture. Users can securely register, login, and manage their tasks with ease.

## 🚀 Tech Stack

### Frontend (`client/`)

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** TailwindCSS, Shadcn UI
- **Forms & Validation:** React Hook Form, Zod
- **Testing:** Vitest, React Testing Library

### Backend (`server/`)

- **Runtime:** Node.js (Express)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma

---

## 🛠️ Prerequisites

Ensure you have the following installed:

- [Bun](https://bun.sh/) (v1.0+)
- [PostgreSQL](https://www.postgresql.org/)

---

## ⚙️ Local Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Install Dependencies

Install dependencies for both client and server separately:

**Server:**

```bash
cd server
bun install
```

**Client:**

```bash
cd client
bun install
```

### 3. Environment Setup

Create `.env` files for both client and server based on the examples.

**Server (`server/.env`):**

```bash
cp server/.env.example server/.env
```

Update `DATABASE_URL` and `JWT_SECRET` with your local values.

**Client (`client/.env`):**

```bash
cp client/.env.example client/.env
```

### 4. Database Setup

Initialize the database and apply migrations:

```bash
cd server
bun x prisma migrate dev --name init
# OR for quick prototyping without migrations:
# bun x prisma db push
cd ..
```

---

## ▶️ Running the Application

Start the backend server first, then the frontend client.

### 1. Start Backend Server

```bash
cd server
bun server.ts
```

The server will start on http://localhost:3000.

### 2. Start Frontend Client

Open a new terminal and run:

```bash
cd client
bun run dev
```

The application will be available at http://localhost:5173.

---

## 🧪 Running Tests

### Frontend Tests

Run unit and integration tests for React components:

```bash
bun run test:client
```

## 📡 API Documentation

| Method   | Endpoint             | Description                      | Auth Required |
| :------- | :------------------- | :------------------------------- | :-----------: |
| `POST`   | `/api/auth/register` | Register a new user              |      ❌       |
| `POST`   | `/api/auth/login`    | Login and receive JWT            |      ❌       |
| `GET`    | `/api/tasks`         | Get all tasks for logged-in user |      ✅       |
| `POST`   | `/api/tasks`         | Create a new task                |      ✅       |
| `PUT`    | `/api/tasks/:id`     | Update an existing task          |      ✅       |
| `DELETE` | `/api/tasks/:id`     | Delete a task                    |      ✅       |
