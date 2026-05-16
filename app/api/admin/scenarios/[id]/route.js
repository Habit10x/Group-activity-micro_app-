import { NextResponse } from "next/server";
import sql from "@/lib/db";

function checkAuth(request) {
  return request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function PUT(request, { params }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
  try {
    const { short_name, full_name, prompt_text, context_points, score, point_first, headline, what_worked, to_improve } = await request.json();
    const rows = await sql`
      UPDATE scenarios SET
        short_name     = ${short_name},
        full_name      = ${full_name},
        prompt_text    = ${prompt_text},
        context_points = ${JSON.stringify(context_points || [])},
        score          = ${score ?? 5},
        point_first    = ${point_first ?? false},
        headline       = ${headline || ""},
        what_worked    = ${what_worked || ""},
        to_improve     = ${to_improve || ""}
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ scenario: rows[0] });
  } catch (err) {
    console.error("Admin scenarios PUT:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
  try {
    await sql`DELETE FROM scenarios WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin scenarios DELETE:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
