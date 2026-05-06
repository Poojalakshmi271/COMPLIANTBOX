# CompliantBox — Spring Boot + PostgreSQL Backend

## What Changed
The Node.js/Express/MongoDB backend has been replaced with **Spring Boot + PostgreSQL**.  
The React frontend is **completely unchanged** — all API routes, request/response shapes, and JWT token format are identical.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 17+ |
| Maven | 3.8+ |
| PostgreSQL | 14+ |

---

## Step 1 — Create the PostgreSQL Database

Open psql or pgAdmin and run:

```sql
CREATE DATABASE compliantbox;
```

> The default config assumes username `postgres` and password `postgres`.  
> Update `src/main/resources/application.properties` if yours differ:
> ```
> spring.datasource.username=YOUR_USERNAME
> spring.datasource.password=YOUR_PASSWORD
> ```

---

## Step 2 — Run the Spring Boot Backend

```bash
cd springboot-backend
mvn spring-boot:run
```

The server starts on **port 5000** (same as the Node.js backend).  
On first run, Hibernate auto-creates the `users` and `complaints` tables.  
The **admin account is seeded automatically**:

| Field    | Value               |
|----------|---------------------|
| Email    | admin@company.com   |
| Password | admin123            |

---

## Step 3 — Run the React Frontend (unchanged)

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Routes (identical to original Node.js backend)

| Method | Route                     | Access       | Description              |
|--------|---------------------------|--------------|--------------------------|
| POST   | /api/auth/register        | Public       | Register new user        |
| POST   | /api/auth/login           | Public       | Login and get JWT token  |
| POST   | /api/complaints           | Protected    | Submit new complaint     |
| GET    | /api/complaints/my        | Protected    | Get my complaints        |
| GET    | /api/complaints           | Admin only   | Get all complaints       |
| PUT    | /api/complaints/:id       | Admin only   | Update complaint status  |

---

## Project Structure

```
springboot-backend/
├── pom.xml
└── src/main/
    ├── java/com/compliantbox/
    │   ├── CompliantBoxApplication.java   ← Entry point
    │   ├── config/
    │   │   ├── SecurityConfig.java        ← CORS + JWT + BCrypt config
    │   │   └── AdminSeeder.java           ← Replaces seedAdmin.js
    │   ├── controller/
    │   │   ├── AuthController.java        ← /api/auth routes
    │   │   └── ComplaintController.java   ← /api/complaints routes
    │   ├── dto/                           ← Request/Response shapes
    │   ├── model/
    │   │   ├── User.java                  ← Replaces models/User.js
    │   │   └── Complaint.java             ← Replaces models/Complaint.js
    │   ├── repository/                    ← JPA repositories (replaces Mongoose)
    │   └── security/
    │       ├── JwtUtil.java               ← Replaces jwt logic in auth.js
    │       └── JwtAuthFilter.java         ← Replaces middleware/auth.js
    └── resources/
        └── application.properties
```
