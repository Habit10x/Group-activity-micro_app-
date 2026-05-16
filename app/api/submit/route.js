import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(request) {
  try {
    const { teamName, members, overall } = await request.json();

    if (!teamName || overall === undefined) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Reject if this team name has already submitted
    const existing = await sql`
      SELECT id FROM attempts WHERE LOWER(team_name) = LOWER(${teamName}) LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: "This team has already submitted." }, { status: 409 });
    }

    await sql`
      INSERT INTO attempts (team_name, members, overall)
      VALUES (${teamName}, ${members}, ${overall})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
