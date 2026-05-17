import { NextResponse } from "next/server";
import sql from "@/lib/db";

function checkAuth(request) {
  return request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

// GET — list all exercises with full data from DB
export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const exercises = await sql`
      SELECT id, title, description, guidelines, timer_minutes, scenario_ids, is_active, login_enabled
      FROM exercises
      ORDER BY is_active DESC, id ASC
    `;
    return NextResponse.json({ exercises });
  } catch (err) {
    console.error("Admin exercises GET:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// POST — create a new exercise
export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { title, description, guidelines, timer_minutes, scenario_ids } = await request.json();
    if (!title) return NextResponse.json({ error: "title is required." }, { status: 400 });

    // Generate slug ID from title
    const baseId = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    // Ensure uniqueness by appending timestamp if needed
    const existing = await sql`SELECT id FROM exercises WHERE id = ${baseId}`;
    const id = existing.length > 0 ? `${baseId}-${Date.now()}` : baseId;

    const rows = await sql`
      INSERT INTO exercises (id, title, description, guidelines, timer_minutes, scenario_ids, is_active)
      VALUES (${id}, ${title}, ${description || ""}, ${JSON.stringify(guidelines || [])},
              ${timer_minutes || 8}, ${JSON.stringify(scenario_ids || [])}, FALSE)
      RETURNING *
    `;
    return NextResponse.json({ exercise: rows[0] });
  } catch (err) {
    console.error("Admin exercises POST:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
