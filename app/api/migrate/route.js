import { NextResponse } from "next/server";
import sql from "@/lib/db";

// One-time migration: make email nullable so submissions work without an email.
// Hit GET /api/migrate once after deploying the new version.
export async function GET() {
  try {
    await sql`ALTER TABLE attempts ALTER COLUMN email DROP NOT NULL`;
    return NextResponse.json({ success: true, message: "Migration complete." });
  } catch (err) {
    return NextResponse.json({
      message: "Migration may have already run or failed — check manually.",
      error: err.message,
    });
  }
}
