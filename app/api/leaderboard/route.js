import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`
      SELECT team_name, members, overall
      FROM attempts
      ORDER BY overall DESC
    `;

    return NextResponse.json({ teams: rows });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
