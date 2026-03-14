import { useState } from "react";

const coreModules = [
  {
    id: "rl",
    name: "Deep RL Trading Agent",
    topic: "Deep RL",
    depth: "DEEP (40%)",
    color: "#EF4444",
    why: "This IS the product. PPO/SAC agent that outputs portfolio weights. State = graph embeddings + technicals + sentiment. Reward = risk-adjusted Sharpe ratio. This alone is sellable.",
    deliverable: "Agent that consistently beats S&P 500 by 5-15% with lower drawdown",
    production: [
      "Real-time inference API (FastAPI) — <50ms response",
      "Risk management layer (max position size, stop-loss, drawdown limits)",
      "Paper trading mode → Live trading mode toggle",
      "Backtesting engine with transaction costs + slippage",
      "Daily rebalancing scheduler (cron job)",
    ],
    weeks: "Week 2-4 (Primary), Week 5-8 (Refinement)"
  },
  {
    id: "gnn",
    name: "Graph Neural Network Market Engine",
    topic: "GNN",
    depth: "DEEP (25%)",
    color: "#8B5CF6",
    why: "This is the SECRET SAUCE. Why your product is better than competitors. Markets are graphs — stocks are connected via sectors, supply chains, correlations. T-GAT captures this. No competitor does this properly.",
    deliverable: "Dynamic market graph that detects regime changes 2-5 days before traditional indicators",
    production: [
      "Daily graph reconstruction from live data",
      "Attention heatmap API — 'which stocks influence which'",
      "Regime detection alerts (bull → bear transition)",
      "Sector contagion early warning system",
      "Graph embeddings served via API for downstream use",
    ],
    weeks: "Week 1-2 (Build), Week 3-4 (Integrate with RL)"
  },
  {
    id: "gan",
    name: "TimeGAN Stress Testing",
    topic: "GANs",
    depth: "MEDIUM (20%)",
    color: "#F59E0B",
    why: "Financial companies PAY for stress testing. Regulators REQUIRE it. Your TimeGAN generates realistic crash scenarios to test portfolio robustness. This is a standalone sellable feature.",
    deliverable: "Generates 1000+ realistic market scenarios including black swan events",
    production: [
      "Scenario library API — 'give me 100 2008-like crashes'",
      "Portfolio stress test report generator",
      "VaR (Value at Risk) estimation via Monte Carlo on synthetic data",
      "Regulatory compliance reports (Basel III style)",
      "Custom scenario builder (user defines crash parameters)",
    ],
    weeks: "Week 3-4 (Build + Validate)"
  },
  {
    id: "sentiment",
    name: "LLM Sentiment Engine",
    topic: "GPT-4 / LLM",
    depth: "MEDIUM (15%)",
    color: "#0EA5E9",
    why: "News moves markets. GPT-4 extracts actionable sentiment from financial news in real-time. This feeds the RL agent AND is independently useful as a signal API.",
    deliverable: "Real-time sentiment scores for 50+ stocks from news feeds",
    production: [
      "NewsAPI + FinViz RSS → GPT-4 sentiment pipeline",
      "Sentiment API endpoint per stock per hour",
      "Event detection (earnings, mergers, regulatory, macro)",
      "Sentiment trend dashboard",
      "Alert system for sentiment spikes",
    ],
    weeks: "Week 1 (Build), Always running thereafter"
  },
];

const researchModules = [
  {
    id: "nas",
    name: "NAS Policy Optimization",
    topic: "NAS",
    depth: "LIGHT",
    color: "#10B981",
    approach: "Run DARTS once to find optimal RL policy architecture. Compare NAS-found vs hand-designed. Include in thesis Chapter 5 as ablation study. 3-4 days of work.",
    thesisValue: "1 table + 1 figure in results section. Shows scientific rigor in architecture selection.",
  },
  {
    id: "fl",
    name: "Federated Learning Extension",
    topic: "FL",
    depth: "LIGHT",
    color: "#EC4899",
    approach: "Simulate 4 institutional clients with Flower. Show FedAvg improves over single-client. 3-4 days work. Privacy analysis with differential privacy.",
    thesisValue: "1 convergence plot + 1 privacy-utility curve. Novel angle for thesis contribution.",
  },
  {
    id: "quantum",
    name: "Quantum Benchmark",
    topic: "Quantum ML",
    depth: "MINIMAL",
    color: "#6366F1",
    approach: "2 days: Implement QAOA for 8-asset selection sub-problem in Qiskit. Compare vs classical. Include as 2-page section in thesis.",
    thesisValue: "1 comparison table. Shows breadth of knowledge. Drop-able if time is tight.",
  },
];

const sellingPoints = [
  {
    buyer: "Hedge Funds / Prop Trading",
    pain: "Need alpha generation with risk controls",
    solution: "RL agent with GNN market intelligence + stress testing",
    price: "$5K-50K/year SaaS",
    icon: "🏦"
  },
  {
    buyer: "Wealth Management Firms",
    pain: "Portfolio optimization for client accounts",
    solution: "Risk-adjusted portfolio allocation API + rebalancing",
    price: "$2K-20K/year per advisor",
    icon: "💼"
  },
  {
    buyer: "Risk / Compliance Teams",
    pain: "Regulatory stress testing (Basel III)",
    solution: "TimeGAN scenario generation + VaR reports",
    price: "$10K-100K/year",
    icon: "🛡️"
  },
  {
    buyer: "Fintech Startups",
    pain: "Need AI-powered features for retail investors",
    solution: "Sentiment API + portfolio recommendation engine",
    price: "$1K-10K/month API access",
    icon: "🚀"
  },
];

const timeline = [
  {
    week: "Week 1",
    title: "Data + Sentiment + Graph Foundation",
    core: true,
    tasks: [
      { task: "Project setup: Docker, FastAPI skeleton, PostgreSQL, repo structure", days: "D1-D2", critical: true },
      { task: "yfinance pipeline: 50 S&P 500 stocks, 10yr OHLCV, 20+ technical indicators", days: "D2-D3", critical: true },
      { task: "GPT-4 sentiment pipeline: NewsAPI → prompt → sentiment score per stock", days: "D3-D4", critical: true },
      { task: "Graph construction: sector + correlation + supply-chain edges (NetworkX)", days: "D4-D5", critical: true },
      { task: "T-GAT v1: 2-layer GAT in PyTorch Geometric, sanity check embeddings", days: "D5-D7", critical: true },
    ],
    milestone: "Working data pipeline + sentiment API + graph with 50 nodes producing embeddings"
  },
  {
    week: "Week 2",
    title: "Trading Environment + First RL Agent",
    core: true,
    tasks: [
      { task: "Custom Gymnasium env: state (graph embed + technicals + sentiment), action (portfolio weights), reward (Sharpe)", days: "D8-D10", critical: true },
      { task: "PPO agent v1: train on 2018-2023 data, validate on 2023-2024", days: "D10-D12", critical: true },
      { task: "Backtesting engine: transaction costs, slippage, realistic execution", days: "D12-D13", critical: true },
      { task: "First benchmark: PPO vs Buy-and-Hold vs Equal Weight", days: "D13-D14", critical: true },
    ],
    milestone: "RL agent that trades and beats buy-and-hold. First numbers on paper."
  },
  {
    week: "Week 3",
    title: "Agent Refinement + GAN",
    core: true,
    tasks: [
      { task: "SAC agent: implement, compare PPO vs SAC (pick winner)", days: "D15-D17", critical: true },
      { task: "Reward engineering: experiment with Sharpe, Sortino, Calmar variants", days: "D17-D18", critical: true },
      { task: "TimeGAN implementation: train on historical 128-step sequences", days: "D18-D20", critical: true },
      { task: "GAN validation: discriminative score, predictive score, t-SNE visual", days: "D20-D21", critical: true },
    ],
    milestone: "Best RL agent selected. TimeGAN generating realistic market data."
  },
  {
    week: "Week 4",
    title: "Stress Testing + Integration",
    core: true,
    tasks: [
      { task: "Conditional crash generation: 2008-like, COVID-like, flash crash modes", days: "D22-D24", critical: true },
      { task: "Stress test RL agent against synthetic crashes, measure robustness", days: "D24-D25", critical: true },
      { task: "Ablation study: RL with GNN vs without GNN (flat features)", days: "D25-D26", critical: true },
      { task: "Risk management layer: max drawdown stop, position limits, rebalancing", days: "D26-D28", critical: true },
    ],
    milestone: "CORE PRODUCT DONE. RL + GNN + GAN + Sentiment all working together."
  },
  {
    week: "Week 5",
    title: "Production API + Dashboard",
    core: true,
    tasks: [
      { task: "FastAPI production endpoints: /predict, /backtest, /stress-test, /sentiment", days: "D29-D31", critical: true },
      { task: "Next.js dashboard: portfolio performance, allocation heatmap, risk metrics", days: "D31-D33", critical: true },
      { task: "Real-time paper trading simulation (daily rebalancing loop)", days: "D33-D35", critical: true },
    ],
    milestone: "SELLABLE PRODUCT: Working API + Dashboard + Paper Trading"
  },
  {
    week: "Week 6",
    title: "Research Extensions (NAS + FL)",
    core: false,
    tasks: [
      { task: "DARTS NAS: find optimal policy architecture, compare vs hand-designed", days: "D36-D39", critical: false },
      { task: "Flower FL: 4 simulated clients, FedAvg, convergence + privacy analysis", days: "D39-D42", critical: false },
    ],
    milestone: "Thesis extras: NAS ablation table + FL convergence curves"
  },
  {
    week: "Week 7",
    title: "Quantum Benchmark + Full Benchmarks",
    core: false,
    tasks: [
      { task: "Qiskit QAOA: 8-asset selection, classical vs quantum comparison", days: "D43-D44", critical: false },
      { task: "Full benchmark suite: 9 baselines, all metrics, statistical significance tests", days: "D44-D47", critical: true },
      { task: "Generate all figures: performance curves, attention heatmaps, architecture diagrams", days: "D47-D49", critical: true },
    ],
    milestone: "All numbers ready for thesis. Complete benchmark tables."
  },
  {
    week: "Week 8",
    title: "Thesis Writing",
    core: false,
    tasks: [
      { task: "Chapter 1-2: Introduction + Literature Review", days: "D50-D52", critical: true },
      { task: "Chapter 3-4: Methodology + Implementation", days: "D52-D54", critical: true },
      { task: "Chapter 5-6: Results + Conclusion + References", days: "D54-D56", critical: true },
    ],
    milestone: "COMPLETE: Working Product + Thesis Draft + All Benchmarks"
  },
];

export default function RestructuredPlan() {
  const [tab, setTab] = useState("philosophy");
  const [expandedWeek, setExpandedWeek] = useState(null);

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      minHeight: "100vh", color: "#E2E8F0", padding: "20px"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{
          fontSize: "26px", fontWeight: 800, margin: "0 0 2px",
          background: "linear-gradient(135deg, #60A5FA, #22C55E)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          FINQUANT-NEXUS v2: Restructured
        </h1>
        <p style={{ color: "#64748B", fontSize: "13px", margin: "0 0 4px" }}>
          Core Product (Sellable) + Research Extensions (Thesis) — No Kichdi
        </p>
        <p style={{ color: "#F59E0B", fontSize: "12px", margin: 0, fontWeight: 600 }}>
          80% effort → 4 Core Modules (SELLABLE) | 20% effort → 3 Research Extras (THESIS)
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { id: "philosophy", label: "Why This Works" },
          { id: "core", label: "Core Product (80%)" },
          { id: "research", label: "Research Extras (20%)" },
          { id: "timeline", label: "8-Week Plan" },
          { id: "sell", label: "Who Buys This?" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "7px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
            background: tab === t.id ? "linear-gradient(135deg, #3B82F6, #22C55E)" : "rgba(255,255,255,0.04)",
            color: tab === t.id ? "white" : "#64748B", fontWeight: 600, fontSize: "12px"
          }}>{t.label}</button>
        ))}
      </div>

      {/* PHILOSOPHY */}
      {tab === "philosophy" && (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            padding: "20px", borderRadius: "12px", marginBottom: "16px",
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)"
          }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#EF4444" }}>
              Tera Concern Was 100% Valid
            </h3>
            <div style={{ fontSize: "13px", color: "#FCA5A5", lineHeight: 1.7 }}>
              Pehle wale plan mein 7 topics ko equal weightage de raha tha — that WOULD have become kichdi.
              NAS, FL, Quantum ko same depth pe implement karna = shallow everything, deep nothing.
              Financial company ko NAS ya Quantum nahi chahiye — unhe chahiye ki agent profitable ho aur risk managed ho.
            </div>
          </div>

          <div style={{
            padding: "20px", borderRadius: "12px", marginBottom: "16px",
            background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)"
          }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#22C55E" }}>
              v2 Fix: Clear Separation
            </h3>
            {[
              { label: "CORE PRODUCT (80% effort, Week 1-5)", desc: "Deep RL + GNN + GAN + Sentiment → This is what you SELL. Production-grade, API-ready, dashboard included. A financial company pays for THIS.", color: "#22C55E" },
              { label: "RESEARCH EXTRAS (20% effort, Week 6-7)", desc: "NAS + FL + Quantum → Light implementations ONLY for thesis depth. 3-4 days each. Ablation tables and comparison figures. Thesis committee gets impressed, but the product doesn't depend on these.", color: "#A78BFA" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "12px", borderRadius: "8px", marginBottom: "8px",
                background: "rgba(0,0,0,0.2)", borderLeft: `3px solid ${item.color}`
              }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: item.color }}>{item.label}</div>
                <div style={{ fontSize: "12px", color: "#CBD5E1", marginTop: "4px", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: "20px", borderRadius: "12px",
            background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)"
          }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#60A5FA" }}>
              The Key Insight
            </h3>
            <div style={{ fontSize: "14px", color: "#93C5FD", lineHeight: 1.7 }}>
              Agar Week 5 ke baad tu sab kuch ruk jaye — tere paas phir bhi ek <span style={{fontWeight: 700, color: "#22C55E"}}>working, sellable product</span> hoga. 
              NAS/FL/Quantum sirf thesis mein bonus hain. Core product independently complete hai Week 5 tak.
              <br/><br/>
              Yahi fark hai kichdi aur smart architecture mein — <span style={{fontWeight: 700, color: "#F59E0B"}}>core is untouchable, extras are optional layers.</span>
            </div>
          </div>
        </div>
      )}

      {/* CORE PRODUCT */}
      {tab === "core" && (
        <div style={{ maxWidth: "750px", margin: "0 auto" }}>
          <div style={{
            padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
            background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "13px", color: "#22C55E", fontWeight: 700 }}>
              These 4 modules = Complete sellable product by Week 5
            </span>
          </div>

          {coreModules.map(m => (
            <div key={m.id} style={{
              marginBottom: "12px", borderRadius: "12px", overflow: "hidden",
              background: "rgba(255,255,255,0.02)", border: `1px solid ${m.color}33`
            }}>
              <div style={{
                padding: "12px 16px",
                background: `linear-gradient(135deg, ${m.color}15, transparent)`,
                borderBottom: `1px solid ${m.color}22`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: m.color }}>{m.name}</span>
                    <span style={{
                      marginLeft: "8px", padding: "2px 8px", borderRadius: "10px", fontSize: "10px",
                      background: `${m.color}22`, color: m.color, fontWeight: 600
                    }}>{m.topic}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>{m.depth}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>{m.weeks}</div>
              </div>

              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontSize: "12px", color: "#CBD5E1", lineHeight: 1.5, marginBottom: "10px" }}>
                  <span style={{ fontWeight: 700, color: m.color }}>WHY: </span>{m.why}
                </div>
                <div style={{
                  fontSize: "12px", padding: "8px 10px", borderRadius: "6px", marginBottom: "10px",
                  background: "rgba(34,197,94,0.08)", borderLeft: "3px solid #22C55E"
                }}>
                  <span style={{ fontWeight: 700, color: "#22C55E" }}>DELIVERABLE: </span>
                  <span style={{ color: "#86EFAC" }}>{m.deliverable}</span>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>
                  PRODUCTION FEATURES:
                </div>
                {m.production.map((p, i) => (
                  <div key={i} style={{ fontSize: "11px", color: "#94A3B8", padding: "2px 0", display: "flex", gap: "6px" }}>
                    <span style={{ color: m.color }}>▸</span> {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESEARCH EXTRAS */}
      {tab === "research" && (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
            background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "13px", color: "#A78BFA", fontWeight: 700 }}>
              These are THESIS BONUSES — product works 100% without them
            </span>
          </div>

          {researchModules.map(m => (
            <div key={m.id} style={{
              padding: "14px", borderRadius: "10px", marginBottom: "10px",
              background: "rgba(255,255,255,0.02)", border: `1px solid ${m.color}22`,
              borderLeft: `3px solid ${m.color}`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: m.color }}>{m.name}</span>
                <span style={{
                  padding: "2px 8px", borderRadius: "10px", fontSize: "10px",
                  background: `${m.color}22`, color: m.color, fontWeight: 600
                }}>{m.depth} — {m.topic}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#CBD5E1", lineHeight: 1.5, marginBottom: "6px" }}>
                <span style={{ fontWeight: 700, color: "#94A3B8" }}>Approach: </span>{m.approach}
              </div>
              <div style={{
                fontSize: "11px", padding: "6px 10px", borderRadius: "6px",
                background: "rgba(167,139,250,0.08)"
              }}>
                <span style={{ fontWeight: 700, color: "#A78BFA" }}>Thesis Value: </span>
                <span style={{ color: "#C4B5FD" }}>{m.thesisValue}</span>
              </div>
            </div>
          ))}

          <div style={{
            padding: "14px", borderRadius: "10px", marginTop: "16px",
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)"
          }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F59E0B", marginBottom: "6px" }}>
              Safety Net: Drop Priority
            </div>
            <div style={{ fontSize: "12px", color: "#FCD34D", lineHeight: 1.5 }}>
              If time is tight: Drop Quantum first (2 days saved) → Drop FL next (4 days saved) → Keep NAS (it directly improves core product).
              Even with ALL three dropped, you still have a complete product + thesis with 4 deep topics.
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      {tab === "timeline" && (
        <div style={{ maxWidth: "750px", margin: "0 auto" }}>
          {timeline.map((w, i) => (
            <div key={i}
              onClick={() => setExpandedWeek(expandedWeek === i ? null : i)}
              style={{
                marginBottom: "8px", borderRadius: "10px", cursor: "pointer",
                background: w.core ? "rgba(34,197,94,0.04)" : "rgba(167,139,250,0.04)",
                border: `1px solid ${w.core ? "rgba(34,197,94,0.1)" : "rgba(167,139,250,0.1)"}`,
                overflow: "hidden"
              }}>
              <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 800,
                    background: w.core ? "rgba(34,197,94,0.15)" : "rgba(167,139,250,0.15)",
                    color: w.core ? "#22C55E" : "#A78BFA"
                  }}>{w.week}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#E2E8F0" }}>{w.title}</div>
                    <div style={{
                      fontSize: "10px", fontWeight: 600,
                      color: w.core ? "#22C55E" : "#A78BFA"
                    }}>{w.core ? "CORE PRODUCT" : "RESEARCH / THESIS"}</div>
                  </div>
                </div>
                <span style={{ color: "#64748B" }}>{expandedWeek === i ? "▲" : "▼"}</span>
              </div>

              {expandedWeek === i && (
                <div style={{ padding: "0 16px 12px" }}>
                  {w.tasks.map((t, j) => (
                    <div key={j} style={{
                      display: "flex", gap: "8px", padding: "4px 0", fontSize: "12px",
                      alignItems: "start"
                    }}>
                      <span style={{
                        flexShrink: 0, padding: "1px 6px", borderRadius: "4px", fontSize: "10px",
                        background: "rgba(255,255,255,0.05)", color: "#64748B", fontWeight: 600
                      }}>{t.days}</span>
                      <span style={{ color: t.critical ? "#CBD5E1" : "#94A3B8" }}>{t.task}</span>
                    </div>
                  ))}
                  <div style={{
                    marginTop: "8px", padding: "8px 10px", borderRadius: "6px",
                    background: "rgba(245,158,11,0.08)", borderLeft: "3px solid #F59E0B"
                  }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#F59E0B" }}>MILESTONE: </span>
                    <span style={{ fontSize: "11px", color: "#FCD34D" }}>{w.milestone}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div style={{
            marginTop: "12px", padding: "14px", borderRadius: "10px", textAlign: "center",
            background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.1))",
            border: "1px solid rgba(34,197,94,0.2)"
          }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#22C55E" }}>
              Week 5 End = PRODUCT COMPLETE
            </div>
            <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
              Even if you stop here, you have a working, sellable system. Week 6-8 are bonus.
            </div>
          </div>
        </div>
      )}

      {/* SELL */}
      {tab === "sell" && (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            padding: "14px", borderRadius: "10px", marginBottom: "16px", textAlign: "center",
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)"
          }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#F59E0B" }}>
              4 Real Revenue Streams from This Product
            </div>
          </div>

          {sellingPoints.map((s, i) => (
            <div key={i} style={{
              padding: "16px", borderRadius: "10px", marginBottom: "10px",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "start" }}>
                  <span style={{ fontSize: "24px" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#E2E8F0" }}>{s.buyer}</div>
                    <div style={{ fontSize: "12px", color: "#EF4444", marginTop: "2px" }}>
                      Pain: {s.pain}
                    </div>
                    <div style={{ fontSize: "12px", color: "#22C55E", marginTop: "2px" }}>
                      Solution: {s.solution}
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700,
                  background: "rgba(34,197,94,0.12)", color: "#22C55E", whiteSpace: "nowrap"
                }}>{s.price}</div>
              </div>
            </div>
          ))}

          <div style={{
            padding: "16px", borderRadius: "10px", marginTop: "12px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(34,197,94,0.08))",
            border: "1px solid rgba(59,130,246,0.2)"
          }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#60A5FA", marginBottom: "8px" }}>
              What Makes This Sellable (vs Academic Toy)
            </div>
            {[
              "FastAPI endpoints — plug into any existing system via REST API",
              "Risk management layer — financial companies won't touch anything without this",
              "Backtesting with transaction costs — shows realistic, not theoretical, returns",
              "Stress testing reports — regulators literally require this (Basel III)",
              "Dashboard — decision makers need visual, not terminal output",
              "Paper trading mode — prove it works before going live",
              "Docker deployment — one command to run everything",
            ].map((p, i) => (
              <div key={i} style={{ fontSize: "12px", color: "#93C5FD", padding: "3px 0", display: "flex", gap: "6px" }}>
                <span style={{ color: "#3B82F6" }}>✦</span> {p}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
