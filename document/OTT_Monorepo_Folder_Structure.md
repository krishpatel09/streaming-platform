# OTT Platform Monorepo Folder Structure

``` text
ott-platform/

├── apps/
│   ├── frontend/                 # Next.js User Application
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── middleware.ts
│   │
│   ├── admin/                    # Next.js Admin CMS
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── middleware.ts
│   │
│   ├── backend/                  # NestJS API (Modular Monolith)
│   │   ├── src/
│   │   │   ├── common/
│   │   │   ├── config/
│   │   │   ├── database/
│   │   │   ├── graphql/
│   │   │   ├── rest/
│   │   │   ├── websocket/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── profiles/
│   │   │   │   ├── movies/
│   │   │   │   ├── series/
│   │   │   │   ├── seasons/
│   │   │   │   ├── episodes/
│   │   │   │   ├── genres/
│   │   │   │   ├── search/
│   │   │   │   ├── recommendation/
│   │   │   │   ├── streaming/
│   │   │   │   ├── upload/
│   │   │   │   ├── transcoding/
│   │   │   │   ├── watch-history/
│   │   │   │   ├── watchlist/
│   │   │   │   ├── reviews/
│   │   │   │   ├── ratings/
│   │   │   │   ├── notifications/
│   │   │   │   ├── subscriptions/
│   │   │   │   ├── payments/
│   │   │   │   ├── analytics/
│   │   │   │   └── admin/
│   │   │   └── main.ts
│   │   └── test/
│   │
│   └── worker/                   # NestJS Background Worker
│       ├── src/
│       │   ├── ffmpeg/
│       │   ├── email/
│       │   ├── notification/
│       │   ├── thumbnail/
│       │   ├── queue/
│       │   └── analytics/
│       └── main.ts
│
├── packages/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── shared/
│   ├── types/
│   ├── config/
│   ├── logger/
│   ├── utils/
│   ├── validation/
│   └── ui/
│
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   ├── worker.Dockerfile
│   └── docker-compose.yml
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── deployment/
│   ├── security/
│   └── system-design/
│
├── scripts/
├── .github/
│   └── workflows/
├── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

## Architecture

-   **Monorepo** for all applications.
-   **Backend** is a **Modular Monolith** built with NestJS.
-   **Worker** is a separate NestJS application for FFmpeg, queues,
    emails, and background jobs.
-   **Frontend** and **Admin** are independent Next.js applications.
-   **Shared packages** (`prisma`, `types`, `config`, `logger`,
    `shared`) are reused across all apps.
