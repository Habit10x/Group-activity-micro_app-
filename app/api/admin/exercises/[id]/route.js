import { NextResponse } from "next/server";
import sql from "@/lib/db";

function checkAuth(request) {
  return request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

// PUT — update exercise fields OR set it active (body: { is_active: true } to activate)
export async function PUT(request, { params }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = params;
  try {
    const body = await request.json();

    // Setting active: deactivate all others first
    if (body.is_active === true) {
      await sql`UPDATE exercises SET is_active = FALSE`;
      await sql`UPDATE exercises SET is_active = TRUE WHERE id = ${id}`;
      return NextResponse.json({ success: true, activeId: id });
    }

    // General update
    const { title, description, guidelines, timer_minutes, scenario_ids } = body;
    const rows = await sql`
      UPDATE exercises SET
        title         = ${title},
        description   = ${description || ""},
        guidelines    = ${JSON.stringify(guidelines || [])},
        timer_minutes = ${timer_minutes || 8},
        scenario_ids  = ${JSON.stringify(scenario_ids || [])}
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ exercise: rows[0] });
  } catch (err) {
    console.error("Admin exercises PUT:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// DELETE — remove exercise (cannot delete the active one)
export async function DELETE(request, { params }) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = params;
  try {
    const rows = await sql`SELECT is_active FROM exercises WHERE id = ${id}`;
    if (rows.length === 0) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (rows[0].is_active) {
      return NextResponse.json({ error: "Cannot delete the active exercise. Set another exercise active first." }, { status: 409 });
    }
    await sql`DELETE FROM exercises WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin exercises DELETE:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
