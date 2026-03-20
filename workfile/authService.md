# Auth Service: Flow & Data Storage

This document explains how the authentication process works and how data is stored across different tables at each step.

---

## 🚀 1. The Login Flow (OTP Based)

### Step A: Send OTP
**Action**: User enters email/phone.
**Logic**:
1. Check **`otp_verifications`** table for rate limits (max 3 in 10 mins).
2. Lookup **`users`** table. If it's a new identifier, **INSERT** a new user record.
3. Generate 6-digit OTP, SHA-256 hash it.
4. **INSERT** into **`otp_verifications`** with `expires_at` (5 mins).

### Step B: Verify OTP
**Action**: User enters the 6-digit code.
**Logic**:
1. **UPDATE** `attempts` in **`otp_verifications`** (prevents race conditions).
2. Compare input hash with stored hash.
3. On Success: **DELETE** the OTP row.
4. **UPSERT** into **`devices`**:
   - If `device_fingerprint` exists, update `last_seen_at`.
   - Else, create a new device entry for this user.
5. **INSERT** into **`refresh_tokens`**:
   - Create a long-lived session (30 days).
   - Link it to the `device_id`.
6. **INSERT** into **`session_activity`**:
   - Log `action = 'otp_verified'`.

---

## 🔄 2. Token Refresh & Idle Session Management

### The Refresh Request
**Action**: Client sends `refresh_token` to get a new `access_token`.
**Logic**:
1. Lookup **`refresh_tokens`** by `token_hash`.
2. check `revoked_at` and `expires_at`.
3. **Idle Check**:
   - Compare `last_activity_at` with device-specific limits (e.g., 14 days for desktop).
   - If exceeded: Check **`otp_bypass`** for "Trusted Device" status.
   - If trusted: Slide `last_activity_at` forward.
   - If NOT trusted: Return `REVERIFICATION_REQUIRED`.
4. **UPDATE** **`refresh_tokens`**:
   - Set `last_activity_at = NOW()`.
5. **INSERT** into **`session_activity`**:
   - Log `action = 'token_refresh'`.

---

## 🗃️ 3. How Tables Store Data (Visual Trace)

| Event | `users` | `profiles` | `devices` | `refresh_tokens` |
| :--- | :--- | :--- | :--- | :--- |
| **New Registration** | New row created | "Primary" profile created | - | - |
| **First Login** | `is_verified` → true | - | New device record | New session record |
| **Switch Profile** | - | `activeProfile` updated (Frontend) | - | - |
| **New Device Login** | - | - | 2nd device record | 2nd independent session |
| **Logout** | - | - | - | Set `revoked_at` |

---

## 🔑 4. Why This Architecture?
- **Stateless Access**: Users use a short-lived **JWT (15 mins)** for requests.
- **Stateful Sessions**: Refresh tokens are stored in the DB so we can **instantly revoke** a stolen device or "Logout of all devices".
- **Privacy**: We never store the actual OTP or Password—only **SHA-256 or Bcrypt hashes**.
