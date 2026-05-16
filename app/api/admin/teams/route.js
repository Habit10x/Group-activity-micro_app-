import { NextResponse } from "next/server";
import sql from "@/lib/db";

function checkAuth(request) {
  const pw = request.headers.get("x-admin-password");
  return pw === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT team_name, members, overall, submitted_at
      FROM attempts
      ORDER BY overall DESC, submitted_at ASC
    `;
    return NextResponse.json({ teams: rows });
  } catch (err) {
    console.error("Admin teams error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
