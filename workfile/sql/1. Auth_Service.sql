
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. USERS

CREATE TABLE users (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    -- username         VARCHAR(100),                        -- optional display name
    email            VARCHAR(255) UNIQUE,                 -- nullable — phone-only users OK
    phone_number     VARCHAR(20)  UNIQUE,                 -- nullable — email-only users OK
    phone_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
    is_verified      BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_user_has_identifier
        CHECK (email IS NOT NULL OR phone_number IS NOT NULL)
);

CREATE INDEX idx_users_email        ON users (email)        WHERE email IS NOT NULL;
CREATE INDEX idx_users_phone_number ON users (phone_number) WHERE phone_number IS NOT NULL;


-- ============================================================
-- 2. OTP VERIFICATIONS  (NEW — was completely missing)
--    Handles phone OTP and email OTP one table
-- ============================================================
CREATE TABLE otp_verifications (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier       VARCHAR(255) NOT NULL,   -- phone number or email address
    identifier_type  VARCHAR(10)  NOT NULL CHECK (identifier_type IN ('phone', 'email')),
    otp_hash         VARCHAR(255) NOT NULL,   -- SHA-256 hash of the 6-digit code
    purpose          VARCHAR(20)  NOT NULL CHECK (purpose IN ('login', 'verify', '2fa')),
    attempts         INT          NOT NULL DEFAULT 0,
    expires_at       TIMESTAMPTZ  NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()    
);

CREATE INDEX idx_otp_identifier ON otp_verifications (identifier, purpose, expires_at);


-- ============================================================
-- 3. DEVICES  (NEW — was missing; needed for multi-device sessions)
-- ============================================================
CREATE TABLE devices (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint  VARCHAR(512) NOT NULL UNIQUE,  -- hashed UA + screen + timezone
    device_name         VARCHAR(100),                  -- "Rahul's iPhone", "Chrome on Mac"
    device_type         VARCHAR(20)  NOT NULL DEFAULT 'desktop'
                            CHECK (device_type IN ('mobile', 'desktop', 'tablet', 'tv')),
    is_trusted          BOOLEAN      NOT NULL DEFAULT FALSE,
    last_seen_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_user_id ON devices (user_id);


-- ============================================================
-- 4. REFRESH TOKENS
--    ADDED: device_id FK, session_label, last_activity_at,
--           requires_reverification — all needed for session mgmt
--    KEPT:  device_info JSONB (useful for quick reads without JOIN)
-- ============================================================
CREATE TABLE refresh_tokens (
    id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                  UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id                UUID         REFERENCES devices(id) ON DELETE SET NULL,
    token_hash               VARCHAR(255) NOT NULL UNIQUE,
    session_label            VARCHAR(100),              -- "Chrome on MacBook Pro"
    device_info              JSONB,                     -- snapshot at login time
    ip_address               INET,
    last_activity_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    expires_at               TIMESTAMPTZ  NOT NULL,
    revoked_at               TIMESTAMPTZ,
    requires_reverification  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id   ON refresh_tokens (user_id)   WHERE revoked_at IS NULL;
CREATE INDEX idx_refresh_tokens_device_id ON refresh_tokens (device_id) WHERE revoked_at IS NULL;


-- ============================================================
-- 5. PROFILES  (unchanged — was already correct)
-- ============================================================
CREATE TABLE profiles (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_name    VARCHAR(50)  NOT NULL,
    avatar_url      TEXT,
    is_kids_profile BOOLEAN      NOT NULL DEFAULT FALSE,
    is_primary      BOOLEAN      NOT NULL DEFAULT FALSE,
    pin_code_hash   VARCHAR(255),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- Only one primary profile allowed per user (partial unique index)
    CONSTRAINT one_primary_profile_per_user UNIQUE (user_id) WHERE (is_primary = TRUE)
);

CREATE INDEX idx_profiles_user_id ON profiles (user_id);


-- ============================================================
-- 6. USER PREFERENCES  (unchanged — was already correct)
-- ============================================================
CREATE TABLE user_preferences (
    id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id            UUID         NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_genres      TEXT[],
    preferred_languages   TEXT[],
    autoplay_next         BOOLEAN      NOT NULL DEFAULT TRUE,
    default_video_quality VARCHAR(10)  NOT NULL DEFAULT 'auto',
    email_notifications   BOOLEAN      NOT NULL DEFAULT TRUE,
    push_notifications    BOOLEAN      NOT NULL DEFAULT TRUE,
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    UNIQUE (profile_id)   -- one preferences row per profile
);


-- ============================================================
-- 7. OTP BYPASS  (NEW — trusted device, skip OTP on idle re-auth)
-- ============================================================
CREATE TABLE otp_bypass (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id   UUID        NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    valid_until TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at  TIMESTAMPTZ,

    UNIQUE (user_id, device_id)
);


-- ============================================================
-- 8. SESSION ACTIVITY  (NEW — audit log per session action)
-- ============================================================
CREATE TABLE session_activity (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    refresh_token_id  UUID        REFERENCES refresh_tokens(id) ON DELETE CASCADE,
    action            VARCHAR(50) NOT NULL,  -- 'otp_verified' | 'token_refresh' | 'logout'
    ip_address        INET,
    user_agent        TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_session_activity_token ON session_activity (refresh_token_id);


-- ============================================================
-- TRIGGER — auto-update users.updated_at on any row change
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();