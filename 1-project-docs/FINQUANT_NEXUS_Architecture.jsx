import { useState } from "react";

const modules = [
  {
    id: "data",
    name: "Data Pipeline",
    tech: "yfinance + NewsAPI + GPT-4 API",
    color: "#0EA5E9",
    x: 50, y: 8, w: 26, h: 14,
    topics: ["GPT-4"],
    desc: "Market OHLCV data (50 S&P 500 stocks, 10yr), macro indicators (FRED), financial news sentiment via GPT-4 API, technical indicators (RSI, MACD, Bollinger, Volume). Zero VRAM — GPT-4 runs via API.",
    week: "Week 1"
  },
  {
    id: "graph",
    name: "Graph Engine (T-GAT)",
    tech: "PyTorch Geometric",
    color: "#8B5CF6",
    x: 12, y: 30, w: 26, h: 14,
    topics: ["GNN"],
    desc: "Temporal Graph Attention Network: stocks = nodes, edges = sector + correlation + supply-chain. 2-layer GAT with time-varying attention weights. Outputs 64-dim graph embeddings per asset. Mini-batched via NeighborSampler for 4GB VRAM.",
    week: "Week 1-2"
  },
  {
    id: "gan",
    name: "Synthetic Engine",
    tech: "TimeGAN (PyTorch)",
    color: "#F59E0B",
    x: 62, y: 30, w: 26, h: 14,
    topics: ["GANs"],
    desc: "Conditional TimeGAN generates realistic 128-step market sequences. Three modes: normal markets, crash scenarios (2008-like, COVID-like), flash crashes. Validates via discriminative score (<0.3) and predictive score (<0.15). FP16 training.",
    week: "Week 3-4"
  },
  {
    id: "rl",
    name: "Deep RL Agent",
    tech: "PPO/SAC (Stable-Baselines3)",
    color: "#EF4444",
    x: 28, y: 52, w: 22, h: 14,
    topics: ["Deep RL", "RL"],
    desc: "Core trading agent. State = T-GAT embeddings + technicals + sentiment. Action = portfolio weights (continuous). Reward = Sharpe ratio. PPO (primary) and SAC (comparison). Trained on real + synthetic data. Curriculum learning for stability.",
    week: "Week 3-4"
  },
  {
    id: "nas",
    name: "NAS Module",
    tech: "DARTS (nni)",
    color: "#10B981",
    x: 55, y: 52, w: 22, h: 14,
    topics: ["NAS"],
    desc: "Differentiable Architecture Search auto-discovers optimal RL policy network. Search space: layer count, hidden units, attention heads, skip connections, graph conv layers. DARTS is efficient — runs on single GPU. Finds architecture in ~6hrs on RTX 3050.",
    week: "Week 5-6"
  },
  {
    id: "fed",
    name: "Federated Layer",
    tech: "Flower (flwr)",
    color: "#EC4899",
    x: 8, y: 52, w: 18, h: 14,
    topics: ["FL"],
    desc: "4-6 simulated institutional clients, each with different stock subsets and risk profiles. FedAvg + FedProx aggregation. Differential privacy (DP-SGD). Demonstrates 15-25% performance boost without sharing raw trading data. Privacy-utility tradeoff analysis.",
    week: "Week 5-6"
  },
  {
    id: "quantum",
    name: "Quantum Benchmark",
    tech: "Qiskit (QAOA)",
    color: "#6366F1",
    x: 80, y: 52, w: 18, h: 14,
    topics: ["Quantum ML"],
    desc: "QAOA for asset selection sub-problem (8-15 assets). Runs on CPU via Qiskit simulator. Benchmarks quantum vs classical brute-force and vs RL agent. One of first direct comparisons at realistic portfolio sizes. ~2 days implementation.",
    week: "Week 7"
  },
  {
    id: "dash",
    name: "Dashboard",
    tech: "Next.js 14 + Recharts",
    color: "#64748B",
    x: 35, y: 76, w: 30, h: 12,
    topics: [],
    desc: "Interactive web dashboard: portfolio performance, asset allocation heatmap, graph visualization, FL convergence curves, GAN quality metrics, NAS architecture topology, quantum vs classical comparison. Real-time backtesting controls.",
    week: "Week 7"
  },
];

const connections = [
  { from: "data", to: "graph", label: "Features" },
  { from: "data", to: "gan", label: "Sequences" },
  { from: "graph", to: "rl", label: "Embeddings" },
  { from: "gan", to: "rl", label: "Synthetic Data" },
  { from: "nas", to: "rl", label: "Optimal Arch" },
  { from: "fed", to: "rl", label: "Aggregated Model" },
  { from: "quantum", to: "dash", label: "Benchmark" },
  { from: "rl", to: "dash", label: "Portfolio" },
];

const topicColors = {
  "GPT-4": "#0EA5E9",
  "GNN": "#8B5CF6",
  "GANs": "#F59E0B",
  "Deep RL": "#EF4444",
  "RL": "#DC2626",
  "NAS": "#10B981",
  "FL": "#EC4899",
  "Quantum ML": "#6366F1"
};

const weekPlan = [
  { week: "Week 1-2", title: "Foundation & Data", tasks: ["Project setup + Docker", "yfinance pipeline (50 stocks)", "GPT-4 sentiment pipeline", "Custom Gym environment", "T-GAT v1 in PyG"], color: "#0EA5E9" },
  { week: "Week 3-4", title: "Core RL + GANs", tasks: ["PPO agent training", "SAC comparison", "TimeGAN implementation", "Crash scenario generation", "Ablation: GNN impact"], color: "#EF4444" },
  { week: "Week 5-6", title: "NAS + Federated", tasks: ["DARTS search space", "Architecture evaluation", "Flower FL setup (4 clients)", "FedAvg vs FedProx", "Privacy analysis (DP)"], color: "#10B981" },
  { week: "Week 7", title: "Quantum + Integration", tasks: ["Qiskit QAOA implementation", "Full pipeline integration", "Next.js dashboard", "End-to-end testing"], color: "#6366F1" },
  { week: "Week 8", title: "Thesis + Benchmarks", tasks: ["6 baseline comparisons", "Ablation studies", "Thesis writing (6 chapters)", "Final documentation"], color: "#F59E0B" },
];

export default function FinQuantNexus() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("architecture");

  const selectedModule = modules.find(m => m.id === selected);

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      minHeight: "100vh",
      color: "#E2E8F0",
      padding: "24px"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ 
          fontSize: "32px", fontWeight: 800, 
          background: "linear-gradient(135deg, #60A5FA, #A78BFA, #F472B6)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          margin: 0, letterSpacing: "-0.5px"
        }}>
          FINQUANT-NEXUS
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "14px", margin: "4px 0 16px" }}>
          Federated Multi-Agent Deep RL for Adaptive Portfolio Optimization with Graph Neural Network Market Intelligence
        </p>
        
        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {["architecture", "timeline", "metrics"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "8px 20px", borderRadius: "8px", border: "none",
              background: view === v ? "linear-gradient(135deg, #3B82F6, #8B5CF6)" : "rgba(255,255,255,0.05)",
              color: view === v ? "white" : "#94A3B8",
              fontWeight: 600, fontSize: "13px", cursor: "pointer",
              transition: "all 0.2s"
            }}>
              {v === "architecture" ? "Architecture" : v === "timeline" ? "8-Week Plan" : "Metrics & Topics"}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Legend */}
      <div style={{ 
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", 
        marginBottom: "20px", padding: "12px", borderRadius: "10px",
        background: "rgba(255,255,255,0.03)"
      }}>
        {Object.entries(topicColors).map(([topic, color]) => (
          <span key={topic} style={{
            padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
            background: `${color}22`, color: color, border: `1px solid ${color}44`
          }}>
            {topic}
          </span>
        ))}
      </div>

      {/* ARCHITECTURE VIEW */}
      {view === "architecture" && (
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 600px", position: "relative", minHeight: "520px" }}>
            <svg viewBox="0 0 100 95" style={{ width: "100%", height: "100%" }}>
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                  <path d="M0,0 L6,2 L0,4" fill="#475569" />
                </marker>
              </defs>
              
              {/* Connection lines */}
              {connections.map((c, i) => {
                const f = modules.find(m => m.id === c.from);
                const t = modules.find(m => m.id === c.to);
                const fx = f.x + f.w/2, fy = f.y + f.h;
                const tx = t.x + t.w/2, ty = t.y;
                const my = (fy + ty) / 2;
                return (
                  <g key={i}>
                    <path d={`M${fx},${fy} C${fx},${my} ${tx},${my} ${tx},${ty}`}
                      fill="none" stroke="#334155" strokeWidth="0.4" markerEnd="url(#arrow)" strokeDasharray="1.5,1" />
                    <text x={(fx+tx)/2} y={my-1} textAnchor="middle" fill="#64748B" fontSize="2.2" fontWeight="500">
                      {c.label}
                    </text>
                  </g>
                );
              })}
              
              {/* Module boxes */}
              {modules.map(m => (
                <g key={m.id} onClick={() => setSelected(m.id === selected ? null : m.id)} 
                   style={{ cursor: "pointer" }}>
                  <rect x={m.x} y={m.y} width={m.w} height={m.h} rx="1.5"
                    fill={selected === m.id ? `${m.color}33` : "#1E293B"}
                    stroke={m.color} strokeWidth={selected === m.id ? "0.6" : "0.3"}
                    opacity={selected && selected !== m.id ? 0.4 : 1}
                  />
                  <rect x={m.x} y={m.y} width={m.w} height="3.5" rx="1.5"
                    fill={m.color} opacity="0.8"
                  />
                  <text x={m.x + m.w/2} y={m.y + 2.5} textAnchor="middle" fill="white" 
                    fontSize="2.4" fontWeight="700">{m.name}</text>
                  <text x={m.x + m.w/2} y={m.y + 6.5} textAnchor="middle" fill="#94A3B8" 
                    fontSize="1.9">{m.tech}</text>
                  <text x={m.x + m.w/2} y={m.y + 9.5} textAnchor="middle" fill={m.color} 
                    fontSize="1.8" fontWeight="600">{m.topics.join(" + ") || "Full Stack"}</text>
                  <text x={m.x + m.w/2} y={m.y + 12} textAnchor="middle" fill="#64748B" 
                    fontSize="1.6">{m.week}</text>
                </g>
              ))}
            </svg>
          </div>

          {/* Detail Panel */}
          <div style={{ 
            flex: "0 0 280px", padding: "16px", borderRadius: "12px",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
          }}>
            {selectedModule ? (
              <>
                <div style={{ 
                  padding: "8px 12px", borderRadius: "8px", marginBottom: "12px",
                  background: `${selectedModule.color}15`, borderLeft: `3px solid ${selectedModule.color}`
                }}>
                  <h3 style={{ margin: 0, fontSize: "16px", color: selectedModule.color }}>{selectedModule.name}</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94A3B8" }}>{selectedModule.tech}</p>
                </div>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#CBD5E1" }}>{selectedModule.desc}</p>
                <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {selectedModule.topics.map(t => (
                    <span key={t} style={{
                      padding: "3px 10px", borderRadius: "12px", fontSize: "11px",
                      background: `${topicColors[t]}22`, color: topicColors[t], fontWeight: 600
                    }}>{t}</span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 10px", color: "#64748B" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>👆</div>
                <p style={{ fontSize: "13px" }}>Click any module to see details, tech choices, and VRAM optimization strategy</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TIMELINE VIEW */}
      {view === "timeline" && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {weekPlan.map((w, i) => (
            <div key={i} style={{ 
              display: "flex", gap: "16px", marginBottom: "16px",
              padding: "16px", borderRadius: "12px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{ 
                flex: "0 0 90px", textAlign: "center", padding: "10px",
                borderRadius: "10px", background: `${w.color}15`
              }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: w.color }}>{w.week}</div>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>{w.title}</div>
              </div>
              <div style={{ flex: 1 }}>
                {w.tasks.map((t, j) => (
                  <div key={j} style={{ 
                    display: "flex", alignItems: "center", gap: "8px", 
                    padding: "4px 0", fontSize: "13px", color: "#CBD5E1"
                  }}>
                    <span style={{ 
                      width: "6px", height: "6px", borderRadius: "50%", 
                      background: w.color, flexShrink: 0 
                    }}/>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* GPU Strategy */}
          <div style={{ 
            padding: "16px", borderRadius: "12px", marginTop: "8px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)"
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#EF4444" }}>
              RTX 3050 (4GB VRAM) Survival Strategy
            </h3>
            {["FP16 mixed precision → ~40% VRAM savings", "Gradient accumulation (micro-batch 16 → effective 128)", "Graph NeighborSampler: 2-hop, 15 neighbors max", "GPT-4 via API = 0 VRAM, Qiskit on CPU", "TimeGAN: 128-step sequences, 64-dim latent"].map((s, i) => (
              <div key={i} style={{ fontSize: "12px", color: "#FCA5A5", padding: "2px 0", display: "flex", gap: "6px" }}>
                <span style={{ color: "#EF4444" }}>▸</span> {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* METRICS VIEW */}
      {view === "metrics" && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Target Metrics */}
          <div style={{ 
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
            gap: "10px", marginBottom: "20px"
          }}>
            {[
              { label: "Sharpe Ratio", target: "> 1.5", icon: "📊" },
              { label: "Max Drawdown", target: "< 15%", icon: "📉" },
              { label: "Annual Return", target: "> 15%", icon: "💰" },
              { label: "Win Rate", target: "> 55%", icon: "🎯" },
              { label: "Sortino Ratio", target: "> 2.0", icon: "⚡" },
              { label: "FL Improvement", target: "15-25%", icon: "🤝" },
            ].map((m, i) => (
              <div key={i} style={{ 
                padding: "14px", borderRadius: "10px", textAlign: "center",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
              }}>
                <div style={{ fontSize: "22px" }}>{m.icon}</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#60A5FA" }}>{m.target}</div>
                <div style={{ fontSize: "11px", color: "#94A3B8" }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Baselines */}
          <h3 style={{ fontSize: "15px", color: "#A78BFA", margin: "0 0 10px" }}>9 Baseline Comparisons</h3>
          <div style={{ 
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "20px" 
          }}>
            {[
              "Equal Weight (1/N)", "Markowitz MVO", "Risk Parity", "Black-Litterman",
              "S&P 500 Buy & Hold", "DRL (no GNN) — Ablation", "DRL (no NAS) — Ablation",
              "DRL (no FL) — Ablation", "DRL (no GAN) — Ablation"
            ].map((b, i) => (
              <div key={i} style={{ 
                padding: "8px 12px", borderRadius: "6px", fontSize: "12px",
                background: i >= 5 ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
                color: i >= 5 ? "#FCA5A5" : "#CBD5E1",
                border: `1px solid ${i >= 5 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)"}`
              }}>
                {b}
              </div>
            ))}
          </div>

          {/* Thesis Chapters */}
          <h3 style={{ fontSize: "15px", color: "#F472B6", margin: "0 0 10px" }}>Thesis: 6 Chapters, 80-100 Pages</h3>
          {[
            { ch: "Ch 1", title: "Introduction", pages: "8-10 pages" },
            { ch: "Ch 2", title: "Literature Review (60-80 papers)", pages: "15-18 pages" },
            { ch: "Ch 3", title: "Proposed Methodology", pages: "20-25 pages" },
            { ch: "Ch 4", title: "Implementation Details", pages: "12-15 pages" },
            { ch: "Ch 5", title: "Results & Ablation Studies", pages: "18-22 pages" },
            { ch: "Ch 6", title: "Conclusion & Future Work", pages: "5-6 pages" },
          ].map((c, i) => (
            <div key={i} style={{ 
              display: "flex", justifyContent: "space-between", padding: "8px 12px",
              borderRadius: "6px", marginBottom: "4px",
              background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"
            }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ color: "#F472B6", fontWeight: 700 }}>{c.ch}</span>
                <span style={{ color: "#CBD5E1", marginLeft: "8px" }}>{c.title}</span>
              </span>
              <span style={{ fontSize: "12px", color: "#64748B" }}>{c.pages}</span>
            </div>
          ))}

          {/* Why God Tier */}
          <div style={{ 
            marginTop: "20px", padding: "16px", borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(139,92,246,0.2)"
          }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "15px", color: "#A78BFA" }}>Why This is God-Tier</h3>
            {[
              "7/8 topics naturally integrated (not forced)",
              "Solves a real $100T+ AUM industry problem",
              "5 independent publishable contributions",
              "Interview ammunition for 7 different ML topics",
              "Opens doors: hedge funds, trading firms, FAANG, fintech",
              "Production-grade: API + Dashboard + Docker + MLflow",
              "No existing paper/system combines all 7 techniques"
            ].map((r, i) => (
              <div key={i} style={{ fontSize: "12px", color: "#C4B5FD", padding: "3px 0", display: "flex", gap: "8px" }}>
                <span style={{ color: "#A78BFA" }}>✦</span> {r}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
