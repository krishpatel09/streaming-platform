# Auth Service — How It Works

> **Stack**: Go · Gin · PostgreSQL (Raw SQL)
> **Pattern**: OTP-only login · Multi-device sessions · Per-device idle expiry

---

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Authentication Flow](#authentication-flow)
4. [Session Management](#session-management)
5. [Multi-Device Logic](#multi-device-logic)
6. [Session Expiry & Re-verification](#session-expiry--re-verification)
7. [Trusted Device Bypass](#trusted-device-bypass)
8. [API Reference](#api-reference)
9. [Error Codes](#error-codes)
10. [Security Design Decisions](#security-design-decisions)

---

## Overview

This service handles **identity and sessions** for a Jio/Hotstar-style streaming platform. There are no passwords — every login is OTP-based (SMS or email). A single user account can have multiple named profiles (like Netflix's "Who's watching?"), and can be active on multiple devices simultaneously.

```
User Account (users)
  ├── Profile: "Rahul"       (profiles)
  │     └── Preferences      (user_preferences)
  ├── Profile: "Kids"        (profiles)
  │     └── Preferences      (user_preferences)
  ├── Session: iPhone        (devices + refresh_tokens)
  ├── Session: MacBook       (devices + refresh_tokens)
  └── Session: Smart TV      (devices + refresh_tokens)
```

**Key design principles:**

- One `users` row = one billing account
- One user can have up to N profiles (configurable)
- Each device gets its own independent session (refresh token)
- Access tokens are short-lived JWTs (15 min); refresh tokens are long-lived random strings stored hashed in DB
- OTP codes are never stored plain — always SHA-256 hashed

---

## Database Schema

### Core tables and their roles

| Table               | Role                                                 |
| ------------------- | ---------------------------------------------------- |
| `users`             | Primary account — owns email/phone, billing identity |
| `otp_verifications` | Temporary OTP codes for login and verification       |
| `devices`           | Named physical devices (iPhone, laptop, TV)          |
| `refresh_tokens`    | One active session per device                        |
| `profiles`          | Per-user named profiles ("Rahul", "Kids")            |
| `user_preferences`  | Per-profile settings (genres, language, quality)     |
| `otp_bypass`        | Trusted device records — skip re-OTP on idle timeout |
| `session_activity`  | Audit log of every auth action                       |

### Key constraints

```sql
-- A user MUST have at least one identifier
CONSTRAINT chk_user_has_identifier
    CHECK (email IS NOT NULL OR phone_number IS NOT NULL)

-- Only one primary profile per user
CONSTRAINT one_primary_profile_per_user
    UNIQUE (user_id) WHERE (is_primary = TRUE)

-- One bypass record per user+device pair
UNIQUE (user_id, device_id)  -- in otp_bypass
```

### Why `device_info JSONB` AND a `devices` table?

`refresh_tokens.device_info` is a snapshot of device metadata at login time (user agent, screen size, IP). The `devices` table is the structured, queryable record — it enables the "Manage devices" screen, trusted-device logic, and per-device idle limits. Both serve different purposes and coexist intentionally.

---

## Authentication Flow

### Step 1 — Send OTP

`POST /api/v1/auth/send-otp`

```
Client                          Auth Service                    DB
  |                                   |                          |
  |-- { identifier, type, purpose } ->|                          |
  |                                   |-- Rate limit check ----->|
  |                                   |   (max 3 OTPs / 10 min) |
  |                                   |                          |
  |                                   |-- User lookup ---------->|
  |                                   |   phone or email         |
  |                                   |                          |
  |                                   |   [if not found]         |
  |                                   |-- INSERT user ---------->|
  |                                   |   (auto-register)        |
  |                                   |                          |
  |                                   |-- Generate 6-digit OTP   |
  |                                   |   crypto/rand            |
  |                                   |-- SHA-256 hash OTP       |
  |                                   |-- INSERT otp_verif ----->|
  |                                   |   expires_at = +5 min    |
  |                                   |                          |
  |                                   |-- Send via SMS/email     |
  |<-- { message, expires_in: 300 } --|                          |
```

**Rate limiting** is enforced at the DB level — no Redis required:

```sql
SELECT COUNT(*) FROM otp_verifications
WHERE identifier = $1
  AND created_at > NOW() - INTERVAL '10 minutes'
```

If count ≥ 3 → return `429 TOO_MANY_REQUESTS`.

---

### Step 2 — Verify OTP

`POST /api/v1/auth/verify-otp`

```
Client                          Auth Service                    DB
  |                                   |                          |
  |-- { identifier, otp,          --->|                          |
  |     device_fingerprint,           |                          |
  |     device_name, device_type }    |                          |
  |                                   |-- Fetch latest OTP ----->|
  |                                   |   WHERE expires_at>NOW() |
  |                                   |                          |
  |                                   |   [not found] → 400      |
  |                                   |   [attempts>=5] → 429    |
  |                                   |                          |
  |                                   |-- INCREMENT attempts --->|
  |                                   |   (before checking!)     |
  |                                   |                          |
  |                                   |-- SHA-256(input) == hash?|
  |                                   |   [no match] → 400       |
  |                                   |                          |
  |                                   |-- DELETE otp row ------->|
  |                                   |-- Mark user verified --->|
  |                                   |                          |
  |                                   |-- UPSERT device -------->|
  |                                   |   match fingerprint      |
  |                                   |                          |
  |                                   |-- Check otp_bypass ----->|
  |                                   |   trusted device?        |
  |                                   |                          |
  |                                   |-- INSERT refresh_token ->|
  |                                   |-- Generate access JWT    |
  |                                   |-- INSERT session_activity|
  |                                   |                          |
  |<-- { access_token, refresh_token, expires_in: 900 } --------|
```

> **Why increment attempts BEFORE checking?**
> Prevents a race condition where two simultaneous requests both read `attempts = 4`, both pass the limit check, and both attempt verification. By writing first, the second request will see `attempts = 5` and be rejected.

---

### OTP Security Details

| Property     | Value             | Reason                                                 |
| ------------ | ----------------- | ------------------------------------------------------ |
| Length       | 6 digits          | Balance of UX and entropy (1-in-1,000,000 brute force) |
| TTL          | 5 minutes         | Short enough to prevent offline brute force            |
| Max attempts | 5                 | Lock after 5 wrong tries — no infinite guessing        |
| Storage      | SHA-256 hash only | Raw OTP is never persisted                             |
| Generation   | `crypto/rand`     | Cryptographically secure, not `math/rand`              |

---

## Session Management

After successful OTP verification, the service issues two tokens:

### Access Token (JWT)

```json
{
  "sub": "user-uuid",
  "profile_id": "profile-uuid",
  "device_id": "device-uuid",
  "device_type": "mobile",
  "session_id": "refresh-token-uuid",
  "iss": "auth-service",
  "exp": 1234567890
}
```

- **TTL**: 15 minutes
- **Stored**: Nowhere — validated by signature only
- **Used for**: Every API call as `Authorization: Bearer <token>`

### Refresh Token

- **Format**: 64 random bytes, hex-encoded (128 char string)
- **Stored**: SHA-256 hash in `refresh_tokens.token_hash`
- **TTL**: 30 days (hard expiry)
- **Used for**: `POST /auth/refresh` to get a new access token

### Token Refresh Flow

`POST /api/v1/auth/refresh`

```
Client                          Auth Service                    DB
  |                                   |                          |
  |-- Authorization: Bearer <raw> --->|                          |
  |                                   |-- SHA-256(raw) ----------|
  |                                   |-- Lookup token_hash ---->|
  |                                   |   WHERE revoked_at IS NULL
  |                                   |                          |
  |                                   |   [not found] → 401      |
  |                                   |   INVALID_REFRESH_TOKEN  |
  |                                   |                          |
  |                                   |-- expires_at < NOW()?    |
  |                                   |   → revoke, 401          |
  |                                   |   SESSION_EXPIRED        |
  |                                   |                          |
  |                                   |-- Idle check (see below) |
  |                                   |                          |
  |                                   |-- UPDATE last_activity ->|
  |                                   |-- Issue new access JWT   |
  |                                   |-- INSERT session_activity|
  |                                   |                          |
  |<-- { access_token, expires_in } --|                          |
```

---

## Multi-Device Logic

Each physical device gets an **independent session**. Logging out of the laptop does not affect the TV session.

```
users row (one per account)
  └── devices rows (one per physical device)
        └── refresh_tokens rows (one active per device)
```

### Device fingerprinting

On web:

```
fingerprint = SHA-256(userAgent + screenWidth + screenHeight + timezone + language)
```

On mobile:

```
fingerprint = SHA-256(APNs/FCM device token)
```

The fingerprint is used to `UPSERT` the device on every login — same device always maps to the same `devices` row.

### Session limit enforcement

To cap concurrent sessions (e.g. max 5 devices like Netflix):

```sql
-- Count active sessions for this user
SELECT COUNT(*) FROM refresh_tokens
WHERE user_id = $1 AND revoked_at IS NULL;

-- If count >= 5, revoke the oldest one
UPDATE refresh_tokens
SET revoked_at = NOW()
WHERE id = (
    SELECT id FROM refresh_tokens
    WHERE user_id = $1 AND revoked_at IS NULL
    ORDER BY last_activity_at ASC
    LIMIT 1
);
```

### Manage devices screen

```sql
SELECT
    d.id,
    d.device_name,
    d.device_type,
    d.is_trusted,
    rt.session_label,
    rt.last_activity_at,
    rt.ip_address,
    rt.id = $current_session_id AS is_current
FROM devices d
JOIN refresh_tokens rt ON rt.device_id = d.id
WHERE d.user_id = $1
  AND rt.revoked_at IS NULL
ORDER BY rt.last_activity_at DESC;
```

---

## Session Expiry & Re-verification

Every call to `/auth/refresh` runs two expiry checks:

### Check 1 — Hard expiry

```
expires_at < NOW()
```

→ Revoke the token, return `401 SESSION_EXPIRED`.
→ User must go through full OTP login again.
→ No bypass possible.

### Check 2 — Idle timeout

```
NOW() - last_activity_at > idle_limit_for_device_type
```

Idle limits by device type:

| Device type | Idle limit | Reason                                    |
| ----------- | ---------- | ----------------------------------------- |
| `mobile`    | 7 days     | Phones are personal, refreshed frequently |
| `desktop`   | 14 days    | Laptop sessions are longer lived          |
| `tablet`    | 10 days    | Between mobile and desktop                |
| `tv`        | 30 days    | TVs are shared, rarely signed out         |

If idle limit is exceeded:

```
Is device trusted? (check otp_bypass table)
  YES → silent re-auth, slide last_activity_at forward, issue new token
  NO  → set requires_reverification = true
        return 401 REVERIFICATION_REQUIRED
```

When the client receives `REVERIFICATION_REQUIRED`:

1. Show OTP screen (identifier is pre-filled from JWT claims)
2. User receives OTP and submits it
3. On success: `requires_reverification = false`, issue fresh tokens
4. Session continues — no full logout needed

---

## Trusted Device Bypass

After a successful OTP on a device, the server can mark it trusted:

```sql
INSERT INTO otp_bypass (user_id, device_id, valid_until)
VALUES ($1, $2, NOW() + INTERVAL '30 days')
ON CONFLICT (user_id, device_id) DO UPDATE
    SET valid_until = EXCLUDED.valid_until,
        revoked_at  = NULL;
```

On idle-expiry check, trusted devices are silently re-authed:

```sql
SELECT ob.valid_until
FROM otp_bypass ob
WHERE ob.user_id   = $1
  AND ob.device_id = $2
  AND ob.valid_until > NOW()
  AND ob.revoked_at IS NULL;
```

Users can revoke trust from the "Manage devices" screen:

```sql
UPDATE otp_bypass
SET revoked_at = NOW()
WHERE user_id = $1 AND device_id = $2;
```

---

## API Reference

### Base URL

```
/api/v1/auth
```

### Endpoints

#### `POST /send-otp`

Send a 6-digit OTP to a phone number or email.

**Request:**

```json
{
  "identifier": "919876543210",
  "identifier_type": "phone",
  "purpose": "login"
}
```

**Response `200`:**

```json
{
  "error": null,
  "message": "ok",
  "data": {
    "message": "OTP sent",
    "expires_in": 300
  }
}
```

---

#### `POST /verify-otp`

Verify OTP and receive session tokens.

**Request:**

```json
{
  "identifier": "919876543210",
  "identifier_type": "phone",
  "otp": "482910",
  "device_fingerprint": "a3f9c2...",
  "device_name": "Rahul's iPhone",
  "device_type": "mobile"
}
```

**Response `200`:**

```json
{
  "error": null,
  "message": "ok",
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "a3f9c2b1...",
    "expires_in": 900
  }
}
```

---

#### `POST /refresh`

Exchange a valid refresh token for a new access token.

**Header:** `Authorization: Bearer <refresh_token_raw>`

**Response `200`:**

```json
{
  "error": null,
  "message": "ok",
  "data": {
    "access_token": "eyJ...",
    "expires_in": 900
  }
}
```

---

#### `POST /logout`

Revoke one session or all sessions.

**Header:** `Authorization: Bearer <access_token>`

**Request (optional):**

```json
{ "all_devices": true }
```

**Response `200`:**

```json
{
  "error": null,
  "message": "ok",
  "data": { "message": "logged out" }
}
```

---

#### `GET /sessions`

List all active sessions for the current user.

**Header:** `Authorization: Bearer <access_token>`

**Response `200`:**

```json
{
  "error": null,
  "message": "ok",
  "data": [
    {
      "session_id": "uuid",
      "device_name": "Rahul's iPhone",
      "device_type": "mobile",
      "session_label": "Chrome on MacBook",
      "last_activity_at": "2025-03-19T10:00:00Z",
      "ip_address": "103.21.4.5",
      "is_current": true
    }
  ]
}
```

---

#### `DELETE /sessions/:session_id`

Revoke a specific session (remote sign-out).

**Header:** `Authorization: Bearer <access_token>`

**Response `200`:**

```json
{
  "error": null,
  "message": "ok",
  "data": { "message": "session revoked" }
}
```

---

## Error Codes

All errors follow this shape:

```json
{
  "error": "ERROR_CODE",
  "message": "human readable description",
  "data": null
}
```

| HTTP | Error Code                | When                                              |
| ---- | ------------------------- | ------------------------------------------------- |
| 400  | `OTP_NOT_FOUND`           | No valid unexpired OTP exists for this identifier |
| 400  | `INVALID_OTP`             | OTP submitted does not match stored hash          |
| 400  | `INVALID_REQUEST`         | Malformed request body or missing fields          |
| 401  | `UNAUTHORIZED`            | Access token missing, invalid, or expired         |
| 401  | `INVALID_REFRESH_TOKEN`   | Refresh token not found or already revoked        |
| 401  | `SESSION_EXPIRED`         | Refresh token TTL exceeded (30 days)              |
| 401  | `REVERIFICATION_REQUIRED` | Idle timeout on untrusted device                  |
| 429  | `TOO_MANY_REQUESTS`       | More than 3 OTPs sent in 10 minutes               |
| 429  | `OTP_MAX_ATTEMPTS`        | 5 wrong OTP attempts on the same code             |
| 403  | `FORBIDDEN`               | Attempting to revoke another user's session       |

---

## Security Design Decisions

### Why SHA-256 for OTP, not bcrypt?

bcrypt is intentionally slow (that's the point for passwords). A 6-digit OTP has at most 1,000,000 possible values — the real protection is the 5-minute TTL and the 5-attempt limit, not the hash strength. SHA-256 is fast enough to be imperceptible to the user and still provides a one-way store.

### Why is the refresh token a random string, not a JWT?

JWTs cannot be revoked without a blocklist. A random string stored hashed in the DB means revocation is instant — just set `revoked_at`. This is critical for "sign out of all devices" and "revoke compromised session" use cases.

### Why store `device_info JSONB` alongside the structured `devices` table?

`device_info` is a snapshot at login time (immutable, fast to read). The `devices` table is the live record — it gets updated on every login (`last_seen_at`), can have its `is_trusted` flag changed, and is the target of foreign keys from `otp_bypass`. They coexist intentionally.

### Why increment OTP `attempts` before verifying?

Race condition prevention. Two concurrent requests reading `attempts = 4` would both pass the limit check. Writing the increment first means only one of them can proceed; the second sees `attempts = 5` and is rejected before touching the hash comparison.

### Why per-device idle limits instead of one global limit?

A Smart TV session on a family TV should not expire as aggressively as a mobile session. TVs are shared devices that are rarely actively signed out. Mobile sessions are personal and should require re-verification sooner. Per-device limits (`mobile=7d`, `desktop=14d`, `tv=30d`) match real usage patterns.

---

_Last updated: 2026-03-19_
