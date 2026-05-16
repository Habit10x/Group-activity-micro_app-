import { useState } from "react";

// ─── Design tokens (identical to Sharp App v3) ────────────────────────────────
const C = {
  crimson:  "#6B1A1A",
  crimsonHover: "#581515",
  crimsonPale:  "#FEF2F2",
  crimsonLight: "#F5E8E8",
  bg:       "#FAFAF8",
  card:     "#FFFFFF",
  border:   "#E8E2DA",
  borderLight: "#F0EBE3",
  text:     "#1C1C1C",
  muted:    "#6B6672",
  tag:      "#F0EBE3",
  tagText:  "#4A3F38",
  green:    "#059669",
  greenPale:"#ECFDF5",
  greenDark:"#065F46",
  amber:    "#D97706",
  amberPale:"#FFFBEB",
  amberDark:"#92400E",
  red:      "#DC2626",
  gold:     "#E8A020",
};

// ─── Scenarios (identical to Sharp App v3) ────────────────────────────────────
const SCENARIOS = [
  { id:1, short:"Project Update", full:"Project Update",
    text:`Your manager asks: "How's the Horizon project coming along?"`,
    ctx:[
      "4 of 6 emails done, approved by marketing",
      "Email 3: legal review delay — resolved",
      "On track for next Friday deadline",
      "Design team hasn't replied about header format — if no reply by Tuesday, 3-day delay"
    ],
    score:8, pf:true,
    headline:"Strong status open — but the risk lands too late",
    worked:"Led with current status and completion count. The resolved delay was handled efficiently in one clause.",
    improve:"The design decision risk is the most time-sensitive item. It should follow the status immediately — not come after a resolved issue that's already done."
  },
  { id:2, short:"Show Rec.", full:"Show Recommendation",
    text:`Your friend texts: "Should I watch that crime show you just finished? I have one evening free."`,
    ctx:[
      "6 episodes. Eps 1–4: gripping, watched all four in one sitting",
      "Eps 5–6: romance subplot takes over, tension drops significantly",
      "Finale reveal satisfying but last 20 min feel rushed",
      "Friend likes crime shows, hates shows that drag"
    ],
    score:5, pf:true,
    headline:"Recommendation is clear but reasoning is entirely generic",
    worked:"Led with a direct yes — that's correct. Overall structure is right.",
    improve:"'Interesting story' describes every show. Use what you actually know: 4 eps in one sitting, then a dip, then a satisfying ending."
  },
  { id:3, short:"Missed Meeting", full:"Missed Meeting",
    text:`Your team lead messages: "You weren't on the call — what happened, and what did you miss?"`,
    ctx:[
      "Water pipe emergency at 2:50pm — no time to message first",
      "Caught up with colleague: presentation moved to Thursday (no content change)",
      "New expense approval: >₹5k needs 2 managers via new form, starts Monday",
      "Tuesday sync cancelled (public holiday)"
    ],
    score:9, pf:false,
    headline:"Near-perfect — every element in the right order",
    worked:"Brief, non-defensive, all updates specific and actionable.",
    improve:"Minor: skipping 'Hi' in the opening would make it even tighter."
  },
  { id:4, short:"Explain Role", full:"Explain Your Role",
    text:`A family member asks: "So what is it that you actually do at work? I've never understood."`,
    ctx:[
      "Role: Business Analyst at a consumer goods company",
      "You find why products underperform and write 2–3 page reports for marketing/ops",
      "Last month: found shelf placement (not pricing) was killing sales in 3 cities",
      "Time: ~60% data, ~30% meetings, ~10% writing"
    ],
    score:4, pf:false,
    headline:"Opens by signalling complexity — opposite of what this needs",
    worked:"Identified the general nature of the work (analytical, reports).",
    improve:"Lead with what you produce and why it matters, then give the shelf-placement example."
  }
];

// ─── Community data (identical to Sharp App v3) ──────────────────────────────
const COMMUNITY = [
  { id:1, sid:1, name:"Priya N.", init:"PN", own:false, score:9,
    answer:"Horizon is on track for Friday. 4 of 6 emails done — legal review on Email 3 resolved. One urgent item: design team needs to decide on header format by Tuesday or we slip 3 days.",
    ih:"Every required element, tight sequence.", iw:"Status first, specific count, resolved item cleaned up, risk named with deadline and consequence.", ii:"Nothing — this is what 9/10 looks like."
  },
  { id:2, sid:1, name:"Marcus T.", init:"MT", own:false, score:5,
    answer:"Project's going well — nearly done with the emails. Had a small delay with legal but that's sorted. Should be done by Friday assuming the design team gets back to us.",
    ih:"The risk is buried in a conditional at the end.", iw:"Status is broadly communicated.", ii:"'Assuming the design team gets back to us' is the entire risk in disguise. Name it explicitly: what they need to decide, by when, what happens if they don't."
  },
  { id:3, sid:1, name:"Team Clarity", init:"TC", own:true, score:8,
    answer:"The Horizon project is on track for next Friday. We've completed 4 of 6 emails — Email 3 needed an extra legal review but that's resolved. One open item: design team needs to decide on header format by Tuesday or we risk a 3-day delay.",
    ih:"Strong — risk sequencing is the one fix.", iw:"Opened with status. Specific count. Resolved delay handled efficiently in one clause.", ii:"Move the design risk directly after status. Resolved issues are past — open risks are now."
  },
  { id:4, sid:1, name:"Arun K.", init:"AK", own:false, score:9,
    answer:"On track for next Friday. 4 emails complete, one legal review resolved. Design team needs to confirm header format by Tuesday — if not, we slip 3 days.",
    ih:"Tightest version in the group.", iw:"Every sentence is load-bearing. Status → resolved → live risk with consequence.", ii:"Nothing — this is the target."
  },
  { id:5, sid:2, name:"Fatima R.", init:"FR", own:false, score:9,
    answer:"Watch it — but go in knowing it's two different shows. Eps 1–4 are gripping; I did all four in one sitting. Eps 5–6 slow right down when romance takes over. The finale reveal lands but the last 20 min rush. Given you hate shows that drag — stick through the dip.",
    ih:"Leads with recommendation, sets expectation, uses specific detail.", iw:"The 'two different shows' framing prepares the friend perfectly.", ii:"Nothing."
  },
  { id:6, sid:2, name:"Team Clarity", init:"TC", own:true, score:5,
    answer:"Yes definitely watch it! It's really good and I think you'll enjoy it. The story is interesting and the characters are well developed. Some parts are slow but overall it's worth it I think.",
    ih:"Recommendation is clear but evidence is generic.", iw:"Led with yes — correct.", ii:"'Interesting story' says nothing. Use specifics: 4 eps in one sitting, then a dip, then a satisfying ending."
  },
];

// ─── Mock other teams for leaderboard ────────────────────────────────────────
const OTHER_TEAMS = [
  { name:"Team Clarity",   members:["Priya N.","Arun K.","Sneha M."],   avgScore:9.0 },
  { name:"Team Signal",    members:["Marcus T.","Fatima R.","Dev P."],   avgScore:7.3 },
  { name:"Team Focus",     members:["Riya S.","Kabir L.","Anaya V."],    avgScore:6.9 },
  { name:"Team Precision", members:["Vikram S.","Aisha R."],             avgScore:6.3 },
];

// ─── Helpers (identical to Sharp App v3) ─────────────────────────────────────
const scoreBg  = s => s>=8?C.greenPale  : s>=6?C.amberPale  : C.crimsonPale;
const scoreClr = s => s>=8?C.green      : s>=6?C.amber      : C.red;
const own      = (sid) => COMMUNITY.find(a=>a.sid===sid&&a.own);

// ─── Tag pill (identical to Sharp App v3) ────────────────────────────────────
const Tag = ({icon, label, highlight}) => (
  <span style={{
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"5px 12px", borderRadius:99, fontSize:12, fontWeight:500,
    border:"1px solid", borderColor: highlight?"#FECACA":C.border,
    background: highlight?C.crimsonPale:C.tag,
    color: highlight?C.crimson:C.tagText,
  }}>
    {icon && <span>{icon}</span>} {label}
  </span>
);

// ─── TopNav — CHANGE 1: shows team name + member count, no sign out ──────────
// In v3 this showed an individual user with a sign-out button.
// For the team app the right side shows the team chip instead.
const TopNav = ({teamName, members, back}) => (
  <header style={{
    background:C.card, borderBottom:"1px solid "+C.border,
    padding:"0 24px", height:52, display:"flex",
    alignItems:"center", justifyContent:"space-between",
    position:"sticky", top:0, zIndex:50,
  }}>
    {/* left: logo + optional back link */}
    <div style={{display:"flex", alignItems:"center", gap:12}}>
      <span style={{fontWeight:800, fontSize:17, color:C.crimson,
        letterSpacing:0.5, fontFamily:"Georgia,serif"}}>SHARP</span>
      {back && (
        <>
          <span style={{color:C.borderLight, fontSize:16}}>|</span>
          <button onClick={back.onClick}
            style={{background:"none", border:"none", color:C.muted,
              fontSize:13, cursor:"pointer", padding:0,
              display:"flex", alignItems:"center", gap:4}}>
            ← {back.label}
          </button>
        </>
      )}
    </div>
    {/* right: team chip */}
    {teamName && (
      <div style={{display:"flex", alignItems:"center", gap:8}}>
        <div style={{background:C.crimsonLight, borderRadius:99,
          padding:"5px 12px 5px 8px", display:"flex", alignItems:"center", gap:7}}>
          <div style={{width:24, height:24, borderRadius:"50%",
            background:C.crimson, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff"}}>
            {teamName?.[0]?.toUpperCase()||"T"}
          </div>
          <span style={{fontSize:13, fontWeight:600, color:C.crimson}}>
            {teamName}
          </span>
          {members && members.filter(m=>m.trim()).length > 0 && (
            <span style={{fontSize:11, color:C.muted}}>
              · {members.filter(m=>m.trim()).length} members
            </span>
          )}
        </div>
      </div>
    )}
  </header>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // CHANGE 2: replaced individual login state with team state
  // v3 had: userName, userEmail, nameInput, emailInput, loginError
  // team app has: teamName, members, startError
  const [teamName,    setTeamName]    = useState("");
  const [members,     setMembers]     = useState(["", "", ""]);
  const [startError,  setStartError]  = useState("");

  // All state below is identical to Sharp App v3
  const [screen,      setScreen]      = useState("start"); // starts at "start", not "login"
  const [q,           setQ]           = useState(1);
  const [texts,       setTexts]       = useState({});
  const [fbOpen,      setFbOpen]      = useState(null);
  const [insightOpen, setInsightOpen] = useState(null);
  const [commSc,      setCommSc]      = useState(1);
  const [sortBy,      setSortBy]      = useState("best");

  const total    = SCENARIOS.length;
  const scenario = SCENARIOS[q-1];
  const overall  = (SCENARIOS.reduce((a,s)=>a+s.score,0)/total).toFixed(1);
  const commAnw  = COMMUNITY.filter(a=>a.sid===commSc&&!a.own);
  const myAnw    = own(commSc);
  const commSorted = [...commAnw].sort((a,b)=>
    sortBy==="best" ? b.score-a.score : a.id-b.id
  );
  const commScenario = SCENARIOS.find(s=>s.id===commSc);

  // Build leaderboard including this team
  const myScore = parseFloat(overall);
  const allTeams = [
    ...OTHER_TEAMS,
    { name: teamName||"Your Team",
      members: members.filter(m=>m.trim()),
      avgScore: myScore,
      isYou: true },
  ].sort((a,b) => b.avgScore - a.avgScore);
  const myRank = allTeams.findIndex(t=>t.isYou) + 1;

  const addMember    = () => setMembers(m => [...m, ""]);
  const removeMember = (i) => setMembers(m => m.filter((_,idx) => idx!==i));
  const setMember    = (i,v) => setMembers(m => m.map((x,idx) => idx===i ? v : x));

  const handleStart = () => {
    if (!teamName.trim()) { setStartError("Please enter a team name."); return; }
    setStartError("");
    setScreen("answering");
  };

  // Demo nav
  const SCREENS = ["start","answering","results","leaderboard","community","feedback","insight"];
  const NavBar = () => (
    <div style={{background:"#111", padding:"10px 20px", display:"flex",
      gap:8, justifyContent:"center", flexWrap:"wrap", borderBottom:"1px solid #222"}}>
      {SCREENS.map(s=>(
        <button key={s} onClick={()=>setScreen(s)}
          style={{padding:"5px 14px", borderRadius:20, border:"1.5px solid",
            borderColor:screen===s?"#E8A020":"#444",
            background:screen===s?"#E8A020":"transparent",
            color:screen===s?"#111":"#aaa",
            fontSize:10, fontWeight:700, cursor:"pointer",
            textTransform:"capitalize"}}>
          {s}
        </button>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 1 — EXERCISE START PAGE
  // CHANGE 2: No login page. Starts here. Added team name + members entry.
  // Everything else on this page is identical to v3's start screen.
  // ═══════════════════════════════════════════════════════════════════════════
  const StartScreen = () => (
    <div style={{minHeight:"100vh", background:C.bg}}>
      <TopNav teamName={teamName||"Your Team"} />

      <div style={{maxWidth:640, margin:"0 auto", padding:"0 20px 48px"}}>
        {/* hero image placeholder */}
        <div style={{width:"100%", height:240, background:"#E8D5D5",
          borderRadius:16, margin:"32px 0 28px", overflow:"hidden",
          position:"relative", display:"flex", alignItems:"center",
          justifyContent:"center"}}>
          <div style={{fontSize:64, opacity:0.4}}>🎯</div>
          <div style={{position:"absolute", inset:0,
            background:"linear-gradient(to bottom, transparent 50%, rgba(250,250,248,0.6))"}} />
        </div>

        <div style={{marginBottom:10}}>
          <Tag label="TEAM COMPETITION" />
        </div>

        <h1 style={{fontSize:34, fontWeight:800, color:C.crimson,
          fontFamily:"Georgia,serif", margin:"0 0 10px", lineHeight:1.2}}>
          Articulation-01
        </h1>
        <p style={{fontSize:15, color:C.muted, margin:"0 0 20px", lineHeight:1.6}}>
          Practice structuring your responses clearly — lead with the point,
          support it specifically, and close confidently. Best team wins.
        </p>

        <div style={{display:"flex", flexWrap:"wrap", gap:8, marginBottom:28}}>
          <Tag icon="👥" label="Team Activity" />
          <Tag icon="🎙" label="Articulation" />
          <Tag icon="📋" label={`${total} Scenarios`} />
          <Tag icon="⏱" label="8 Minute Timer" highlight />
        </div>

        <hr style={{border:"none", borderTop:"1px solid "+C.border, margin:"0 0 28px"}} />

        {/* Guidelines — identical to v3 */}
        <h2 style={{fontSize:22, fontWeight:700, color:C.text,
          fontFamily:"Georgia,serif", margin:"0 0 20px"}}>
          Guidelines
        </h2>
        {[
          "Read each scenario carefully — all context you need is provided.",
          "Discuss as a team, then the captain writes the final answer.",
          "Don't add information that isn't in the scenario.",
          "Scores and community responses unlock after submitting all scenarios.",
        ].map((g, i) => (
          <div key={i} style={{display:"flex", gap:14, marginBottom:16,
            alignItems:"flex-start"}}>
            <div style={{width:26, height:26, borderRadius:"50%", flexShrink:0,
              background:C.crimsonLight, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:11, fontWeight:700,
              color:C.crimson, marginTop:1}}>
              {i+1}
            </div>
            <span style={{fontSize:15, color:C.text, lineHeight:1.6}}>{g}</span>
          </div>
        ))}

        <hr style={{border:"none", borderTop:"1px solid "+C.border, margin:"28px 0"}} />

        {/* ── Team entry (new for team app) ── */}
        <h2 style={{fontSize:22, fontWeight:700, color:C.text,
          fontFamily:"Georgia,serif", margin:"0 0 20px"}}>
          Your Team
        </h2>

        {/* Team name */}
        <label style={{display:"block", marginBottom:20}}>
          <div style={{fontSize:11, fontWeight:700, color:C.muted,
            textTransform:"uppercase", letterSpacing:1, marginBottom:7}}>
            Team Name
          </div>
          <input type="text" value={teamName}
            onChange={e=>{ setTeamName(e.target.value); setStartError(""); }}
            onKeyDown={e=>e.key==="Enter"&&handleStart()}
            placeholder="e.g. Team Clarity"
            style={{width:"100%", padding:"11px 14px",
              border:"1.5px solid "+C.border, borderRadius:8,
              fontSize:14, color:C.text, background:C.card,
              outline:"none", boxSizing:"border-box", fontFamily:"inherit"}} />
        </label>

        {/* Team members */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11, fontWeight:700, color:C.muted,
            textTransform:"uppercase", letterSpacing:1, marginBottom:10}}>
            Team Members
          </div>
          {members.map((m, i) => (
            <div key={i} style={{display:"flex", gap:8, marginBottom:8}}>
              <input type="text" value={m}
                onChange={e=>setMember(i, e.target.value)}
                placeholder={`Member ${i+1} name`}
                style={{flex:1, padding:"10px 13px",
                  border:"1.5px solid "+C.border, borderRadius:8,
                  fontSize:14, color:C.text, background:C.card,
                  outline:"none", fontFamily:"inherit"}} />
              {members.length > 1 && (
                <button onClick={()=>removeMember(i)}
                  style={{width:38, height:38, borderRadius:8,
                    border:"1px solid "+C.border, background:C.card,
                    color:C.muted, fontSize:20, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    lineHeight:1}}>
                  ×
                </button>
              )}
            </div>
          ))}
          {members.length < 5 && (
            <button onClick={addMember}
              style={{background:"none", border:"1.5px dashed "+C.border,
                color:C.muted, fontSize:13, fontWeight:600,
                padding:"9px 16px", borderRadius:8, cursor:"pointer",
                width:"100%", marginTop:2, fontFamily:"inherit"}}>
              + Add member
            </button>
          )}
        </div>

        {startError && (
          <div style={{background:C.crimsonPale, border:"1px solid #FECACA",
            borderRadius:8, padding:"9px 13px", marginBottom:20,
            fontSize:13, color:C.crimson}}>{startError}</div>
        )}

        <div style={{textAlign:"center"}}>
          <button onClick={handleStart}
            style={{background:C.crimson, color:"#fff", border:"none",
              borderRadius:10, padding:"14px 40px", fontSize:15, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit", letterSpacing:0.3}}>
            Start Exercise →
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 2 — ANSWERING (identical to Sharp App v3, teamName replaces userName)
  // ═══════════════════════════════════════════════════════════════════════════
  const AnsweringScreen = () => (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex",
      flexDirection:"column"}}>
      <TopNav teamName={teamName} members={members} />

      {/* progress bar — identical to v3 */}
      <div style={{background:C.card, borderBottom:"1px solid "+C.border,
        padding:"10px 24px"}}>
        <div style={{maxWidth:640, margin:"0 auto"}}>
          <div style={{display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:8}}>
            <span style={{fontSize:12, color:C.muted}}>Scenario {q} of {total}</span>
            <span style={{fontSize:12, color:C.muted}}>Clear Articulation</span>
          </div>
          <div style={{display:"flex", gap:5}}>
            {Array.from({length:total}, (_,i) => (
              <div key={i} style={{flex:1, height:4, borderRadius:2,
                background: i<q ? C.crimson : C.borderLight}} />
            ))}
          </div>
        </div>
      </div>

      {/* content — identical to v3 */}
      <div style={{flex:1, padding:"28px 20px 100px",
        maxWidth:640, margin:"0 auto", width:"100%", boxSizing:"border-box"}}>

        <div style={{background:C.card, borderRadius:12, border:"1px solid "+C.border,
          marginBottom:20, overflow:"hidden"}}>
          <div style={{padding:"16px 20px", borderBottom:"1px solid "+C.borderLight}}>
            <div style={{fontSize:10, fontWeight:700, color:C.muted,
              letterSpacing:1.5, textTransform:"uppercase", marginBottom:8}}>
              Scenario {q}
            </div>
            <p style={{fontSize:15, color:C.text, lineHeight:1.7,
              margin:0, fontStyle:"italic", fontWeight:500}}>
              "{scenario.text}"
            </p>
          </div>
          <div style={{padding:"14px 20px", background:"#FDFCFB"}}>
            <div style={{fontSize:10, fontWeight:700, color:C.muted,
              letterSpacing:1.5, textTransform:"uppercase", marginBottom:10}}>
              What You Know
            </div>
            {scenario.ctx.map((c,i) => (
              <div key={i} style={{display:"flex", gap:10, marginBottom:7,
                alignItems:"flex-start"}}>
                <span style={{color:C.crimson, fontWeight:700, fontSize:13,
                  flexShrink:0, marginTop:2}}>→</span>
                <span style={{fontSize:13, color:C.text, lineHeight:1.55}}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <div style={{fontSize:13, fontWeight:600, color:C.text, marginBottom:8}}>
            Your Team's Response
          </div>
          <textarea
            value={texts[q]||""}
            onChange={e=>setTexts(t=>({...t,[q]:e.target.value}))}
            placeholder="Write your team's response here..."
            style={{width:"100%", minHeight:140,
              border:"1.5px solid "+C.border, borderRadius:10,
              padding:"14px 16px", fontSize:14, color:C.text,
              fontFamily:"inherit", lineHeight:1.7, resize:"vertical",
              outline:"none", background:C.card, boxSizing:"border-box"}} />
          <div style={{textAlign:"right", fontSize:11, color:C.muted, marginTop:4}}>
            {(texts[q]||"").length} characters
          </div>
        </div>

        <div style={{display:"flex", alignItems:"center", gap:8,
          background:C.tag, borderRadius:8, padding:"10px 14px",
          border:"1px solid "+C.borderLight}}>
          <span>🔒</span>
          <span style={{fontSize:12, color:C.muted}}>
            Scores & community responses unlock after submitting all scenarios
          </span>
        </div>
      </div>

      {/* sticky footer — identical to v3 */}
      <div style={{position:"fixed", bottom:0, left:0, right:0,
        background:C.card, borderTop:"1px solid "+C.border,
        padding:"12px 20px", zIndex:40}}>
        <div style={{maxWidth:640, margin:"0 auto",
          display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <button
            onClick={()=>q>1?setQ(q-1):setScreen("start")}
            style={{padding:"10px 22px", borderRadius:8,
              border:"1.5px solid "+C.border, background:C.card,
              color:C.text, fontSize:13, fontWeight:600, cursor:"pointer"}}>
            ← {q>1?"Previous":"Back"}
          </button>
          <div style={{display:"flex", gap:6}}>
            {Array.from({length:total},(_,i)=>(
              <div key={i} style={{width:8, height:8, borderRadius:"50%",
                background: i===q-1?C.crimson:i<q-1?C.crimsonLight:C.borderLight}} />
            ))}
          </div>
          <button
            onClick={()=>q<total?setQ(q+1):setScreen("results")}
            style={{padding:"10px 22px", borderRadius:8, border:"none",
              background:C.crimson, color:"#fff", fontSize:13,
              fontWeight:700, cursor:"pointer"}}>
            {q<total?"Next →":"Submit All →"}
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 3 — RESULTS
  // CHANGE 3 & 4: Score card now shows team score + rank side by side.
  // Leaderboard access section added below score card.
  // Scenario breakdown and community CTA are identical to v3.
  // ═══════════════════════════════════════════════════════════════════════════
  const ResultsScreen = () => (
    <div style={{minHeight:"100vh", background:C.bg}}>
      <TopNav teamName={teamName} members={members} />

      <div style={{maxWidth:640, margin:"0 auto", padding:"32px 20px 48px"}}>

        {/* completion header — identical to v3 */}
        <div style={{textAlign:"center", marginBottom:28}}>
          <div style={{width:64, height:64, borderRadius:"50%",
            background:C.greenPale, border:"2px solid "+C.green,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, margin:"0 auto 14px"}}>✓</div>
          <h1 style={{fontSize:26, fontWeight:700, color:C.text,
            fontFamily:"Georgia,serif", margin:"0 0 6px"}}>
            Exercise Complete
          </h1>
          <p style={{fontSize:14, color:C.muted, margin:0}}>
            {teamName||"Your Team"} · Clear Articulation · {total} Scenarios
          </p>
        </div>

        {/* ── CHANGE 3 & 4: Score card now split — score left, rank right ── */}
        <div style={{background:C.crimson, borderRadius:14,
          padding:"22px 28px", marginBottom:12, color:"#fff",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:16}}>

          {/* left: team score */}
          <div style={{textAlign:"center", flex:1}}>
            <div style={{fontSize:11, letterSpacing:2,
              textTransform:"uppercase", opacity:0.7, marginBottom:4}}>
              Team Score
            </div>
            <div style={{display:"flex", alignItems:"baseline",
              justifyContent:"center", gap:3}}>
              <span style={{fontSize:52, fontWeight:800,
                fontFamily:"Georgia,serif", lineHeight:1}}>{overall}</span>
              <span style={{fontSize:20, opacity:0.7}}>/10</span>
            </div>
          </div>

          {/* divider */}
          <div style={{width:1, height:60,
            background:"rgba(255,255,255,0.25)", flexShrink:0}} />

          {/* right: leaderboard rank */}
          <div style={{textAlign:"center", flex:1}}>
            <div style={{fontSize:11, letterSpacing:2,
              textTransform:"uppercase", opacity:0.7, marginBottom:4}}>
              Your Rank
            </div>
            <div style={{display:"flex", alignItems:"baseline",
              justifyContent:"center", gap:2}}>
              <span style={{fontSize:52, fontWeight:800,
                fontFamily:"Georgia,serif", lineHeight:1, color:C.gold}}>
                #{myRank}
              </span>
              <span style={{fontSize:20, opacity:0.5}}>
                /{allTeams.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── CHANGE 3: Leaderboard access — sits just below score card ── */}
        <div style={{background:C.card, border:"1px solid "+C.border,
          borderRadius:10, padding:"14px 18px", marginBottom:24,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:12}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <span style={{fontSize:20}}>🏆</span>
            <div>
              <div style={{fontSize:13, fontWeight:700, color:C.text}}>
                Team Leaderboard
              </div>
              <div style={{fontSize:12, color:C.muted}}>
                See all teams, scores, and answers
              </div>
            </div>
          </div>
          <button onClick={()=>setScreen("leaderboard")}
            style={{background:C.crimson, color:"#fff", border:"none",
              borderRadius:8, padding:"9px 18px", fontSize:13,
              fontWeight:700, cursor:"pointer", whiteSpace:"nowrap"}}>
            View →
          </button>
        </div>

        {/* Scenario breakdown — identical to v3 */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11, fontWeight:700, color:C.muted,
            letterSpacing:1.5, textTransform:"uppercase", marginBottom:12}}>
            Scenario Breakdown
          </div>
          {SCENARIOS.map((s,i) => (
            <div key={s.id} style={{background:C.card,
              border:"1px solid "+C.border, borderRadius:10,
              padding:"13px 16px", marginBottom:8,
              display:"flex", alignItems:"center", gap:12}}>
              <div style={{width:24, height:24, borderRadius:"50%",
                background:C.crimsonLight, display:"flex",
                alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, color:C.crimson,
                flexShrink:0}}>
                {i+1}
              </div>
              <span style={{flex:1, fontSize:14, fontWeight:500, color:C.text}}>
                {s.short}
              </span>
              <span style={{background:scoreBg(s.score), color:scoreClr(s.score),
                fontWeight:700, fontSize:12, padding:"3px 10px",
                borderRadius:20, marginRight:6}}>
                {s.score}/10
              </span>
              <button
                onClick={()=>{ setFbOpen(s.id); setScreen("feedback"); }}
                style={{background:"none", border:"none",
                  color:C.crimson, fontSize:12, fontWeight:600,
                  cursor:"pointer", textDecoration:"underline",
                  padding:0, fontFamily:"inherit"}}>
                Feedback
              </button>
            </div>
          ))}
        </div>

        {/* Community CTA — identical to v3 */}
        <div style={{background:C.card, border:"1px solid "+C.border,
          borderRadius:14, padding:"22px 22px", textAlign:"center"}}>
          <div style={{fontSize:20, marginBottom:8}}>🎉</div>
          <div style={{fontSize:16, fontWeight:700, color:C.text,
            marginBottom:6}}>Community Responses Unlocked</div>
          <p style={{fontSize:13, color:C.muted, margin:"0 0 18px",
            lineHeight:1.6}}>
            See how other teams answered each scenario.
            Browse answers, compare approaches, view AI insight on any response.
          </p>
          <button onClick={()=>setScreen("community")}
            style={{background:C.crimson, color:"#fff", border:"none",
              borderRadius:8, padding:"12px 28px", fontSize:14,
              fontWeight:700, cursor:"pointer", width:"100%"}}>
            Explore Community Responses →
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 4 — LEADERBOARD (new screen, added for team competition)
  // ═══════════════════════════════════════════════════════════════════════════
  const LeaderboardScreen = () => {
    const [expandedIdx, setExpandedIdx] = useState(null);

    const medalBorderLeft = (i) =>
      i===0 ? "4px solid "+C.gold
      : i===1 ? "4px solid #A8B2BE"
      : i===2 ? "4px solid #C49A72"
      : "1px solid "+C.border;

    const medalIcon = (i) => i===0?"🥇": i===1?"🥈": i===2?"🥉":"";

    return (
      <div style={{minHeight:"100vh", background:C.bg}}>
        <TopNav teamName={teamName} members={members}
          back={{label:"Results", onClick:()=>setScreen("results")}} />

        <div style={{maxWidth:640, margin:"0 auto", padding:"28px 20px 48px"}}>
          <div style={{marginBottom:24}}>
            <h1 style={{fontSize:26, fontWeight:700, color:C.text,
              fontFamily:"Georgia,serif", margin:"0 0 4px"}}>
              Team Leaderboard
            </h1>
            <p style={{fontSize:13, color:C.muted, margin:0}}>
              {allTeams.length} teams · Ranked by average score
            </p>
          </div>

          {/* Ranked list */}
          {allTeams.map((team, i) => (
            <div key={team.name+i} style={{background:C.card,
              borderRadius:12, marginBottom:10, overflow:"hidden",
              borderLeft: team.isYou ? "4px solid "+C.crimson : medalBorderLeft(i),
              border: team.isYou ? "2px solid "+C.crimson : "1px solid "+C.border,
              boxShadow: i===0 ? "0 2px 12px rgba(107,26,26,0.10)" : "0 1px 4px rgba(0,0,0,0.04)"}}>

              {/* row */}
              <div style={{padding:"14px 16px", display:"flex",
                alignItems:"center", gap:12, cursor:"pointer"}}
                onClick={()=>setExpandedIdx(expandedIdx===i ? null : i)}>

                {/* rank indicator */}
                <div style={{width:32, height:32, borderRadius:"50%", flexShrink:0,
                  background: i===0?C.gold : i===1?"#DDE1E7" : i===2?"#EAD9C8" : C.borderLight,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize: i<3?18:12, fontWeight:700,
                  color: i===0?C.navy : i===1?"#6B7280" : i===2?"#8B6F5E" : C.muted}}>
                  {i<3 ? medalIcon(i) : i+1}
                </div>

                {/* name + members */}
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:"flex", alignItems:"center", gap:6}}>
                    <span style={{fontSize:14, fontWeight:700, color:C.text}}>
                      {team.name}
                    </span>
                    {team.isYou && (
                      <span style={{fontSize:9, fontWeight:700,
                        background:C.crimsonLight, color:C.crimson,
                        padding:"2px 7px", borderRadius:99}}>YOU</span>
                    )}
                  </div>
                  <div style={{fontSize:11, color:C.muted, marginTop:2,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                    {team.members.filter(m=>m).join(" · ")}
                  </div>
                </div>

                {/* score */}
                <div style={{textAlign:"right", flexShrink:0}}>
                  <div style={{fontSize:22, fontWeight:800,
                    fontFamily:"Georgia,serif", lineHeight:1,
                    color: i===0 ? C.crimson : C.text}}>
                    {team.avgScore.toFixed(1)}
                  </div>
                  <div style={{fontSize:10, color:C.muted}}>/10</div>
                </div>

                {/* expand toggle */}
                <span style={{color:C.muted, fontSize:11, flexShrink:0}}>
                  {expandedIdx===i ? "▲" : "▼"}
                </span>
              </div>

              {/* expanded: scenario scores */}
              {expandedIdx===i && (
                <div style={{borderTop:"1px solid "+C.borderLight,
                  background:"#FDFCFB", padding:"14px 16px"}}>
                  <div style={{fontSize:10, fontWeight:700, color:C.muted,
                    letterSpacing:1.2, textTransform:"uppercase", marginBottom:10}}>
                    Score per Scenario
                  </div>
                  {SCENARIOS.map((sc,si) => (
                    <div key={sc.id} style={{display:"flex", alignItems:"center",
                      gap:12, marginBottom:8}}>
                      <span style={{fontSize:12, color:C.muted, width:14,
                        flexShrink:0, textAlign:"center"}}>{si+1}</span>
                      <span style={{flex:1, fontSize:13, color:C.text}}>
                        {sc.short}
                      </span>
                      <span style={{background:scoreBg(sc.score),
                        color:scoreClr(sc.score), fontWeight:700,
                        fontSize:12, padding:"2px 9px", borderRadius:99}}>
                        {sc.score}/10
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 5 — FEEDBACK MODAL (identical to Sharp App v3)
  // ═══════════════════════════════════════════════════════════════════════════
  const FeedbackModal = () => {
    const s = SCENARIOS.find(s=>s.id===fbOpen)||SCENARIOS[0];
    return (
      <div onClick={()=>setScreen("results")}
        style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:200, padding:"20px"}}>
        <div onClick={e=>e.stopPropagation()}
          style={{background:C.card, borderRadius:16, width:"100%", maxWidth:480,
            maxHeight:"85vh", overflowY:"auto",
            boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>

          <div style={{padding:"18px 22px", borderBottom:"1px solid "+C.border,
            display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:11, color:C.muted, letterSpacing:1.2,
                textTransform:"uppercase", marginBottom:3}}>
                Scenario {s.id} · Feedback
              </div>
              <div style={{fontSize:16, fontWeight:700, color:C.text}}>
                {s.full}
              </div>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <span style={{background:scoreBg(s.score), color:scoreClr(s.score),
                fontWeight:700, fontSize:15, padding:"5px 12px", borderRadius:20}}>
                {s.score}/10
              </span>
              <button onClick={()=>setScreen("results")}
                style={{background:C.borderLight, border:"none",
                  color:C.muted, width:28, height:28, borderRadius:"50%",
                  cursor:"pointer", fontSize:16,
                  display:"flex", alignItems:"center", justifyContent:"center"}}>
                ✕
              </button>
            </div>
          </div>

          <div style={{padding:"20px 22px 24px"}}>
            <div style={{marginBottom:16}}>
              <span style={{display:"inline-flex", alignItems:"center", gap:5,
                background: s.pf?C.greenPale:C.crimsonPale,
                padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:600,
                color: s.pf?C.green:C.crimson}}>
                {s.pf?"✅":"❌"} Point First: {s.pf?"Yes":"No"}
              </span>
            </div>

            {[
              {label:"Summary",    text:s.headline, bg:"#1C1C1C", textColor:"#fff"},
              {label:"What Worked",text:s.worked,   bg:C.greenPale, textColor:C.greenDark},
              {label:"To Improve", text:s.improve,  bg:C.amberPale, textColor:C.amberDark},
            ].map(b=>(
              <div key={b.label} style={{background:b.bg, borderRadius:10,
                padding:"13px 16px", marginBottom:10}}>
                <div style={{fontSize:9, fontWeight:700,
                  color: b.bg==="#1C1C1C"?"#888":b.textColor,
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:5}}>
                  {b.label}
                </div>
                <div style={{fontSize:13, color:b.textColor, lineHeight:1.6,
                  fontWeight: b.bg==="#1C1C1C"?600:400}}>
                  {b.text}
                </div>
              </div>
            ))}

            <button onClick={()=>setScreen("results")}
              style={{width:"100%", padding:"12px", background:C.crimson,
                color:"#fff", border:"none", borderRadius:10,
                fontSize:13, fontWeight:700, cursor:"pointer", marginTop:6}}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 6 — COMMUNITY (identical to Sharp App v3, teamName replaces userName)
  // ═══════════════════════════════════════════════════════════════════════════
  const CommunityScreen = () => (
    <div style={{minHeight:"100vh", background:C.bg}}>
      <TopNav teamName={teamName} members={members}
        back={{label:"Results", onClick:()=>setScreen("results")}} />

      <div style={{maxWidth:680, margin:"0 auto", padding:"24px 20px 48px"}}>
        <h2 style={{fontSize:22, fontWeight:700, color:C.text,
          fontFamily:"Georgia,serif", margin:"0 0 16px"}}>
          Community Responses
        </h2>

        {/* scenario tabs */}
        <div style={{display:"flex", gap:7, overflowX:"auto",
          marginBottom:24, paddingBottom:4}}>
          {SCENARIOS.map(s=>(
            <button key={s.id} onClick={()=>setCommSc(s.id)}
              style={{padding:"6px 16px", borderRadius:99,
                border:"1.5px solid",
                borderColor: commSc===s.id?C.crimson:C.border,
                background: commSc===s.id?C.crimsonPale:C.card,
                color: commSc===s.id?C.crimson:C.muted,
                fontSize:12, fontWeight:600, cursor:"pointer",
                whiteSpace:"nowrap", flexShrink:0}}>
              {s.id}. {s.short}
            </button>
          ))}
        </div>

        {/* scenario card */}
        {commScenario && (
          <div style={{background:C.card, borderRadius:12,
            border:"1px solid "+C.border, overflow:"hidden", marginBottom:16}}>
            <div style={{padding:"14px 18px", borderBottom:"1px solid "+C.borderLight}}>
              <div style={{fontSize:10, fontWeight:700, color:C.muted,
                letterSpacing:1.5, textTransform:"uppercase", marginBottom:7}}>
                Scenario {commScenario.id}
              </div>
              <p style={{fontSize:14, color:C.text, lineHeight:1.7,
                margin:0, fontStyle:"italic", fontWeight:500}}>
                "{commScenario.text}"
              </p>
            </div>
            <div style={{padding:"13px 18px", background:"#FDFCFB"}}>
              <div style={{fontSize:10, fontWeight:700, color:C.muted,
                letterSpacing:1.5, textTransform:"uppercase", marginBottom:8}}>
                Context
              </div>
              {commScenario.ctx.map((c,i)=>(
                <div key={i} style={{display:"flex", gap:9, marginBottom:5}}>
                  <span style={{color:C.crimson, fontWeight:700,
                    fontSize:12, flexShrink:0, marginTop:2}}>→</span>
                  <span style={{fontSize:12, color:C.text, lineHeight:1.5}}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your team's answer */}
        {myAnw && (
          <div style={{background:C.card, borderRadius:12,
            border:"2px solid "+C.crimson,
            padding:"15px 18px", marginBottom:20}}>
            <div style={{display:"flex", alignItems:"center",
              justifyContent:"space-between", marginBottom:10}}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <div style={{width:32, height:32, borderRadius:"50%",
                  background:C.crimsonLight, display:"flex",
                  alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:700, color:C.crimson}}>
                  {teamName?.[0]?.toUpperCase()||"T"}
                </div>
                <div>
                  <span style={{fontSize:13, fontWeight:700, color:C.text}}>
                    Your Team's Answer
                  </span>
                  <span style={{fontSize:10, fontWeight:700,
                    background:C.crimsonLight, color:C.crimson,
                    padding:"2px 7px", borderRadius:8, marginLeft:7}}>
                    YOU
                  </span>
                </div>
              </div>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <span style={{background:scoreBg(myAnw.score),
                  color:scoreClr(myAnw.score), fontWeight:700,
                  fontSize:12, padding:"3px 10px", borderRadius:20}}>
                  {myAnw.score}/10
                </span>
                <button onClick={()=>{ setInsightOpen(myAnw.id); setScreen("insight"); }}
                  style={{background:C.crimson, border:"none",
                    color:"#fff", fontSize:11, fontWeight:600,
                    padding:"6px 12px", borderRadius:7, cursor:"pointer"}}>
                  My Feedback →
                </button>
              </div>
            </div>
            <p style={{fontSize:13, color:C.text, lineHeight:1.65, margin:0}}>
              {myAnw.answer}
            </p>
          </div>
        )}

        {/* Sort bar */}
        <div style={{display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:14}}>
          <span style={{fontSize:12, color:C.muted}}>
            {commAnw.length} other responses
          </span>
          <div style={{display:"flex", gap:6}}>
            {["best","latest"].map(opt=>(
              <button key={opt} onClick={()=>setSortBy(opt)}
                style={{padding:"5px 12px", borderRadius:20,
                  border:"1px solid "+C.border,
                  background: sortBy===opt?C.crimson:C.card,
                  color: sortBy===opt?"#fff":C.muted,
                  fontSize:11, fontWeight:600, cursor:"pointer"}}>
                {opt==="best"?"Best Rated":"Latest"}
              </button>
            ))}
          </div>
        </div>

        {/* Other answers */}
        {commSorted.map(ans=>(
          <div key={ans.id} style={{background:C.card, borderRadius:12,
            padding:"15px 18px", marginBottom:10,
            border:"1px solid "+C.border}}>
            <div style={{display:"flex", alignItems:"flex-start",
              gap:10, marginBottom:10}}>
              <div style={{width:32, height:32, borderRadius:"50%",
                background:"#EDE8E3", display:"flex",
                alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:700, color:C.muted, flexShrink:0}}>
                {ans.init}
              </div>
              <div style={{flex:1}}>
                <span style={{fontSize:13, fontWeight:600, color:C.text}}>
                  {ans.name}
                </span>
              </div>
              <span style={{background:scoreBg(ans.score),
                color:scoreClr(ans.score), fontWeight:700,
                fontSize:12, padding:"3px 10px", borderRadius:20,
                flexShrink:0}}>
                {ans.score}/10
              </span>
            </div>
            <p style={{fontSize:13, color:C.text, lineHeight:1.65,
              margin:"0 0 12px 42px"}}>
              {ans.answer}
            </p>
            <div style={{display:"flex", justifyContent:"flex-end"}}>
              <button onClick={()=>{ setInsightOpen(ans.id); setScreen("insight"); }}
                style={{background:"none", border:"1px solid "+C.border,
                  color:C.text, fontSize:12, fontWeight:500,
                  padding:"6px 14px", borderRadius:8, cursor:"pointer"}}>
                View Insight →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN 7 — INSIGHT MODAL (identical to Sharp App v3)
  // ═══════════════════════════════════════════════════════════════════════════
  const InsightModal = () => {
    const ans = COMMUNITY.find(a=>a.id===insightOpen)||COMMUNITY[0];
    return (
      <div onClick={()=>setScreen("community")}
        style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:200, padding:"20px"}}>
        <div onClick={e=>e.stopPropagation()}
          style={{background:C.card, borderRadius:16, width:"100%", maxWidth:460,
            maxHeight:"82vh", overflowY:"auto",
            boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>

          <div style={{padding:"16px 20px", borderBottom:"1px solid "+C.border,
            display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div style={{display:"flex", alignItems:"center", gap:9}}>
              <div style={{width:32, height:32, borderRadius:"50%",
                background: ans.own?C.crimsonLight:"#EDE8E3",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:700,
                color: ans.own?C.crimson:C.muted, flexShrink:0}}>
                {ans.own ? (teamName?.[0]?.toUpperCase()||"T") : ans.init}
              </div>
              <div>
                <div style={{fontSize:13, fontWeight:700, color:C.text}}>
                  {ans.own?"Your Team's Answer":ans.name}
                </div>
                <div style={{fontSize:10, color:C.muted}}>AI Insight</div>
              </div>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              <span style={{background:scoreBg(ans.score),
                color:scoreClr(ans.score), fontWeight:700,
                fontSize:13, padding:"4px 11px", borderRadius:20}}>
                {ans.score}/10
              </span>
              <button onClick={()=>setScreen("community")}
                style={{background:C.borderLight, border:"none",
                  color:C.muted, width:28, height:28, borderRadius:"50%",
                  cursor:"pointer", fontSize:15,
                  display:"flex", alignItems:"center", justifyContent:"center"}}>
                ✕
              </button>
            </div>
          </div>

          <div style={{padding:"18px 20px 22px"}}>
            <div style={{background:"#FDFCFB", borderLeft:"3px solid "+C.crimson,
              padding:"10px 14px", borderRadius:"0 8px 8px 0",
              marginBottom:14, fontSize:13, color:C.text,
              lineHeight:1.65, fontStyle:"italic"}}>
              "{ans.answer}"
            </div>

            {[
              {label:"AI Assessment", text:ans.ih, bg:"#1C1C1C", tc:"#fff", lc:"#888"},
              {label:"What Works",    text:ans.iw, bg:C.greenPale,  tc:C.greenDark, lc:C.greenDark},
              ...( ans.ii!=="Nothing."&&ans.ii!=="Nothing — this is the target."
                ? [{label:"Could Be Better", text:ans.ii, bg:C.amberPale, tc:C.amberDark, lc:C.amberDark}]
                : [] ),
            ].map(b=>(
              <div key={b.label} style={{background:b.bg, borderRadius:10,
                padding:"12px 15px", marginBottom:10}}>
                <div style={{fontSize:9, fontWeight:700, color:b.lc,
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:4}}>
                  {b.label}
                </div>
                <div style={{fontSize:13, color:b.tc, lineHeight:1.6,
                  fontWeight: b.bg==="#1C1C1C"?600:400}}>{b.text}</div>
              </div>
            ))}

            <button onClick={()=>setScreen("community")}
              style={{width:"100%", padding:"11px", background:C.crimson,
                color:"#fff", border:"none", borderRadius:10,
                fontSize:13, fontWeight:700, cursor:"pointer", marginTop:4}}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <NavBar />
      {screen==="start"       && <StartScreen />}
      {screen==="answering"   && <AnsweringScreen />}
      {screen==="results"     && <ResultsScreen />}
      {screen==="leaderboard" && <LeaderboardScreen />}
      {screen==="feedback"    && <><ResultsScreen /><FeedbackModal /></>}
      {screen==="community"   && <CommunityScreen />}
      {screen==="insight"     && <><CommunityScreen /><InsightModal /></>}
    </div>
  );
}
