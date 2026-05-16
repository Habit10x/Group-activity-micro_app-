import { NextResponse } from "next/server";
import sql from "@/lib/db";

function checkAuth(request) {
  return request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const rows = await sql`
      SELECT id, short_name, full_name, prompt_text, context_points,
             score, point_first, headline, what_worked, to_improve, created_at
      FROM scenarios
      ORDER BY id ASC
    `;
    return NextResponse.json({ scenarios: rows });
  } catch (err) {
    console.error("Admin scenarios GET:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { short_name, full_name, prompt_text, context_points, score, point_first, headline, what_worked, to_improve } = await request.json();
    if (!short_name || !full_name || !prompt_text) {
      return NextResponse.json({ error: "short_name, full_name, and prompt_text are required." }, { status: 400 });
    }
    const rows = await sql`
      INSERT INTO scenarios (short_name, full_name, prompt_text, context_points, score, point_first, headline, what_worked, to_improve)
      VALUES (${short_name}, ${full_name}, ${prompt_text}, ${JSON.stringify(context_points || [])},
              ${score ?? 5}, ${point_first ?? false}, ${headline || ""}, ${what_worked || ""}, ${to_improve || ""})
      RETURNING *
    `;
    return NextResponse.json({ scenario: rows[0] });
  } catch (err) {
    console.error("Admin scenarios POST:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
