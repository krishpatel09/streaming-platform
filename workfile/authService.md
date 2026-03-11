# Auth Service: How It Works

The **Auth Service** is a dedicated microservice responsible for managing user identity, authentication, and secure access to the Streaming Platform. It sits at the front of the platform's security layer.

## 🏗️ Architecture & Component Flow

The service follows a **Clean Architecture** pattern, separating concerns into logical layers:

### 1. The Entry Point (`cmd/main.go`)
- **Config Loading**: Reads database (PostgreSQL) and cache (Redis) settings from environment variables.
- **Dependency Injection**: Uses `wire.go` to connect the database to the repositories, repositories to services, and services to API handlers.
- **Server Initialization**: Starts the Gin engine on a specified port (default `50051`).

### 2. API & Routing Layer (`internal/api/`)
- **Router** (`router/router.go`): Maps URL paths to specific handler functions.
  - `/auth/register` (POST): Open for new users.
  - `/auth/login` (POST): Open for existing users.
  - `/auth/me` (GET): Protected; requires a valid token.
- **Middleware** (`middleware.go`): The "Guard". It intercepts every request to protected routes.
  - Checks for the `Authorization: Bearer <token>` header.
  - Decodes and validates the **JWT** (JSON Web Token).
  - Extracts the `user_id` and attaches it to the request context for the handlers to use.

### 3. Business Logic Layer (`internal/service/`)
- **Registration**:
  - Checks if the email is already taken.
  - Uses `bcrypt` to hash the password (so we never store plain-text passwords).
  - Saves the new user and returns a freshly generated JWT.
- **Login**:
  - Finds the user by email.
  - Compares the provided password with the stored hash.
  - If they match, it issues a signed JWT.
- **Profile**:
  - Retrieves user details (Username, Email, Verification status) using the ID provided by the middleware.

### 4. Data Layer (`internal/repository/`)
- Uses **GORM** to communicate with **PostgreSQL**.
- Handles raw database operations like `Create`, `FindByID`, and `FindByEmail`.

---

## 🔐 Security Standards

- **JWT (JSON Web Tokens)**: Used for stateless authentication. Once a user logs in, the client sends this token with every subsequent request.
- **Password Salting/Hashing**: Implemented via `golang.org/x/crypto/bcrypt` to ensure maximum security for user credentials.
- **Contextual Safety**: User IDs are passed through the request context, preventing users from accessing data they don't own.

## 🛠️ Typical Request Flow (e.g., "Get My Profile")

1. **Client** calls `GET /auth/me` with a JWT in the header.
2. **Middleware** verifies the token. If valid, it attaches `user_id` to the context and lets the request continue.
3. **Handler** (`GetProfile`) reads the `user_id` from the context and asks the **Service**.
4. **Service** asks the **Repository** to fetch user data from **Postgres**.
5. **Response**: The user's profile is sent back as JSON.
