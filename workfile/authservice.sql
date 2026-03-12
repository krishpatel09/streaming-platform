-- JioCinema-style Database Schema
-- Focuses on high-scale streaming, multi-profile support, and complex content metadata.

-- ==========================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ==========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    -- phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_name VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    age_group VARCHAR(20) DEFAULT 'adult', -- kids, teen, adult
    is_primary BOOLEAN DEFAULT FALSE,
    pin VARCHAR(4), -- Optional profile lock
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT one_primary_profile_per_user UNIQUE (user_id) WHERE (is_primary = TRUE)
);

-- ==========================================
-- 2. CONTENT METADATA
-- ==========================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Movies, TV Shows, Sports, News, Anime
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Action, Comedy, Thriller, etc.
);

CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INTEGER,
    maturity_rating VARCHAR(10), -- U, UA, A
    category_id INTEGER REFERENCES categories(id),
    thumbnail_url TEXT,
    banner_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector -- For full-text search optimization
);

CREATE TABLE content_genres (
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, genre_id)
);

CREATE TABLE movies (
    content_id UUID PRIMARY KEY REFERENCES content(id) ON DELETE CASCADE,
    duration_minutes INTEGER,
    director VARCHAR(255),
    cast_members TEXT -- JSON or comma-separated
);

CREATE TABLE tv_shows (
    content_id UUID PRIMARY KEY REFERENCES content(id) ON DELETE CASCADE,
    creator VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ongoing' -- ongoing, ended, cancelled
);

CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tv_show_id UUID REFERENCES tv_shows(content_id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tv_show_id, season_number)
);

CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title VARCHAR(255),
    description TEXT,
    duration_minutes INTEGER,
    thumbnail_url TEXT,
    air_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (season_id, episode_number)
);

-- ==========================================
-- 3. MEDIA ASSETS & STREAMING
-- ==========================================

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE, -- Nullable if it's an episode
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE, -- Nullable if it's a movie
    stream_url TEXT NOT NULL,
    resolution VARCHAR(10), -- 480p, 720p, 1080p, 4K
    format VARCHAR(10), -- HLS, DASH
    audio_language VARCHAR(50),
    subtitle_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. USER ENGAGEMENT & HISTORY
-- ==========================================

CREATE TABLE watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id), -- Null for movies
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress_seconds INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE (profile_id, content_id, episode_id)
);

CREATE TABLE watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (profile_id, content_id)
);

-- ==========================================
-- 5. SUBSCRIPTIONS & PAYMENTS
-- ==========================================

CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- Gold, Premium, Lite
    price DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    concurrent_devices INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES subscription_plans(id),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
    auto_renew BOOLEAN DEFAULT TRUE
);

-- ==========================================
-- INDEXING FOR PERFORMANCE
-- ==========================================

CREATE INDEX idx_content_category ON content(category_id);
CREATE INDEX idx_watch_history_profile ON watch_history(profile_id);
CREATE INDEX idx_watchlist_profile ON watchlist(profile_id);
CREATE INDEX idx_episodes_season ON episodes(season_id);
CREATE INDEX idx_media_assets_content ON media_assets(content_id);
