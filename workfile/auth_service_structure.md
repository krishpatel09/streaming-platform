# Auth Service: Step-by-Step Process and API Documentation

This document provides a comprehensive explanation of the authentication service, including its folder structure, business processes, and API endpoints.

---

## 📂 Service Structure (Internal)

The service follows a clean architecture pattern to ensure separation of concerns:

-   **`cmd/`**: Entry point for the service.
-   **`internal/api/`**: 
    -   **`handler/`**: HTTP request handlers (parsing input, calling usecases).
    -   **`middleware/`**: Cross-cutting concerns like JWT Authentication.
    -   **`router/`**: API route definitions and grouping.
-   **`internal/domain/`**: Data models, structures, and repository interfaces.
-   **`internal/usecase/`**: Core business logic implementation.
-   **`internal/repository/`**: Data access layer for PostgreSQL and Redis.
-   **`internal/utils/`**: Helper functions for passwords, JWT tokens, and emails.
-   **`internal/di/`**: Dependency injection using Google's `wire`.

---

## 🔄 Core Authentication Processes

### 1. User Registration Flow
When a new user signs up:
1.  **Request**: User submits `username`, `email`, and `password`.
2.  **Validation**: Service checks if the email already exists in the database.
3.  **Hashing**: The password is hashed using Argon2/Bcrypt before storage.
4.  **Creation**: A new user record is created with `is_verified = false`.
5.  **OTP Generation**: A random 6-digit OTP is generated.
6.  **Persistence**: The OTP is stored in **Redis** with a 5-minute TTL.
7.  **Email Notification**: An email is sent asynchronously to the user's email address with the OTP.
8.  **Response**: Returns user details and a prompt to verify the OTP.

### 2. Email Verification (OTP) Flow
1.  **Validation**: User submits their `email` and the `OTP` received.
2.  **Verification**: 
    -   Service retrieves the OTP from Redis.
    -   If matches, the user's `is_verified` status is set to `true` in PostgreSQL.
3.  **Cleanup**: The OTP is deleted from Redis.
4.  **Token Issuance**: An **Access Token** and **Refresh Token** are generated for the user.
5.  **Response**: Returns the user profile along with authentication tokens.

### 3. Login Flow
1.  **Authentication**: User submits `email` and `password`.
2.  **Verification**: Service fetches the user from the database and compares the hashed password.
3.  **Token Issuance**: If valid, new Access and Refresh tokens are generated.
4.  **Response**: Returns tokens and user information (including verification status).

---

## 🚀 API Endpoints

### Public Routes (`/auth/api/...`)

#### 📝 Register User
-   **Endpoint**: `POST /auth/api/register`
-   **Description**: Registers a new user account.
-   **Body**:
    ```json
    {
      "username": "johndoe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```

#### ✅ Verify OTP
-   **Endpoint**: `POST /auth/api/verify-otp`
-   **Description**: Verifies the email using the OTP sent during registration.
-   **Body**:
    ```json
    {
      "email": "john@example.com",
      "otp": "123456"
    }
    ```

#### 🔄 Resend OTP
-   **Endpoint**: `POST /auth/api/resend-otp`
-   **Description**: Generates and sends a new OTP if the previous one expired.
-   **Body**:
    ```json
    {
      "email": "john@example.com"
    }
    ```

#### 🔑 Login
-   **Endpoint**: `POST /auth/api/login`
-   **Description**: Authenticates a user and returns JWT tokens.
-   **Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```

---

### Protected Routes (Requires JWT Token)

#### 👤 Get Current Profile
-   **Endpoint**: `GET /auth/me`
-   **Description**: Retrieves the authenticated user's profile information.
-   **Headers**: `Authorization: Bearer <access_token>`
-   **Response**:
    ```json
    {
      "id": "uuid-v4-string",
      "username": "johndoe",
      "email": "john@example.com",
      "is_verified": true
    }
    ```

---

## 🛠️ Internal Technologies
-   **Framework**: Gin Gonic (Go HTTP Framework)
-   **Database**: PostgreSQL (GORM)
-   **Caching/OTP**: Redis
-   **Communication**: Resend API (for Emails)
-   **Authentication**: JWT (JSON Web Tokens)
