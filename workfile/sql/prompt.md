You are a senior backend engineer. Build a production-grade Auth Service in Go using the Gin framework and PostgreSQL (database/sql + lib/pq driver). No ORM.

---

## CONTEXT

This is a Jio/Hotstar-style streaming platform auth service. Users log in via phone number OR email using OTP only — no passwords. The system supports multiple simultaneous device sessions (mobile, desktop, tablet, tv) with per-device idle expiry and a trusted-device bypass mechanism.

---

## DATABASE SCHEMA

Use exactly these tables (already exist in PostgreSQL, do not re-create unless asked):

1. users — id (UUID), username, email (nullable), phone_number (nullable, unique), phone_verified, is_verified, is_active, created_at, updated_at
2. otp_verifications — id, identifier (phone or email string), identifier_type ('phone'|'email'), otp_hash, purpose ('login'|'verify'|'2fa'), attempts (int), expires_at, created_at
3. devices — id, user_id (FK), device_fingerprint (unique hashed string), device_name, device_type ('mobile'|'desktop'|'tablet'|'tv'), is_trusted, last_seen_at, created_at
4. refresh_tokens — id, user_id (FK), device_id (FK), token_hash (unique), session_label, ip_address, last_activity_at, expires_at, revoked_at, requires_reverification (bool), created_at
5. otp_bypass — id, user_id (FK), device_id (FK), valid_until, created_at, revoked_at — UNIQUE(user_id, device_id)
6. session_activity — id, refresh_token_id (FK), action, ip_address, user_agent, created_at
7. profiles — id, user_id (FK), profile_name, avatar_url, is_kids_profile, is_primary, pin_code_hash, created_at
8. user_preferences — id, profile_id (FK), preferred_genres (text[]), preferred_languages (text[]), autoplay_next, default_video_quality, email_notifications, push_notifications, updated_at

---

## WHAT TO BUILD

### 1. Project structure

Scaffold this exact layout:
auth-service/
├── cmd/main.go
├── internal/
│ ├── config/config.go
│ ├── db/db.go
│ ├── models/ (one file per table: user.go, device.go, token.go, otp.go)
│ ├── repository/ (user_repo.go, otp_repo.go, token_repo.go, device_repo.go)
│ ├── service/ (auth_service.go, session_service.go, otp_service.go)
│ ├── handler/ (auth_handler.go, session_handler.go)
│ ├── middleware/ (auth_middleware.go, ratelimit_middleware.go)
│ └── utils/ (jwt.go, otp.go, fingerprint.go, response.go)
├── .env.example
└── go.mod

---

### 2. OTP utilities — internal/utils/otp.go

- GenerateOTP() string — cryptographically secure 6-digit OTP using crypto/rand
- HashOTP(otp string) string — SHA-256 hash (hex), NOT bcrypt (too slow for OTP)
- VerifyOTP(plain, hash string) bool — constant-time compare

### 3. JWT utilities — internal/utils/jwt.go

Use golang-jwt/jwt/v5.

- Access token: 15-minute TTL. Claims must include: user_id, profile_id, device_id, device_type, session_id
- Refresh token: random 64-byte hex string (crypto/rand), stored hashed (SHA-256) in DB — NOT a JWT
- GenerateAccessToken(claims AuthClaims) (string, error)
- ParseAccessToken(tokenStr string) (\*AuthClaims, error)
- GenerateRefreshToken() (raw string, hash string, error)

### 4. API routes — mount all under /api/v1/auth

POST /send-otp
Body: { "identifier": "919876543210", "identifier_type": "phone", "purpose": "login" }
Logic:

- Validate identifier format (E.164 for phone, RFC 5322 for email)
- Check rate limit: max 3 OTPs per identifier per 10 minutes (query otp_verifications table, no Redis)
- If user does not exist → auto-create in users table (set phone_verified/email = false)
- Generate OTP, hash it, INSERT into otp_verifications with expires_at = NOW() + 5 min
- Return 200 { "message": "OTP sent", "expires_in": 300 }
- In dev mode (ENV=development): return OTP in response as "debug_otp" field

POST /verify-otp
Body: { "identifier": "919876543210", "identifier_type": "phone", "otp": "482910", "device_fingerprint": "...", "device_name": "Rahul's iPhone", "device_type": "mobile" }
Logic:

- Fetch latest unused otp_verifications row for this identifier where expires_at > NOW()
- If not found → 400 OTP_NOT_FOUND
- If attempts >= 5 → 429 OTP_MAX_ATTEMPTS
- Increment attempts immediately (prevent race)
- HashOTP(plain) and compare — if mismatch → 400 INVALID_OTP
- If valid: DELETE the otp row, mark user phone_verified/email = true
- UPSERT device (match on device_fingerprint): insert if new, update last_seen_at if existing
- Check otp_bypass for this (user_id, device_id) where valid_until > NOW() and revoked_at IS NULL
- INSERT refresh_token row: expires_at = NOW() + 30 days, last_activity_at = NOW()
- Generate access token (15 min)
- INSERT session_activity row with action = 'otp_verified'
- Return 200 { "access_token": "...", "refresh_token": "...", "expires_in": 900 }

POST /refresh
Header: Authorization: Bearer <refresh_token_raw>
Logic:

- SHA-256 hash the raw token, lookup in refresh_tokens where revoked_at IS NULL
- If not found → 401 INVALID_REFRESH_TOKEN
- If expires_at < NOW() → set revoked_at = NOW(), return 401 SESSION_EXPIRED (force full re-login)
- Check idle timeout by device_type:
  mobile → 7 days
  desktop → 14 days
  tablet → 10 days
  tv → 30 days
  If NOW() - last_activity_at > idle_limit:
  Check otp_bypass: if valid → update last_activity_at, issue new access token (silent re-auth)
  Else → set requires_reverification = true, return 401 REVERIFICATION_REQUIRED
- If requires_reverification = true → return 401 REVERIFICATION_REQUIRED
- Happy path: UPDATE last_activity_at = NOW(), issue new access token
- INSERT session_activity row with action = 'token_refresh'
- Return 200 { "access_token": "...", "expires_in": 900 }

POST /logout
Header: Authorization: Bearer <access_token>
Body (optional): { "all_devices": true }
Logic:

- If all_devices = true → SET revoked_at = NOW() on ALL refresh_tokens for this user_id
- Else → revoke only the session matching this device_id from JWT claims
- INSERT session_activity with action = 'logout'
- Return 200 { "message": "logged out" }

GET /sessions
Header: Authorization: Bearer <access_token>
Logic:

- Query refresh_tokens JOIN devices WHERE user_id = $1 AND revoked_at IS NULL
- Return list: [ { session_id, device_name, device_type, session_label, last_activity_at, ip_address, is_current } ]
- Mark is_current = true where device_id matches JWT claims

DELETE /sessions/:session_id
Header: Authorization: Bearer <access_token>
Logic:

- Verify session belongs to the requesting user_id
- SET revoked_at = NOW()
- Return 200

---

### 5. Middleware

auth_middleware.go

- Extract Bearer token from Authorization header
- ParseAccessToken → validate signature + expiry
- Inject AuthClaims into Gin context: ctx.Set("claims", claims)
- On failure return 401 with JSON { "error": "UNAUTHORIZED", "message": "..." }

ratelimit_middleware.go

- In-memory rate limiter using sync.Map (no Redis dependency)
- Applied only to POST /send-otp
- Max 10 requests per IP per minute
- Return 429 { "error": "RATE_LIMITED" } on breach

---

### 6. Config — internal/config/config.go

Load from environment variables with these exact names:
DB_URL, JWT_SECRET, JWT_ISSUER, ENV, PORT,
OTP_TTL_SECONDS (default 300), OTP_MAX_ATTEMPTS (default 5),
REFRESH_TOKEN_TTL_DAYS (default 30), BYPASS_TTL_DAYS (default 30)
Use os.Getenv with typed defaults. No third-party config library.

---

### 7. Error handling convention

All error responses must follow this shape:
{ "error": "ERROR_CODE", "message": "human readable", "data": null }

All success responses:
{ "error": null, "message": "ok", "data": { ... } }

Create a helper in utils/response.go:
Success(c *gin.Context, data any)
Fail(c *gin.Context, httpStatus int, code string, message string)

---

### 8. Code quality rules

- Every public function must have a Go doc comment
- All DB queries use parameterized $1 $2 placeholders — zero string concatenation in SQL
- All errors wrapped with fmt.Errorf("functionName: %w", err)
- No global variables except the \*sql.DB pool passed via dependency injection
- Repository layer talks to DB only — zero business logic
- Service layer contains all business logic — zero Gin context references
- Handler layer contains only request binding, service calls, and response writing
- Use context.Context threading from handler → service → repository throughout

---

### 9. Dependencies (go.mod)

Use only:
github.com/gin-gonic/gin
github.com/lib/pq
github.com/golang-jwt/jwt/v5
github.com/google/uuid
No other third-party packages. Standard library only beyond these four.

---

## DELIVERY FORMAT

Output every file in full. No placeholders like "// TODO" or "implement this later".
Each file starts with a comment: // path: internal/utils/otp.go
Files in this order:

1. go.mod
2. .env.example
3. cmd/main.go
4. internal/config/config.go
5. internal/db/db.go
6. internal/models/\*.go (all models)
7. internal/repository/\*.go (all repos)
8. internal/utils/otp.go
9. internal/utils/jwt.go
10. internal/utils/fingerprint.go
11. internal/utils/response.go
12. internal/service/\*.go
13. internal/middleware/\*.go
14. internal/handler/\*.go
