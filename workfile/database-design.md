# JioCinema Database Architecture Design

This document explains the database architecture for a high-scale streaming platform, inspired by JioCinema.

## 1. High-Level Architecture
The database is designed to handle millions of users, concurrent streaming sessions, and a massive library of content. It follows a relational model but is optimized for read-heavy operations (streaming discovery) and write-heavy operations (watch history).

### Core Pillars
1.  **Multi-Profile System**: Allows one user account to have up to 5 profiles (Kids, Adults, etc.) with independent watch histories.
2.  **Content Hierarchy**: Supports Movies, TV Shows, Seasons, and Episodes with a flexible inheritance-like structure.
3.  **Adaptive Streaming Metadata**: Stores HLS/DASH links categorized by resolution and language.
4.  **Performance Optimization**: Uses comprehensive indexing and specialized tables for "Continue Watching" features.

---

## 2. Shared Responsibility (Tables)

### 👤 User & Access (Identity)
-   **`users`**: The root account. Stores credentials and subscription status.
-   **`profiles`**: The persona using the app. This is where personalizations (Watchlist, History) reside.

### 🎬 Content Engine (Metadata)
-   **`content`**: The base table for everything. If it has a title and a thumbnail, it's here.
-   **`movies` & `tv_shows`**: Extension tables. This "Class Table Inheritance" pattern keeps the schema clean while allowing specific fields for different content types.
-   **`seasons` & `episodes`**: Handles the nested structure of series.

### 📽️ Streaming Engine (Assets)
-   **`media_assets`**: This table doesn't store files; it stores URLs to the CDN. Each movie/episode can have multiple assets for different qualities (4K, 1080p) or languages.

### 📊 Engagement Engine (Social/Activity)
-   **`watch_history`**: Tracks "Continue Watching". It saves the exact second a user stops watching.
-   **`watchlist`**: Standard "My List" functionality.

### 💳 Subscription & Monetization
-   **`subscription_plans`**: Defines tiers (e.g., Gold vs. Premium).
-   **`user_subscriptions`**: Tracks which user has paid for which plan and until when.

---

## 3. How It Works (Typical Flows)

### discovery Flow (Home Screen)
1.  Frontend requests content by `category` (e.g., "Movies").
2.  Query joins `content`, `categories`, and `genres`.
3.  Optimized by `idx_content_category` for fast loading.

### Playback Flow
1.  User clicks "Play".
2.  Backend fetches `media_assets` filtered by `content_id` (or `episode_id`) and the user's current network bandwidth (determined by resolution).
3.  A row is inserted/updated in `watch_history` to start tracking progress.

### "Continue Watching" Flow
1.  Frontend queries `watch_history` filtered by the active `profile_id`.
2.  Results are ordered by `last_watched_at` DESC.
3.  Displays the partial progress bar on content thumbnails.

---

## 4. Key Design Decisions

-   **UUIDs**: All primary keys use UUIDs (Universally Unique Identifiers) to support multi-region distribution and prevent ID guessing.
-   **PostgreSQL Features**: Uses `TIMESTAMP WITH TIME ZONE` for global compatibility and JSON-ready fields for future scale.
-   **Normalization**: Balanced between 3NF (Normal Form) and performance. We use inheritance patterns for content to avoid null-heavy tables.
