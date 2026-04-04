# CoinPulse — Detailed Project Report

> **Date:** April 4, 2026 · **Version:** 0.2.0 (The Web3 Update)

---

## 1. Project Overview

**CoinPulse** (also titled _CryptoPulse — Analytics Dashboard_) is a high-performance cryptocurrency analytics dashboard and trading terminal. Built with Next.js 16, it delivers **real-time market intelligence** by combining CoinGecko's vast data repository with high-frequency streams from Binance and on-chain persistence via Ethereum (Sepolia).

**Key Mission:** Provide a seamless, "all-in-one" experience where users can discover tokens, track live prices with sub-second accuracy, and manage an on-chain watchlist.

---

## 2. Tech Stack

| Layer             | Technology                        | Version     |
| ----------------- | --------------------------------- | ----------- |
| **Framework**     | Next.js (App Router)              | 16.1.0      |
| **Language**      | TypeScript                        | ^5          |
| **Blockchain**    | Wagmi + Viem + Sepolia Testnet    | Latest      |
| **Smart Contract**| Solidity (EVM)                    | 0.8.0       |
| **UI Library**    | React                             | 19.2.3      |
| **Styling**       | Tailwind CSS v4 + PostCSS         | ^4          |
| **UI Components** | shadcn/ui (Radix Primitives)      | —           |
| **Charting**      | TradingView Lightweight Charts    | ^5.1.0      |
| **Data Sources**  | CoinGecko API + Binance WebSocket | Mixed       |
| **Icons**         | Lucide React                      | ^0.562.0    |
| **Fonts**         | Geist + Geist Mono (Google Fonts) | —           |

---

## 3. Project Architecture

### 3.1 Directory Structure

```
coinpulse/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Web3Provider wrapping the app
│   ├── page.tsx                # Home dashboard
│   └── coins/
│       ├── page.tsx            # All Coins — paginated market table
│       └── [id]/
│           └── page.tsx        # Coin Detail — live data + charting
├── components/
│   ├── CategorySelector.tsx    # [NEW] URL-based category filtering
│   ├── WatchlistButton.tsx     # [NEW] Web3 Toggle (Add/Remove on-chain)
│   ├── WatchlistSection.tsx    # [NEW] Real-time On-Chain Watchlist display
│   ├── Web3Provider.tsx        # [NEW] Wagmi/RainbowKit Config
│   ├── Header.tsx              # Navigation header with CategorySelector
│   ├── SearchModal.tsx         # Global search (Ctrl+K)
│   ├── CandlestickChart.tsx    # TradingView chart component
│   ├── CoinHeader.tsx          # Coin detail header with live stats
│   ├── LiveDataWrapper.tsx     # WebSocket-powered live data hub
│   ├── home/
│   │   ├── CoinOverview.tsx    # Bitcoin overview with live stream hooks
│   │   ├── TrendingCoins.tsx   # Trending coins table
│   │   └── Categories.tsx      # Top crypto market table with category support
├── hooks/
│   ├── useBinanceLiveStream.ts # Real-time price stream from Binance
│   └── useCoinGeckoWebSocket.ts # WebSocket hook for live price/trades
├── lib/
│   ├── coingecko.actions.ts    # Server actions — API fetcher
│   ├── contractConfig.ts       # [NEW] V2 Contract Address & ABI
│   └── utils.ts                # Formatting utilities
├── constants.ts                # Chart config, nav items
└── type.d.ts                   # Global TypeScript types (320+ lines)
```

### 3.2 Rendering Strategy

| Route         | Rendering                   | Description                                                                                      |
| ------------- | --------------------------- | ------------------------------------------------------------------------------------------------ |
| `/` (Home)    | **Server-Side** (async RSC) | Fetches global data, BTC overview, trending coins, and on-chain watchlist with `Suspense`        |
| `/coins`      | **Server-Side** (async RSC) | Paginated market data table with category filter support                                         |
| `/coins/[id]` | **Hybrid** (SSR + Client)   | Server fetches details; `LiveDataWrapper` + `WatchlistButton` handle real-time & Web3 interaction |

---

## 4. Features Breakdown

### 4.1 Real-Time Crypto Terminal
- **Binance Live Stream:** The Home page Bitcoin card uses a dedicated `useBinanceLiveStream` hook for sub-second price updates, providing a professional trading floor feel.
- **Visual Highlights:** Success/Danger color transitions on price changes for instant readability.

### 4.2 Web3 On-Chain Watchlist (V2)
- **Smart Contract:** Custom Solidity contract deployed on **Sepolia (0x7C6a623Ec16d436cc4EFcF959Ed2Ef2F71A64654)**.
- **Optimistic UI:** Clicking the star toggles the visual state instantly while the transaction clears, ensuring zero latency for the user experience.
- **Event-Driven UI:** `WatchlistSection` utilizes `useWatchContractEvent` to listen for on-chain `CoinAdded`/`CoinRemoved` events, triggering an immediate data refresh.

### 4.3 Advanced Market Discovery
- **Category Sector Filtering:** A custom `CategorySelector` synced with Next.js URL parameters (`?category=...`).
- **State Persistence:** Filters are bookmarkable and shareable.
- **Pagination:** Smart ellipsis-based pagination for the "All Coins" market table.

### 4.4 Global Search (`Ctrl+K`)
- **Keyboard shortcut**: `Ctrl+K` / `Cmd+K` to toggle.
- **Debounced search** (300ms) against CoinGecko `/search` endpoint.
- **Full Navigation**: Search results lead directly to asset-specific dashboards.

---

## 5. Real-Time Data Architecture

### 5.1 WebSocket Integration
Managed via `useCoinGeckoWebSocket` and `useBinanceLiveStream`.

| Channel         | Source    | Data                                                      |
| --------------- | --------- | --------------------------------------------------------- |
| `CGSimplePrice` | CoinGecko | Real-time price, 24h change %, market cap, volume         |
| `OnchainTrade`  | CoinGecko | Individual trade events (price, amount, buy/sell)         |
| `btcusdt@ticker`| Binance   | Ultra-fast sub-second price updates for core assets       |

---

## 6. Smart Contract Configuration (V2)

**Address:** `0x7C6a623Ec16d436cc4EFcF959Ed2Ef2F71A64654`  
**Network:** Sepolia Testnet  
**Methods:**
- `addCoin(string _coinId)`: Stores a CoinGecko ID in the user's permanent on-chain array.
- `removeCoin(string _coinId)`: Efficiently deletes a coin by swapping it with the last element and popping.
- `getMyWatchlist()`: View function that returns the full list of saved IDs for the caller's address.

---

## 7. Data Flow

### The Web3 Interaction Loop
1. **User Interaction:** Clicks `WatchlistButton` while on `/coins/[id]`.
2. **Instant Feedback:** `useState` updates the star icon and text immediately (Optimistic).
3. **Transaction Initiation:** `useWriteContract` prompts the MetaMask signature.
4. **On-Chain Execution:** Transaction is mined; contract emits `CoinAdded` or `CoinRemoved`.
5. **Real-time Sync:** `WatchlistSection` (on Home) catches the event and hits `refetch()`.

---

## 8. Development Roadmap (Future)
- **Portfolio Tracking:** Integrate balance fetching to show total USD value of watched coins.
- **Push Notifications:** Alert users when a watched coin hits a specific price target.
- **DeFi Swaps:** Integrated swap widget using Li.Fi or Uniswap SDK.

---

> **Summary:** CoinPulse is a full-featured, production-ready cryptocurrency analytics dashboard. It leverages Next.js 16's App Router with a hybrid SSR + client-side rendering strategy, combining REST APIs for depth, WebSockets for speed, and Ethereum Smart Contracts for owner-controlled data persistence.
