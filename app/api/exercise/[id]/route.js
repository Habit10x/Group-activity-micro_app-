import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { COMMUNITY } from "@/lib/exerciseData";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const exRows = await sql`
      SELECT id, title, description, guidelines, timer_minutes, scenario_ids, login_enabled
      FROM exercises
      WHERE id = ${id} AND is_active = TRUE
      LIMIT 1
    `;

    if (exRows.length === 0) {
      return NextResponse.json({ error: "Exercise not found or not active." }, { status: 404 });
    }

    const ex = exRows[0];
    const scenarioIds = Array.isArray(ex.scenario_ids) ? ex.scenario_ids : [];

    let scenarios = [];
    if (scenarioIds.length > 0) {
      const scRows = await sql`
        SELECT id, short_name, full_name, prompt_text, context_points,
               score, point_first, headline, what_worked, to_improve
        FROM scenarios
        WHERE id = ANY(${scenarioIds})
      `;
      const scMap = Object.fromEntries(scRows.map(s => [s.id, s]));
      scenarios = scenarioIds.map(id => scMap[id]).filter(Boolean);
    }

    const normalisedScenarios = scenarios.map(s => ({
      id:       s.id,
      short:    s.short_name,
      full:     s.full_name,
      text:     s.prompt_text,
      ctx:      Array.isArray(s.context_points) ? s.context_points : [],
      score:    s.score,
      pf:       s.point_first,
      headline: s.headline,
      worked:   s.what_worked,
      improve:  s.to_improve,
    }));

    const community = COMMUNITY.filter(c => scenarioIds.includes(c.sid));

    const exercise = {
      id:          ex.id,
      title:       ex.title,
      description: ex.description,
      guidelines:  Array.isArray(ex.guidelines) ? ex.guidelines : [],
      timerMinutes:ex.timer_minutes,
      loginEnabled: ex.login_enabled ?? true,
      tags: [
        { icon: "👥", label: "Team Activity" },
        { icon: "🎙", label: "Articulation" },
        { icon: "📋", label: `${normalisedScenarios.length} Scenarios` },
        { icon: "⏱", label: `${ex.timer_minutes} Min Timer`, highlight: true },
      ],
    };

    return NextResponse.json({ exercise, scenarios: normalisedScenarios, community });
  } catch (err) {
    console.error("exercise/[id] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
