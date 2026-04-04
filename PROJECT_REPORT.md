# CoinPulse — Detailed Project Report

> **Date:** April 4, 2026 · **Version:** 0.2.0 (The Web3 Update)

---

## 1. Project Overview

**CoinPulse** is a high-performance, real-time cryptocurrency analytics dashboard and trading terminal. Originally built for market intelligence, the platform has been evolved into a **Web3-enabled dashboard** that combines real-time data streams (Binance & CoinGecko) with on-chain functionality (Sepolia Smart Contract Watchlist).

**Key Mission:** Provide a seamless bridge between Web2 market data and Web3 personal portfolio management.

---

## 2. Tech Stack

| Layer             | Technology                        | Version     |
| ----------------- | --------------------------------- | ----------- |
| **Framework**     | Next.js (App Router)              | 16.1.0      |
| **Language**      | TypeScript                        | ^5          |
| **Blockchain**    | Wagmi + Viem + Sepolia Testnet   | Latest      |
| **Smart Contract**| Solidity (EVM)                    | 0.8.0       |
| **UI Library**    | React                             | 19.2.3      |
| **Styling**       | Tailwind CSS v4 + PostCSS         | ^4          |
| **Data Sources**  | CoinGecko API + Binance WebSocket | Mixed       |
| **Charting**      | TradingView Lightweight Charts    | ^5.1.0      |
| **Icons**         | Lucide React                      | ^0.562.0    |

### Major Recent Additions
- **Wagmi/Viem:** For MetaMask connection and Smart Contract interaction.
- **Binance WebSocket:** High-frequency live price stream for the hero section.
- **Lucide Icons:** Enhanced visual cues for Web3 actions.

---

## 3. Project Architecture (Updated)

### 3.1 Directory Structure Highlights

```
coinpulse/
├── app/
│   ├── layout.tsx              # Web3Provider wrapping the app
│   ├── page.tsx                # Dashboard with WatchlistSection
│   └── coins/
│       └── [id]/
│           └── page.tsx        # Detail page with WatchlistButton
├── components/
│   ├── CategorySelector.tsx    # [NEW] URL-based category filter
│   ├── WatchlistButton.tsx     # [NEW] Web3 Toggle (Add/Remove on-chain)
│   ├── WatchlistSection.tsx    # [NEW] Real-time On-Chain Watchlist display
│   ├── Web3Provider.tsx        # [NEW] Wagmi/RainbowKit Config
│   ├── lib/
│   │   └── contractConfig.ts   # [NEW] V2 Contract Address & ABI
├── hooks/
│   └── useBinanceLiveStream.ts # [NEW] Real-time price stream from Binance
├── lib/
│   ├── coingecko.actions.ts    # Market data fetching logic
│   └── contractConfig.ts       # Smart Contract metadata
```

---

## 4. Feature Breakdown & Implementation

### 4.1 Real-Time Crypto Terminal
- **Binance Live Stream:** The Home page Bitcoin card uses a dedicated `useBinanceLiveStream` hook for sub-second price updates, bypassing CoinGecko's interval-based updates for a "Trading Terminal" feel.
- **Optimized UI:** Price changes are highlighted with color-coded success/danger badges and dynamic percentage indicators.

### 4.2 Web3 On-Chain Watchlist (V2)
- **Smart Contract:** A custom Solidity contract deployed on **Sepolia (0x7C6a623Ec16d436cc4EFcF959Ed2Ef2F71A64654)**.
- **Add/Remove Logic:**
    - `WatchlistButton` detects if a coin is already on-chain.
    - **Optimistic UI:** Clicking the star toggles the visual state instantly while the transaction clears in the background.
    - **Transaction Safety:** Automatically rolls back the UI state if the user rejects the MetaMask request.
- **Read Operation:** `WatchlistSection` fetches the user's saved IDs from the blockchain and hydrates them with live price data from CoinGecko.

### 4.3 Advanced Filtering System
- **Category Selector:** A custom dropdown integrated into the Header that synchronizes with Next.js URL parameters.
- **State-Persistence:** Filters like "DeFi", "Gaming", or "Meme Coins" are stored in the URL, allowing users to bookmark filtered views or share them with others.
- **Cross-Page Support:** The selector works seamlessly on both the Home Dashboard and the detailed "All Coins" market table.

---

## 5. Smart Contract Details (V2)

**Address:** `0x7C6a623Ec16d436cc4EFcF959Ed2Ef2F71A64654`  
**Network:** Sepolia Testnet  
**Functions:**
- `addCoin(string _coinId)`: Saves a CoinGecko ID to the user's specific array.
- `removeCoin(string _coinId)`: Efficiently pops an ID from the user's list.
- `getMyWatchlist()`: View function to retrieve all saved IDs for the connected wallet.

---

## 6. Data Flow

### The Web3 Loop
1. **User Action:** Clicks `WatchlistButton`.
2. **Optimistic Update:** React state flags `isSaved` to `true` instantly.
3. **Transaction:** Wagmi's `useWriteContract` sends a request to MetaMask.
4. **Blockchain Event:** Contract emits `CoinAdded`.
5. **Real-time Refresh:** `WatchlistSection` listens for the event via `useWatchContractEvent` and triggers a `refetch()` of the list instantly.

---

## 7. Future Roadmap
- **Portfolio Value Tracking:** Calculate total value of on-chain holdings.
- **Price Alerts:** Browser notifications when watched coins hit target prices.
- **Swap Integration:** Integrate Uniswap/PancakeSwap widgets for direct trading.

---

> **Summary:** CoinPulse has successfully bridged the gap between a high-frequency trading dashboard and a decentralized personal watchlist. With Binance-powered live prices and Sepolia-backed data persistence, it represents a modern approach to crypto asset management.
