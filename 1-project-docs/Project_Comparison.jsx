import { useState } from "react";

const projects = [
  {
    id: "finquant",
    name: "FINQUANT-NEXUS",
    subtitle: "Federated Graph-Aware Deep RL Portfolio Optimization",
    source: "Our Blueprint",
    topics: 7,
    topicList: ["Deep RL", "GNN", "GANs", "FL", "NAS", "GPT-4", "Quantum ML"],
    feasibility: 9,
    novelty: 9.5,
    thesis: 9.5,
    interview: 10,
    production: 9,
    rtx3050: 8.5,
    twoMonths: 8,
    overall: 9.2,
    color: "#3B82F6",
    verdict: "RECOMMENDED",
    pros: [
      "7/8 topics naturally integrated — not forced",
      "Finance domain = hedge fund + FAANG + fintech doors",
      "5 independently publishable research contributions",
      "Clear problem statement: $100T+ AUM industry pain point",
      "9 baselines + 4 ablation studies = bulletproof thesis",
      "RTX 3050 optimized (FP16, graph mini-batch, API calls)",
      "Detailed 8-week day-by-day execution plan exists",
      "Full tech stack with version numbers locked",
      "Each module works independently — fail-safe design",
    ],
    cons: [
      "GPT-4 API costs ~$20-50 for sentiment pipeline",
      "Quantum module is benchmarking only, not deep",
      "GNN + RL training needs careful hyperparameter tuning",
    ],
    whyBetter: "Laser-focused problem + maximum topic coverage + RTX 3050 feasible + thesis-ready architecture"
  },
  {
    id: "emergent",
    name: "EmergentOS",
    subtitle: "Multi-Agent AI Operating System",
    source: "Document Idea #1",
    topics: 6,
    topicList: ["GPT-4", "GANs", "NAS", "RL", "Deep RL", "FL"],
    feasibility: 4,
    novelty: 7,
    thesis: 5,
    interview: 7,
    production: 6,
    rtx3050: 3,
    twoMonths: 3,
    overall: 5.0,
    color: "#EF4444",
    verdict: "TOO VAGUE",
    pros: [
      "Impressive concept — multi-agent orchestration",
      "Covers 6 topics",
      "Good demo potential if pulled off",
    ],
    cons: [
      "EXTREMELY vague — 'agents work for you' is not a problem statement",
      "No clear research contribution — what's novel vs AutoGPT/CrewAI?",
      "No defined evaluation metrics — how do you prove it works?",
      "2 months mein kaise? No concrete plan given",
      "RTX 3050 pe NAS + GAN + RL simultaneously? VRAM death",
      "Thesis committee will ask: 'What specific problem does this solve?'",
      "Sounds like a hackathon pitch, not a research project",
      "No baseline comparisons defined",
    ],
    whyBetter: null
  },
  {
    id: "alpha",
    name: "AlphaMind",
    subtitle: "Autonomous Financial Intelligence System",
    source: "Document Idea #2",
    topics: 5,
    topicList: ["GPT-4", "GANs", "Deep RL", "NAS", "FL"],
    feasibility: 6,
    novelty: 6,
    thesis: 6,
    interview: 8,
    production: 5,
    rtx3050: 6,
    twoMonths: 5,
    overall: 6.0,
    color: "#F59E0B",
    verdict: "FINQUANT IS BETTER VERSION",
    pros: [
      "Same domain as FINQUANT — finance is great",
      "RL trading is industry-relevant",
      "Good concept direction",
    ],
    cons: [
      "No GNN — misses graph structure of markets (huge gap)",
      "No Quantum ML coverage (7 vs 5 topics)",
      "No specific architecture details given",
      "No evaluation framework defined",
      "No timeline or execution plan",
      "FINQUANT-NEXUS is literally this idea but 10x more detailed and research-grade",
      "'Latency < 100ms' is a nice line but no plan to achieve it",
    ],
    whyBetter: null
  },
  {
    id: "med",
    name: "MedSphere",
    subtitle: "Privacy-Preserving AI Healthcare Platform",
    source: "Document Idea #3",
    topics: 5,
    topicList: ["FL", "GANs", "NAS", "GPT-4", "Deep RL"],
    feasibility: 6,
    novelty: 7,
    thesis: 8,
    interview: 6,
    production: 5,
    rtx3050: 6,
    twoMonths: 5,
    overall: 6.3,
    color: "#10B981",
    verdict: "GOOD BUT WRONG DOMAIN FOR YOU",
    pros: [
      "Socially impactful — ethics angle strong",
      "FL + healthcare is hot research area",
      "Publishable if done well",
      "Good for thesis committees who value social impact",
    ],
    cons: [
      "You said finance direction — healthcare doesn't align",
      "Medical datasets are HARD to get (privacy, IRB approvals)",
      "No RL naturally fits — would be forced",
      "No Quantum ML integration point",
      "Domain expertise needed (medical imaging/diagnosis)",
      "Won't help with hedge fund / fintech interviews",
      "GAN for rare diseases needs domain validation you can't do in 2 months",
    ],
    whyBetter: null
  },
  {
    id: "auto",
    name: "AutoGenesis",
    subtitle: "Self-Evolving Neural Systems",
    source: "Document Idea #4",
    topics: 5,
    topicList: ["NAS", "RL", "GANs", "GPT-4", "FL"],
    feasibility: 3,
    novelty: 8,
    thesis: 4,
    interview: 5,
    production: 3,
    rtx3050: 2,
    twoMonths: 2,
    overall: 3.8,
    color: "#8B5CF6",
    verdict: "IMPOSSIBLE IN 2 MONTHS",
    pros: [
      "Intellectually fascinating concept",
      "High novelty if it works",
    ],
    cons: [
      "This is a PhD-level project, not M.Tech 2-month",
      "No concrete problem statement",
      "What does 'self-evolving' mean in measurable terms?",
      "RTX 3050 simply cannot run NAS + RL + GAN together",
      "No evaluation possible — how do you grade 'meta-learning'?",
      "Thesis will be all hand-waving, no hard results",
      "No finance domain alignment",
      "Document itself says 'CRAZY level' — that's a red flag for feasibility",
    ],
    whyBetter: null
  },
  {
    id: "neuro",
    name: "NeuroMesh",
    subtitle: "Decentralized AI Training Network",
    source: "Document Idea #5",
    topics: 3,
    topicList: ["FL", "GPT-4", "GANs"],
    feasibility: 3,
    novelty: 5,
    thesis: 4,
    interview: 4,
    production: 4,
    rtx3050: 4,
    twoMonths: 2,
    overall: 3.5,
    color: "#EC4899",
    verdict: "WRONG DIRECTION",
    pros: [
      "Blockchain + AI is trendy",
      "Distributed systems knowledge",
    ],
    cons: [
      "Only 3/8 topics covered",
      "Blockchain is infrastructure, not ML research",
      "Thesis committee: 'Where's the ML contribution?'",
      "No RL, no GNN, no NAS, no Quantum",
      "Needs actual blockchain infra — 2 months impossible",
      "Not aligned with finance or your profile",
      "More of a systems engineering project than ML",
    ],
    whyBetter: null
  },
  {
    id: "qoptima",
    name: "Q-Optima",
    subtitle: "Quantum Assisted AI System",
    source: "Document Idea #6",
    topics: 3,
    topicList: ["Quantum ML", "NAS", "Deep RL"],
    feasibility: 4,
    novelty: 8,
    thesis: 6,
    interview: 4,
    production: 2,
    rtx3050: 5,
    twoMonths: 4,
    overall: 4.5,
    color: "#6366F1",
    verdict: "HIGH RISK, LOW REWARD",
    pros: [
      "Research novelty is high",
      "Quantum + DL is cutting edge",
    ],
    cons: [
      "Only 3/8 topics covered",
      "Qiskit simulator is SLOW for anything meaningful",
      "No production value — purely academic",
      "Interviewers won't ask quantum questions at FAANG",
      "No finance alignment",
      "Very niche — limits career options",
      "Missing GANs, FL, GNN, GPT-4",
    ],
    whyBetter: null
  },
];

const criteria = [
  { key: "feasibility", label: "2-Month Feasibility", icon: "⏱" },
  { key: "novelty", label: "Research Novelty", icon: "🔬" },
  { key: "thesis", label: "Thesis Strength", icon: "📄" },
  { key: "interview", label: "Interview Value", icon: "💼" },
  { key: "production", label: "Production Grade", icon: "🏭" },
  { key: "rtx3050", label: "RTX 3050 Fit", icon: "🖥" },
];

function ScoreBar({ score, max = 10, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)" }}>
        <div style={{
          width: `${(score / max) * 100}%`, height: "100%", borderRadius: "4px",
          background: score >= 8 ? "#22C55E" : score >= 6 ? "#F59E0B" : "#EF4444",
          transition: "width 0.5s ease"
        }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 700, color, minWidth: "28px" }}>{score}/10</span>
    </div>
  );
}

export default function Comparison() {
  const [selected, setSelected] = useState("finquant");
  const [showAll, setShowAll] = useState(false);

  const proj = projects.find(p => p.id === selected);
  const displayProjects = showAll ? projects : projects.filter(p => ["finquant", "alpha", "emergent", "med"].includes(p.id));

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      minHeight: "100vh", color: "#E2E8F0", padding: "20px"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{
          fontSize: "26px", fontWeight: 800, margin: "0 0 4px",
          background: "linear-gradient(135deg, #60A5FA, #A78BFA, #F472B6)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Project Comparison: Which One is God-Tier?
        </h1>
        <p style={{ color: "#64748B", fontSize: "13px", margin: 0 }}>
          7 projects analyzed on 6 criteria | RTX 3050 | 2 Months | Finance Domain
        </p>
      </div>

      {/* Project Selector */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "8px", marginBottom: "20px"
      }}>
        {displayProjects.map(p => (
          <button key={p.id} onClick={() => setSelected(p.id)} style={{
            padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer",
            background: selected === p.id
              ? `linear-gradient(135deg, ${p.color}33, ${p.color}11)`
              : "rgba(255,255,255,0.03)",
            borderLeft: selected === p.id ? `3px solid ${p.color}` : "3px solid transparent",
            textAlign: "left", transition: "all 0.2s"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: selected === p.id ? p.color : "#94A3B8" }}>
                {p.name}
              </span>
              <span style={{
                fontSize: "11px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px",
                background: p.overall >= 8 ? "#22C55E22" : p.overall >= 6 ? "#F59E0B22" : "#EF444422",
                color: p.overall >= 8 ? "#22C55E" : p.overall >= 6 ? "#F59E0B" : "#EF4444"
              }}>
                {p.overall}
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>{p.source}</div>
            <div style={{
              fontSize: "10px", marginTop: "4px", padding: "2px 6px", borderRadius: "4px", display: "inline-block",
              background: p.verdict === "RECOMMENDED" ? "#22C55E15" : p.verdict.includes("IMPOSSIBLE") ? "#EF444415" : "#F59E0B15",
              color: p.verdict === "RECOMMENDED" ? "#22C55E" : p.verdict.includes("IMPOSSIBLE") ? "#EF4444" : "#F59E0B",
              fontWeight: 700
            }}>
              {p.verdict}
            </div>
          </button>
        ))}
      </div>

      {!showAll && (
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button onClick={() => setShowAll(true)} style={{
            padding: "6px 16px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "#94A3B8", fontSize: "12px", cursor: "pointer"
          }}>
            Show all 7 projects
          </button>
        </div>
      )}

      {/* Main Content */}
      {proj && (
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {/* Left: Scores */}
          <div style={{
            flex: "1 1 340px", padding: "16px", borderRadius: "12px",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", color: proj.color }}>{proj.name}</h2>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94A3B8" }}>{proj.subtitle}</p>
              </div>
              <div style={{
                fontSize: "24px", fontWeight: 900, color: proj.overall >= 8 ? "#22C55E" : proj.overall >= 6 ? "#F59E0B" : "#EF4444"
              }}>
                {proj.overall}
              </div>
            </div>

            {/* Topics */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", color: "#64748B", marginRight: "4px" }}>{proj.topics}/8 topics:</span>
              {proj.topicList.map(t => (
                <span key={t} style={{
                  padding: "2px 8px", borderRadius: "10px", fontSize: "10px",
                  background: `${proj.color}15`, color: proj.color, fontWeight: 600
                }}>{t}</span>
              ))}
            </div>

            {/* Score Bars */}
            {criteria.map(c => (
              <div key={c.key} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>{c.icon} {c.label}</span>
                </div>
                <ScoreBar score={proj[c.key]} color={proj.color} />
              </div>
            ))}

            {/* Overall bar */}
            <div style={{
              marginTop: "12px", padding: "10px", borderRadius: "8px",
              background: proj.overall >= 8 ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${proj.overall >= 8 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`
            }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: proj.overall >= 8 ? "#22C55E" : "#EF4444" }}>
                OVERALL: {proj.overall}/10 — {proj.verdict}
              </div>
            </div>
          </div>

          {/* Right: Pros/Cons */}
          <div style={{ flex: "1 1 340px" }}>
            {/* Pros */}
            <div style={{
              padding: "14px", borderRadius: "12px", marginBottom: "10px",
              background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)"
            }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "13px", color: "#22C55E" }}>
                Strengths
              </h3>
              {proj.pros.map((p, i) => (
                <div key={i} style={{
                  fontSize: "12px", color: "#86EFAC", padding: "3px 0",
                  display: "flex", gap: "6px", lineHeight: 1.4
                }}>
                  <span style={{ color: "#22C55E", flexShrink: 0 }}>✓</span> {p}
                </div>
              ))}
            </div>

            {/* Cons */}
            <div style={{
              padding: "14px", borderRadius: "12px",
              background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)"
            }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "13px", color: "#EF4444" }}>
                Weaknesses / Risks
              </h3>
              {proj.cons.map((c, i) => (
                <div key={i} style={{
                  fontSize: "12px", color: "#FCA5A5", padding: "3px 0",
                  display: "flex", gap: "6px", lineHeight: 1.4
                }}>
                  <span style={{ color: "#EF4444", flexShrink: 0 }}>✗</span> {c}
                </div>
              ))}
            </div>

            {proj.whyBetter && (
              <div style={{
                marginTop: "10px", padding: "12px", borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
                border: "1px solid rgba(99,102,241,0.2)"
              }}>
                <div style={{ fontSize: "12px", color: "#A5B4FC", fontWeight: 600 }}>
                  Why This Wins: {proj.whyBetter}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Final Verdict */}
      <div style={{
        marginTop: "20px", padding: "16px", borderRadius: "12px", textAlign: "center",
        background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(34,197,94,0.08))",
        border: "1px solid rgba(59,130,246,0.2)"
      }}>
        <div style={{ fontSize: "18px", fontWeight: 800, color: "#60A5FA", marginBottom: "6px" }}>
          FINAL VERDICT: FINQUANT-NEXUS (9.2/10)
        </div>
        <div style={{ fontSize: "13px", color: "#94A3B8", maxWidth: "600px", margin: "0 auto", lineHeight: 1.5 }}>
          Document ke ideas are good starting points, but lack execution detail, evaluation frameworks,
          and RTX 3050 feasibility analysis. FINQUANT-NEXUS covers 7/8 topics naturally,
          has a clear research contribution, detailed 8-week plan, and aligns perfectly with your finance career goals.
          AlphaMind (#2) is the closest competitor but FINQUANT-NEXUS is its superior, research-grade evolution.
        </div>
      </div>
    </div>
  );
}
