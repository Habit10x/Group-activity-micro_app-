"use client";

import { useState, useEffect } from "react";
import { getExerciseData } from "@/lib/exerciseData";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  crimson:     "#6B1A1A",
  crimsonHover:"#581515",
  crimsonPale: "#FEF2F2",
  crimsonLight:"#F5E8E8",
  bg:          "#FAFAF8",
  card:        "#FFFFFF",
  border:      "#E8E2DA",
  borderLight: "#F0EBE3",
  text:        "#1C1C1C",
  muted:       "#6B6672",
  tag:         "#F0EBE3",
  tagText:     "#4A3F38",
  green:       "#059669",
  greenPale:   "#ECFDF5",
  greenDark:   "#065F46",
  amber:       "#D97706",
  amberPale:   "#FFFBEB",
  amberDark:   "#92400E",
  red:         "#DC2626",
  gold:        "#E8A020",
};


// ─── Helpers ──────────────────────────────────────────────────────────────────
const scoreBg  = s => s>=8 ? C.greenPale  : s>=6 ? C.amberPale  : C.crimsonPale;
const scoreClr = s => s>=8 ? C.green      : s>=6 ? C.amber      : C.red;

// ─── Tag ──────────────────────────────────────────────────────────────────────
const Tag = ({ icon, label, highlight }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"5px 12px", borderRadius:99, fontSize:12, fontWeight:500,
    border:"1px solid", borderColor: highlight ? "#FECACA" : C.border,
    background: highlight ? C.crimsonPale : C.tag,
    color: highlight ? C.crimson : C.tagText,
  }}>
    {icon && <span>{icon}</span>} {label}
  </span>
);

// ─── TopNav ───────────────────────────────────────────────────────────────────
const TopNav = ({ teamName, members, back, onLogout }) => (
  <header style={{
    background:C.card, borderBottom:"1px solid "+C.border,
    padding:"0 24px", height:52, display:"flex",
    alignItems:"center", justifyContent:"space-between",
    position:"sticky", top:0, zIndex:50,
  }}>
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
    <div style={{display:"flex", alignItems:"center", gap:10}}>
      {teamName && (
        <div style={{background:C.crimsonLight, borderRadius:99,
          padding:"5px 12px 5px 8px", display:"flex", alignItems:"center", gap:7}}>
          <div style={{width:24, height:24, borderRadius:"50%",
            background:C.crimson, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff"}}>
            {teamName?.[0]?.toUpperCase() || "T"}
          </div>
          <span style={{fontSize:13, fontWeight:600, color:C.crimson}}>
            {teamName}
          </span>
          {members && members.filter(m => m.trim()).length > 0 && (
            <span style={{fontSize:11, color:C.muted}}>
              · {members.filter(m => m.trim()).length} members
            </span>
          )}
        </div>
      )}
      {onLogout && (
        <button onClick={onLogout}
          style={{background:"none", border:"1px solid "+C.border,
            color:C.muted, fontSize:12, fontWeight:600,
            padding:"6px 14px", borderRadius:8, cursor:"pointer",
            fontFamily:"inherit"}}>
          Log out
        </button>
      )}
    </div>
  </header>
);

// ─── StartScreen ──────────────────────────────────────────────────────────────
const StartScreen = ({ exercise, teamName, setTeamName, members, addMember, removeMember, setMember, startError, setStartError, handleStart, startChecking, onViewResults, loginEnabled = true, total, onLogout }) => {
  const [vrOpen,    setVrOpen]    = useState(false);
  const [vrName,    setVrName]    = useState("");
  const [vrError,   setVrError]   = useState("");
  const [vrLoading, setVrLoading] = useState(false);

  const handleVR = async () => {
    if (!vrName.trim()) { setVrError("Please enter your team name."); return; }
    setVrLoading(true);
    setVrError("");
    const result = await onViewResults(vrName.trim());
    setVrLoading(false);
    if (result && result.error) setVrError(result.error);
    if (result && !result.found && !result.error) setVrError("No results found for this team name.");
  };

  return (
  <div style={{minHeight:"100vh", background:C.bg}}>
    <TopNav teamName={teamName || "Your Team"} onLogout={onLogout} />

    <div style={{maxWidth:640, margin:"0 auto", padding:"0 20px 48px"}}>
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
        {exercise?.title || "Loading..."}
      </h1>
      <p style={{fontSize:15, color:C.muted, margin:"0 0 20px", lineHeight:1.6}}>
        {exercise?.description}
      </p>

      <div style={{display:"flex", flexWrap:"wrap", gap:8, marginBottom:28}}>
        {(exercise?.tags || []).map(t => (
          <Tag key={t.label} icon={t.icon} label={t.label} highlight={t.highlight} />
        ))}
      </div>

      {loginEnabled && (
        <>
          <hr style={{border:"none", borderTop:"1px solid "+C.border, margin:"0 0 28px"}} />

          <h2 style={{fontSize:22, fontWeight:700, color:C.text,
            fontFamily:"Georgia,serif", margin:"0 0 20px"}}>
            Guidelines
          </h2>
          {(exercise?.guidelines || []).map((g, i) => (
            <div key={i} style={{display:"flex", gap:14, marginBottom:16, alignItems:"flex-start"}}>
              <div style={{width:26, height:26, borderRadius:"50%", flexShrink:0,
                background:C.crimsonLight, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:11, fontWeight:700,
                color:C.crimson, marginTop:1}}>
                {i+1}
              </div>
              <span style={{fontSize:15, color:C.text, lineHeight:1.6}}>{g}</span>
            </div>
          ))}
        </>
      )}

      {loginEnabled ? (
        <>
          <hr style={{border:"none", borderTop:"1px solid "+C.border, margin:"28px 0"}} />

          <h2 style={{fontSize:22, fontWeight:700, color:C.text,
            fontFamily:"Georgia,serif", margin:"0 0 20px"}}>
            Your Team
          </h2>

          <label style={{display:"block", marginBottom:20}}>
            <div style={{fontSize:11, fontWeight:700, color:C.muted,
              textTransform:"uppercase", letterSpacing:1, marginBottom:7}}>
              Team Name
            </div>
            <input
              type="text"
              value={teamName}
              onChange={e => { setTeamName(e.target.value); setStartError(""); }}
              onKeyDown={e => e.key === "Enter" && handleStart()}
              placeholder="e.g. Team Clarity"
              style={{width:"100%", padding:"11px 14px",
                border:"1.5px solid "+C.border, borderRadius:8,
                fontSize:14, color:C.text, background:C.card,
                outline:"none", boxSizing:"border-box", fontFamily:"inherit"}} />
          </label>

          <div style={{marginBottom:20}}>
            <div style={{fontSize:11, fontWeight:700, color:C.muted,
              textTransform:"uppercase", letterSpacing:1, marginBottom:10}}>
              Team Members
            </div>
            {members.map((m, i) => (
              <div key={i} style={{display:"flex", gap:8, marginBottom:8}}>
                <input
                  type="text"
                  value={m}
                  onChange={e => setMember(i, e.target.value)}
                  placeholder={`Member ${i+1} name`}
                  style={{flex:1, padding:"10px 13px",
                    border:"1.5px solid "+C.border, borderRadius:8,
                    fontSize:14, color:C.text, background:C.card,
                    outline:"none", fontFamily:"inherit"}} />
                {members.length > 1 && (
                  <button onClick={() => removeMember(i)}
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
            <button onClick={handleStart} disabled={startChecking}
              style={{background: startChecking ? C.muted : C.crimson, color:"#fff", border:"none",
                borderRadius:10, padding:"14px 40px", fontSize:15, fontWeight:700,
                cursor: startChecking ? "not-allowed" : "pointer",
                fontFamily:"inherit", letterSpacing:0.3}}>
              {startChecking ? "Checking..." : "Start Exercise →"}
            </button>
          </div>

          <hr style={{border:"none", borderTop:"1px solid "+C.border, margin:"28px 0 20px"}} />

          {!vrOpen ? (
            <div style={{textAlign:"center"}}>
              <button onClick={() => setVrOpen(true)}
                style={{background:"none", border:"none", color:C.muted, fontSize:13,
                  cursor:"pointer", textDecoration:"underline", fontFamily:"inherit", padding:0}}>
                Already attempted the exercise? View your results →
              </button>
            </div>
          ) : (
            <div>
              <div style={{fontSize:13, fontWeight:600, color:C.text, marginBottom:10}}>
                View Your Results
              </div>
              <div style={{display:"flex", gap:8}}>
                <input
                  type="text"
                  value={vrName}
                  onChange={e => { setVrName(e.target.value); setVrError(""); }}
                  onKeyDown={e => e.key === "Enter" && !vrLoading && handleVR()}
                  placeholder="Enter your team name"
                  autoFocus
                  style={{flex:1, padding:"11px 14px",
                    border:"1.5px solid "+(vrError ? "#FECACA" : C.border),
                    borderRadius:8, fontSize:14, color:C.text,
                    background:C.card, outline:"none", fontFamily:"inherit"}} />
                <button onClick={handleVR} disabled={vrLoading}
                  style={{padding:"11px 20px", background: vrLoading ? C.muted : C.crimson,
                    color:"#fff", border:"none", borderRadius:8, fontSize:13,
                    fontWeight:700, cursor: vrLoading ? "not-allowed" : "pointer",
                    fontFamily:"inherit", whiteSpace:"nowrap"}}>
                  {vrLoading ? "..." : "View →"}
                </button>
              </div>
              {vrError && (
                <div style={{background:C.crimsonPale, border:"1px solid #FECACA",
                  borderRadius:8, padding:"9px 13px", marginTop:10,
                  fontSize:13, color:C.crimson}}>{vrError}</div>
              )}
              <button onClick={() => { setVrOpen(false); setVrName(""); setVrError(""); }}
                style={{background:"none", border:"none", color:C.muted, fontSize:12,
                  cursor:"pointer", marginTop:10, padding:0, fontFamily:"inherit"}}>
                ← Cancel
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <hr style={{border:"none", borderTop:"1px solid "+C.border, margin:"28px 0"}} />

          <h2 style={{fontSize:22, fontWeight:700, color:C.text,
            fontFamily:"Georgia,serif", margin:"0 0 8px"}}>
            See Results
          </h2>
          <p style={{fontSize:14, color:C.muted, margin:"0 0 20px", lineHeight:1.6}}>
            The exercise is complete. Enter your team name to view your results.
          </p>

          <div style={{display:"flex", gap:8}}>
            <input
              type="text"
              value={vrName}
              onChange={e => { setVrName(e.target.value); setVrError(""); }}
              onKeyDown={e => e.key === "Enter" && !vrLoading && handleVR()}
              placeholder="Enter your team name"
              autoFocus
              style={{flex:1, padding:"11px 14px",
                border:"1.5px solid "+(vrError ? "#FECACA" : C.border),
                borderRadius:8, fontSize:14, color:C.text,
                background:C.card, outline:"none", fontFamily:"inherit"}} />
            <button onClick={handleVR} disabled={vrLoading}
              style={{padding:"11px 20px", background: vrLoading ? C.muted : C.crimson,
                color:"#fff", border:"none", borderRadius:8, fontSize:13,
                fontWeight:700, cursor: vrLoading ? "not-allowed" : "pointer",
                fontFamily:"inherit", whiteSpace:"nowrap"}}>
              {vrLoading ? "..." : "View Results →"}
            </button>
          </div>
          {vrError && (
            <div style={{background:C.crimsonPale, border:"1px solid #FECACA",
              borderRadius:8, padding:"9px 13px", marginTop:10,
              fontSize:13, color:C.crimson}}>{vrError}</div>
          )}
        </>
      )}
    </div>
  </div>
  );
};

// ─── AnsweringScreen ──────────────────────────────────────────────────────────
const AnsweringScreen = ({ teamName, members, q, setQ, texts, setTexts, total, scenario, setScreen, onSubmitAll, onLogout }) => (
  <div style={{minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column"}}>
    <TopNav teamName={teamName} members={members} onLogout={onLogout} />

    <div style={{background:C.card, borderBottom:"1px solid "+C.border, padding:"10px 24px"}}>
      <div style={{maxWidth:640, margin:"0 auto"}}>
        <div style={{display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:8}}>
          <span style={{fontSize:12, color:C.muted}}>Scenario {q} of {total}</span>
          <span style={{fontSize:12, color:C.muted}}>Clear Articulation</span>
        </div>
        <div style={{display:"flex", gap:5}}>
          {Array.from({length:total}, (_,i) => (
            <div key={i} style={{flex:1, height:4, borderRadius:2,
              background: i < q ? C.crimson : C.borderLight}} />
          ))}
        </div>
      </div>
    </div>

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
          {scenario.ctx.map((c, i) => (
            <div key={i} style={{display:"flex", gap:10, marginBottom:7, alignItems:"flex-start"}}>
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
          value={texts[q] || ""}
          onChange={e => setTexts(t => ({...t, [q]: e.target.value}))}
          placeholder="Write your team's response here..."
          style={{width:"100%", minHeight:140,
            border:"1.5px solid "+C.border, borderRadius:10,
            padding:"14px 16px", fontSize:14, color:C.text,
            fontFamily:"inherit", lineHeight:1.7, resize:"vertical",
            outline:"none", background:C.card, boxSizing:"border-box"}} />
        <div style={{textAlign:"right", fontSize:11, color:C.muted, marginTop:4}}>
          {(texts[q] || "").length} characters
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

    <div style={{position:"fixed", bottom:0, left:0, right:0,
      background:C.card, borderTop:"1px solid "+C.border,
      padding:"12px 20px", zIndex:40}}>
      <div style={{maxWidth:640, margin:"0 auto",
        display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <button
          onClick={() => q > 1 ? setQ(q-1) : setScreen("start")}
          style={{padding:"10px 22px", borderRadius:8,
            border:"1.5px solid "+C.border, background:C.card,
            color:C.text, fontSize:13, fontWeight:600, cursor:"pointer"}}>
          ← {q > 1 ? "Previous" : "Back"}
        </button>
        <div style={{display:"flex", gap:6}}>
          {Array.from({length:total}, (_,i) => (
            <div key={i} style={{width:8, height:8, borderRadius:"50%",
              background: i===q-1 ? C.crimson : i<q-1 ? C.crimsonLight : C.borderLight}} />
          ))}
        </div>
        <button
          onClick={() => q < total ? setQ(q+1) : onSubmitAll()}
          style={{padding:"10px 22px", borderRadius:8, border:"none",
            background:C.crimson, color:"#fff", fontSize:13,
            fontWeight:700, cursor:"pointer"}}>
          {q < total ? "Next →" : "Submit All →"}
        </button>
      </div>
    </div>
  </div>
);

// ─── ResultsScreen ────────────────────────────────────────────────────────────
const ResultsScreen = ({ teamName, members, overall, myRank, allTeams, total, scenarios, setScreen, setFbOpen, onLogout, readOnly }) => (
  <div style={{minHeight:"100vh", background:C.bg}}>
    <TopNav teamName={teamName} members={members} onLogout={onLogout} />

    <div style={{maxWidth:640, margin:"0 auto", padding:"32px 20px 48px"}}>

      <div style={{textAlign:"center", marginBottom:28}}>
        <div style={{width:64, height:64, borderRadius:"50%",
          background:C.greenPale, border:"2px solid "+C.green,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:28, margin:"0 auto 14px"}}>✓</div>
        <h1 style={{fontSize:26, fontWeight:700, color:C.text,
          fontFamily:"Georgia,serif", margin:"0 0 6px"}}>
          {readOnly ? "Your Results" : "Exercise Complete"}
        </h1>
        <p style={{fontSize:14, color:C.muted, margin:0}}>
          {teamName || "Your Team"} · Clear Articulation · {total} Scenarios
        </p>
      </div>

      <div style={{background:C.crimson, borderRadius:14,
        padding:"22px 28px", marginBottom:12, color:"#fff",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:16}}>
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

        <div style={{width:1, height:60, background:"rgba(255,255,255,0.25)", flexShrink:0}} />

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
            <span style={{fontSize:20, opacity:0.5}}>/{allTeams.length}</span>
          </div>
        </div>
      </div>

      <div style={{background:C.card, border:"1px solid "+C.border,
        borderRadius:10, padding:"14px 18px", marginBottom:24,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:12}}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <span style={{fontSize:20}}>🏆</span>
          <div>
            <div style={{fontSize:13, fontWeight:700, color:C.text}}>Team Leaderboard</div>
            <div style={{fontSize:12, color:C.muted}}>See all teams, scores, and answers</div>
          </div>
        </div>
        <button onClick={() => setScreen("leaderboard")}
          style={{background:C.crimson, color:"#fff", border:"none",
            borderRadius:8, padding:"9px 18px", fontSize:13,
            fontWeight:700, cursor:"pointer", whiteSpace:"nowrap"}}>
          View →
        </button>
      </div>

      <div style={{marginBottom:24}}>
        <div style={{fontSize:11, fontWeight:700, color:C.muted,
          letterSpacing:1.5, textTransform:"uppercase", marginBottom:12}}>
          Scenario Breakdown
        </div>
        {(scenarios || []).map((s, i) => (
          <div key={s.id} style={{background:C.card,
            border:"1px solid "+C.border, borderRadius:10,
            padding:"13px 16px", marginBottom:8,
            display:"flex", alignItems:"center", gap:12}}>
            <div style={{width:24, height:24, borderRadius:"50%",
              background:C.crimsonLight, display:"flex",
              alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:700, color:C.crimson, flexShrink:0}}>
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
              onClick={() => { setFbOpen(s.id); setScreen("feedback"); }}
              style={{background:"none", border:"none",
                color:C.crimson, fontSize:12, fontWeight:600,
                cursor:"pointer", textDecoration:"underline",
                padding:0, fontFamily:"inherit"}}>
              Feedback
            </button>
          </div>
        ))}
      </div>

      <div style={{background:C.card, border:"1px solid "+C.border,
        borderRadius:14, padding:"22px 22px", textAlign:"center"}}>
        <div style={{fontSize:20, marginBottom:8}}>🎉</div>
        <div style={{fontSize:16, fontWeight:700, color:C.text, marginBottom:6}}>
          Community Responses Unlocked
        </div>
        <p style={{fontSize:13, color:C.muted, margin:"0 0 18px", lineHeight:1.6}}>
          See how other teams answered each scenario.
          Browse answers, compare approaches, view AI insight on any response.
        </p>
        <button onClick={() => setScreen("community")}
          style={{background:C.crimson, color:"#fff", border:"none",
            borderRadius:8, padding:"12px 28px", fontSize:14,
            fontWeight:700, cursor:"pointer", width:"100%"}}>
          Explore Community Responses →
        </button>
      </div>
    </div>
  </div>
);

// ─── LeaderboardScreen ────────────────────────────────────────────────────────
const LeaderboardScreen = ({ teamName, members, scenarios, fallbackTeams, setScreen, onLogout }) => {
  const [teams,   setTeams]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(data => {
        const rows = (data.teams || []).map(t => ({
          name:     t.team_name,
          members:  Array.isArray(t.members) ? t.members : [],
          avgScore: parseFloat(t.overall),
          isYou:    t.team_name?.toLowerCase() === teamName?.toLowerCase(),
        }));
        setTeams(rows.length > 0 ? rows : fallbackTeams);
      })
      .catch(() => setTeams(fallbackTeams))
      .finally(() => setLoading(false));
  }, []);

  const displayTeams = teams || fallbackTeams;

  const medalBorderLeft = (i) =>
    i===0 ? "4px solid "+C.gold
    : i===1 ? "4px solid #A8B2BE"
    : i===2 ? "4px solid #C49A72"
    : "1px solid "+C.border;

  const medalIcon = (i) => i===0 ? "🥇" : i===1 ? "🥈" : i===2 ? "🥉" : "";

  const [expandedIdx, setExpandedIdx] = useState(null);

  return (
    <div style={{minHeight:"100vh", background:C.bg}}>
      <TopNav teamName={teamName} members={members}
        back={{label:"Results", onClick:()=>setScreen("results")}}
        onLogout={onLogout} />

      <div style={{maxWidth:640, margin:"0 auto", padding:"28px 20px 48px"}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:26, fontWeight:700, color:C.text,
            fontFamily:"Georgia,serif", margin:"0 0 4px"}}>
            Team Leaderboard
          </h1>
          <p style={{fontSize:13, color:C.muted, margin:0}}>
            {loading ? "Loading..." : `${displayTeams.length} teams · Ranked by average score`}
          </p>
        </div>

        {loading ? (
          <div style={{textAlign:"center", padding:"48px 0", color:C.muted, fontSize:14}}>
            Loading leaderboard...
          </div>
        ) : displayTeams.map((team, i) => (
          <div key={team.name+i} style={{background:C.card,
            borderRadius:12, marginBottom:10, overflow:"hidden",
            borderLeft: team.isYou ? "4px solid "+C.crimson : medalBorderLeft(i),
            border: team.isYou ? "2px solid "+C.crimson : "1px solid "+C.border,
            boxShadow: i===0 ? "0 2px 12px rgba(107,26,26,0.10)" : "0 1px 4px rgba(0,0,0,0.04)"}}>

            <div style={{padding:"14px 16px", display:"flex",
              alignItems:"center", gap:12, cursor:"pointer"}}
              onClick={() => setExpandedIdx(expandedIdx===i ? null : i)}>

              <div style={{width:32, height:32, borderRadius:"50%", flexShrink:0,
                background: i===0 ? C.gold : i===1 ? "#DDE1E7" : i===2 ? "#EAD9C8" : C.borderLight,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: i<3 ? 18 : 12, fontWeight:700,
                color: i===0 ? "#7A5500" : i===1 ? "#6B7280" : i===2 ? "#8B6F5E" : C.muted}}>
                {i<3 ? medalIcon(i) : i+1}
              </div>

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
                  {team.members.filter(m => m).join(" · ")}
                </div>
              </div>

              <div style={{textAlign:"right", flexShrink:0}}>
                <div style={{fontSize:22, fontWeight:800,
                  fontFamily:"Georgia,serif", lineHeight:1,
                  color: i===0 ? C.crimson : C.text}}>
                  {team.avgScore.toFixed(1)}
                </div>
                <div style={{fontSize:10, color:C.muted}}>/10</div>
              </div>

              <span style={{color:C.muted, fontSize:11, flexShrink:0}}>
                {expandedIdx===i ? "▲" : "▼"}
              </span>
            </div>

            {expandedIdx===i && (
              <div style={{borderTop:"1px solid "+C.borderLight,
                background:"#FDFCFB", padding:"14px 16px"}}>
                <div style={{fontSize:10, fontWeight:700, color:C.muted,
                  letterSpacing:1.2, textTransform:"uppercase", marginBottom:10}}>
                  Score per Scenario
                </div>
                {(scenarios || []).map((sc, si) => (
                  <div key={sc.id} style={{display:"flex", alignItems:"center",
                    gap:12, marginBottom:8}}>
                    <span style={{fontSize:12, color:C.muted, width:14,
                      flexShrink:0, textAlign:"center"}}>{si+1}</span>
                    <span style={{flex:1, fontSize:13, color:C.text}}>{sc.short}</span>
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

// ─── FeedbackModal ────────────────────────────────────────────────────────────
const FeedbackModal = ({ fbOpen, scenarios, setScreen }) => {
  const s = (scenarios || []).find(s => s.id===fbOpen) || (scenarios || [])[0] || {};
  return (
    <div onClick={() => setScreen("results")}
      style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:200, padding:"20px"}}>
      <div onClick={e => e.stopPropagation()}
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
            <div style={{fontSize:16, fontWeight:700, color:C.text}}>{s.full}</div>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <span style={{background:scoreBg(s.score), color:scoreClr(s.score),
              fontWeight:700, fontSize:15, padding:"5px 12px", borderRadius:20}}>
              {s.score}/10
            </span>
            <button onClick={() => setScreen("results")}
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
              background: s.pf ? C.greenPale : C.crimsonPale,
              padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:600,
              color: s.pf ? C.green : C.crimson}}>
              {s.pf ? "✅" : "❌"} Point First: {s.pf ? "Yes" : "No"}
            </span>
          </div>

          {[
            {label:"Summary",     text:s.headline, bg:"#1C1C1C", textColor:"#fff"},
            {label:"What Worked", text:s.worked,   bg:C.greenPale, textColor:C.greenDark},
            {label:"To Improve",  text:s.improve,  bg:C.amberPale, textColor:C.amberDark},
          ].map(b => (
            <div key={b.label} style={{background:b.bg, borderRadius:10,
              padding:"13px 16px", marginBottom:10}}>
              <div style={{fontSize:9, fontWeight:700,
                color: b.bg==="#1C1C1C" ? "#888" : b.textColor,
                letterSpacing:1.5, textTransform:"uppercase", marginBottom:5}}>
                {b.label}
              </div>
              <div style={{fontSize:13, color:b.textColor, lineHeight:1.6,
                fontWeight: b.bg==="#1C1C1C" ? 600 : 400}}>
                {b.text}
              </div>
            </div>
          ))}

          <button onClick={() => setScreen("results")}
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

// ─── CommunityScreen ──────────────────────────────────────────────────────────
const CommunityScreen = ({ teamName, members, scenarios, commSc, setCommSc, commAnw, myAnw, commSorted, commScenario, sortBy, setSortBy, setScreen, setInsightOpen, onLogout }) => (
  <div style={{minHeight:"100vh", background:C.bg}}>
    <TopNav teamName={teamName} members={members}
      back={{label:"Results", onClick:()=>setScreen("results")}}
      onLogout={onLogout} />

    <div style={{maxWidth:680, margin:"0 auto", padding:"24px 20px 48px"}}>
      <h2 style={{fontSize:22, fontWeight:700, color:C.text,
        fontFamily:"Georgia,serif", margin:"0 0 16px"}}>
        Community Responses
      </h2>

      <div style={{display:"flex", gap:7, overflowX:"auto",
        marginBottom:24, paddingBottom:4}}>
        {(scenarios || []).map(s => (
          <button key={s.id} onClick={() => setCommSc(s.id)}
            style={{padding:"6px 16px", borderRadius:99,
              border:"1.5px solid",
              borderColor: commSc===s.id ? C.crimson : C.border,
              background: commSc===s.id ? C.crimsonPale : C.card,
              color: commSc===s.id ? C.crimson : C.muted,
              fontSize:12, fontWeight:600, cursor:"pointer",
              whiteSpace:"nowrap", flexShrink:0}}>
            {s.id}. {s.short}
          </button>
        ))}
      </div>

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
            {commScenario.ctx.map((c, i) => (
              <div key={i} style={{display:"flex", gap:9, marginBottom:5}}>
                <span style={{color:C.crimson, fontWeight:700,
                  fontSize:12, flexShrink:0, marginTop:2}}>→</span>
                <span style={{fontSize:12, color:C.text, lineHeight:1.5}}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {myAnw && (
        <div style={{background:C.card, borderRadius:12,
          border:"2px solid "+C.crimson, padding:"15px 18px", marginBottom:20}}>
          <div style={{display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:10}}>
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              <div style={{width:32, height:32, borderRadius:"50%",
                background:C.crimsonLight, display:"flex",
                alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, color:C.crimson}}>
                {teamName?.[0]?.toUpperCase() || "T"}
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
              <button onClick={() => { setInsightOpen(myAnw.id); setScreen("insight"); }}
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

      <div style={{display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:14}}>
        <span style={{fontSize:12, color:C.muted}}>
          {commAnw.length} other responses
        </span>
        <div style={{display:"flex", gap:6}}>
          {["best","latest"].map(opt => (
            <button key={opt} onClick={() => setSortBy(opt)}
              style={{padding:"5px 12px", borderRadius:20,
                border:"1px solid "+C.border,
                background: sortBy===opt ? C.crimson : C.card,
                color: sortBy===opt ? "#fff" : C.muted,
                fontSize:11, fontWeight:600, cursor:"pointer"}}>
              {opt==="best" ? "Best Rated" : "Latest"}
            </button>
          ))}
        </div>
      </div>

      {commSorted.map(ans => (
        <div key={ans.id} style={{background:C.card, borderRadius:12,
          padding:"15px 18px", marginBottom:10, border:"1px solid "+C.border}}>
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
              fontSize:12, padding:"3px 10px", borderRadius:20, flexShrink:0}}>
              {ans.score}/10
            </span>
          </div>
          <p style={{fontSize:13, color:C.text, lineHeight:1.65, margin:"0 0 12px 42px"}}>
            {ans.answer}
          </p>
          <div style={{display:"flex", justifyContent:"flex-end"}}>
            <button onClick={() => { setInsightOpen(ans.id); setScreen("insight"); }}
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

// ─── InsightModal ─────────────────────────────────────────────────────────────
const InsightModal = ({ insightOpen, community, teamName, setScreen }) => {
  const ans = (community || []).find(a => a.id===insightOpen) || (community || [])[0] || {};
  return (
    <div onClick={() => setScreen("community")}
      style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:200, padding:"20px"}}>
      <div onClick={e => e.stopPropagation()}
        style={{background:C.card, borderRadius:16, width:"100%", maxWidth:460,
          maxHeight:"82vh", overflowY:"auto",
          boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>

        <div style={{padding:"16px 20px", borderBottom:"1px solid "+C.border,
          display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div style={{display:"flex", alignItems:"center", gap:9}}>
            <div style={{width:32, height:32, borderRadius:"50%",
              background: ans.own ? C.crimsonLight : "#EDE8E3",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:700,
              color: ans.own ? C.crimson : C.muted, flexShrink:0}}>
              {ans.own ? (teamName?.[0]?.toUpperCase() || "T") : ans.init}
            </div>
            <div>
              <div style={{fontSize:13, fontWeight:700, color:C.text}}>
                {ans.own ? "Your Team's Answer" : ans.name}
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
            <button onClick={() => setScreen("community")}
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
            {label:"AI Assessment", text:ans.ih, bg:"#1C1C1C", tc:"#fff",        lc:"#888"},
            {label:"What Works",    text:ans.iw, bg:C.greenPale, tc:C.greenDark, lc:C.greenDark},
            ...(ans.ii!=="Nothing." && ans.ii!=="Nothing — this is the target."
              ? [{label:"Could Be Better", text:ans.ii, bg:C.amberPale, tc:C.amberDark, lc:C.amberDark}]
              : []),
          ].map(b => (
            <div key={b.label} style={{background:b.bg, borderRadius:10,
              padding:"12px 15px", marginBottom:10}}>
              <div style={{fontSize:9, fontWeight:700, color:b.lc,
                letterSpacing:1.5, textTransform:"uppercase", marginBottom:4}}>
                {b.label}
              </div>
              <div style={{fontSize:13, color:b.tc, lineHeight:1.6,
                fontWeight: b.bg==="#1C1C1C" ? 600 : 400}}>{b.text}</div>
            </div>
          ))}

          <button onClick={() => setScreen("community")}
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

// ─── App ──────────────────────────────────────────────────────────────────────
export function App({ forceExerciseId } = {}) {
  // Active exercise data (fetched from API, falls back to hardcoded)
  const FALLBACK = getExerciseData("articulation-01");
  const [exercisePayload, setExercisePayload] = useState(FALLBACK);
  const [notFound, setNotFound] = useState(false);
  const [loadingExercise, setLoadingExercise] = useState(true);

  useEffect(() => {
    const url = forceExerciseId
      ? `/api/exercise/${encodeURIComponent(forceExerciseId)}`
      : "/api/exercise/active";
    fetch(url)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        if (data?.exercise && data?.scenarios) setExercisePayload(data);
      })
      .catch(() => {})
      .finally(() => setLoadingExercise(false));
  }, [forceExerciseId]);

  if (loadingExercise) return null;

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF8", display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif" }}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#6B1A1A", margin: "0 0 10px" }}>
            Exercise Not Available
          </h1>
          <p style={{ fontSize: 15, color: "#888", margin: 0 }}>
            This exercise is not currently active. Please check with your administrator.
          </p>
        </div>
      </div>
    );
  }

  const { exercise, scenarios, community } = exercisePayload;
  const loginEnabled = exercise?.loginEnabled ?? true;

  const [savedAttempt,  setSavedAttempt]  = useState(null);
  const [startChecking, setStartChecking] = useState(false);

  // Team / navigation
  const [teamName,    setTeamName]    = useState("");
  const [members,     setMembers]     = useState(["", "", ""]);
  const [startError,  setStartError]  = useState("");
  const [screen,      setScreen]      = useState("start");
  const [q,           setQ]           = useState(1);
  const [texts,       setTexts]       = useState({});
  const [fbOpen,      setFbOpen]      = useState(null);
  const [insightOpen, setInsightOpen] = useState(null);
  const [commSc,      setCommSc]      = useState(scenarios[0]?.id || 1);
  const [sortBy,      setSortBy]      = useState("best");
  const [submitting,  setSubmitting]  = useState(false);

  // Reset commSc when exercise changes
  useEffect(() => {
    setCommSc(scenarios[0]?.id || 1);
  }, [exercise?.id]);

  const total        = scenarios.length;
  const scenario     = scenarios[q - 1];
  const overall      = savedAttempt
    ? parseFloat(savedAttempt.overall).toFixed(1)
    : (scenarios.reduce((a, s) => a + s.score, 0) / (total || 1)).toFixed(1);

  const commAnw      = community.filter(a => a.sid === commSc && !a.own);
  const myAnw        = community.find(a => a.sid === commSc && a.own);
  const commSorted   = [...commAnw].sort((a, b) =>
    sortBy === "best" ? b.score - a.score : a.id - b.id
  );
  const commScenario = scenarios.find(s => s.id === commSc);

  // Fallback leaderboard (used if DB fetch fails)
  const fallbackTeams = [
    { name: teamName || "Your Team",
      members: members.filter(m => m.trim()),
      avgScore: parseFloat(overall),
      isYou: true },
  ];

  const addMember    = () => setMembers(m => [...m, ""]);
  const removeMember = (i) => setMembers(m => m.filter((_,idx) => idx!==i));
  const setMember    = (i,v) => setMembers(m => m.map((x,idx) => idx===i ? v : x));

  const handleLogout = () => {
    setSavedAttempt(null);
    setTeamName("");
    setMembers(["", "", ""]);
    setStartError("");
    setScreen("start");
    setQ(1);
    setTexts({});
  };

  const handleStart = async () => {
    if (!teamName.trim()) { setStartError("Please enter a team name."); return; }
    setStartChecking(true);
    setStartError("");
    try {
      const res  = await fetch(`/api/results?teamName=${encodeURIComponent(teamName.trim())}`);
      const data = await res.json();
      if (data.found) {
        setStartError(`"${teamName.trim()}" has already completed the exercise. Use "View your results" below to see your results.`);
        return;
      }
    } catch {
      setStartError("Could not verify team name. Please check your connection and try again.");
      return;
    } finally {
      setStartChecking(false);
    }
    setScreen("answering");
  };

  const handleViewResults = async (searchTeamName) => {
    try {
      const res  = await fetch(`/api/results?teamName=${encodeURIComponent(searchTeamName)}`);
      const data = await res.json();
      if (data.found && data.attempt) {
        setTeamName(data.attempt.team_name || searchTeamName);
        setMembers(Array.isArray(data.attempt.members) && data.attempt.members.length > 0
          ? data.attempt.members : [""]);
        setSavedAttempt(data.attempt);
        setScreen("results");
        return { found: true };
      }
      return { found: false };
    } catch {
      return { error: "Something went wrong. Please try again." };
    }
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    const score = parseFloat((scenarios.reduce((a, s) => a + s.score, 0) / (total || 1)).toFixed(1));
    try {
      await fetch("/api/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          members: members.filter(m => m.trim()),
          overall: score,
        }),
      });
    } catch {
      // navigate to results regardless; score is still shown
    } finally {
      setSubmitting(false);
      setSavedAttempt({ team_name: teamName, overall: score });
      setScreen("results");
    }
  };

  const sharedProps = { onLogout: handleLogout };

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>

      {screen==="start" && !savedAttempt && <StartScreen
        exercise={exercise}
        teamName={teamName} setTeamName={setTeamName}
        members={members} addMember={addMember}
        removeMember={removeMember} setMember={setMember}
        startError={startError} setStartError={setStartError}
        handleStart={handleStart} startChecking={startChecking}
        onViewResults={handleViewResults}
        loginEnabled={loginEnabled}
        total={total} {...sharedProps} />}

      {screen==="answering" && !savedAttempt && <AnsweringScreen
        teamName={teamName} members={members}
        q={q} setQ={setQ} texts={texts} setTexts={setTexts}
        total={total} scenario={scenario} setScreen={setScreen}
        onSubmitAll={handleSubmitAll} {...sharedProps} />}

      {(screen==="results" || screen==="feedback") && <ResultsScreen
        teamName={teamName} members={members} scenarios={scenarios}
        overall={overall} myRank={1} allTeams={fallbackTeams}
        total={total} setScreen={setScreen} setFbOpen={setFbOpen}
        readOnly={!!savedAttempt} {...sharedProps} />}

      {screen==="feedback" && <FeedbackModal
        fbOpen={fbOpen} scenarios={scenarios} setScreen={setScreen} />}

      {screen==="leaderboard" && <LeaderboardScreen
        teamName={teamName} members={members} scenarios={scenarios}
        fallbackTeams={fallbackTeams}
        setScreen={setScreen} {...sharedProps} />}

      {(screen==="community" || screen==="insight") && <CommunityScreen
        teamName={teamName} members={members} scenarios={scenarios}
        commSc={commSc} setCommSc={setCommSc}
        commAnw={commAnw} myAnw={myAnw}
        commSorted={commSorted} commScenario={commScenario}
        sortBy={sortBy} setSortBy={setSortBy}
        setScreen={setScreen} setInsightOpen={setInsightOpen}
        {...sharedProps} />}

      {screen==="insight" && <InsightModal
        insightOpen={insightOpen} community={community}
        teamName={teamName} setScreen={setScreen} />}

      {submitting && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.35)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:300}}>
          <div style={{background:C.card, borderRadius:14, padding:"28px 36px",
            textAlign:"center", boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}>
            <div style={{fontSize:13, fontWeight:600, color:C.text, marginBottom:6}}>
              Saving your results...
            </div>
            <div style={{fontSize:12, color:C.muted}}>Just a moment</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
