import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

// Active listeners — heartbeat based
export const activeListeners = pgTable("active_listeners", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
});
