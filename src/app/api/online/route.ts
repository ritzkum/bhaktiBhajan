import { db } from "@/db";
import { activeListeners } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!db) {
      return Response.json({ count: Math.floor(Math.random() * 20) + 25 });
    }

    const { sessionId } = (await request.json()) as { sessionId: string };
    if (!sessionId) {
      return Response.json({ error: "sessionId required" }, { status: 400 });
    }

    // Upsert this listener's heartbeat
    await db.execute(sql`
      INSERT INTO active_listeners (session_id, last_seen)
      VALUES (${sessionId}, NOW())
      ON CONFLICT (session_id)
      DO UPDATE SET last_seen = NOW()
    `);

    // Clean up stale sessions (older than 30 seconds)
    await db.execute(sql`
      DELETE FROM active_listeners
      WHERE last_seen < NOW() - INTERVAL '30 seconds'
    `);

    // Count active listeners
    const result = await db.execute(sql`
      SELECT COUNT(*)::int AS count FROM active_listeners
      WHERE last_seen > NOW() - INTERVAL '30 seconds'
    `);

    const count = (result.rows[0] as { count: number })?.count ?? 1;

    return Response.json({ count });
  } catch {
    return Response.json({ count: 1 });
  }
}
