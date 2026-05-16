"use client";

import { useState, useEffect } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  crimson:     "#6B1A1A",
  crimsonPale: "#FEF2F2",
  crimsonLight:"#F5E8E8",
  bg:          "#F5F5F3",
  card:        "#FFFFFF",
  border:      "#E2E2DC",
  borderLight: "#EEEEE8",
  text:        "#1C1C1C",
  muted:       "#6B6672",
  green:       "#059669",
  greenPale:   "#ECFDF5",
  greenDark:   "#065F46",
  amber:       "#D97706",
  amberPale:   "#FFFBEB",
  amberDark:   "#92400E",
  red:         "#DC2626",
  gold:        "#E8A020",
};

const scoreBg  = s => s >= 8 ? C.greenPale  : s >= 6 ? C.amberPale  : C.crimsonPale;
const scoreClr = s => s >= 8 ? C.green      : s >= 6 ? C.amber      : C.red;

// ─── Shared UI atoms ─────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", disabled, style = {} }) => {
  const base = { border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
    padding: "9px 18px", transition: "opacity 0.1s", opacity: disabled ? 0.5 : 1, ...style };
  const variants = {
    primary:  { background: C.crimson,  color: "#fff" },
    ghost:    { background: "none",     color: C.muted,   border: "1px solid " + C.border },
    danger:   { background: "#FEF2F2",  color: C.red,     border: "1px solid #FECACA" },
    success:  { background: C.greenPale,color: C.greenDark,border: "1px solid #A7F3D0" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase",
      letterSpacing: 1, marginBottom: 6 }}>
      {label}{required && <span style={{ color: C.crimson }}> *</span>}
    </div>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: "100%", padding: "10px 13px", border: "1.5px solid " + C.border,
      borderRadius: 8, fontSize: 14, color: C.text, background: C.card, outline: "none",
      boxSizing: "border-box", fontFamily: "inherit", ...style }} />
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ width: "100%", padding: "10px 13px", border: "1.5px solid " + C.border,
      borderRadius: 8, fontSize: 14, color: C.text, background: C.card, outline: "none",
      boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />
);

const Toast = ({ msg, type = "success" }) => msg ? (
  <div style={{ background: type === "success" ? C.greenPale : C.crimsonPale,
    border: "1px solid " + (type === "success" ? "#A7F3D0" : "#FECACA"),
    borderRadius: 8, padding: "10px 16px", marginBottom: 16,
    fontSize: 13, color: type === "success" ? C.greenDark : C.crimson, fontWeight: 500 }}>
    {type === "success" ? "✓ " : "✗ "}{msg}
  </div>
) : null;

// Dynamic list (guidelines, context points)
const DynamicList = ({ items, onChange, placeholder }) => (
  <div>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <Input value={item} placeholder={placeholder + " " + (i + 1)}
          onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }} />
        <button onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          style={{ width: 36, height: 38, borderRadius: 8, border: "1px solid " + C.border,
            background: C.card, color: C.muted, fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          ×
        </button>
      </div>
    ))}
    <button onClick={() => onChange([...items, ""])}
      style={{ background: "none", border: "1.5px dashed " + C.border, color: C.muted,
        fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 8,
        cursor: "pointer", width: "100%", fontFamily: "inherit" }}>
      + Add item
    </button>
  </div>
);

// ─── Scenario Form ────────────────────────────────────────────────────────────
const EMPTY_SCENARIO = {
  short_name: "", full_name: "", prompt_text: "", context_points: ["", "", ""],
  score: 5, point_first: false, headline: "", what_worked: "", to_improve: "",
};

function ScenarioForm({ initial, onSave, onCancel, pw }) {
  const [form,    setForm]    = useState(initial || EMPTY_SCENARIO);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.short_name || !form.full_name || !form.prompt_text) {
      setError("Short name, full name, and prompt are required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { ...form, context_points: form.context_points.filter(c => c.trim()) };
    const url  = initial?.id ? `/api/admin/scenarios/${initial.id}` : "/api/admin/scenarios";
    const method = initial?.id ? "PUT" : "POST";
    const res  = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Save failed."); return; }
    onSave(data.scenario);
  };

  return (
    <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12,
      padding: "22px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
          {initial?.id ? "Edit Scenario" : "New Scenario"}
        </div>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>

      <Toast msg={error} type="error" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 }}>
        <Field label="Short Name" required>
          <Input value={form.short_name} placeholder="e.g. Project Update"
            onChange={e => set("short_name", e.target.value)} />
        </Field>
        <Field label="Full Name" required>
          <Input value={form.full_name} placeholder="e.g. Workplace Project Update"
            onChange={e => set("full_name", e.target.value)} />
        </Field>
      </div>

      <Field label="Prompt (what the user is asked)" required>
        <Textarea value={form.prompt_text} rows={2} placeholder='e.g. Your manager asks: "How is the project going?"'
          onChange={e => set("prompt_text", e.target.value)} />
      </Field>

      <Field label="Context Points">
        <DynamicList items={form.context_points} placeholder="Context point"
          onChange={v => set("context_points", v)} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16 }}>
        <Field label="Score (0–10)">
          <Input type="number" value={form.score} style={{ textAlign: "center" }}
            onChange={e => set("score", Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))} />
        </Field>
        <Field label="Point First?">
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 8 }}>
            <input type="checkbox" checked={form.point_first}
              onChange={e => set("point_first", e.target.checked)}
              style={{ width: 18, height: 18, cursor: "pointer", accentColor: C.crimson }} />
            <span style={{ fontSize: 14, color: C.text }}>
              Response leads with the main point
            </span>
          </div>
        </Field>
      </div>

      <Field label="Feedback Headline">
        <Input value={form.headline} placeholder="One-line summary of the response quality"
          onChange={e => set("headline", e.target.value)} />
      </Field>
      <Field label="What Worked">
        <Textarea value={form.what_worked} rows={2} placeholder="What the response did well"
          onChange={e => set("what_worked", e.target.value)} />
      </Field>
      <Field label="To Improve">
        <Textarea value={form.to_improve} rows={2} placeholder="What could be better"
          onChange={e => set("to_improve", e.target.value)} />
      </Field>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={save} disabled={saving}>
          {saving ? "Saving..." : initial?.id ? "Save Changes" : "Create Scenario"}
        </Btn>
      </div>
    </div>
  );
}

// ─── Exercise Form ────────────────────────────────────────────────────────────
const EMPTY_EXERCISE = {
  title: "", description: "", timer_minutes: 8,
  guidelines: [
    "Read each scenario carefully — all context you need is provided.",
    "Discuss as a team, then the captain writes the final answer.",
    "Don't add information that isn't in the scenario.",
    "Scores and community responses unlock after submitting all scenarios.",
  ],
  scenario_ids: [],
};

function ExerciseForm({ initial, allScenarios, onSave, onCancel, pw }) {
  const [form,   setForm]   = useState(initial
    ? { ...initial, scenario_ids: Array.isArray(initial.scenario_ids) ? initial.scenario_ids : [] }
    : EMPTY_EXERCISE);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleScenario = (id) => {
    const ids = form.scenario_ids;
    set("scenario_ids", ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  };

  const save = async () => {
    if (!form.title) { setError("Title is required."); return; }
    if (form.scenario_ids.length === 0) { setError("Select at least one scenario."); return; }
    setSaving(true);
    setError("");
    const payload = { ...form, guidelines: form.guidelines.filter(g => g.trim()) };
    const url    = initial?.id ? `/api/admin/exercises/${initial.id}` : "/api/admin/exercises";
    const method = initial?.id ? "PUT" : "POST";
    const res    = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Save failed."); return; }
    onSave(data.exercise);
  };

  return (
    <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12,
      padding: "22px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
          {initial?.id ? "Edit Exercise" : "New Exercise"}
        </div>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>

      <Toast msg={error} type="error" />

      <Field label="Title" required>
        <Input value={form.title} placeholder="e.g. Articulation-03"
          onChange={e => set("title", e.target.value)} />
      </Field>

      <Field label="Description">
        <Textarea value={form.description} rows={2}
          placeholder="Short description shown to participants on the start screen"
          onChange={e => set("description", e.target.value)} />
      </Field>

      <Field label="Timer (minutes)">
        <Input type="number" value={form.timer_minutes} style={{ width: 100 }}
          onChange={e => set("timer_minutes", Math.max(1, parseInt(e.target.value) || 8))} />
      </Field>

      <Field label="Guidelines">
        <DynamicList items={form.guidelines} placeholder="Guideline"
          onChange={v => set("guidelines", v)} />
      </Field>

      <Field label={`Scenarios (${form.scenario_ids.length} selected)`} required>
        <div style={{ border: "1.5px solid " + C.border, borderRadius: 8, overflow: "hidden" }}>
          {allScenarios.length === 0 ? (
            <div style={{ padding: "16px", color: C.muted, fontSize: 13, textAlign: "center" }}>
              No scenarios yet. Create some in the Scenarios tab first.
            </div>
          ) : allScenarios.map((s, i) => {
            const checked = form.scenario_ids.includes(s.id);
            return (
              <label key={s.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                cursor: "pointer", borderTop: i > 0 ? "1px solid " + C.borderLight : "none",
                background: checked ? C.crimsonPale : C.card,
              }}>
                <input type="checkbox" checked={checked} onChange={() => toggleScenario(s.id)}
                  style={{ width: 16, height: 16, accentColor: C.crimson, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.full_name}</span>
                  <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>#{s.id}</span>
                </div>
                <span style={{ background: scoreBg(s.score), color: scoreClr(s.score),
                  fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                  {s.score}/10
                </span>
              </label>
            );
          })}
        </div>
        {form.scenario_ids.length > 0 && (
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
            Order: {form.scenario_ids.map(id => {
              const s = allScenarios.find(x => x.id === id);
              return s ? s.short_name : id;
            }).join(" → ")}
          </div>
        )}
      </Field>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={save} disabled={saving}>
          {saving ? "Saving..." : initial?.id ? "Save Changes" : "Create Exercise"}
        </Btn>
      </div>
    </div>
  );
}

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    if (!pw.trim()) { setError("Enter the admin password."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/stats", { headers: { "x-admin-password": pw.trim() } });
    if (res.ok) {
      sessionStorage.setItem("adminPw", pw.trim());
      onUnlock(pw.trim());
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.crimson,
            fontFamily: "Georgia,serif", letterSpacing: 1 }}>SHARP</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Admin Panel</div>
        </div>
        <div style={{ background: C.card, borderRadius: 14, border: "1px solid " + C.border,
          padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16 }}>Admin Access</div>
          <Toast msg={error} type="error" />
          <input type="password" value={pw} autoFocus
            onChange={e => { setPw(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && !loading && attempt()}
            placeholder="Password"
            style={{ width: "100%", padding: "11px 14px", border: "1.5px solid " + C.border,
              borderRadius: 8, fontSize: 14, color: C.text, background: C.card,
              outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 14 }} />
          <Btn onClick={attempt} disabled={loading} style={{ width: "100%", padding: 12 }}>
            {loading ? "Checking..." : "Enter →"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border,
      padding: "18px 20px", flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase",
        letterSpacing: 1.2, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Georgia,serif",
        color: color || C.text, lineHeight: 1 }}>{value ?? "—"}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ pw }) {
  const [stats,   setStats]   = useState(null);
  const [teams,   setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { headers: { "x-admin-password": pw } }).then(r => r.json()),
      fetch("/api/admin/teams", { headers: { "x-admin-password": pw } }).then(r => r.json()),
    ]).then(([s, t]) => { setStats(s); setTeams(t.teams || []); })
      .finally(() => setLoading(false));
  }, []);

  const medalIcon = i => ["🥇","🥈","🥉"][i] || "";

  if (loading) return <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard label="Total Teams"   value={stats?.total}  sub="submissions received" color={C.crimson} />
        <StatCard label="Avg Score"     value={stats?.avgScore != null ? stats.avgScore + "/10" : "—"} sub="across all teams" />
        <StatCard label="Top Team"      value={stats?.topTeam?.name || "—"} sub={stats?.topTeam ? stats.topTeam.score + "/10" : "no data"} color={C.gold} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase",
        letterSpacing: 1.2, marginBottom: 12 }}>Leaderboard</div>

      {teams.length === 0 ? (
        <div style={{ background: C.card, borderRadius: 10, border: "1px solid " + C.border,
          padding: 32, textAlign: "center", color: C.muted }}>No submissions yet.</div>
      ) : teams.map((t, i) => (
        <div key={t.team_name + i} style={{ background: C.card, borderRadius: 10,
          border: "1px solid " + C.border, padding: "12px 16px", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            background: i === 0 ? C.gold : i === 1 ? "#DDE1E7" : i === 2 ? "#EAD9C8" : C.borderLight,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: i < 3 ? 16 : 12, fontWeight: 700 }}>
            {i < 3 ? medalIcon(i) : i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.team_name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>
              {(Array.isArray(t.members) ? t.members : []).filter(Boolean).join(" · ") || "—"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "Georgia,serif",
              color: i === 0 ? C.crimson : C.text, lineHeight: 1 }}>
              {parseFloat(t.overall).toFixed(1)}
            </div>
            <div style={{ fontSize: 10, color: C.muted }}>/10</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Teams Tab ────────────────────────────────────────────────────────────────
function TeamsTab({ pw }) {
  const [teams,   setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("score");

  useEffect(() => {
    fetch("/api/admin/teams", { headers: { "x-admin-password": pw } })
      .then(r => r.json()).then(d => setTeams(d.teams || []))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...teams].sort((a, b) =>
    sortKey === "score"
      ? parseFloat(b.overall) - parseFloat(a.overall)
      : new Date(b.submitted_at) - new Date(a.submitted_at)
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.muted }}>
          {loading ? "Loading..." : `${teams.length} team${teams.length !== 1 ? "s" : ""}`}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["score","By Score"],["date","By Date"]].map(([k, l]) => (
            <button key={k} onClick={() => setSortKey(k)}
              style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                border: "1px solid " + C.border, cursor: "pointer",
                background: sortKey === k ? C.crimson : C.card,
                color: sortKey === k ? "#fff" : C.muted }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Loading...</div>
      ) : sorted.length === 0 ? (
        <div style={{ background: C.card, borderRadius: 10, border: "1px solid " + C.border,
          padding: 32, textAlign: "center", color: C.muted }}>No submissions yet.</div>
      ) : (
        <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 80px 150px",
            padding: "10px 16px", borderBottom: "1px solid " + C.border,
            fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>
            <span>Team</span><span>Members</span>
            <span style={{ textAlign: "right" }}>Score</span>
            <span style={{ textAlign: "right" }}>Submitted</span>
          </div>
          {sorted.map((t, i) => (
            <div key={t.team_name + i} style={{ display: "grid",
              gridTemplateColumns: "2fr 2fr 80px 150px", padding: "12px 16px",
              borderBottom: i < sorted.length - 1 ? "1px solid " + C.borderLight : "none",
              alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.team_name}</div>
              <div style={{ fontSize: 12, color: C.muted }}>
                {(Array.isArray(t.members) ? t.members : []).filter(Boolean).join(", ") || "—"}
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ background: scoreBg(parseFloat(t.overall)),
                  color: scoreClr(parseFloat(t.overall)), fontWeight: 700,
                  fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>
                  {parseFloat(t.overall).toFixed(1)}/10
                </span>
              </div>
              <div style={{ fontSize: 11, color: C.muted, textAlign: "right" }}>
                {t.submitted_at
                  ? new Date(t.submitted_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                  : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Exercises Tab ────────────────────────────────────────────────────────────
function ExercisesTab({ pw }) {
  const [exercises,    setExercises]    = useState([]);
  const [allScenarios, setAllScenarios] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editing,      setEditing]      = useState(null);
  const [toast,        setToast]        = useState({ msg: "", type: "success" });
  const [actioning,    setActioning]    = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  };

  const load = async () => {
    setLoading(true);
    const [ex, sc] = await Promise.all([
      fetch("/api/admin/exercises",  { headers: { "x-admin-password": pw } }).then(r => r.json()),
      fetch("/api/admin/scenarios",  { headers: { "x-admin-password": pw } }).then(r => r.json()),
    ]);
    setExercises(ex.exercises || []);
    setAllScenarios(sc.scenarios || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setActive = async (id) => {
    setActioning(id + "_active");
    const res = await fetch(`/api/admin/exercises/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify({ is_active: true }),
    });
    const data = await res.json();
    setActioning(null);
    if (data.success) { notify(`"${id}" is now active.`); load(); }
    else notify(data.error || "Failed.", "error");
  };

  const deleteEx = async (id) => {
    if (!confirm(`Delete exercise "${id}"? This cannot be undone.`)) return;
    setActioning(id + "_delete");
    const res = await fetch(`/api/admin/exercises/${id}`, {
      method: "DELETE", headers: { "x-admin-password": pw },
    });
    const data = await res.json();
    setActioning(null);
    if (data.success) { notify("Exercise deleted."); load(); }
    else notify(data.error || "Failed.", "error");
  };

  const onSave = (ex) => {
    notify(editing ? "Exercise updated." : "Exercise created.");
    setShowForm(false);
    setEditing(null);
    load();
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: C.muted }}>Loading...</div>;

  if (showForm || editing) {
    return (
      <ExerciseForm
        initial={editing}
        allScenarios={allScenarios}
        pw={pw}
        onSave={onSave}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.muted }}>
          {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
        </div>
        <Btn onClick={() => setShowForm(true)}>+ New Exercise</Btn>
      </div>

      {exercises.length === 0 ? (
        <div style={{ background: C.card, borderRadius: 10, border: "1px solid " + C.border,
          padding: 32, textAlign: "center", color: C.muted }}>
          No exercises yet. Create one above.
        </div>
      ) : exercises.map(ex => {
        const sids = Array.isArray(ex.scenario_ids) ? ex.scenario_ids : [];
        const scenarioNames = sids.map(id => {
          const s = allScenarios.find(x => x.id === id);
          return s ? s.short_name : `#${id}`;
        });

        return (
          <div key={ex.id} style={{ background: C.card, borderRadius: 12, marginBottom: 12,
            border: ex.is_active ? "2px solid " + C.crimson : "1px solid " + C.border }}>

            <div style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start",
              justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{ex.title}</span>
                  {ex.is_active && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: C.crimson,
                      color: "#fff", padding: "2px 9px", borderRadius: 99 }}>ACTIVE</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{ex.description}</div>
                {scenarioNames.length > 0 && (
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                    Scenarios: {scenarioNames.join(" · ")}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {!ex.is_active && (
                  <Btn variant="success" disabled={actioning === ex.id + "_active"}
                    onClick={() => setActive(ex.id)}>
                    {actioning === ex.id + "_active" ? "Setting..." : "Set Active →"}
                  </Btn>
                )}
                <Btn variant="ghost" onClick={() => setEditing(ex)}>Edit</Btn>
                {!ex.is_active && (
                  <Btn variant="danger" disabled={actioning === ex.id + "_delete"}
                    onClick={() => deleteEx(ex.id)}>
                    Delete
                  </Btn>
                )}
              </div>
            </div>

            <div style={{ padding: "9px 20px", borderTop: "1px solid " + C.borderLight,
              background: "#FDFCFB", display: "flex", gap: 20 }}>
              <span style={{ fontSize: 12, color: C.muted }}>
                <b style={{ color: C.text }}>{sids.length}</b> scenarios
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>
                <b style={{ color: C.text }}>{ex.timer_minutes}</b> min timer
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>
                ID: <code style={{ fontSize: 11, background: C.borderLight,
                  padding: "1px 6px", borderRadius: 4 }}>{ex.id}</code>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Scenarios Tab ────────────────────────────────────────────────────────────
function ScenariosTab({ pw }) {
  const [scenarios, setScenarios] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [expanded,  setExpanded]  = useState(null);
  const [toast,     setToast]     = useState({ msg: "", type: "success" });
  const [deleting,  setDeleting]  = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/scenarios", { headers: { "x-admin-password": pw } })
      .then(r => r.json()).then(d => setScenarios(d.scenarios || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteScenario = async (id) => {
    if (!confirm("Delete this scenario? This cannot be undone.")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/scenarios/${id}`, {
      method: "DELETE", headers: { "x-admin-password": pw },
    });
    const data = await res.json();
    setDeleting(null);
    if (data.success) { notify("Scenario deleted."); load(); }
    else notify(data.error || "Failed.", "error");
  };

  const onSave = () => {
    notify(editing ? "Scenario updated." : "Scenario created.");
    setShowForm(false);
    setEditing(null);
    load();
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: C.muted }}>Loading...</div>;

  if (showForm || editing) {
    return (
      <ScenarioForm
        initial={editing ? {
          ...editing,
          context_points: Array.isArray(editing.context_points) ? editing.context_points : [],
        } : null}
        pw={pw}
        onSave={onSave}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.muted }}>
          {scenarios.length} scenario{scenarios.length !== 1 ? "s" : ""}
        </div>
        <Btn onClick={() => setShowForm(true)}>+ New Scenario</Btn>
      </div>

      {scenarios.length === 0 ? (
        <div style={{ background: C.card, borderRadius: 10, border: "1px solid " + C.border,
          padding: 32, textAlign: "center", color: C.muted }}>
          No scenarios yet. Create one above.
        </div>
      ) : scenarios.map((s, i) => (
        <div key={s.id} style={{ background: C.card, borderRadius: 10, marginBottom: 8,
          border: "1px solid " + C.border, overflow: "hidden" }}>

          {/* Row */}
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
              background: C.crimsonLight, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.crimson }}>
              {s.id}
            </div>
            <div style={{ flex: 1, cursor: "pointer" }}
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.full_name}</span>
              <span style={{ fontSize: 11, color: C.muted, marginLeft: 10 }}>{s.short_name}</span>
            </div>
            <span style={{ background: scoreBg(s.score), color: scoreClr(s.score),
              fontWeight: 700, fontSize: 12, padding: "3px 10px", borderRadius: 20, flexShrink: 0 }}>
              {s.score}/10
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }}
                onClick={() => setEditing(s)}>Edit</Btn>
              <Btn variant="danger" style={{ padding: "6px 12px", fontSize: 12 }}
                disabled={deleting === s.id} onClick={() => deleteScenario(s.id)}>
                {deleting === s.id ? "..." : "Delete"}
              </Btn>
            </div>
            <span style={{ fontSize: 11, color: C.muted, cursor: "pointer" }}
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
              {expanded === s.id ? "▲" : "▼"}
            </span>
          </div>

          {/* Expanded */}
          {expanded === s.id && (
            <div style={{ borderTop: "1px solid " + C.borderLight, padding: "14px 20px",
              background: "#FDFCFB" }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.muted,
                  textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5 }}>Prompt</div>
                <div style={{ fontSize: 13, color: C.text, fontStyle: "italic",
                  lineHeight: 1.6 }}>"{s.prompt_text}"</div>
              </div>
              {Array.isArray(s.context_points) && s.context_points.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted,
                    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Context</div>
                  {s.context_points.map((c, ci) => (
                    <div key={ci} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                      <span style={{ color: C.crimson, fontWeight: 700, fontSize: 12 }}>→</span>
                      <span style={{ fontSize: 13, color: C.text }}>{c}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { label: "Headline",    text: s.headline,    bg: "#1C1C1C", tc: "#fff",      lc: "#888" },
                  { label: "What Worked", text: s.what_worked, bg: C.greenPale, tc: C.greenDark, lc: C.greenDark },
                  { label: "To Improve",  text: s.to_improve,  bg: C.amberPale, tc: C.amberDark, lc: C.amberDark },
                ].filter(b => b.text).map(b => (
                  <div key={b.label} style={{ background: b.bg, borderRadius: 8, padding: "10px 13px" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: b.lc,
                      letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>
                      {b.label}
                    </div>
                    <div style={{ fontSize: 13, color: b.tc, lineHeight: 1.6,
                      fontWeight: b.bg === "#1C1C1C" ? 600 : 400 }}>{b.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Admin App ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [pw,       setPw]       = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [tab,      setTab]      = useState("dashboard");

  useEffect(() => {
    const stored = sessionStorage.getItem("adminPw") || "";
    setPw(stored);
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  if (!pw) return <PasswordGate onUnlock={pw => { setPw(pw); }} />;

  const TABS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "exercises", label: "Exercises" },
    { id: "scenarios", label: "Scenarios" },
    { id: "teams",     label: "Teams" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg,
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* Top nav */}
      <header style={{ background: "#1A1A1A", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#fff",
            fontFamily: "Georgia,serif", letterSpacing: 0.5 }}>SHARP</span>
          <span style={{ color: "#555", fontSize: 14 }}>|</span>
          <span style={{ fontSize: 13, color: "#aaa", fontWeight: 500 }}>Admin</span>
        </div>
        <button onClick={() => { sessionStorage.removeItem("adminPw"); setPw(""); }}
          style={{ background: "none", border: "1px solid #333", color: "#888",
            fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 7,
            cursor: "pointer", fontFamily: "inherit" }}>
          Sign out
        </button>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text,
            fontFamily: "Georgia,serif", margin: "0 0 4px" }}>Admin Panel</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
            Manage exercises and scenarios, view submissions, and control what teams see.
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24,
          borderBottom: "1px solid " + C.border }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "9px 18px", border: "none", background: "none",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                color: tab === t.id ? C.crimson : C.muted, fontFamily: "inherit",
                borderBottom: tab === t.id ? "2px solid " + C.crimson : "2px solid transparent",
                marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && <DashboardTab pw={pw} />}
        {tab === "exercises" && <ExercisesTab pw={pw} />}
        {tab === "scenarios" && <ScenariosTab pw={pw} />}
        {tab === "teams"     && <TeamsTab pw={pw} />}
      </div>
    </div>
  );
}
