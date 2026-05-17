import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  const results = [];

  // ── 1. Make email nullable on attempts ───────────────────────────────────────
  try {
    await sql`ALTER TABLE attempts ALTER COLUMN email DROP NOT NULL`;
    results.push("✓ attempts.email made nullable");
  } catch {
    results.push("· attempts.email already nullable (skipped)");
  }

  // ── 2. Create scenarios table ─────────────────────────────────────────────────
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS scenarios (
        id             SERIAL PRIMARY KEY,
        short_name     TEXT NOT NULL,
        full_name      TEXT NOT NULL,
        prompt_text    TEXT NOT NULL,
        context_points JSONB NOT NULL DEFAULT '[]',
        score          INT  NOT NULL DEFAULT 5,
        point_first    BOOLEAN NOT NULL DEFAULT FALSE,
        headline       TEXT DEFAULT '',
        what_worked    TEXT DEFAULT '',
        to_improve     TEXT DEFAULT '',
        created_at     TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    results.push("✓ scenarios table ready");
  } catch (err) {
    results.push("✗ scenarios table: " + err.message);
    return NextResponse.json({ success: false, results });
  }

  // ── 3. Create exercises table (full schema) ───────────────────────────────────
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS exercises (
        id            TEXT PRIMARY KEY,
        title         TEXT NOT NULL DEFAULT '',
        description   TEXT DEFAULT '',
        guidelines    JSONB DEFAULT '[]',
        timer_minutes INT  DEFAULT 8,
        scenario_ids  JSONB DEFAULT '[]',
        is_active     BOOLEAN NOT NULL DEFAULT FALSE
      )
    `;
    results.push("✓ exercises table ready");
  } catch (err) {
    results.push("✗ exercises table: " + err.message);
    return NextResponse.json({ success: false, results });
  }

  // ── 4. Add any missing columns to exercises (safe, idempotent) ────────────────
  const exerciseCols = [
    { name: "title",         def: "TEXT NOT NULL DEFAULT ''" },
    { name: "description",   def: "TEXT DEFAULT ''" },
    { name: "guidelines",    def: "JSONB DEFAULT '[]'" },
    { name: "timer_minutes", def: "INT DEFAULT 8" },
    { name: "scenario_ids",  def: "JSONB DEFAULT '[]'" },
  ];

  for (const col of exerciseCols) {
    try {
      // Check if column exists first
      const rows = await sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'exercises' AND column_name = ${col.name}
      `;
      if (rows.length === 0) {
        // Column missing — add it. We need to build the statement dynamically.
        // neon template literals don't allow dynamic identifiers, so we check
        // each column by name and run the matching statement.
        if (col.name === "title")         await sql`ALTER TABLE exercises ADD COLUMN title TEXT NOT NULL DEFAULT ''`;
        if (col.name === "description")   await sql`ALTER TABLE exercises ADD COLUMN description TEXT DEFAULT ''`;
        if (col.name === "guidelines")    await sql`ALTER TABLE exercises ADD COLUMN guidelines JSONB DEFAULT '[]'`;
        if (col.name === "timer_minutes") await sql`ALTER TABLE exercises ADD COLUMN timer_minutes INT DEFAULT 8`;
        if (col.name === "scenario_ids")  await sql`ALTER TABLE exercises ADD COLUMN scenario_ids JSONB DEFAULT '[]'`;
        results.push(`✓ added column exercises.${col.name}`);
      }
    } catch (err) {
      results.push(`· exercises.${col.name}: ${err.message}`);
    }
  }

  // ── 5. Seed scenarios (SERIAL = explicit ID works without OVERRIDING) ─────────
  const seeds = [
    { id:1, short:"Project Update",   full:"Project Update",
      prompt:`Your manager asks: "How's the Horizon project coming along?"`,
      ctx:["4 of 6 emails done, approved by marketing","Email 3: legal review delay — resolved","On track for next Friday deadline","Design team hasn't replied about header format — if no reply by Tuesday, 3-day delay"],
      score:8, pf:true,
      hl:"Strong status open — but the risk lands too late",
      worked:"Led with current status and completion count. The resolved delay was handled efficiently in one clause.",
      improve:"The design decision risk is the most time-sensitive item. It should follow the status immediately — not come after a resolved issue that's already done." },
    { id:2, short:"Show Rec.",        full:"Show Recommendation",
      prompt:`Your friend texts: "Should I watch that crime show you just finished? I have one evening free."`,
      ctx:["6 episodes. Eps 1–4: gripping, watched all four in one sitting","Eps 5–6: romance subplot takes over, tension drops significantly","Finale reveal satisfying but last 20 min feel rushed","Friend likes crime shows, hates shows that drag"],
      score:5, pf:true,
      hl:"Recommendation is clear but reasoning is entirely generic",
      worked:"Led with a direct yes — that's correct. Overall structure is right.",
      improve:"'Interesting story' describes every show. Use what you actually know: 4 eps in one sitting, then a dip, then a satisfying ending." },
    { id:3, short:"Missed Meeting",   full:"Missed Meeting",
      prompt:`Your team lead messages: "You weren't on the call — what happened, and what did you miss?"`,
      ctx:["Water pipe emergency at 2:50pm — no time to message first","Caught up with colleague: presentation moved to Thursday (no content change)","New expense approval: >₹5k needs 2 managers via new form, starts Monday","Tuesday sync cancelled (public holiday)"],
      score:9, pf:false,
      hl:"Near-perfect — every element in the right order",
      worked:"Brief, non-defensive, all updates specific and actionable.",
      improve:"Minor: skipping 'Hi' in the opening would make it even tighter." },
    { id:4, short:"Explain Role",     full:"Explain Your Role",
      prompt:`A family member asks: "So what is it that you actually do at work? I've never understood."`,
      ctx:["Role: Business Analyst at a consumer goods company","You find why products underperform and write 2–3 page reports for marketing/ops","Last month: found shelf placement (not pricing) was killing sales in 3 cities","Time: ~60% data, ~30% meetings, ~10% writing"],
      score:4, pf:false,
      hl:"Opens by signalling complexity — opposite of what this needs",
      worked:"Identified the general nature of the work (analytical, reports).",
      improve:"Lead with what you produce and why it matters, then give the shelf-placement example." },
    { id:5, short:"Budget Request",   full:"Budget Request",
      prompt:`Your manager asks: "You've flagged needing an extra ₹80k for the quarter — walk me through why."`,
      ctx:["AWS costs doubled in 3 months due to 4× traffic growth (expected, healthy)","ISO 27001 compliance now mandatory — requires paid security tooling: ₹25k/year","Original infra estimate was made 8 months ago, pre-scale","Evaluated 3 cheaper cloud alternatives — none meet latency requirements for product"],
      score:7, pf:true,
      hl:"Solid structure — but the 'why now' isn't front-loaded",
      worked:"The three cost drivers are all legitimate and specific. Good that alternatives were evaluated.",
      improve:"Open with the single clearest reason: the original estimate is 8 months stale and the product has 4× the traffic. Everything else flows from that." },
    { id:6, short:"Vendor Delay",     full:"Vendor Delay",
      prompt:`Your client messages: "We were expecting delivery last Friday — what's the status?"`,
      ctx:["Primary supplier delayed 3 weeks due to a port strike — notified you 4 days after the deadline","Secondary supplier identified and confirmed — adds ₹12k to project cost","New confirmed delivery date: this Thursday","Client hasn't been told about the cost increase yet"],
      score:6, pf:true,
      hl:"The key facts are present but the cost increase is buried",
      worked:"Led with the new delivery date — correct. Explained the root cause clearly.",
      improve:"The ₹12k cost increase is a decision the client needs to make, not a detail to bury at the end. Surface it immediately after the new date, with a clear ask." },
    { id:7, short:"Team Performance", full:"Team Performance",
      prompt:`Your HR director asks: "How did Riya perform last quarter? Brief summary for the review file."`,
      ctx:["Delivered 3 of 4 assigned projects on time — all received positive client feedback (avg 4.6/5)","Q4 project missed deadline by 10 days — scope changed mid-project by leadership, not Riya's call","Peers flag her written updates as consistently clear and ahead of schedule","One area flagged by her: wants more ownership on client-facing presentations"],
      score:8, pf:false,
      hl:"Well-structured — but leading with the missed deadline is the wrong call",
      worked:"Every fact is included and specific. The context around the Q4 delay is important and was included.",
      improve:"Lead with the output: 3/4 on time, strong client scores. Then address the missed deadline with its context. Don't open a performance summary with the one miss." },
    { id:8, short:"Feature Feedback", full:"Feature Feedback",
      prompt:`Your PM asks the day before launch: "Any concerns with the new onboarding flow before we ship?"`,
      ctx:["Tested with 8 users — 6 completed without help, 2 dropped at Step 3 (payment fields)","Step 3 has 4 required fields — industry standard but dense; fixing it needs ~2 days","Current analytics show 23% drop-off at payment in the existing flow too","Launch is tomorrow; delaying costs ₹40k in contractual penalties"],
      score:5, pf:true,
      hl:"Surfaces the concern but doesn't give the PM what they need to decide",
      worked:"Named the specific drop point (Step 3) with a concrete number (2 users). Good.",
      improve:"The PM needs to decide: ship or delay. Give them the tradeoff in one sentence — '2 users dropped at payment; fixing it takes 2 days and costs ₹40k in penalties. The same step has 23% drop-off in the old flow, so it may not move the needle. Your call.'" },
  ];

  let seeded = 0;
  for (const s of seeds) {
    try {
      await sql`
        INSERT INTO scenarios
          (id, short_name, full_name, prompt_text, context_points,
           score, point_first, headline, what_worked, to_improve)
        VALUES
          (${s.id}, ${s.short}, ${s.full}, ${s.prompt}, ${JSON.stringify(s.ctx)},
           ${s.score}, ${s.pf}, ${s.hl}, ${s.worked}, ${s.improve})
        ON CONFLICT (id) DO NOTHING
      `;
      seeded++;
    } catch (err) {
      results.push(`✗ scenario ${s.id} (${s.short}): ${err.message}`);
    }
  }

  // Update sequence so next auto-insert gets id > 8
  try {
    await sql`SELECT setval('scenarios_id_seq', GREATEST((SELECT MAX(id) FROM scenarios), 8))`;
  } catch { /* ignore */ }

  results.push(`✓ ${seeded}/8 scenarios seeded`);

  // ── 6. Seed exercises ─────────────────────────────────────────────────────────
  const defaultGuidelines = [
    "Read each scenario carefully — all context you need is provided.",
    "Discuss as a team, then the captain writes the final answer.",
    "Don't add information that isn't in the scenario.",
    "Scores and community responses unlock after submitting all scenarios.",
  ];

  const exerciseSeeds = [
    { id: "articulation-01", title: "Articulation-01",
      desc: "Practice structuring your responses clearly — lead with the point, support it specifically, and close confidently. Best team wins.",
      sids: [1,2,3,4], active: true },
    { id: "articulation-02", title: "Articulation-02",
      desc: "Practice communicating clearly under pressure — budget conversations, client escalations, performance reviews, and launch decisions. Every word counts.",
      sids: [5,6,7,8], active: false },
  ];

  for (const ex of exerciseSeeds) {
    try {
      await sql`
        INSERT INTO exercises (id, title, description, guidelines, timer_minutes, scenario_ids, is_active)
        VALUES (
          ${ex.id}, ${ex.title}, ${ex.desc},
          ${JSON.stringify(defaultGuidelines)}, 8, ${JSON.stringify(ex.sids)}, ${ex.active}
        )
        ON CONFLICT (id) DO UPDATE SET
          title        = EXCLUDED.title,
          description  = EXCLUDED.description,
          guidelines   = EXCLUDED.guidelines,
          timer_minutes= EXCLUDED.timer_minutes,
          scenario_ids = EXCLUDED.scenario_ids
      `;
      results.push(`✓ exercise "${ex.id}" seeded`);
    } catch (err) {
      results.push(`✗ exercise "${ex.id}": ${err.message}`);
    }
  }

  // ── 7. Add login_enabled column to exercises ─────────────────────────────────
  try {
    const leRows = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'exercises' AND column_name = 'login_enabled'
    `;
    if (leRows.length === 0) {
      await sql`ALTER TABLE exercises ADD COLUMN login_enabled BOOLEAN NOT NULL DEFAULT TRUE`;
      results.push("✓ added column exercises.login_enabled");
    } else {
      results.push("· exercises.login_enabled already exists (skipped)");
    }
  } catch (err) {
    results.push("· exercises.login_enabled: " + err.message);
  }

  return NextResponse.json({ success: true, results });
}
