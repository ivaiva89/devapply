# Vercel Build

Set the Vercel dashboard Build Command to:

```bash
npm run build:vercel
```

## Production deployments

When `VERCEL_ENV=production`, the build runs:

```bash
prisma generate
prisma migrate deploy
next build
```

## Preview and development deployments

When `VERCEL_ENV` is not `production`, the build runs:

```bash
prisma generate
next build
```

`prisma migrate deploy` is production-only so preview and development
deployments do not apply migrations automatically against shared databases.
