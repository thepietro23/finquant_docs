import { useState } from "react";

// ===================== DATA =====================

const projectMeta = {
  name: "FINQUANT-NEXUS v4",
  tagline: "Self-Optimizing Federated Portfolio Intelligence Platform",
  subtitle: "7 AI/ML Techniques × Production Grade × Academic Rigor",
  stats: {
    topics: 7,
    dailyHours: "8+",
    weeks: 8,
    totalHours: "~450+",
    modules: 7,
    apis: 12,
    dashViews: 8,
  }
};

const modules = [
  {
    id: "gnn",
    name: "Graph Neural Network Market Engine",
    topic: "GNN",
    role: "Captures how stocks influence each other — sector, supply-chain, correlation edges",
    depth: "PRODUCT-GRADE",
    effort: "15%",
    color: "#8B5CF6",
    week: "W1",
    vram: "~1.2GB (FP16)",
    productFeatures: [
      "Dynamic market graph: 50 stocks, ~200+ edges, rebuilt daily",
      "T-GAT (Temporal Graph Attention): 2-layer, multi-head attention, time-varying weights",
      "API: /graph/embeddings — 64-dim per stock, used by RL + Dashboard",
      "API: /graph/attention — heatmap showing which stocks influence which",
      "API: /graph/regime — detects bull↔bear transition via graph structure change",
      "Dashboard: Interactive graph visualization with attention weights on edges",
    ],
    learnFirst: [
      "What is a graph? (nodes, edges, adjacency matrix)",
      "Message Passing: how nodes aggregate neighbor information",
      "GAT (Graph Attention Network): attention mechanism on graph edges",
      "PyTorch Geometric basics: Data object, DataLoader, NeighborSampler",
    ],
    whyProduct: "No competitor models stock relationships as dynamic graphs. Bloomberg, FinRL — all use flat feature vectors. This is your MOAT.",
    thesis: "Chapter 3.1: T-GAT architecture. Chapter 5.2: Ablation (with GNN vs without)",
  },
  {
    id: "rl",
    name: "Deep RL Trading Agent",
    topic: "Deep RL + RL",
    role: "Core brain — learns optimal portfolio allocation through trial and error",
    depth: "PRODUCT-GRADE",
    effort: "25%",
    color: "#EF4444",
    week: "W2-W3",
    vram: "~800MB",
    productFeatures: [
      "Custom Gym environment: state=GNN_embed+technicals+sentiment, action=portfolio_weights",
      "PPO agent (primary): on-policy, stable, good for continuous action spaces",
      "SAC agent (comparison): off-policy, sample efficient, entropy regularization",
      "Reward function: Sharpe ratio with drawdown penalty + turnover penalty",
      "Risk management layer: max position 20%, stop-loss, max drawdown circuit breaker",
      "API: /trade/predict — returns optimal portfolio weights",
      "API: /trade/backtest — runs strategy on any date range with realistic costs",
      "Paper trading mode: daily rebalancing simulation with live data",
      "Dashboard: portfolio performance, daily P&L, allocation pie chart, trade log",
    ],
    learnFirst: [
      "MDP: State, Action, Reward, Transition — formulation for trading",
      "Policy Gradient: how agent learns from rewards",
      "PPO: clipping, advantage estimation, why it's stable",
      "SAC: entropy term, twin Q-networks, reparameterization trick",
      "Gym environment: step(), reset(), observation_space, action_space",
    ],
    whyProduct: "THIS is what companies pay for. An agent that makes money with controlled risk. Everything else supports this module.",
    thesis: "Chapter 2.3: RL literature. Chapter 3.2: MDP formulation + reward design. Chapter 5.1: PPO vs SAC comparison",
  },
  {
    id: "gan",
    name: "TimeGAN Stress Testing Engine",
    topic: "GANs",
    role: "Generates realistic synthetic market data + simulates crash scenarios for stress testing",
    depth: "PRODUCT-GRADE",
    effort: "15%",
    color: "#F59E0B",
    week: "W3-W4",
    vram: "~600MB",
    productFeatures: [
      "TimeGAN: embedding + recovery + sequence generation + discrimination networks",
      "Conditional generation: normal markets, 2008-crash, COVID-crash, flash crash modes",
      "Quality validation: discriminative score (<0.3), predictive score (<0.15), t-SNE",
      "API: /stress/generate — generates N synthetic market scenarios of type X",
      "API: /stress/test — runs RL agent against synthetic crashes, returns survival metrics",
      "API: /stress/var — Value-at-Risk estimation via Monte Carlo on synthetic data",
      "Scenario library: pre-generated 1000+ scenarios for quick access",
      "Dashboard: synthetic vs real distribution comparison, stress test survival reports",
    ],
    learnFirst: [
      "GAN basics: Generator vs Discriminator, minimax game",
      "Why vanilla GAN fails for time-series (no temporal structure)",
      "TimeGAN: 4 networks (embedder, recovery, generator, discriminator)",
      "Conditional generation: how to control what the GAN outputs",
      "Evaluation: discriminative score, predictive score concepts",
    ],
    whyProduct: "Regulators (Basel III, RBI) REQUIRE stress testing. Banks pay millions for this. Your tool does it with AI at fraction of cost.",
    thesis: "Chapter 3.3: TimeGAN architecture. Chapter 5.3: GAN quality + stress test results",
  },
  {
    id: "nas",
    name: "NAS AutoML Engine",
    topic: "Neural Architecture Search",
    role: "Automatically discovers optimal neural network architectures for EVERY model in the pipeline",
    depth: "PRODUCT-GRADE",
    effort: "15%",
    color: "#10B981",
    week: "W4-W5",
    vram: "~1.5GB",
    productFeatures: [
      "DARTS (Differentiable Architecture Search) for RL policy network optimization",
      "Search space: layer count (2-6), hidden dims (32-256), attention heads (1-8), skip connections",
      "Auto-optimize GNN architecture: number of GAT layers, aggregation type, embedding dim",
      "NAS report: top-3 architectures discovered, performance comparison vs hand-designed",
      "API: /nas/optimize — takes any model config, returns optimized architecture",
      "API: /nas/report — architecture comparison with training curves",
      "Dashboard: architecture topology visualization, search progress, performance comparison",
      "One-click re-optimization: market regime changes → NAS finds new optimal architecture",
    ],
    learnFirst: [
      "What is NAS? Why hand-designing networks is suboptimal",
      "Search space: what architectural choices can NAS explore",
      "DARTS: continuous relaxation, bilevel optimization",
      "Weight sharing: how supernet avoids training each architecture from scratch",
      "Evaluation: retraining top architectures from scratch for fair comparison",
    ],
    whyProduct: "This makes your system SELF-IMPROVING. Market changes → NAS finds new optimal architecture → system adapts. This is AutoML for finance — a real product.",
    thesis: "Chapter 3.4: DARTS search space design. Chapter 5.4: NAS vs hand-designed comparison",
  },
  {
    id: "fl",
    name: "Federated Learning Platform",
    topic: "Federated Learning",
    role: "Enables multiple institutions to collaboratively improve models WITHOUT sharing private trading data",
    depth: "PRODUCT-GRADE",
    effort: "15%",
    color: "#EC4899",
    week: "W5-W6",
    vram: "~800MB (sequential clients)",
    productFeatures: [
      "Flower-based FL server: orchestrates training across institutional clients",
      "4-6 simulated hedge funds: different stock universes, different risk profiles, different data",
      "FedAvg aggregation: simple averaging of model weights",
      "FedProx: handles non-IID data (each institution has different stocks)",
      "Differential Privacy (DP-SGD): add noise to gradients, configurable privacy budget (epsilon)",
      "API: /fl/join — institution registers as federated client",
      "API: /fl/status — training progress, convergence metrics, privacy budget remaining",
      "API: /fl/compare — federated model vs individual model performance comparison",
      "Dashboard: FL convergence curves, client contribution heatmap, privacy-utility tradeoff chart",
      "Privacy guarantee: mathematically proven data privacy via DP (epsilon-delta framework)",
    ],
    learnFirst: [
      "Why FL? The problem of data silos in finance (banks can't share client data)",
      "FedAvg: how local training + weight averaging works",
      "Non-IID data: why finance data across institutions is heterogeneous",
      "FedProx: proximal term to handle data heterogeneity",
      "Differential Privacy: epsilon budget, noise injection, privacy guarantee",
      "Flower framework: client/server architecture, strategy pattern",
    ],
    whyProduct: "Post-GDPR/RBI data privacy laws, NO financial company can share raw data. FL is the ONLY way to collaborate. First-mover advantage is massive.",
    thesis: "Chapter 3.5: FL protocol + privacy framework. Chapter 5.5: FedAvg vs FedProx + privacy-utility curve",
  },
  {
    id: "quantum",
    name: "Quantum-Classical Hybrid Optimizer",
    topic: "Quantum ML",
    role: "Uses quantum computing for portfolio optimization sub-problems that are classically intractable",
    depth: "PRODUCT-GRADE",
    effort: "10%",
    color: "#6366F1",
    week: "W6-W7",
    vram: "0 (CPU only — Qiskit simulator)",
    productFeatures: [
      "QAOA (Quantum Approximate Optimization Algorithm) for combinatorial asset selection",
      "Hybrid VQC (Variational Quantum Circuit): quantum layer + classical optimizer in training loop",
      "Portfolio selection: given 30 stocks, find optimal 8-12 stock subset (NP-hard classically)",
      "Benchmark suite: quantum vs classical brute-force vs greedy vs RL-based selection",
      "API: /quantum/optimize — takes covariance matrix, returns optimal asset subset",
      "API: /quantum/compare — side-by-side quantum vs classical results + runtime comparison",
      "Dashboard: quantum circuit visualization, qubit state evolution, approximation ratio charts",
      "Configurable: qubit count (4-16), circuit depth, QAOA layers (p parameter)",
    ],
    learnFirst: [
      "Quantum computing basics: qubits, superposition, entanglement (conceptual only)",
      "Variational Quantum Eigensolver (VQE) concept: parameterized circuits + classical optimizer",
      "QAOA: how it solves combinatorial optimization problems",
      "Qiskit basics: QuantumCircuit, Parameter, AerSimulator",
      "Hybrid training loop: quantum circuit forward pass → classical gradient update",
    ],
    whyProduct: "Quantum computing is coming. Companies that have quantum-ready optimization NOW will dominate in 3-5 years. This is future-proofing as a service.",
    thesis: "Chapter 3.6: QAOA + VQC design. Chapter 5.6: Quantum vs classical comparison at different portfolio sizes",
  },
  {
    id: "sentiment",
    name: "FinBERT Sentiment Engine",
    topic: "NLP / Transformers",
    role: "Extracts financial sentiment from news — feeds into RL agent as signal",
    depth: "SUPPORTING MODULE",
    effort: "5%",
    color: "#0EA5E9",
    week: "W1",
    vram: "~400MB",
    productFeatures: [
      "FinBERT fine-tuned on Financial PhraseBank (4800 labeled sentences)",
      "Real-time sentiment scoring per stock per day",
      "Event detection: earnings, mergers, regulatory, macro events",
      "API: /sentiment/score — returns sentiment (-1 to +1) for any stock",
      "Dashboard: sentiment trend line, event timeline, top movers by sentiment",
    ],
    learnFirst: [
      "BERT basics: tokenization, attention, [CLS] token for classification",
      "Fine-tuning: freeze base layers, train classification head",
      "Financial PhraseBank dataset structure",
    ],
    whyProduct: "Sentiment is a proven alpha signal. This module feeds the RL agent AND is independently useful as an API.",
    thesis: "Chapter 3.7: FinBERT fine-tuning. Chapter 5.7: Sentiment impact on RL performance (ablation)",
  },
];

const timeline = [
  {
    week: "W1", days: "D1-D7", hours: "56+hrs",
    title: "Foundation: Data + Sentiment + GNN",
    color: "#8B5CF6",
    dailyPlan: [
      { day: "D1", hrs: 8, learn: "Project setup + Graph theory basics", build: "Repo structure, Docker, FastAPI skeleton, PostgreSQL setup, dependencies install" },
      { day: "D2", hrs: 8, learn: "yfinance API + Technical indicators (RSI, MACD, Bollinger)", build: "Data pipeline: 50 S&P 500 stocks, 10yr OHLCV, 20+ technical features, FRED macro data" },
      { day: "D3", hrs: 8, learn: "BERT/FinBERT architecture + fine-tuning", build: "FinBERT: download pre-trained, fine-tune on Financial PhraseBank, evaluate F1 score" },
      { day: "D4", hrs: 8, learn: "Graph construction strategies for financial markets", build: "Build market graph: sector edges, rolling correlation edges (>0.6 threshold), supply-chain edges" },
      { day: "D5", hrs: 8, learn: "GAT (Graph Attention Network) mechanism deep-dive", build: "T-GAT v1: 2-layer GAT in PyTorch Geometric, multi-head attention, node feature input" },
      { day: "D6", hrs: 8, learn: "Graph mini-batching + NeighborSampler", build: "T-GAT optimization for RTX 3050: FP16, NeighborSampler (2-hop, 15 neighbors), sanity check embeddings" },
      { day: "D7", hrs: 8, learn: "Review + debug", build: "API endpoints: /sentiment/score, /graph/embeddings, /graph/attention. Integration test all pipelines." },
    ],
    milestone: "Data flowing + FinBERT producing sentiments + T-GAT producing 64-dim graph embeddings",
    checkpoint: "Can you query sentiment for any stock? Can you visualize the market graph? If yes → proceed.",
  },
  {
    week: "W2", days: "D8-D14", hours: "56+hrs",
    title: "Core: Deep RL Trading Agent",
    color: "#EF4444",
    dailyPlan: [
      { day: "D8", hrs: 8, learn: "MDP formulation for trading + reward function design", build: "Custom Gymnasium environment: define state_space, action_space, step(), reset()" },
      { day: "D9", hrs: 8, learn: "Policy Gradient + PPO algorithm deep-dive", build: "PPO v1: Stable-Baselines3, train on 2019-2023 data with graph embeddings as state" },
      { day: "D10", hrs: 8, learn: "Reward shaping: Sharpe vs Sortino vs custom", build: "Reward experiments: try 3 reward functions, compare training curves, select best" },
      { day: "D11", hrs: 8, learn: "SAC algorithm: entropy, twin Q, reparameterization", build: "SAC agent: implement, train on same data, compare PPO vs SAC (Sharpe, drawdown, stability)" },
      { day: "D12", hrs: 8, learn: "Backtesting best practices (lookahead bias, survivorship bias)", build: "Backtesting engine: transaction costs (0.1%), slippage (0.05%), realistic execution" },
      { day: "D13", hrs: 8, learn: "Risk management in algorithmic trading", build: "Risk layer: max position 20%, stop-loss at -5%, max drawdown circuit breaker at -15%" },
      { day: "D14", hrs: 8, learn: "Baseline comparison methodology", build: "First benchmarks: PPO vs SAC vs Buy-and-Hold vs Equal Weight vs S&P 500. FIRST NUMBERS." },
    ],
    milestone: "RL agent beating buy-and-hold. PPO vs SAC comparison done. Risk management active.",
    checkpoint: "Does backtest show positive Sharpe >1.0? Does risk layer prevent >15% drawdown? If yes → proceed.",
  },
  {
    week: "W3", days: "D15-D21", hours: "56+hrs",
    title: "TimeGAN + Stress Testing",
    color: "#F59E0B",
    dailyPlan: [
      { day: "D15", hrs: 8, learn: "GAN fundamentals: minimax, training dynamics, mode collapse", build: "Vanilla GAN sanity check: generate simple sine waves, verify training loop works" },
      { day: "D16", hrs: 8, learn: "TimeGAN: 4-network architecture, supervised + unsupervised loss", build: "TimeGAN implementation: embedder, recovery, generator, discriminator on historical data" },
      { day: "D17", hrs: 8, learn: "GAN quality metrics for time-series", build: "Training + validation: discriminative score, predictive score, t-SNE visual comparison" },
      { day: "D18", hrs: 8, learn: "Conditional generation techniques", build: "Conditional TimeGAN: add condition vector (crash_type). 3 modes: 2008, COVID, flash crash" },
      { day: "D19", hrs: 8, learn: "Stress testing methodology in finance (VaR, CVaR)", build: "Stress test suite: run RL agent on 500+ synthetic crashes, measure survival rate + recovery" },
      { day: "D20", hrs: 8, learn: "Data augmentation with synthetic data", build: "Retrain RL agent with augmented data (real + synthetic), measure robustness improvement" },
      { day: "D21", hrs: 8, learn: "Review + integration", build: "APIs: /stress/generate, /stress/test, /stress/var. Scenario library with 1000+ pre-generated scenarios." },
    ],
    milestone: "TimeGAN generating realistic scenarios. RL agent stress-tested. Robustness quantified.",
    checkpoint: "Discriminative score <0.3? RL survives 80%+ synthetic crashes? If yes → proceed.",
  },
  {
    week: "W4", days: "D22-D28", hours: "56+hrs",
    title: "NAS AutoML Engine",
    color: "#10B981",
    dailyPlan: [
      { day: "D22", hrs: 8, learn: "NAS fundamentals: search space, search strategy, evaluation strategy", build: "Define DARTS search space for RL policy: layers(2-6), dims(32-256), heads(1-8), skip connections" },
      { day: "D23", hrs: 8, learn: "DARTS: continuous relaxation + bilevel optimization", build: "DARTS supernet: implement mixed operations, architecture parameters (alpha), weight sharing" },
      { day: "D24", hrs: 8, learn: "Training the supernet: alternating architecture + weight updates", build: "Train supernet on trading task (~6hrs on RTX 3050 with FP16)" },
      { day: "D25", hrs: 8, learn: "Architecture extraction + standalone retraining", build: "Extract top-3 architectures from alpha, retrain each from scratch, compare performance" },
      { day: "D26", hrs: 8, learn: "NAS for GNN optimization", build: "Apply DARTS to T-GAT: search over GAT layers(1-4), aggregation(mean/max/attention), embed_dim(32-128)" },
      { day: "D27", hrs: 8, learn: "AutoML product design patterns", build: "NAS API: /nas/optimize (takes model config, returns best architecture), /nas/report (comparison viz)" },
      { day: "D28", hrs: 8, learn: "Review + ablation setup", build: "Key ablation: NAS-optimized vs hand-designed policy. Dashboard: architecture topology viz, search curves." },
    ],
    milestone: "NAS finding optimal architectures for RL + GNN. Self-optimization demonstrated.",
    checkpoint: "NAS-found architecture beats hand-designed by >5%? Architecture viz working? If yes → proceed.",
  },
  {
    week: "W5", days: "D29-D35", hours: "56+hrs",
    title: "Federated Learning Platform",
    color: "#EC4899",
    dailyPlan: [
      { day: "D29", hrs: 8, learn: "FL fundamentals: why data can't leave institutions, FedAvg algorithm", build: "Flower setup: FL server, create 4 client configs with different stock universes" },
      { day: "D30", hrs: 8, learn: "Non-IID data in FL + FedProx proximal term", build: "FedAvg implementation: 4 clients train locally, server aggregates. Convergence logging." },
      { day: "D31", hrs: 8, learn: "Differential Privacy: epsilon-delta framework, noise mechanisms", build: "FedProx implementation: compare convergence vs FedAvg on non-IID data" },
      { day: "D32", hrs: 8, learn: "DP-SGD: adding calibrated noise to gradients", build: "Differential Privacy layer: DP-SGD with configurable epsilon. Privacy-utility curve generation." },
      { day: "D33", hrs: 8, learn: "FL evaluation: fairness across clients", build: "FL analysis: per-client improvement, federated vs individual performance comparison" },
      { day: "D34", hrs: 8, learn: "FL product patterns: registration, monitoring, compliance", build: "APIs: /fl/join, /fl/status, /fl/compare. FL Dashboard: convergence curves, client contribution heatmap." },
      { day: "D35", hrs: 8, learn: "Review + full integration test", build: "End-to-end FL test: 4 clients, 50 rounds, FedProx + DP, verify 15-25% improvement over individual." },
    ],
    milestone: "Federated Learning working. Multiple institutions improve together without sharing data.",
    checkpoint: "FL improves individual performance by >15%? Privacy guarantee (epsilon <8)? If yes → proceed.",
  },
  {
    week: "W6", days: "D36-D42", hours: "56+hrs",
    title: "Quantum ML + Production Integration",
    color: "#6366F1",
    dailyPlan: [
      { day: "D36", hrs: 8, learn: "Quantum computing basics: qubits, gates, superposition, entanglement", build: "Qiskit setup: install, create simple 2-qubit circuit, run on AerSimulator" },
      { day: "D37", hrs: 8, learn: "QAOA algorithm: cost Hamiltonian, mixer, variational parameters", build: "QAOA for asset selection: encode portfolio optimization as QUBO problem, implement in Qiskit" },
      { day: "D38", hrs: 8, learn: "Variational Quantum Circuits (VQC): parameterized quantum layers", build: "Hybrid VQC: quantum circuit layer + classical PyTorch optimizer in training loop" },
      { day: "D39", hrs: 8, learn: "Quantum vs classical complexity for portfolio optimization", build: "Benchmark suite: QAOA vs brute-force vs greedy vs RL-based for 4,6,8,10,12 asset subsets" },
      { day: "D40", hrs: 8, learn: "Full system integration patterns", build: "Quantum APIs: /quantum/optimize, /quantum/compare. Dashboard: circuit viz, qubit evolution, comparison charts." },
      { day: "D41", hrs: 8, learn: "Docker + docker-compose for ML systems", build: "Docker-compose: all services containerized, single 'docker-compose up' runs everything" },
      { day: "D42", hrs: 8, learn: "End-to-end system testing", build: "Full integration: all 7 modules connected, 12 API endpoints working, data flowing end-to-end." },
    ],
    milestone: "Quantum module complete. Entire system dockerized. All 12 APIs working.",
    checkpoint: "QAOA produces valid portfolio? Docker-compose up works? ALL APIs respond? If yes → proceed.",
  },
  {
    week: "W7", days: "D43-D49", hours: "56+hrs",
    title: "Dashboard + Full Benchmarks + All Figures",
    color: "#3B82F6",
    dailyPlan: [
      { day: "D43", hrs: 8, learn: "Next.js 14 + Recharts/Plotly for data dashboards", build: "Dashboard skeleton: layout, navigation, 8 view pages, API connection to FastAPI backend" },
      { day: "D44", hrs: 8, learn: "Financial data visualization best practices", build: "Dashboard views: Portfolio performance, allocation heatmap, P&L curve, trade log" },
      { day: "D45", hrs: 8, learn: "Interactive graph + network visualization", build: "Dashboard views: Market graph (interactive), attention heatmap, regime detection alerts" },
      { day: "D46", hrs: 8, learn: "ML experiment visualization", build: "Dashboard views: FL convergence, NAS architecture topology, quantum circuit viz, stress test reports" },
      { day: "D47", hrs: 8, learn: "Statistical significance testing for ML experiments", build: "Full benchmarks: ALL 9 baselines, ALL metrics, 5 random seeds, paired t-tests, Wilcoxon tests" },
      { day: "D48", hrs: 8, learn: "Publication-quality figure generation (matplotlib/plotly)", build: "Generate ALL thesis figures: performance curves, ablation bars, attention heatmaps, architecture diagrams" },
      { day: "D49", hrs: 8, learn: "MLflow experiment tracking", build: "MLflow integration: all experiments logged, reproducible. Paper trading demo running for 7 days." },
    ],
    milestone: "Dashboard complete (8 views). All benchmark numbers final. All thesis figures generated.",
    checkpoint: "Dashboard looks professional? All 9 baselines compared? Statistical tests done? If yes → proceed.",
  },
  {
    week: "W8", days: "D50-D56", hours: "56+hrs",
    title: "Thesis Writing + Documentation + Demo Prep",
    color: "#F59E0B",
    dailyPlan: [
      { day: "D50", hrs: 8, learn: "Academic writing: thesis structure, citation style", build: "Chapter 1 (Intro) + Chapter 2 (Literature Review — 60-80 papers across 7 topics)" },
      { day: "D51", hrs: 8, learn: "Methodology writing: mathematical notation, algorithm pseudocode", build: "Chapter 3 (Methodology): T-GAT formulation, RL MDP, TimeGAN, DARTS, FL protocol, QAOA" },
      { day: "D52", hrs: 8, learn: "Implementation documentation patterns", build: "Chapter 4 (Implementation): tech stack, architecture diagram, RTX 3050 optimizations, API design" },
      { day: "D53", hrs: 8, learn: "Results analysis and interpretation", build: "Chapter 5 (Results): all benchmarks, ablation studies (7 ablations), statistical analysis" },
      { day: "D54", hrs: 8, learn: "Academic conclusion + future work writing", build: "Chapter 6 (Conclusion + Future Work) + Abstract + References formatting" },
      { day: "D55", hrs: 8, learn: "Demo preparation best practices", build: "README.md, API documentation, demo script (5-min walkthrough), video recording" },
      { day: "D56", hrs: 8, learn: "Final review", build: "Proofread thesis, test demo end-to-end, prepare viva slides (15 slides), final Git push." },
    ],
    milestone: "EVERYTHING DONE. Thesis submitted. Demo ready. Viva slides prepared.",
    checkpoint: "Thesis >80 pages? Demo runs smoothly? Can you explain every module in 2 min? → DONE.",
  },
];

const baselines = [
  { name: "Equal Weight (1/N)", type: "Classical", desc: "Equally divide capital across all stocks" },
  { name: "Markowitz MVO", type: "Classical", desc: "Mean-variance optimization with historical returns" },
  { name: "Risk Parity", type: "Classical", desc: "Equal risk contribution from each asset" },
  { name: "Black-Litterman", type: "Classical", desc: "Bayesian estimation with market equilibrium prior" },
  { name: "S&P 500 Buy & Hold", type: "Benchmark", desc: "Simply hold S&P 500 index" },
  { name: "FINQUANT (no GNN)", type: "Ablation", desc: "Remove GNN, use flat features — proves GNN value" },
  { name: "FINQUANT (no GAN)", type: "Ablation", desc: "Remove synthetic data — proves GAN augmentation value" },
  { name: "FINQUANT (no NAS)", type: "Ablation", desc: "Use hand-designed policy — proves NAS value" },
  { name: "FINQUANT (no FL)", type: "Ablation", desc: "Single client only — proves FL collaboration value" },
  { name: "FINQUANT (no Quantum)", type: "Ablation", desc: "Classical asset selection — proves quantum advantage" },
  { name: "FINQUANT (no Sentiment)", type: "Ablation", desc: "Remove FinBERT — proves sentiment signal value" },
  { name: "FinRL Library (baseline)", type: "External", desc: "Popular open-source RL trading library" },
];

const apis = [
  { endpoint: "/sentiment/score", method: "GET", module: "FinBERT", desc: "Sentiment score (-1 to +1) for any stock" },
  { endpoint: "/graph/embeddings", method: "GET", module: "GNN", desc: "64-dim graph embeddings per stock" },
  { endpoint: "/graph/attention", method: "GET", module: "GNN", desc: "Attention weights heatmap (which stocks influence which)" },
  { endpoint: "/graph/regime", method: "GET", module: "GNN", desc: "Current market regime detection (bull/bear/transition)" },
  { endpoint: "/trade/predict", method: "POST", module: "Deep RL", desc: "Optimal portfolio weights for current market state" },
  { endpoint: "/trade/backtest", method: "POST", module: "Deep RL", desc: "Run strategy on date range with realistic costs" },
  { endpoint: "/stress/generate", method: "POST", module: "GANs", desc: "Generate N synthetic market scenarios of type X" },
  { endpoint: "/stress/test", method: "POST", module: "GANs", desc: "Test RL agent against synthetic crashes" },
  { endpoint: "/stress/var", method: "GET", module: "GANs", desc: "Value-at-Risk via Monte Carlo on synthetic data" },
  { endpoint: "/nas/optimize", method: "POST", module: "NAS", desc: "Auto-find optimal architecture for given model config" },
  { endpoint: "/fl/join", method: "POST", module: "FL", desc: "Register institution as federated client" },
  { endpoint: "/fl/status", method: "GET", module: "FL", desc: "FL training progress + privacy budget" },
  { endpoint: "/quantum/optimize", method: "POST", module: "Quantum", desc: "QAOA + VQC portfolio optimization" },
  { endpoint: "/quantum/compare", method: "GET", module: "Quantum", desc: "Quantum vs classical comparison results" },
];

export default function FinalLocked() {
  const [tab, setTab] = useState("overview");
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      minHeight: "100vh", color: "#E2E8F0", padding: "16px"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <div style={{
          display: "inline-block", padding: "3px 12px", borderRadius: "12px", marginBottom: "6px",
          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)"
        }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: "#EF4444", letterSpacing: "2px" }}>
            LOCKED — NO MORE CHANGES
          </span>
        </div>
        <h1 style={{
          fontSize: "24px", fontWeight: 800, margin: "4px 0",
          background: "linear-gradient(135deg, #60A5FA, #22C55E, #F59E0B)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          FINQUANT-NEXUS v4 FINAL
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "12px", margin: 0 }}>
          {projectMeta.tagline} — ALL 7 Topics PRODUCT-GRADE
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
        {[
          { label: "Topics", value: "7/7", color: "#22C55E" },
          { label: "Daily Hours", value: "8+", color: "#EF4444" },
          { label: "Total Hours", value: "450+", color: "#F59E0B" },
          { label: "APIs", value: "14", color: "#3B82F6" },
          { label: "Dashboard Views", value: "8", color: "#8B5CF6" },
          { label: "Baselines", value: "12", color: "#EC4899" },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "6px 12px", borderRadius: "8px", textAlign: "center",
            background: `${s.color}10`, border: `1px solid ${s.color}22`
          }}>
            <div style={{ fontSize: "16px", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "9px", color: "#64748B" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "16px", flexWrap: "wrap" }}>
        {[
          { id: "overview", label: "7 Modules" },
          { id: "timeline", label: "56-Day Plan" },
          { id: "apis", label: "14 APIs" },
          { id: "baselines", label: "12 Baselines" },
          { id: "learning", label: "Learning Path" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "6px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
            background: tab === t.id ? "linear-gradient(135deg, #3B82F6, #22C55E)" : "rgba(255,255,255,0.04)",
            color: tab === t.id ? "white" : "#64748B", fontWeight: 600, fontSize: "11px"
          }}>{t.label}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          {modules.map((m, i) => (
            <div key={i}
              onClick={() => setExpandedModule(expandedModule === i ? null : i)}
              style={{
                marginBottom: "6px", borderRadius: "10px", cursor: "pointer", overflow: "hidden",
                background: "rgba(255,255,255,0.02)", border: `1px solid ${m.color}22`
              }}>
              <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 700, background: `${m.color}20`, color: m.color }}>{m.topic}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#E2E8F0" }}>{m.name}</span>
                  <span style={{ fontSize: "10px", color: "#64748B" }}>{m.effort} effort | {m.week} | {m.vram}</span>
                </div>
                <span style={{ color: "#64748B" }}>{expandedModule === i ? "▲" : "▼"}</span>
              </div>
              {expandedModule === i && (
                <div style={{ padding: "0 14px 12px" }}>
                  <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "8px", fontStyle: "italic" }}>{m.role}</div>
                  
                  <div style={{ fontSize: "11px", fontWeight: 700, color: m.color, marginBottom: "4px" }}>PRODUCT FEATURES:</div>
                  {m.productFeatures.map((f, j) => (
                    <div key={j} style={{ fontSize: "11px", color: "#CBD5E1", padding: "2px 0", display: "flex", gap: "5px" }}>
                      <span style={{ color: m.color, flexShrink: 0 }}>▸</span> {f}
                    </div>
                  ))}
                  
                  <div style={{ marginTop: "8px", padding: "8px 10px", borderRadius: "6px", background: `${m.color}08`, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: m.color }}>WHY THIS IS PRODUCT-WORTHY:</div>
                    <div style={{ fontSize: "11px", color: "#CBD5E1", lineHeight: 1.5 }}>{m.whyProduct}</div>
                  </div>
                  
                  <div style={{ marginTop: "6px", fontSize: "10px", color: "#64748B" }}>
                    <span style={{ fontWeight: 700 }}>Thesis: </span>{m.thesis}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TIMELINE */}
      {tab === "timeline" && (
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          {timeline.map((w, i) => (
            <div key={i}
              onClick={() => setExpandedWeek(expandedWeek === i ? null : i)}
              style={{
                marginBottom: "6px", borderRadius: "10px", cursor: "pointer", overflow: "hidden",
                background: "rgba(255,255,255,0.02)", border: `1px solid ${w.color}22`
              }}>
              <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 800, background: `${w.color}18`, color: w.color }}>{w.week}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>{w.title}</div>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>{w.days} | {w.hours}</div>
                  </div>
                </div>
                <span style={{ color: "#64748B" }}>{expandedWeek === i ? "▲" : "▼"}</span>
              </div>
              {expandedWeek === i && (
                <div style={{ padding: "0 14px 12px" }}>
                  {w.dailyPlan.map((d, j) => (
                    <div key={j} style={{
                      padding: "6px 8px", borderRadius: "6px", marginBottom: "4px",
                      background: j % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"
                    }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "2px" }}>
                        <span style={{ padding: "1px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, background: `${w.color}15`, color: w.color }}>{d.day}</span>
                        <span style={{ fontSize: "10px", color: "#64748B" }}>{d.hrs}hrs</span>
                      </div>
                      <div style={{ fontSize: "11px", display: "flex", gap: "4px", marginBottom: "1px" }}>
                        <span style={{ color: "#A78BFA", fontWeight: 600, flexShrink: 0 }}>Learn:</span>
                        <span style={{ color: "#C4B5FD" }}>{d.learn}</span>
                      </div>
                      <div style={{ fontSize: "11px", display: "flex", gap: "4px" }}>
                        <span style={{ color: "#22C55E", fontWeight: 600, flexShrink: 0 }}>Build:</span>
                        <span style={{ color: "#86EFAC" }}>{d.build}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: "6px", padding: "6px 10px", borderRadius: "6px", background: "rgba(245,158,11,0.08)", borderLeft: "3px solid #F59E0B" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#F59E0B" }}>MILESTONE: </span>
                    <span style={{ fontSize: "11px", color: "#FCD34D" }}>{w.milestone}</span>
                  </div>
                  <div style={{ marginTop: "4px", padding: "6px 10px", borderRadius: "6px", background: "rgba(59,130,246,0.06)" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#3B82F6" }}>CHECKPOINT: </span>
                    <span style={{ fontSize: "11px", color: "#93C5FD" }}>{w.checkpoint}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* APIs */}
      {tab === "apis" && (
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ padding: "10px", borderRadius: "8px", marginBottom: "12px", background: "rgba(59,130,246,0.06)", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#60A5FA", fontWeight: 700 }}>14 Production API Endpoints — FastAPI + Auto-generated Swagger Docs</span>
          </div>
          {apis.map((a, i) => {
            const m = modules.find(mod => mod.topic.includes(a.module) || mod.name.includes(a.module)) || {};
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px",
                borderRadius: "6px", marginBottom: "3px",
                background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"
              }}>
                <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: 700, background: a.method === "GET" ? "#22C55E22" : "#3B82F622", color: a.method === "GET" ? "#22C55E" : "#3B82F6" }}>{a.method}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#E2E8F0", fontFamily: "monospace", minWidth: "180px" }}>{a.endpoint}</span>
                <span style={{ fontSize: "10px", color: "#64748B" }}>{a.desc}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* BASELINES */}
      {tab === "baselines" && (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ padding: "10px", borderRadius: "8px", marginBottom: "12px", background: "rgba(167,139,250,0.06)", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#A78BFA", fontWeight: 700 }}>12 Baseline Comparisons = Bulletproof Thesis (4 Classical + 1 Benchmark + 6 Ablation + 1 External)</span>
          </div>
          {baselines.map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px",
              borderRadius: "6px", marginBottom: "3px",
              background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"
            }}>
              <span style={{
                padding: "2px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: 700, minWidth: "55px", textAlign: "center",
                background: b.type === "Classical" ? "#F59E0B18" : b.type === "Ablation" ? "#EF444418" : b.type === "External" ? "#3B82F618" : "#22C55E18",
                color: b.type === "Classical" ? "#F59E0B" : b.type === "Ablation" ? "#EF4444" : b.type === "External" ? "#3B82F6" : "#22C55E"
              }}>{b.type}</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#E2E8F0", minWidth: "200px" }}>{b.name}</span>
              <span style={{ fontSize: "11px", color: "#64748B" }}>{b.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* LEARNING PATH */}
      {tab === "learning" && (
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ padding: "12px", borderRadius: "10px", marginBottom: "14px", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.12)" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#A78BFA", marginBottom: "4px" }}>Teaching Approach: Concept Brief → Code → Explanation</div>
            <div style={{ fontSize: "12px", color: "#C4B5FD", lineHeight: 1.5 }}>
              Har module se pehle main concept samjhaunga (5-10 min read), phir code likhenge with inline Hinglish comments.
              Har day ka format: Learn (theory) → Build (code) → Checkpoint (verify it works).
            </div>
          </div>

          {modules.map((m, i) => (
            <div key={i} style={{
              padding: "12px", borderRadius: "8px", marginBottom: "6px",
              background: "rgba(255,255,255,0.02)", borderLeft: `3px solid ${m.color}`
            }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: m.color, marginBottom: "6px" }}>
                {m.topic} — Learn Before You Build:
              </div>
              {m.learnFirst.map((l, j) => (
                <div key={j} style={{ fontSize: "11px", color: "#CBD5E1", padding: "2px 0", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#A78BFA", flexShrink: 0 }}>{j + 1}.</span> {l}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* FINAL LOCK */}
      <div style={{
        marginTop: "20px", padding: "16px", borderRadius: "12px", textAlign: "center",
        background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(59,130,246,0.1))",
        border: "2px solid rgba(239,68,68,0.3)"
      }}>
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#EF4444", letterSpacing: "2px", marginBottom: "4px" }}>
          STATUS: LOCKED & FINALIZED
        </div>
        <div style={{ fontSize: "18px", fontWeight: 900, color: "#60A5FA" }}>
          FINQUANT-NEXUS v4 — 7 Topics × Product Grade × 56 Days
        </div>
        <div style={{ fontSize: "12px", color: "#94A3B8", margin: "6px 0", lineHeight: 1.5 }}>
          14 APIs | 8 Dashboard Views | 12 Baselines | 7 Ablation Studies | 80-100 Page Thesis<br/>
          Every module: Learn → Build → Test → Document | Docker one-command deployment
        </div>
        <div style={{
          marginTop: "10px", display: "inline-block", padding: "8px 24px", borderRadius: "8px",
          background: "linear-gradient(135deg, #EF4444, #3B82F6)", color: "white",
          fontWeight: 800, fontSize: "14px"
        }}>
          WEEK 1, DAY 1 → START
        </div>
      </div>
    </div>
  );
}
