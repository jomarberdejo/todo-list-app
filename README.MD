# Todo List Application

A full-stack Todo List application built with **React**, **TypeScript**, **Express**, **Prisma v6**, and **MongoDB**. This project focuses on functionality with user authentication via **JWT** stored in **local storage**, CRUD operations for todos, and task management features including search, filtering, sorting, and pagination.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Setup & Installation](#setup--installation)
* [Assumptions & Decisions](#assumptions--decisions)
* [Future Enhancements](#future-enhancements)

---

## Features

### Implemented

* User authentication (signup/login) with JWT stored in **local storage**
* Create, read, update, and delete todo items
* Mark todos as completed or pending
* **Search** todos by title or description
* **Filter** todos by status
* **Sort** todos by date or title
* **Pagination** for todo lists
* Responsive UI with React and ShadcnUI

### Planned / Not Implemented Yet

* **Task Prioritization**: Add priority levels (high, medium, low)
* **Categories**: Allow users to categorize todo items
* **HTTP ONLY COOKIE**: Store in http only cookie instead of jwt for security and less vulnerability

---

## Tech Stack

* **Frontend**: React, TypeScript
* **Backend**: Express, TypeScript
* **Database**: MongoDB, Prisma v6
* **Authentication**: JWT stored in local storage
* **Environment Variables**: `.env` files for client and server

---

## Project Structure

```
root/
│
├─ client/                 # React frontend
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   └─ utils/
│   ├─ .env
│   └─ package.json
│
├─ server/                 # Express backend
│   ├─ src/
│   │   ├─ controllers/
│   │   ├─ routes/
│   │   ├─ middleware/
│   │   ├─ prisma/
│   │   └─ index.ts
│   ├─ .env
│   └─ package.json
│
│
└─ README.md
```

**Design choices**:

* **Prisma v6** was chosen because Prisma v7 is unstable at the time of development.
* **MongoDB** is used for scalability and simplicity with JSON-like documents.
* JWT is stored in **local storage** for simplicity during development.
* Backend uses **TypeScript** for type safety and maintainability.

---

## Setup & Installation

### Prerequisites

* Node.js >= 18
* npm or yarn
* MongoDB Atlas or local MongoDB instance

### Clone the repository

```bash
git clone https://github.com/jomarberdejo/todo-list-app.git
cd todo-app
```

### Backend setup

```bash
cd server
npm install
cp .env.example .env       # add your MongoDB URI and JWT secret
npx prisma db push         # migrate db schema
npx prisma generate        # generate Prisma client
npm run dev                # start backend server
```

### Frontend setup

```bash
cd client
npm install
cp .env.example .env       # add your frontend environment variables
npm run dev                # start React development server
```

Your application should now be running at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

---

## Assumptions & Decisions

* JWT is stored in **local storage** for simplicity.
* **Task prioritization** and **categories** are planned but not yet implemented.
* Search, filtering, sorting, and pagination are implemented for better usability.
* Prisma v6 is used with MongoDB for stability.
* Separate `.env` files are used for frontend and backend configuration.

---

## References

* [Prisma Docs](https://www.prisma.io/docs)
* [React Docs](https://reactjs.org/docs/getting-started.html)
* [Express Docs](https://expressjs.com/)
* [MongoDB Docs](https://www.mongodb.com/docs/)

---

