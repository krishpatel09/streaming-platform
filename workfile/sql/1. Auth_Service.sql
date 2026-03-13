-- 1.   AUTH SERVICE & USER SERVICE

-- Table: users (The primary Account owner)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: refresh_tokens (Linked to the Account)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: oauth_providers (Social logins for the Account)
-- CREATE TABLE oauth_providers (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--     provider VARCHAR(50) CHECK (provider IN ('google','facebook','apple')),
--     provider_user_id VARCHAR(255) NOT NULL,
--     access_token TEXT,
--     refresh_token TEXT,
--     token_expires_at TIMESTAMPTZ,
--     created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- NEW Table: profiles (The "My Space" multi-profile feature)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_name VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    is_kids_profile BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT FALSE,
    pin_code_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT one_primary_profile_per_user UNIQUE (user_id) WHERE (is_primary = TRUE)
);

-- Table: user_preferences (Now linked to individual PROFILES)
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_genres TEXT[],
    preferred_languages TEXT[],
    autoplay_next BOOLEAN DEFAULT true,
    default_video_quality VARCHAR(10) DEFAULT 'auto',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


