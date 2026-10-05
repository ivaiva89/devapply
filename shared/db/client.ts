import "server-only";

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { env } from "@/shared/config/env";

import * as schema from "./schema";

// The pooled WebSocket driver, not neon-http: tracking-core needs an
// interactive transaction, which the HTTP driver cannot run.
const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle({ client: pool, schema });
