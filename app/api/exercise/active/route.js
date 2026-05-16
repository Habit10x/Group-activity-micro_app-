import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { COMMUNITY, getExerciseData } from "@/lib/exerciseData";

export async function GET() {
  try {
    // Get the active exercise from DB
    const exRows = await sql`
      SELECT id, title, description, guidelines, timer_minutes, scenario_ids
      FROM exercises
      WHERE is_active = TRUE
      LIMIT 1
    `;

    if (exRows.length === 0) {
      // No active exercise set — fall back to hardcoded
      return NextResponse.json(getExerciseData("articulation-01"));
    }

    const ex = exRows[0];
    const scenarioIds = Array.isArray(ex.scenario_ids) ? ex.scenario_ids : [];

    // Fetch those scenarios from DB (preserve order from scenario_ids array)
    let scenarios = [];
    if (scenarioIds.length > 0) {
      const scRows = await sql`
        SELECT id, short_name, full_name, prompt_text, context_points,
               score, point_first, headline, what_worked, to_improve
        FROM scenarios
        WHERE id = ANY(${scenarioIds})
      `;
      // Sort to match the order in scenario_ids
      const scMap = Object.fromEntries(scRows.map(s => [s.id, s]));
      scenarios = scenarioIds.map(id => scMap[id]).filter(Boolean);
    }

    // Normalise DB column names to match what the frontend expects
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

    // Community answers — still hardcoded, filtered by this exercise's scenario IDs
    const community = COMMUNITY.filter(c => scenarioIds.includes(c.sid));

    // Auto-generate tags from exercise data
    const exercise = {
      id:          ex.id,
      title:       ex.title,
      description: ex.description,
      guidelines:  Array.isArray(ex.guidelines) ? ex.guidelines : [],
      timerMinutes:ex.timer_minutes,
      tags: [
        { icon: "👥", label: "Team Activity" },
        { icon: "🎙", label: "Articulation" },
        { icon: "📋", label: `${normalisedScenarios.length} Scenarios` },
        { icon: "⏱", label: `${ex.timer_minutes} Min Timer`, highlight: true },
      ],
    };

    return NextResponse.json({ exercise, scenarios: normalisedScenarios, community });
  } catch (err) {
    console.error("exercise/active error:", err);
    // DB unavailable — fall back to first hardcoded exercise
    return NextResponse.json(getExerciseData("articulation-01"));
  }
}
