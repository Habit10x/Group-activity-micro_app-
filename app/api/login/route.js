import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();

    // Register user if not already present
    await sql`
      INSERT INTO users (email)
      VALUES (${normalised})
      ON CONFLICT (email) DO NOTHING
    `;

    // Check for an existing attempt
    const rows = await sql`
      SELECT team_name, members, overall, submitted_at
      FROM attempts
      WHERE email = ${normalised}
      LIMIT 1
    `;

    if (rows.length > 0) {
      return NextResponse.json({ hasAttempt: true, attempt: rows[0] });
    }

    return NextResponse.json({ hasAttempt: false });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
