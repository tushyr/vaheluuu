# Project 23

A four-chapter, mobile-first birthday experience built with Next.js, React, Tailwind CSS, and Prisma.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm ci
cp .env.example .env.local
npm run db:migrate
npm run dev
```

Replace the example `P23_ADMIN_SECRET` before using `/admin`. Recipient progress, responses, and rewards are stored in `prisma/dev.db` for local and persistent Node deployments. Use a durable database adapter before deploying to an environment with an ephemeral or read-only filesystem.

The application uses India Standard Time for its September 20–23, 2026 chapter schedule. Development builds can preview a chapter with `?chap=1` through `?chap=4`; production builds ignore that override. The authenticated admin dashboard can apply a browser-scoped date simulation.

## Checks

```bash
npm run check
npm audit --omit=dev
```

`npm run check` runs ESLint, unit tests, and the production build.
