-- Modify users: phone is the primary login identifier
ALTER TABLE users
  ADD COLUMN phone_number VARCHAR(20) UNIQUE,
  ADD COLUMN phone_verified BOOLEAN DEFAULT false;

-- email can now be NULL (it's optional for Jio/Hotstar style)
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Central OTP table (handles phone AND email flows)
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,          -- the phone or email
  identifier_type VARCHAR(10) NOT NULL,       -- 'phone' | 'email'
  otp_hash VARCHAR(255) NOT NULL,             -- bcrypt/sha256 of OTP
  purpose VARCHAR(20) NOT NULL,              -- 'login' | 'verify' | '2fa'
  attempts INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX idx_otp_identifier (identifier, purpose)
);

-- Physical devices (laptop, phone, tablet, TV)
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_fingerprint VARCHAR(512) UNIQUE NOT NULL, -- hashed UA+screen+etc
  device_name VARCHAR(100),                  -- "Rahul's iPhone", "Chrome on Mac"
  device_type VARCHAR(20),                   -- 'mobile' | 'desktop' | 'tablet' | 'tv'
  is_trusted BOOLEAN DEFAULT false,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add device linkage + idle tracking to refresh_tokens
ALTER TABLE refresh_tokens
  ADD COLUMN device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  ADD COLUMN session_label VARCHAR(100),     -- "Chrome on MacBook"
  ADD COLUMN last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN requires_reverification BOOLEAN DEFAULT false;

-- Trusted device bypass (skip OTP on idle re-auth)
CREATE TABLE otp_bypass (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  UNIQUE (user_id, device_id)
);

-- For auditing: what happened per session
CREATE TABLE session_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refresh_token_id UUID REFERENCES refresh_tokens(id) ON DELETE CASCADE,
  action VARCHAR(50),   -- 'token_refresh' | 'otp_verified' | 'logout'
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


