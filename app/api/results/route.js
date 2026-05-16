import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teamName = searchParams.get("teamName")?.trim();

  if (!teamName) {
    return NextResponse.json({ error: "Team name required." }, { status: 400 });
  }

  try {
    const rows = await sql`
      SELECT team_name, members, overall, submitted_at
      FROM attempts
      WHERE LOWER(team_name) = LOWER(${teamName})
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({ found: true, attempt: rows[0] });
  } catch (err) {
    console.error("Results error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
