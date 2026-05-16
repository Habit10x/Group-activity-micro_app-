// ─── All Scenarios ────────────────────────────────────────────────────────────
export const SCENARIOS = [
  // ── Articulation-01 ──────────────────────────────────────────────────────────
  {
    id: 1, short: "Project Update", full: "Project Update",
    text: `Your manager asks: "How's the Horizon project coming along?"`,
    ctx: [
      "4 of 6 emails done, approved by marketing",
      "Email 3: legal review delay — resolved",
      "On track for next Friday deadline",
      "Design team hasn't replied about header format — if no reply by Tuesday, 3-day delay",
    ],
    score: 8, pf: true,
    headline: "Strong status open — but the risk lands too late",
    worked: "Led with current status and completion count. The resolved delay was handled efficiently in one clause.",
    improve: "The design decision risk is the most time-sensitive item. It should follow the status immediately — not come after a resolved issue that's already done.",
  },
  {
    id: 2, short: "Show Rec.", full: "Show Recommendation",
    text: `Your friend texts: "Should I watch that crime show you just finished? I have one evening free."`,
    ctx: [
      "6 episodes. Eps 1–4: gripping, watched all four in one sitting",
      "Eps 5–6: romance subplot takes over, tension drops significantly",
      "Finale reveal satisfying but last 20 min feel rushed",
      "Friend likes crime shows, hates shows that drag",
    ],
    score: 5, pf: true,
    headline: "Recommendation is clear but reasoning is entirely generic",
    worked: "Led with a direct yes — that's correct. Overall structure is right.",
    improve: "'Interesting story' describes every show. Use what you actually know: 4 eps in one sitting, then a dip, then a satisfying ending.",
  },
  {
    id: 3, short: "Missed Meeting", full: "Missed Meeting",
    text: `Your team lead messages: "You weren't on the call — what happened, and what did you miss?"`,
    ctx: [
      "Water pipe emergency at 2:50pm — no time to message first",
      "Caught up with colleague: presentation moved to Thursday (no content change)",
      "New expense approval: >₹5k needs 2 managers via new form, starts Monday",
      "Tuesday sync cancelled (public holiday)",
    ],
    score: 9, pf: false,
    headline: "Near-perfect — every element in the right order",
    worked: "Brief, non-defensive, all updates specific and actionable.",
    improve: "Minor: skipping 'Hi' in the opening would make it even tighter.",
  },
  {
    id: 4, short: "Explain Role", full: "Explain Your Role",
    text: `A family member asks: "So what is it that you actually do at work? I've never understood."`,
    ctx: [
      "Role: Business Analyst at a consumer goods company",
      "You find why products underperform and write 2–3 page reports for marketing/ops",
      "Last month: found shelf placement (not pricing) was killing sales in 3 cities",
      "Time: ~60% data, ~30% meetings, ~10% writing",
    ],
    score: 4, pf: false,
    headline: "Opens by signalling complexity — opposite of what this needs",
    worked: "Identified the general nature of the work (analytical, reports).",
    improve: "Lead with what you produce and why it matters, then give the shelf-placement example.",
  },

  // ── Articulation-02 ──────────────────────────────────────────────────────────
  {
    id: 5, short: "Budget Request", full: "Budget Request",
    text: `Your manager asks: "You've flagged needing an extra ₹80k for the quarter — walk me through why."`,
    ctx: [
      "AWS costs doubled in 3 months due to 4× traffic growth (expected, healthy)",
      "ISO 27001 compliance now mandatory — requires paid security tooling: ₹25k/year",
      "Original infra estimate was made 8 months ago, pre-scale",
      "Evaluated 3 cheaper cloud alternatives — none meet latency requirements for product",
    ],
    score: 7, pf: true,
    headline: "Solid structure — but the 'why now' isn't front-loaded",
    worked: "The three cost drivers are all legitimate and specific. Good that alternatives were evaluated.",
    improve: "Open with the single clearest reason: the original estimate is 8 months stale and the product has 4× the traffic. Everything else flows from that.",
  },
  {
    id: 6, short: "Vendor Delay", full: "Vendor Delay",
    text: `Your client messages: "We were expecting delivery last Friday — what's the status?"`,
    ctx: [
      "Primary supplier delayed 3 weeks due to a port strike — notified you 4 days after the deadline",
      "Secondary supplier identified and confirmed — adds ₹12k to project cost",
      "New confirmed delivery date: this Thursday",
      "Client hasn't been told about the cost increase yet",
    ],
    score: 6, pf: true,
    headline: "The key facts are present but the cost increase is buried",
    worked: "Led with the new delivery date — correct. Explained the root cause clearly.",
    improve: "The ₹12k cost increase is a decision the client needs to make, not a detail to bury at the end. Surface it immediately after the new date, with a clear ask.",
  },
  {
    id: 7, short: "Team Performance", full: "Team Performance",
    text: `Your HR director asks: "How did Riya perform last quarter? Brief summary for the review file."`,
    ctx: [
      "Delivered 3 of 4 assigned projects on time — all received positive client feedback (avg 4.6/5)",
      "Q4 project missed deadline by 10 days — scope changed mid-project by leadership, not Riya's call",
      "Peers flag her written updates as consistently clear and ahead of schedule",
      "One area flagged by her: wants more ownership on client-facing presentations",
    ],
    score: 8, pf: false,
    headline: "Well-structured — but leading with the missed deadline is the wrong call",
    worked: "Every fact is included and specific. The context around the Q4 delay is important and was included.",
    improve: "Lead with the output: 3/4 on time, strong client scores. Then address the missed deadline with its context. Don't open a performance summary with the one miss.",
  },
  {
    id: 8, short: "Feature Feedback", full: "Feature Feedback",
    text: `Your PM asks the day before launch: "Any concerns with the new onboarding flow before we ship?"`,
    ctx: [
      "Tested with 8 users — 6 completed without help, 2 dropped at Step 3 (payment fields)",
      "Step 3 has 4 required fields — industry standard but dense; fixing it needs ~2 days",
      "Current analytics show 23% drop-off at payment in the existing flow too",
      "Launch is tomorrow; delaying costs ₹40k in contractual penalties",
    ],
    score: 5, pf: true,
    headline: "Surfaces the concern but doesn't give the PM what they need to decide",
    worked: "Named the specific drop point (Step 3) with a concrete number (2 users). Good.",
    improve: "The PM needs to decide: ship or delay. Give them the tradeoff in one sentence — '2 users dropped at payment; fixing it takes 2 days and costs ₹40k in penalties. The same step has 23% drop-off in the old flow, so it may not move the needle. Your call.'",
  },
];

// ─── Community Answers ────────────────────────────────────────────────────────
export const COMMUNITY = [
  // Articulation-01 / Scenario 1
  {
    id: 1, sid: 1, name: "Priya N.", init: "PN", own: false, score: 9,
    answer: "Horizon is on track for Friday. 4 of 6 emails done — legal review on Email 3 resolved. One urgent item: design team needs to decide on header format by Tuesday or we slip 3 days.",
    ih: "Every required element, tight sequence.", iw: "Status first, specific count, resolved item cleaned up, risk named with deadline and consequence.", ii: "Nothing — this is what 9/10 looks like.",
  },
  {
    id: 2, sid: 1, name: "Marcus T.", init: "MT", own: false, score: 5,
    answer: "Project's going well — nearly done with the emails. Had a small delay with legal but that's sorted. Should be done by Friday assuming the design team gets back to us.",
    ih: "The risk is buried in a conditional at the end.", iw: "Status is broadly communicated.", ii: "'Assuming the design team gets back to us' is the entire risk in disguise. Name it explicitly: what they need to decide, by when, what happens if they don't.",
  },
  {
    id: 3, sid: 1, name: "Team Clarity", init: "TC", own: true, score: 8,
    answer: "The Horizon project is on track for next Friday. We've completed 4 of 6 emails — Email 3 needed an extra legal review but that's resolved. One open item: design team needs to decide on header format by Tuesday or we risk a 3-day delay.",
    ih: "Strong — risk sequencing is the one fix.", iw: "Opened with status. Specific count. Resolved delay handled efficiently in one clause.", ii: "Move the design risk directly after status. Resolved issues are past — open risks are now.",
  },
  {
    id: 4, sid: 1, name: "Arun K.", init: "AK", own: false, score: 9,
    answer: "On track for next Friday. 4 emails complete, one legal review resolved. Design team needs to confirm header format by Tuesday — if not, we slip 3 days.",
    ih: "Tightest version in the group.", iw: "Every sentence is load-bearing. Status → resolved → live risk with consequence.", ii: "Nothing — this is the target.",
  },
  // Articulation-01 / Scenario 2
  {
    id: 5, sid: 2, name: "Fatima R.", init: "FR", own: false, score: 9,
    answer: "Watch it — but go in knowing it's two different shows. Eps 1–4 are gripping; I did all four in one sitting. Eps 5–6 slow right down when romance takes over. The finale reveal lands but the last 20 min rush. Given you hate shows that drag — stick through the dip.",
    ih: "Leads with recommendation, sets expectation, uses specific detail.", iw: "The 'two different shows' framing prepares the friend perfectly.", ii: "Nothing.",
  },
  {
    id: 6, sid: 2, name: "Team Clarity", init: "TC", own: true, score: 5,
    answer: "Yes definitely watch it! It's really good and I think you'll enjoy it. The story is interesting and the characters are well developed. Some parts are slow but overall it's worth it I think.",
    ih: "Recommendation is clear but evidence is generic.", iw: "Led with yes — correct.", ii: "'Interesting story' says nothing. Use specifics: 4 eps in one sitting, then a dip, then a satisfying ending.",
  },
  // Articulation-02 / Scenario 5
  {
    id: 7, sid: 5, name: "Dev T.", init: "DT", own: false, score: 9,
    answer: "The ₹80k is driven by three things: AWS costs doubled as traffic grew 4×, ISO compliance now requires ₹25k in tooling, and the original estimate is 8 months old. We evaluated three cheaper cloud options — none meet our latency bar. I'd like sign-off by Thursday to avoid service degradation.",
    ih: "Clear driver breakdown, alternatives addressed, specific ask.", iw: "Led with scale context before the number. Each cost has a reason.", ii: "Nothing material.",
  },
  {
    id: 8, sid: 5, name: "Team Clarity", init: "TC", own: true, score: 7,
    answer: "We need the additional budget because our infrastructure costs have gone up significantly. AWS has doubled, we have a new compliance requirement for ₹25k, and our original budget was made before our growth. We looked at alternatives but they don't work for us technically.",
    ih: "All three drivers present but sequenced weakly.", iw: "Covered all the reasons.", ii: "Lead with the root cause: the estimate is 8 months stale and traffic has 4×'d. Then name the specifics.",
  },
  // Articulation-02 / Scenario 8
  {
    id: 9, sid: 8, name: "Keanu M.", init: "KM", own: false, score: 9,
    answer: "One concern: 2 of 8 test users dropped at the payment step. Fixing it takes 2 days. Delaying costs ₹40k in penalties. Worth noting — the same step has 23% drop-off in the current flow, so the new version may not be worse. Ship or wait: your call, I can go either way.",
    ih: "Gave the PM everything needed to decide in four sentences.", iw: "Named the issue, the fix cost, the penalty, and the baseline comparison. Ended with a clear ask.", ii: "Nothing.",
  },
  {
    id: 10, sid: 8, name: "Team Clarity", init: "TC", own: true, score: 5,
    answer: "Yes there are some concerns. The payment step seems a bit complicated — 2 users out of 8 had trouble there. We could simplify it but it would take a couple of days. The launch is tomorrow so we need to decide soon.",
    ih: "Surfaces the concern without giving the PM what they need.", iw: "Named the correct step.", ii: "Give the PM the tradeoff explicitly: fixing = 2 days + ₹40k penalty. Note that the current flow has the same drop-off. Then ask directly: ship or delay?",
  },
];

// ─── Exercises ────────────────────────────────────────────────────────────────
export const EXERCISES = [
  {
    id: "articulation-01",
    title: "Articulation-01",
    subtitle: "Clear Communication · Workplace Scenarios",
    description: "Practice structuring your responses clearly — lead with the point, support it specifically, and close confidently. Best team wins.",
    guidelines: [
      "Read each scenario carefully — all context you need is provided.",
      "Discuss as a team, then the captain writes the final answer.",
      "Don't add information that isn't in the scenario.",
      "Scores and community responses unlock after submitting all scenarios.",
    ],
    tags: [
      { icon: "👥", label: "Team Activity" },
      { icon: "🎙", label: "Articulation" },
      { icon: "📋", label: "4 Scenarios" },
      { icon: "⏱", label: "8 Minute Timer", highlight: true },
    ],
    timerMinutes: 8,
    scenarioIds: [1, 2, 3, 4],
  },
  {
    id: "articulation-02",
    title: "Articulation-02",
    subtitle: "Pressure Communication · High-Stakes Scenarios",
    description: "Practice communicating clearly under pressure — budget conversations, client escalations, performance reviews, and launch decisions. Every word counts.",
    guidelines: [
      "Read each scenario carefully — all context you need is provided.",
      "Discuss as a team, then the captain writes the final answer.",
      "Don't add information that isn't in the scenario.",
      "Scores and community responses unlock after submitting all scenarios.",
    ],
    tags: [
      { icon: "👥", label: "Team Activity" },
      { icon: "🎙", label: "Articulation" },
      { icon: "📋", label: "4 Scenarios" },
      { icon: "⏱", label: "8 Minute Timer", highlight: true },
    ],
    timerMinutes: 8,
    scenarioIds: [5, 6, 7, 8],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getExerciseData(exerciseId) {
  const exercise = EXERCISES.find(e => e.id === exerciseId) || EXERCISES[0];
  const scenarios = exercise.scenarioIds.map(id => SCENARIOS.find(s => s.id === id)).filter(Boolean);
  const community = COMMUNITY.filter(c => exercise.scenarioIds.includes(c.sid));
  return { exercise, scenarios, community };
}
