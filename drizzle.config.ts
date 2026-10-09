import { defineConfig } from "drizzle-kit";

// Drizzle Kit needs a direct connection, so it reads the unpooled URL itself.
// The pooled DATABASE_URL in shared/config/server-env is the app's runtime one
// and is never used here.
const url = process.env.DATABASE_URL_UNPOOLED;
if (!url) {
  throw new Error("Missing environment variable: DATABASE_URL_UNPOOLED");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url,
  },
});
