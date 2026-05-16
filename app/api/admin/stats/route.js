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
    const [totals, top] = await Promise.all([
      sql`SELECT COUNT(*) as total, AVG(overall) as avg_score FROM attempts`,
      sql`SELECT team_name, overall FROM attempts ORDER BY overall DESC LIMIT 1`,
    ]);

    return NextResponse.json({
      total: parseInt(totals[0].total),
      avgScore: totals[0].avg_score ? parseFloat(parseFloat(totals[0].avg_score).toFixed(2)) : null,
      topTeam: top.length > 0 ? { name: top[0].team_name, score: parseFloat(top[0].overall) } : null,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
