import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// Make database connection optional for static builds
const connectionString = process.env.DATABASE_URL;

// Only create pool if DATABASE_URL is available
const pool = connectionString 
  ? new pg.Pool({ connectionString })
  : null;

// Export db as potentially null for environments without database
export const db = pool ? drizzle(pool) : null;
