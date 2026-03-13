# MASTER FRONTEND PROMPT – Streaming Platform (Next.js + Tailwind + Shadcn)

## Role

You are a **Senior Frontend Architect** building a high-performance OTT streaming platform UI similar to **JioCinema / Netflix**.

## Objective

Create a **modern streaming platform frontend** using:

- Next.js 16 (App Router)
- Tailwind CSS
- Shadcn/UI
- TypeScript
- Axios / Fetch API
- Responsive design (Mobile, Web, Smart TV)

The frontend must communicate with backend microservices through a **central API Gateway**.

The platform must support automatic region detection based on IP address similar to how Hotstar routes users to:

## https://www.hotstar.com/in/home

0. Region Detection & Initial Routing (Hotstar Style)

When a user first visits the site, the system must detect the user's country using their IP address.

Example behavior:

User opens: https://krishstream.com
↓
System detects IP location
↓
Redirect to region homepage

Example routing:

India → /in/home
UnitedStates → /us/home
UK → /uk/home

Example final URL:

https://krishstream.com/in/home

Implementation Requirements:

Use a Geo-IP detection service

Store detected region in cookie or local storage

Avoid repeated IP lookups

Automatically redirect users to the correct regional homepage

Example services for IP detection:

ipinfo.io
ipapi.co
cloudflare headers

Next.js Middleware Logic:

Detect user IP
Get country code
If no region cookie exists:
redirect → /{countryCode}/home
Else:
load existing region

Example:

/in/home
/in/movies
/in/profile

# 1. Global Architecture

All frontend API requests must go through a **single API Gateway**.

Example:

API Gateway Base URL

```
https://api.krishstream.com
peresent: http://localhost:3000
```

Endpoints:

```
POST /auth/api/register
POST /auth/api/login
POST /auth/api/verify-otp
POST /auth/api/resend-otp
GET  /auth/me
```

Token Handling:

- Access Token → stored in memory (React state)
- Refresh Token → secure HTTP-only cookie
- Automatically refresh expired tokens

---

# 2. Landing Page Layout

Create a professional OTT homepage structured like Netflix or JioCinema.

### Page Flow

```
Navbar
Hero Banner
Content Carousels
Trending Section
Recommended Section
Footer
```

---

# 3. Hero Section (Dynamic Banner)

The hero section should showcase a **featured movie from S3 storage**.

Design Requirements:

- Full-width cinematic banner
- Background image fetched from MinIO bucket
- Bottom gradient overlay
- Title + description text
- Two buttons

Example asset URL pattern:

https://cdn.krishstream.com/movies/banner/movie-name.jpg

(or)

http://minio.krishstream.local/movies/banner/movie-name.jpg

Buttons:

```
Watch Now
More Info
```

Interactions:

Watch Now

- If user is not authenticated → open Login Dialog

More Info

- Opens a Shadcn Dialog showing:
  - movie description
  - cast
  - duration
  - rating

Navbar Style:

Use **Glassmorphism effect**

```
backdrop-blur
transparent background
sticky top navigation
```

---

# 4. Content Carousels

Display movie collections using **Shadcn Carousel**.

Sections to implement:

```
Trending Now
New Releases
Top Rated
Continue Watching
Recommended For You
```

Data Sources:

Trending

```
Redis Sorted Sets
```

Movies

```
MongoDB content collection
```

Each card must show:

```
thumbnail
movie title
age rating
duration
```

Thumbnail example:

https://cdn.krishstream.com/movies/thumbnails/movie-id.jpg

Hover Interaction:

When hovering a card:

```
show metadata
show play button
slight zoom animation
```

---

# 5. Authentication Modal (Dialog)

Authentication must be handled via a **Shadcn Dialog modal**.

The login button opens a **multi-step authentication flow**.

---

# 6. Multi-Step Authentication Flow

Step 1 — Identify User

UI:

```
Email / Phone input
Continue button
```

API Call

```
POST /auth/api/login
```

Purpose:

Send OTP to user.

---

Step 2 — OTP Verification

UI:

Use **Shadcn InputOTP component**

Requirements:

```
6 digit OTP
auto focus
auto move to next input
paste support
```

API Call

```
POST /auth/api/verify-otp
```

Success Response:

```
JWT Access Token
User Profile
```

---

Step 3 — Success

Actions:

```
Store Access Token
Fetch user profile
Redirect to homepage
```

Profile Endpoint:

```
GET /auth/me
```

---

# 7. Resend OTP Logic

Add a **60-second countdown timer**.

Flow:

```
User clicks resend
POST /auth/api/resend-otp
Disable button for 60 seconds
Show countdown
```

---

# 8. Toast Notifications

Use **Shadcn Toast**.

Show messages:

Success

```
Login successful
OTP verified
```

Error

```
Invalid OTP
OTP expired
Network error
```

---

# 9. Theme & Visual Style

Design inspiration:

```
JioCinema
Netflix
Prime Video
```

Theme:

Deep Dark Mode

```
Background: #0f1014
Primary Accent: Jio Pink
Secondary Accent: Blue
```

UI Requirements:

```
glassmorphism modals
soft shadows
cinematic typography
smooth animations
```

---

# 10. Responsive Design

Support:

```
Mobile
Tablet
Desktop
Smart TV layout
```

Grid Behavior:

Mobile

```
2 movie cards per row
```

Tablet

```
4 cards
```

Desktop

```
6 cards
```

---

# 11. Loading & Skeleton UI

Before data loads:

Show **loading skeletons**.

Example:

```
Movie card skeleton
Hero banner skeleton
Profile loading state
```

---

# 12. Protected Routes

Use **Next.js Middleware** to protect routes.

Logic:

If user is not verified:

```
redirect → OTP verification page
```

Protected Pages:

```
/watch
/profile
/watchlist
```

Middleware Check:

```
is_authenticated
is_verified
```

---

# 13. Folder Structure

Recommended Next.js structure:

````
/app
   /page.tsx
   /movies
   /profile

/components
   HeroBanner
   MovieCarousel
   Navbar
   AuthDialog

/lib
   api-client.ts
   auth.ts
   token-manager.ts

/hooks
   useAuth
   useMovies

/store
   authStore
```MinIO integration helper example file:

lib/minio-client.ts

---

# 14. Performance Requirements

Implement:

````

lazy loading
image optimization
code splitting
skeleton loading

```

Use:

```

Next.js Image component
React Suspense
Server Components

```

---

# 15. Expected Result

The final UI must feel like a **production OTT platform** with:

```

cinematic landing page
smooth authentication flow
high performance UI
clean architecture
MinIO based media delivery

```

Inspired by:

```

Netflix
JioCinema
Hotstar
Prime Video

```

```
