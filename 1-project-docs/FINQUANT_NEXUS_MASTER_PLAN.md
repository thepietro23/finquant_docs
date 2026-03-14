# FINQUANT-NEXUS v4 — Master Implementation Plan

## Project Overview

**Title:** Self-Optimizing Federated Portfolio Intelligence Platform
**Degree:** M.Tech in Data Science & Machine Learning
**Duration:** 56 Days | 8+ Hours/Day | ~450+ Total Hours
**Hardware:** NVIDIA RTX 3050 (4GB VRAM) — Sequential training only
**Target:** NIFTY 50 Stocks, Indian Market

### 7 AI/ML Techniques
| # | Technique | Module |
|---|-----------|--------|
| 1 | Graph Neural Networks | T-GAT Market Intelligence |
| 2 | Deep Reinforcement Learning | PPO/SAC Trading Agent |
| 3 | Generative Adversarial Networks | TimeGAN Stress Testing |
| 4 | Neural Architecture Search | DARTS AutoML Engine |
| 5 | Federated Learning | Privacy-Preserving Platform |
| 6 | Quantum Machine Learning | QAOA + VQC Hybrid Optimizer |
| 7 | NLP / Sentiment Analysis | FinBERT Financial Sentiment |

### Current State
- `fqn1/` directory skeleton created (all folders exist)
- **ZERO source files** — starting from scratch
- `venv` exists at `fqn1/venv`

---

## Project Structure

```
finquant-nexus/ (fqn1/)
+-- src/
|   +-- data/          # P1-P2: download, features, quality, normalize
|   +-- sentiment/     # P3: finbert, news fetcher
|   +-- graph/         # P4-P5: graph_builder, tgat model
|   +-- rl/            # P6-P7: trading_env, ppo, sac, reward
|   +-- gan/           # P8-P9: timegan, stress_test
|   +-- nas/           # P10: darts, search_space
|   +-- federated/     # P11: fl_server, fl_client, privacy
|   +-- quantum/       # P12: qaoa, vqc
|   +-- api/           # P13: all FastAPI endpoints
|   +-- utils/         # Shared: logger, config, seed, metrics
+-- configs/           # YAML hyperparameters
+-- dashboard/         # P14: Next.js 14
+-- data/              # Downloaded CSVs (gitignored)
+-- models/            # Saved model checkpoints (gitignored)
+-- experiments/       # W&B logs
+-- tests/             # All test files
+-- thesis/
+-- docker-compose.yml
+-- Dockerfile
+-- requirements.txt
+-- .gitignore
+-- .env
```

---

## Data Split Strategy (CRITICAL — No Leakage)

| Set | Period | Purpose |
|-----|--------|---------|
| Train | 2015-01-01 to 2021-12-31 | Model training |
| Validation | 2022-01-01 to 2023-12-31 | Hyperparameter tuning, model selection |
| Test | 2024-01-01 to 2025-12-31 | Final evaluation (USE ONCE ONLY) |

**Rules:**
- Feature normalization mean/std SIRF train set se calculate hona chahiye
- Validation/test pe train ka mean/std apply karna
- Walk-forward validation: RL training mein har step pe sirf past data use hona chahiye
- Test set ko SIRF ek baar use karna — final results ke liye

---

## Key Configuration (configs/base.yaml)

```yaml
seed: 42
device: 'cuda'
fp16: true

data:
  stocks: 'nifty50'
  start_date: '2015-01-01'
  end_date: '2025-12-31'
  train_end: '2021-12-31'
  val_end: '2023-12-31'
  risk_free_rate: 0.07      # India govt bond ~7%
  transaction_cost: 0.001   # 0.1% STT+brokerage
  slippage: 0.0005          # 0.05%

features:
  normalize: 'zscore'
  rolling_window: 252       # 1 year rolling for normalization
  indicators: ['rsi','macd','bb','sma','ema','atr','stoch','volume']

gnn:
  hidden_dim: 64
  num_layers: 2
  num_heads: 4
  dropout: 0.1
  correlation_threshold: 0.6
  neighbor_sample: 15

rl:
  algorithm: 'PPO'
  lr: 0.0003
  gamma: 0.99
  batch_size: 64
  n_steps: 2048
  max_position: 0.20       # 20% max per stock
  stop_loss: -0.05         # -5% per stock
  max_drawdown: -0.15      # -15% circuit breaker

gan:
  seq_length: 128
  latent_dim: 64
  hidden_dim: 128
  num_layers: 3
  epochs: 500
  lr: 0.0005

nas:
  search_space_layers: [2,3,4,5,6]
  search_space_dims: [32,64,128,256]
  search_space_heads: [1,2,4,8]
  darts_epochs: 50
  retrain_epochs: 100

fl:
  num_clients: 4
  rounds: 50
  local_epochs: 5
  strategy: 'FedProx'
  dp_epsilon: 8.0
  dp_delta: 1e-5

quantum:
  num_assets: 8
  qaoa_layers: 3
  max_qubits: 12
  shots: 1024
```

---

## Master Rule

> **No phase starts until previous phase tests are 100% GREEN + git committed.**

**Total Test Scenarios:** 124 unit tests + 54 edge cases + 11 integration tests = **189 test scenarios**

---

---

# PHASE 0: Global Setup (Pre-requisite)

**Timeline:** Before Day 1
**Goal:** Project scaffolding, shared utilities, reproducibility infrastructure

### Checklist

- [ ] Initialize git repo in `fqn1/`
- [ ] Create `requirements.txt` with all dependencies
- [ ] Create `configs/base.yaml` (all hyperparameters — seed, data splits, model configs)
- [ ] Create `src/__init__.py` + all subpackage `__init__.py` files
- [ ] Create `src/utils/config.py` — YAML config loader
- [ ] Create `src/utils/seed.py` — Reproducibility (seed=42, torch, numpy, random)
- [ ] Create `src/utils/logger.py` — Structured logging per module
- [ ] Create `src/utils/metrics.py` — Sharpe, MaxDrawdown, Sortino, Calmar ratios
- [ ] Create `.gitignore` — data/, models/, venv/, .env, *.pyc, logs/, __pycache__/
- [ ] Create `.env` template file
- [ ] Verify `venv` has Python 3.10+, install base deps from requirements.txt
- [ ] **Git commit:** `"Phase 0: Project scaffolding complete"`

### Shared Utility Code

**src/utils/config.py**
```python
import yaml

def load_config(path='configs/base.yaml'):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

CONFIG = load_config()
```

**src/utils/seed.py**
```python
import random, numpy as np, torch

def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
```

**src/utils/logger.py**
```python
import logging, os

def get_logger(name, log_dir='logs'):
    os.makedirs(log_dir, exist_ok=True)
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    fh = logging.FileHandler(f'{log_dir}/{name}.log')
    ch = logging.StreamHandler()
    fmt = logging.Formatter('%(asctime)s [%(name)s] %(levelname)s: %(message)s')
    fh.setFormatter(fmt); ch.setFormatter(fmt)
    logger.addHandler(fh); logger.addHandler(ch)
    return logger
```

**src/utils/metrics.py**
```python
import numpy as np

def sharpe_ratio(returns, rf=0.07, periods=248):
    excess = returns - rf/periods
    if excess.std() == 0: return 0.0
    return np.sqrt(periods) * excess.mean() / excess.std()

def max_drawdown(portfolio_values):
    peak = np.maximum.accumulate(portfolio_values)
    drawdown = (portfolio_values - peak) / peak
    return drawdown.min()

def sortino_ratio(returns, rf=0.07, periods=248):
    excess = returns - rf/periods
    downside = excess[excess < 0].std()
    if downside == 0: return 0.0
    return np.sqrt(periods) * excess.mean() / downside

def calmar_ratio(returns, portfolio_values, rf=0.07):
    annual_ret = (1 + returns).prod() ** (248/len(returns)) - 1
    mdd = abs(max_drawdown(portfolio_values))
    if mdd == 0: return 0.0
    return (annual_ret - rf) / mdd
```

---

---

# PHASE 1: Data Pipeline (D1-D2)

**Timeline:** Day 1-2
**Goal:** Download NIFTY 50 data, quality checks, clean data
**Files:** `src/data/stocks.py`, `src/data/download.py`, `src/data/quality.py`

### Theory (Quick)
- **OHLCV:** Open/High/Low/Close/Volume — stock ka daily data. Close sabse important.
- **yfinance:** Yahoo Finance ka free Python API. NSE stocks ke liye `.NS` suffix. NIFTY index = `^NSEI`.
- **Stock Splits:** Company stock split karti hai → price halved but value same. **Use Adj Close** (not regular Close) — handles splits automatically.
- **Missing Data:** NSE holidays (Diwali, Holi, Republic Day) pe data nahi hoga. Forward-fill for gaps, drop stocks with <1000 days.

### Implementation Checklist

- [ ] Create `src/data/stocks.py` — NIFTY 50 stock registry with sector mapping
  ```python
  NIFTY50 = {
      'IT': ['TCS.NS','INFY.NS','HCLTECH.NS','WIPRO.NS','TECHM.NS'],
      'Banking': ['HDFCBANK.NS','ICICIBANK.NS','KOTAKBANK.NS','SBIN.NS','AXISBANK.NS','INDUSINDBK.NS'],
      'Energy': ['RELIANCE.NS','ONGC.NS','NTPC.NS','POWERGRID.NS'],
      'Auto': ['MARUTI.NS','M&M.NS','TATAMOTORS.NS','BAJAJ-AUTO.NS'],
      'FMCG': ['HINDUNILVR.NS','ITC.NS','NESTLEIND.NS','BRITANNIA.NS'],
      'Pharma': ['SUNPHARMA.NS','DRREDDY.NS','CIPLA.NS','DIVISLAB.NS'],
      'Metals': ['TATASTEEL.NS','HINDALCO.NS','JSWSTEEL.NS'],
      'Infra': ['ULTRACEMCO.NS','GRASIM.NS','LT.NS'],
      'Telecom': ['BHARTIARTL.NS'],
      'Finance': ['BAJFINANCE.NS','BAJAJFINSV.NS','HDFCLIFE.NS','SBILIFE.NS'],
      'Others': ['TITAN.NS','ASIANPAINT.NS','ADANIENT.NS','ADANIPORTS.NS',
                'HEROMOTOCO.NS','EICHERMOT.NS','APOLLOHOSP.NS'],
  }
  ```
- [ ] Create `src/data/download.py` — yfinance download with retry (3x exponential backoff), Adj Close, batch download, save per-stock CSV + combined `all_close_prices.csv`
- [ ] Create `src/data/quality.py` — DataQualityChecker class with 7 checks:
  1. Minimum 1000 trading days
  2. Max 5% NaN allowed
  3. No duplicate dates
  4. No zero/negative prices
  5. No extreme returns >50% in one day
  6. Volume zero days <1%
  7. Chronological order verified
  - `clean_stock()` method: sort, dedup, ffill, dropna

### Test Cases (tests/test_data.py)

| ID | Test | Assertion |
|----|------|-----------|
| T1.1 | Stock CSV count | `len(files) >= 40` |
| T1.2 | CSV columns exist | Open, High, Low, Close, Adj Close, Volume present |
| T1.3 | NIFTY index downloaded | `NIFTY50_INDEX.csv` exists with 1000+ rows |
| T1.4 | Combined prices | `all_close_prices.csv` has 40+ columns |
| T1.5 | Quality check passes | `DataQualityChecker.check_stock(RELIANCE) == True` |
| T1.6 | Clean removes NaN | NaN count = 0 after `clean_stock()` |
| T1.7 | No duplicate dates | `index.duplicated().sum() == 0` after clean |
| T1.8 | Date range coverage | Covers 2015 to 2025 |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E1.1 | Stock split (RELIANCE 2020) | Adj Close should be smooth, no 50% drop |
| E1.2 | Newly listed stock (<1000 days) | Skip with warning, don't crash |
| E1.3 | NSE holidays | Forward fill, verify no gaps |
| E1.4 | Internet disconnection | Retry 3 times with exponential backoff |
| E1.5 | yfinance returns empty DataFrame | Log error, continue with other stocks |

### Pass Criteria
> Phase 2 shuru mat karna jab tak: (1) 40+ stocks clean data hai (2) Quality report sab PASS (3) All 8 tests GREEN (4) Git commit done.

**Git commit:** `"Phase 1: Data pipeline complete — 40+ NIFTY stocks downloaded and validated"`

---

---

# PHASE 2: Feature Engineering (D3-D4)

**Timeline:** Day 3-4
**Goal:** 27 technical indicators + rolling Z-score normalization
**Files:** `src/data/features.py`, `src/data/normalize.py`

### Theory (Quick)
- **Normalization:** Features ko same scale pe laana. RSI 0-100 hai, price 100-50000 hai. Z-score: `(value - mean) / std`.
- **Rolling Normalization:** 252-day window (1 year). Har din ke liye PAST 252 days ka mean/std. No future leak.
- **Feature Categories:** (1) Price returns (1d, 5d, 20d) (2) Volatility (20d, 60d std) (3) Momentum (RSI, MACD, Stochastic) (4) Trend (SMA, EMA) (5) Bollinger Bands (6) Volume ratios (7) ATR

### Implementation Checklist

- [ ] Create `src/data/features.py` — 27 technical indicators via `ta` library:
  - RSI, MACD, MACD_signal, MACD_hist
  - Bollinger upper/mid/lower
  - SMA_20, SMA_50, EMA_12, EMA_26
  - ATR, Stochastic %K/%D
  - Volume SMA, Volume ratio
  - Returns (1d, 5d, 20d), Volatility (20d, 60d)
- [ ] Create `src/data/normalize.py` — RollingNormalizer class:
  ```python
  class RollingNormalizer:
      def __init__(self, window=252):
          self.window = window

      def normalize(self, df, feature_cols):
          df_norm = df.copy()
          for col in feature_cols:
              rolling_mean = df[col].rolling(self.window, min_periods=60).mean()
              rolling_std = df[col].rolling(self.window, min_periods=60).std()
              rolling_std = rolling_std.replace(0, 1e-8)
              df_norm[col] = (df[col] - rolling_mean) / rolling_std
          df_norm = df_norm.clip(-5, 5)  # Clip extremes
          df_norm.dropna(inplace=True)
          return df_norm
  ```
- [ ] Save `{stock}_features_normalized.csv` per stock
- [ ] Feature columns list saved in config

### Test Cases (tests/test_features.py)

| ID | Test | Assertion |
|----|------|-----------|
| T2.1 | Feature count | Each stock has ~27 features |
| T2.2 | Normalization stats | Mean ~ 0, std ~ 1 on train set |
| T2.3 | No NaN | `isnull().sum().sum() == 0` in final matrix |
| T2.4 | Value range | No values outside [-5, +5] after clipping |
| T2.5 | No future leak | Normalization at time T uses only data <= T |
| T2.6 | Division by zero | Constant-price stock doesn't crash |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E2.1 | Stock with <252 days history | `min_periods=60` handles this |
| E2.2 | Volume=0 days (trading halt) | `volume_ratio` handled with `fillna(1.0)` |
| E2.3 | All NaN column (indicator failed) | Drop column, log warning |
| E2.4 | Extreme outlier (z-score >10) | Clipped to [-5, +5] |

### Pass Criteria
**Git commit:** `"Phase 2: Feature engineering complete — 27 indicators + rolling normalization"`

---

---

# PHASE 3: FinBERT Sentiment (D5-D6)

**Timeline:** Day 5-6
**Goal:** Fine-tune FinBERT, create sentiment scoring pipeline
**Files:** `src/sentiment/finbert.py`, `src/sentiment/news_fetcher.py`

### Theory (Quick)
- **FinBERT:** BERT fine-tuned on financial text. `ProsusAI/finbert` from HuggingFace. 3 classes: positive/negative/neutral.
- **Fine-tuning:** Financial PhraseBank dataset (4800 sentences, 75% agreement subset). 3 epochs, lr=2e-5, batch=16. ~30 min on RTX 3050, ~400MB VRAM.
- **Scoring:** `score = P(positive) - P(negative)`. Range [-1, +1].
- **Missing news:** Previous day sentiment * 0.95 decay factor.

### Implementation Checklist

- [ ] Create `src/sentiment/finbert.py`:
  - Load `ProsusAI/finbert` from HuggingFace
  - Fine-tune on Financial PhraseBank (75%-agree subset)
  - Inference pipeline: text -> [positive, negative, neutral] probabilities
  - Score = P(pos) - P(neg), range [-1, +1]
  - Cache in SQLite DB: (date, ticker, score)
- [ ] Create `src/sentiment/news_fetcher.py`:
  - Fetch financial news headlines per NIFTY stock (free sources)
  - Per stock per day: average all headlines
  - No news = previous day * 0.95 decay
- [ ] Save sentiment scores per stock per day

### Test Cases (tests/test_sentiment.py)

| ID | Test | Assertion |
|----|------|-----------|
| T3.1 | Model loads | VRAM < 500MB |
| T3.2 | Fine-tuning runs | 3 epochs complete without error |
| T3.3 | F1 score | F1 > 0.75 on validation set |
| T3.4 | Positive text | 'Reliance posts record profit' -> positive (>0.7 confidence) |
| T3.5 | Negative text | 'Market crashes amid global fears' -> negative (>0.7 confidence) |
| T3.6 | Neutral text | 'Trading volume was normal today' -> neutral |
| T3.7 | Inference speed | Returns score for any input in <100ms |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E3.1 | Hindi/Hinglish text | FinBERT English only — skip non-English gracefully |
| E3.2 | Empty or very short text (<5 chars) | Return neutral (0.0) |
| E3.3 | No news for stock on a day | Use last known sentiment, decay towards 0 |

### Pass Criteria
**Git commit:** `"Phase 3: FinBERT trained + sentiment pipeline complete"`

---

---

# PHASE 4: Graph Construction (D6-D7)

**Timeline:** Day 6-7
**Goal:** Build dynamic market graph with 3 edge types
**Files:** `src/graph/graph_builder.py`

### Theory (Quick)
- **Market Graph:** Stocks = nodes, relationships = edges.
- **3 Edge Types:**
  1. **Sector edges** — same sector stocks connected (from `stocks.py`)
  2. **Correlation edges** — rolling 60-day Pearson > 0.6 (recomputed DAILY)
  3. **Supply chain edges** — manual mapping (TATASTEEL->MARUTI etc.)
- **Dynamic:** Correlation edges change daily. Graph structure CHANGES during crashes (all correlated).
- **Output:** PyG `Data` object with node features + `edge_index` per day. Save as `data/graphs/{date}.pt`.

### Implementation Checklist

- [ ] Create `src/graph/graph_builder.py`:
  - Sector edges from `stocks.py` (static)
  - Correlation edges: rolling 60-day Pearson > 0.6 threshold (dynamic, daily)
  - Supply chain edges: manual mapping (static)
  - Combine all 3 edge types into single `edge_index`
  - Output: PyG `Data` object per day
  - Pre-compute and save as `.pt` files
- [ ] Supply chain mapping dictionary (reasonable defaults)

### Test Cases (tests/test_graph.py)

| ID | Test | Assertion |
|----|------|-----------|
| T4.1 | Node count | N nodes = num stocks |
| T4.2 | Sector edges correct | HDFCBANK-ICICIBANK-SBIN-AXISBANK all connected |
| T4.3 | Correlation edges dynamic | Different graph on different dates |
| T4.4 | No self-loops | No stock connected to itself |
| T4.5 | Undirected graph | A[i][j] == A[j][i] |
| T4.6 | Save/load works | Saved `.pt` matches original |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E4.1 | Isolated node (no correlations) | Still include, GNN handles via self-loop |
| E4.2 | Crash period (all correlated) | Graph becomes almost fully connected — expected |
| E4.3 | New stock added mid-timeline | Handle dynamic node count |
| E4.4 | Negative correlation | Treat as edge too (inverse relationship = information) |

### Pass Criteria + Integration Test 1

**INTEGRATION TEST 1:** Data -> Features -> Sentiment -> Graph — full pipeline end-to-end
| ID | Test |
|----|------|
| IT1.1 | Raw NIFTY data -> features -> sentiment -> graph with embeddings runs end-to-end |
| IT1.2 | No data leakage: features at time T use only data <= T |
| IT1.3 | All stocks have aligned dates (same trading days) |

**Git commit:** `"Phase 4: Dynamic graph construction complete + Integration Test 1 passed"`

---

---

# PHASE 5: T-GAT Model (D8-D10)

**Timeline:** Day 8-10
**Goal:** Temporal Graph Attention Network producing 64-dim embeddings per stock
**Files:** `src/graph/tgat.py`

### Theory (Quick)
- **Message Passing:** Har node apne neighbors se information collect karta hai, aggregate, transform, update. Multiple rounds = deeper reach.
- **GAT (Graph Attention):** Attention mechanism decides kaunsa neighbor kitna important. Weights dynamically learned.
- **Temporal:** T-GAT = time-varying attention. Graph har din rebuild hoti hai, GAT fresh attention compute karta hai.
- **Multi-head:** K=4 heads independently compute attention, then concatenate.
- **Mini-batching:** NeighborSampler — 15 neighbors max, 2-hop. VRAM friendly.

### Implementation Checklist

- [ ] Create `src/graph/tgat.py`:
  - 2-layer multi-head GAT (4 heads)
  - Input: node features -> Output: 64-dim embedding per stock
  - Layer Normalization (PyG default)
  - FP16 training via `torch.cuda.amp`
  - NeighborSampler/NeighborLoader for mini-batching
  - Model checkpoint save/load
- [ ] Training loop with gradient accumulation (batch 16 * 4 = 64 effective)
- [ ] GPU memory monitoring throughout

### Test Cases (tests/test_gnn.py)

| ID | Test | Assertion |
|----|------|-----------|
| T5.1 | Output shape | `[num_stocks, 64]` (64-dim embedding per stock) |
| T5.2 | Attention weights | Sum to 1.0 for each node's neighbors |
| T5.3 | Temporal sensitivity | Different input dates -> different embeddings |
| T5.4 | VRAM usage | FP16 training < 1.5GB |
| T5.5 | NeighborSampler | Handles batch of 16 stocks |
| T5.6 | Gradient check | No NaN in gradients after 10 steps |
| T5.7 | Checkpoint | Save and load correctly |
| T5.8 | Embedding quality | Same-sector stocks closer (cosine similarity) |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E5.1 | Disconnected node | Self-loop ensures embedding still produced |
| E5.2 | Very dense graph (crash) | NeighborSampler caps at 15 neighbors |
| E5.3 | GPU OOM | Reduce batch size, verify FP16 active |

### Pass Criteria
**Git commit:** `"Phase 5: T-GAT model complete — 64-dim embeddings working"`

---

---

# PHASE 6: RL Environment (D10-D12)

**Timeline:** Day 10-12
**Goal:** Custom Gymnasium trading environment with risk controls
**Files:** `src/rl/trading_env.py`, `src/rl/reward.py`

### Theory (Quick)
- **Gymnasium Env:** `reset()` -> initial state, `step(action)` -> next_state, reward, done, info
- **State:** [GNN_embeddings (64) + technical_features (27) + sentiment (1)] = ~92 features per stock x ~45 stocks
- **Action:** Continuous portfolio weights. Length = num_stocks. Softmax ensures sum = 1.0
- **Reward:** `daily_sharpe - 0.1*drawdown_penalty - 0.01*turnover_penalty`
- **Risk Controls:** Max position 20%, stop-loss -5% per stock, circuit breaker -15% portfolio drawdown

### Implementation Checklist

- [ ] Create `src/rl/trading_env.py`:
  - Custom Gymnasium environment
  - State space: GNN embeddings + technical features + sentiment
  - Action space: Continuous vector, softmax -> weights sum to 1.0
  - Transaction costs (0.1%) + slippage (0.05%) deducted
  - Risk management: max_position=20%, stop_loss=-5%, circuit_breaker=-15%
  - Episode length: 252 trading days
  - Portfolio value tracking with full trade log
- [ ] Create `src/rl/reward.py`:
  - Sharpe-based reward with penalties
  - `reward = sharpe_daily - lambda1 * drawdown - lambda2 * turnover`

### Test Cases (tests/test_env.py)

| ID | Test | Assertion |
|----|------|-----------|
| T6.1 | reset() | Returns valid observation (correct shape, no NaN) |
| T6.2 | step() | Returns observation, reward, done, info |
| T6.3 | Weight constraint | Portfolio weights sum to 1.0 after softmax |
| T6.4 | Transaction cost | 0.1% of turnover deducted correctly |
| T6.5 | Episode length | Ends after 252 trading days |
| T6.6 | Reward finite | No NaN, no inf |
| T6.7 | Portfolio tracking | Value tracking matches manual calculation |
| T6.8 | Stop-loss | Triggers at -5% per stock |
| T6.9 | Circuit breaker | Triggers at -15% portfolio drawdown |
| T6.10 | Max position | No stock > 20% enforced |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E6.1 | All stocks go to zero | Handle gracefully, episode ends |
| E6.2 | Negative weights from agent | Clamp to 0 before softmax |
| E6.3 | Single stock remaining | Still valid portfolio |
| E6.4 | Weekend/holiday in data | Env skips to next trading day |
| E6.5 | Sharpe div-by-zero (std=0) | Add epsilon |
| E6.6 | Portfolio < 1 rupee | Mark bankrupt, end episode |

### Pass Criteria
**Git commit:** `"Phase 6: RL environment complete — random agent plays full episode"`

---

---

# PHASE 7: Deep RL Agent (D12-D17)

**Timeline:** Day 12-17
**Goal:** Train PPO + SAC, compare, pick winner
**Files:** `src/rl/ppo.py`, `src/rl/sac.py`

### Theory (Quick)
- **PPO:** Policy Gradient + Clipping. Max 20% policy change per update. Stable training.
  - `L_CLIP = min(r_t * A_t, clip(r_t, 1-eps, 1+eps) * A_t)` where eps=0.2
- **SAC:** Off-policy + Maximum Entropy. Replay buffer reuses old data. Entropy encourages exploration.
  - `J_SAC = E[sum(r_t + alpha * H(pi(.|s_t)))]`
- **Training:** Train 2015-2021. Validate 2022-2023. Test 2024-2025 (ONCE).
- **Walk-Forward:** Train on expanding window, validate on next quarter. 500K-1M timesteps.

### Implementation Checklist

- [ ] Create `src/rl/ppo.py` — PPO agent:
  - lr=3e-4, n_steps=2048, batch_size=64, n_epochs=10, gamma=0.99, clip=0.2
  - FP16 via `torch.cuda.amp` (~800MB VRAM)
  - Early stop if validation Sharpe plateaus for 50K steps
- [ ] Create `src/rl/sac.py` — SAC agent:
  - lr=3e-4, buffer_size=100000, batch_size=256, tau=0.005, ent_coef=auto
- [ ] Walk-forward validation implementation:
  - window=252 (1 year), step=63 (1 quarter)
  - Per quarter Sharpe reported
- [ ] PPO vs SAC comparison table (Sharpe, MaxDD, Sortino, Calmar, Turnover)
- [ ] Pick winner for all subsequent experiments

### Test Cases (tests/test_rl.py)

| ID | Test | Assertion |
|----|------|-----------|
| T7.1 | Convergence | Reward increases over training |
| T7.2 | Beats baseline | Beats buy-and-hold on validation |
| T7.3 | No NaN actions | All output weights valid |
| T7.4 | Sharpe target | Sharpe > 1.0 on validation |
| T7.5 | Checkpoint | Save and load correctly |
| T7.6 | Comparison | PPO vs SAC table generated |
| T7.7 | Risk compliance | Risk limits respected in all episodes |
| T7.8 | Reproducibility | Same seed = same results |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E7.1 | Reward hacking | Agent exploits env bug — verify reward logic |
| E7.2 | Catastrophic forgetting | Monitor performance on older periods |
| E7.3 | Action collapse | All weight to one stock — entropy bonus |
| E7.4 | Training divergence | LR too high — reduce, restart from checkpoint |

### Pass Criteria + Integration Test 2

**INTEGRATION TEST 2:** Data -> GNN -> RL -> Agent trades full episode end-to-end
| ID | Test |
|----|------|
| IT2.1 | GNN embeddings feed into RL state correctly |
| IT2.2 | RL agent trades for full episode without crash |
| IT2.3 | Backtest results reproducible (same seed = same numbers) |

**Git commit:** `"Phase 7: Deep RL agent trained — PPO/SAC compared, best agent beats NIFTY 50"`

---

---

# PHASE 8-9: TimeGAN + Stress Testing (D18-D24)

**Timeline:** Day 18-24
**Goal:** Generate realistic synthetic market data + stress test RL agent
**Files:** `src/gan/timegan.py`, `src/gan/conditional.py`, `src/gan/stress_test.py`

### Theory (Quick)
- **TimeGAN:** 4 networks — Embedder (real->latent), Recovery (latent->real), Generator (noise->fake latent), Discriminator (real vs fake in latent).
- **3 Losses:** Reconstruction (faithful encode/decode), Supervised (temporal dynamics), Adversarial (fool discriminator).
- **Conditional:** Condition vector `c = [normal=0, crash_2008=1, crash_covid=2, flash_crash=3]` controls output type.
- **Config:** seq_length=128, latent_dim=64, hidden=128, 3 LSTM layers, 500 epochs, lr=5e-4. ~600MB VRAM, ~2-3 hours.
- **Stress Test:** Generate 1000 scenarios, run RL agent, measure survival rate. VaR at 95% and 99%.

### Implementation Checklist

- [ ] Create `src/gan/timegan.py`:
  - 4 LSTM-based networks (embedder, recovery, generator, discriminator)
  - 3 loss functions (reconstruction + supervised + adversarial)
  - FP16 training, gradient accumulation (batch 32 * 4 = 128)
- [ ] Create `src/gan/conditional.py`:
  - Conditional variant — condition vector concatenated to generator input
  - 4 modes: normal, crash_2008, crash_covid, flash_crash
- [ ] Create `src/gan/stress_test.py`:
  - Generate N scenarios of type X
  - Run RL agent on each scenario
  - Calculate survival rate, VaR (95%, 99%), CVaR
  - Monte Carlo: 10000 synthetic paths for VaR
  - Scenario library save/load
- [ ] Quality validation suite: discriminative score, predictive score, t-SNE

### Test Cases

**TimeGAN (tests/test_gan.py)**

| ID | Test | Assertion |
|----|------|-----------|
| T8.1 | Training converges | Loss decreases over epochs |
| T8.2 | Discriminative score | < 0.3 |
| T8.3 | Predictive score | < 0.15 |
| T8.4 | Output shape | Generated sequence shape = real sequence shape |
| T8.5 | t-SNE overlap | Visual: real and synthetic clusters overlap |
| T8.6 | Conditional modes | Crash vs normal produce different distributions |
| T8.7 | No mode collapse | Generated outputs are diverse |

**Stress Testing (tests/test_stress.py)**

| ID | Test | Assertion |
|----|------|-----------|
| T9.1 | Scenario generation | 1000 scenarios generated successfully |
| T9.2 | RL survival normal | Survives 80%+ normal scenarios |
| T9.3 | Crash realism | Crash scenarios produce realistic drawdowns |
| T9.4 | VaR accuracy | Matches historical VaR within 20% |
| T9.5 | Report generation | Stress test report generates |
| T9.6 | Scenario library | Saves and loads correctly |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E8.1 | Mode collapse (all same output) | Spectral normalization, minibatch discrimination |
| E8.2 | Training instability (loss oscillation) | Reduce LR, add gradient penalty |
| E8.3 | Very short sequences | Pad to min_length |
| E8.4 | Negative prices in generated data | Clip to 0, log warning |
| E9.1 | All synthetic scenarios identical | GAN quality issue — retrain |
| E9.2 | RL crashes on extreme scenario | Graceful handling, log failure |
| E9.3 | VaR on very short history | Minimum 100 scenarios for stable estimate |

### Pass Criteria
**Git commit:** `"Phase 8-9: TimeGAN + stress testing complete — 1000 scenarios, VaR computed"`

---

---

# PHASE 10: NAS / DARTS (D25-D30)

**Timeline:** Day 25-30
**Goal:** Auto-discover optimal architectures for RL policy + GNN
**Files:** `src/nas/search_space.py`, `src/nas/darts.py`

### Theory (Quick)
- **DARTS:** Differentiable Architecture Search. Architecture selection ko continuous bana do -> gradient descent se optimize.
- **Supernet:** All possible operations simultaneously present. Architecture weights (alpha) decide which op is best.
- **Bilevel optimization:** Outer loop = alpha (architecture), Inner loop = weights (model).
- **Search Space:** Layers (2-6), hidden dims (32-256), attention heads (1-8), skip connections, aggregation types, activation functions.
- **VRAM:** ~1.5GB for supernet. FP16 essential. ~6-8 hours per search.

### Implementation Checklist

- [ ] Create `src/nas/search_space.py`:
  - Define operation candidates (linear, conv1d, attention, skip, none)
  - Layer/dim/head search ranges
  - Mixed operation with softmax architecture weights
- [ ] Create `src/nas/darts.py`:
  - DARTS algorithm implementation
  - Step 1: Apply to RL policy network
  - Step 2: Apply to GNN (T-GAT)
  - Step 3: Extract top-3 architectures per model
  - Step 4: Retrain from scratch, compare vs hand-designed
  - FP16 + gradient accumulation for VRAM management
- [ ] Generate NAS report: architecture topology, comparison table, figures for thesis

### Test Cases (tests/test_nas.py)

| ID | Test | Assertion |
|----|------|-----------|
| T10.1 | Supernet VRAM | < 1.5GB |
| T10.2 | Alpha convergence | Architecture weights converge |
| T10.3 | Architecture extraction | Top-3 architectures extracted successfully |
| T10.4 | NAS beats hand-designed | Retrained arch Sharpe > hand-designed Sharpe |
| T10.5 | NAS report | Report generated with figures |
| T10.6 | Reproducibility | Same seed = same architecture |
| T10.7 | Dual application | Applied to both RL and GNN |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E10.1 | All architectures similar | Poor search space — expand options |
| E10.2 | Supernet OOM | Reduce search space, increase grad accumulation |
| E10.3 | Skip connection dominance | Edge normalization, progressive pruning |

### Pass Criteria
**Git commit:** `"Phase 10: NAS complete — optimized architecture beats hand-designed by >5%"`

---

---

# PHASE 11: Federated Learning (D31-D37)

**Timeline:** Day 31-37
**Goal:** 4 simulated institutional clients + privacy-preserving training
**Files:** `src/federated/fl_server.py`, `src/federated/fl_client.py`, `src/federated/privacy.py`

### Theory (Quick)
- **FedAvg:** Server sends global model -> clients train locally -> send weights back -> server averages. Repeat T rounds.
- **FedProx:** Adds proximal term `(mu/2) * ||W_k - W_t||^2` to handle non-IID data. mu=0.01.
- **Differential Privacy (DP-SGD):** Clip gradients (max norm C=1.0) + add Gaussian noise. epsilon=8, delta=1e-5.
- **Setup:** 4 clients (simulated hedge funds) with different NIFTY subsets. 50 rounds, 5 local epochs.

### Implementation Checklist

- [ ] Create `src/federated/fl_server.py`:
  - Global model initialization
  - FedAvg aggregation (weighted by dataset size)
  - FedProx aggregation (with proximal term)
  - Convergence monitoring, round-wise metrics
- [ ] Create `src/federated/fl_client.py`:
  - 4 simulated clients with different stock subsets (e.g., Banking-only, IT-only, Mixed, All)
  - Local training for E=5 epochs per round
  - Send updated weights to server
- [ ] Create `src/federated/privacy.py`:
  - DP-SGD: per-sample gradient clipping + Gaussian noise
  - Privacy budget tracker (epsilon accumulates per round)
  - epsilon=8, delta=1e-5, max_grad_norm=1.0
- [ ] Comparison: federated vs individual training. Target: 15-25% improvement.

### Test Cases (tests/test_fl.py)

| ID | Test | Assertion |
|----|------|-----------|
| T11.1 | Client init | 4 clients initialize correctly |
| T11.2 | FL convergence | Loss decreases across rounds |
| T11.3 | FedAvg vs FedProx | Comparison table generated |
| T11.4 | Federated > Individual | Performance improvement >= 15% |
| T11.5 | DP doesn't destroy model | epsilon=8 still produces usable model |
| T11.6 | Privacy budget tracking | Epsilon accumulates correctly per round |
| T11.7 | Per-client fairness | No single client dominates |
| T11.8 | Convergence curve | Plots generated |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E11.1 | Byzantine client (garbage data) | Detect via validation, exclude |
| E11.2 | Extremely non-IID (one client = banking only) | FedProx handles with proximal term |
| E11.3 | DP epsilon too small (model useless) | Minimum epsilon=4 threshold |
| E11.4 | Client disconnects mid-round | Skip client, proceed with available |

### Pass Criteria + Integration Test 3

**INTEGRATION TEST 3:** Full pipeline Data -> GNN -> RL -> GAN -> NAS -> FL all connected
| ID | Test |
|----|------|
| IT2.4 | TimeGAN scenarios accepted by stress test module |

**Git commit:** `"Phase 11: Federated learning complete — FL beats individual, privacy verified"`

---

---

# PHASE 12: Quantum ML (D38-D42)

**Timeline:** Day 38-42
**Goal:** QAOA + VQC for portfolio optimization + benchmark vs classical
**Files:** `src/quantum/qaoa.py`, `src/quantum/vqc.py`

### Theory (Quick)
- **QAOA:** Encode portfolio selection as QUBO. Quantum circuit with p=3 layers. AerSimulator (CPU only, 0 VRAM). 1024 shots.
- **VQC:** Hybrid — classical features -> parameterized quantum circuit (RY+CNOT) -> classical optimizer.
- **Benchmark:** QAOA vs brute-force vs greedy vs RL for 4, 6, 8, 10, 12 assets. Runtime scaling curve.

### Implementation Checklist

- [ ] Create `src/quantum/qaoa.py`:
  - Portfolio as QUBO: `min x^T Q x` where x_i in {0,1}
  - Q matrix from expected returns + covariance
  - QAOA circuit: p=3 layers, 8-12 assets
  - AerSimulator, 1024 shots
  - Classical optimizer (COBYLA) for variational parameters
- [ ] Create `src/quantum/vqc.py`:
  - Hybrid architecture: Classical NN -> VQC (4-8 qubits, RY+CNOT) -> Classical
  - Classical Adam optimizer tunes both classical + quantum params
- [ ] Benchmark suite: compare QAOA vs brute-force vs greedy vs RL
- [ ] Runtime analysis: computation time vs number of assets (scaling curve)

### Test Cases (tests/test_quantum.py)

| ID | Test | Assertion |
|----|------|-----------|
| T12.1 | Circuit runs | Qiskit AerSimulator executes without error |
| T12.2 | QAOA result | Finds valid portfolio (correct number of assets) |
| T12.3 | VQC converges | Training loss decreases |
| T12.4 | Quantum vs classical | Comparison table generated |
| T12.5 | Runtime scaling | Plot generated for 4-12 assets |
| T12.6 | Reproducibility | Results reproducible |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E12.1 | >12 qubits too slow | Cap at 10 qubits for simulation |
| E12.2 | Degenerate solutions | Multiple optimal — pick any valid |
| E12.3 | Simulator memory limit | Reduce shot count, qubit count |

### Pass Criteria
**Git commit:** `"Phase 12: Quantum ML complete — QAOA + VQC benchmarked"`

---

---

# PHASE 13: API + Docker (D43-D46)

**Timeline:** Day 43-46
**Goal:** 14 REST API endpoints + Docker deployment
**Files:** `src/api/main.py`, `Dockerfile`, `docker-compose.yml`

### 14 API Endpoints

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/health` | System health check |
| 2 | GET | `/stocks` | List all NIFTY 50 stocks |
| 3 | GET | `/stocks/{ticker}/price` | Historical prices |
| 4 | GET | `/stocks/{ticker}/features` | Technical indicators |
| 5 | GET | `/stocks/{ticker}/sentiment` | Sentiment scores |
| 6 | GET | `/graph/{date}` | Market graph for date |
| 7 | GET | `/graph/{date}/attention` | Attention heatmap |
| 8 | POST | `/predict` | Portfolio weight prediction |
| 9 | POST | `/backtest` | Run backtest with params |
| 10 | POST | `/stress-test` | Generate stress scenarios |
| 11 | GET | `/portfolio/performance` | Portfolio metrics |
| 12 | GET | `/fl/status` | Federated learning status |
| 13 | GET | `/quantum/optimize` | Quantum portfolio optimization |
| 14 | GET | `/nas/architecture` | NAS-found architecture info |

### Implementation Checklist

- [ ] Create `src/api/main.py`:
  - FastAPI app with CORS middleware
  - All 14 endpoints with Pydantic request/response models
  - Swagger docs auto-generated at `/docs`
  - Error handling: 422 for invalid input, 404 for unknown ticker
- [ ] Pydantic validation models:
  ```python
  class BacktestRequest(BaseModel):
      start_date: date
      end_date: date
      initial_capital: float = Field(default=10000000, ge=100000)
      risk_level: str = Field(default='medium', pattern='^(low|medium|high)$')
  ```
- [ ] Create `Dockerfile` — Python 3.11, CUDA 12.1, all deps, model files
- [ ] Create `docker-compose.yml` — api (FastAPI) + db (PostgreSQL) + dashboard (Next.js)
- [ ] Health check: `/health` returns `{status: 'ok', modules: [list]}`

### Test Cases (tests/test_api.py)

| ID | Test | Assertion |
|----|------|-----------|
| T13.1 | All endpoints 200 | All 14 return 200 on valid input |
| T13.2 | Invalid input | Returns 422 with clear error |
| T13.3 | Unknown ticker | Returns 404 |
| T13.4 | Swagger docs | Available at /docs |
| T13.5 | Response time | < 500ms for GET endpoints |
| T13.6 | Docker build | Succeeds without errors |
| T13.7 | docker-compose up | All services start |
| T13.8 | API accessible | localhost:8000 responds |
| T13.9 | Health check | /health returns ok |
| T13.10 | Concurrency | 10 parallel requests don't crash |

### Edge Cases

| ID | Edge Case | Handling |
|----|-----------|----------|
| E13.1 | Invalid date format | Clear 422 error, not 500 |
| E13.2 | Future date requested | 'Data not available yet' |
| E13.3 | Server OOM | Graceful degradation |
| E13.4 | PostgreSQL connection lost | Retry with backoff |
| E13.5 | Very large backtest range | Timeout handling |

### Pass Criteria + Integration Test 4

**INTEGRATION TEST 4 (Final):**
| ID | Test |
|----|------|
| IT3.1 | docker-compose up -> all healthy -> API responds -> dashboard loads |
| IT3.2 | Upload stock -> get prediction -> run backtest -> get report |
| IT3.3 | All 14 API endpoints work with real data |
| IT3.4 | System handles 10 concurrent users without crash |

**Git commit:** `"Phase 13: API + Docker complete — 14 endpoints, one-command deployment"`

---

---

# PHASE 14: Dashboard + Benchmarks (D46-D49)

**Timeline:** Day 46-49
**Goal:** Interactive dashboard + 12 baseline comparisons
**Files:** `dashboard/` (Next.js 14)

### 8 Dashboard Views

| # | View | Content |
|---|------|---------|
| 1 | Portfolio Performance | Cumulative returns, drawdown chart, metrics table |
| 2 | Asset Allocation | Heatmap of portfolio weights over time |
| 3 | Market Graph | Interactive node-link diagram, click stock for details |
| 4 | Sentiment Timeline | Per-stock sentiment line chart, event markers |
| 5 | FL Convergence | Round-wise loss curves, per-client contribution |
| 6 | NAS Architecture | Topology visualization, comparison table |
| 7 | Quantum Comparison | QAOA vs classical bar chart, scaling curve |
| 8 | Stress Test Report | Scenario survival heatmap, VaR gauges |

### 12 Baselines to Compute

| # | Baseline | Type |
|---|----------|------|
| 1 | Equal Weight (1/N) | Classical |
| 2 | Markowitz Mean-Variance | Classical |
| 3 | Risk Parity | Classical |
| 4 | Minimum Variance | Classical |
| 5 | NIFTY 50 Buy-and-Hold | Market Index |
| 6 | Ours - without GNN | Ablation |
| 7 | Ours - without Sentiment | Ablation |
| 8 | Ours - without NAS | Ablation |
| 9 | Ours - without FL | Ablation |
| 10 | Ours - without Stress Testing | Ablation |
| 11 | Ours - PPO only (no SAC comparison) | Ablation |
| 12 | FinRL library baseline | External |

**Statistical tests:** Paired t-test + Wilcoxon signed-rank across 5 random seeds for ALL comparisons. p < 0.05 = significant.

### Implementation Checklist

- [ ] Set up Next.js 14 project in `dashboard/`
- [ ] Create all 8 views connecting to FastAPI endpoints
- [ ] Compute all 12 baselines
- [ ] Run statistical significance tests (5 seeds)
- [ ] Generate all thesis-ready figures
- [ ] Export benchmark comparison tables

### Pass Criteria
**Git commit:** `"Phase 14: Dashboard + 12 baselines complete — all figures thesis-ready"`

---

---

# PHASE 15: Thesis + Demo (D50-D56)

**Timeline:** Day 50-56
**Goal:** 80-100 page thesis, demo, viva preparation

### Thesis Structure (6 Chapters)

| Ch | Title | Pages |
|----|-------|-------|
| 1 | Introduction | 8-10 |
| 2 | Literature Review | 15-20 |
| 3 | Methodology | 25-30 |
| 4 | Experiments & Results | 20-25 |
| 5 | Discussion & Analysis | 8-10 |
| 6 | Conclusion & Future Work | 5-8 |

### 5 Research Contributions

1. **C1:** T-GAT for dynamic inter-asset relationship modeling — first time-varying graph attention for financial markets
2. **C2:** DARTS-based NAS for Deep RL policy networks in finance — first differentiable NAS for trading agents
3. **C3:** Conditional TimeGAN for black swan synthesis — extends TimeGAN with crash-conditioned generation
4. **C4:** Federated Deep RL with differential privacy — first privacy-preserving collaborative portfolio learning
5. **C5:** QAOA + VQC hybrid quantum vs Deep RL benchmark — first direct comparison at realistic portfolio sizes

### Implementation Checklist

- [ ] Write all 6 thesis chapters (80-100 pages)
- [ ] Include 60-80 references
- [ ] All figures from dashboard/experiments
- [ ] 5-minute demo walkthrough script
- [ ] Docker-compose up -> show dashboard -> run backtest -> show stress test -> explain FL
- [ ] 15 viva slides (problem, 7 techniques, results, conclusions)

### Pass Criteria
**Git commit:** `"Phase 15: Thesis + demo complete — PROJECT DONE"`

---

---

# Final Verification Checklist (20 Items)

- [ ] 40+ NIFTY 50 stocks clean data with 27 features each (normalized)
- [ ] FinBERT trained, F1 > 0.75, sentiment scores per stock per day
- [ ] Dynamic market graph with 3 edge types, rebuilt daily
- [ ] T-GAT producing 64-dim embeddings, attention heatmap working
- [ ] RL environment with risk controls, transaction costs, 252-day episodes
- [ ] PPO/SAC agent beating NIFTY 50 index, Sharpe > 1.5 on validation
- [ ] TimeGAN generating realistic scenarios, quality metrics passed
- [ ] Stress testing: 1000 scenarios, survival rate > 80%, VaR computed
- [ ] NAS-optimized architecture beats hand-designed by > 5%
- [ ] FL with 4 clients, federated > individual by 15%+, privacy epsilon=8
- [ ] Quantum QAOA + VQC working, benchmark table ready
- [ ] 14 API endpoints working, Swagger docs generated
- [ ] Docker: one command deployment works
- [ ] Dashboard: 8 views, all data flowing
- [ ] 12 baselines computed with statistical significance tests
- [ ] 124 unit tests + 54 edge cases + 11 integration tests = ALL GREEN
- [ ] Thesis: 80-100 pages, 6 chapters, 60-80 references
- [ ] Demo: 5-minute walkthrough script prepared
- [ ] Viva: 15 slides ready
- [ ] Git: clean history, meaningful commits per phase

---

---

# Finalized Decisions (All Questions Resolved)

## 1. Environment & Setup (CONFIRMED)

| Item | Decision |
|------|----------|
| Python | **3.11.9** (via existing venv) |
| GPU | NVIDIA GeForce RTX 3050 Laptop GPU (4GB VRAM) |
| CUDA | **12.1** |
| PyTorch Install | `pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121` |
| venv | Already set up at `fqn1/venv`, use existing |

## 2. Data & Market (CONFIRMED)

| Item | Decision |
|------|----------|
| Date range | **2015-01-01 to 2025-present** (latest available via yfinance) |
| News source | **Google News RSS** (free, no API key needed, decent coverage for Indian stocks). Fallback: Financial PhraseBank for fine-tuning, pre-cached sentiment for historical dates |
| Supply chain mapping | **We will create a reasonable default** mapping for NIFTY 50 (e.g., TATASTEEL->MARUTI, RELIANCE->ONGC, TCS->INFY etc.) |

## 3. Scope & Priority (CONFIRMED)

| Item | Decision |
|------|----------|
| Timeline | **Flexible** — quality over speed |
| Phase priority | See priority tiers below |
| FinRL baseline | **Actually install and run** FinRL library for fair comparison |

### Phase Priority Tiers

| Tier | Phases | Status |
|------|--------|--------|
| **P0 — MUST HAVE (Core)** | Phase 0-7 (Setup, Data, Features, Sentiment, Graph, T-GAT, RL Env, RL Agent) | Non-negotiable. Yeh bina project exist nahi karta. |
| **P1 — MUST HAVE (Differentiators)** | Phase 8-9 (TimeGAN + Stress), Phase 11 (FL), Phase 13 (API + Docker) | Thesis ke 5 contributions ke liye zaruri. |
| **P2 — IMPORTANT** | Phase 10 (NAS/DARTS), Phase 14 (Dashboard + Benchmarks), Phase 15 (Thesis) | Important but can be simplified if time runs short. |
| **P3 — CAN SIMPLIFY** | Phase 12 (Quantum ML) | Can be reduced to QAOA-only (drop VQC) if tight on time. Still needed for thesis contribution C5. |

## 4. Tooling (CONFIRMED)

| Item | Decision | Reasoning |
|------|----------|-----------|
| Experiment tracking | **W&B (Weights & Biases)** | Better UI, easier to learn, free for personal use. Will teach as we go. |
| Dashboard | **Next.js 14** | Proper production-grade UI. Best frontend experience. |
| Database | **PostgreSQL** via Docker | Production-grade. Docker makes setup easy. |

## 5. Git & Workflow (CONFIRMED)

| Item | Decision |
|------|----------|
| Git | **Local git first**, GitHub repo later when everything is working |
| Branching | **POC first on main**, then phase-wise branches once stable |
| Workflow | Build -> Test -> All GREEN -> Git commit -> Next Phase |

---

> **All decisions locked. Phase 0 build shuru.**
> **Har phase ke end pe: tests run -> all GREEN -> git commit -> next phase.**
