# CoinPulse — Real-Time Web3 Crypto Dashboard

<div align="center">
  <img src="public/readme/readme-hero.webp" alt="Project Banner">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logo=Next.js&logoColor=white" />
    <img src="https://img.shields.io/badge/-Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/-Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/-Wagmi-3E7FF1?style=for-the-badge&logo=wagmi&logoColor=white" />
    <img src="https://img.shields.io/badge/-Sepolia-5A5A5A?style=for-the-badge&logo=ethereum&logoColor=white" />
    <img src="https://img.shields.io/badge/-CoinGecko-06D6A0?style=for-the-badge&logo=coingecko&logoColor=white" />
  </div>

  <h3 align="center">Professional Analytics Terminal & On-Chain Portfolio Manager</h3>
</div>

## 📋 Table of Contents

1. ✨ [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🛡️ [Web3 Integration](#web3-integration)

## <a name="introduction">✨ Introduction</a>

**CoinPulse** is a high-performance cryptocurrency analytics dashboard and trading terminal built with **Next.js 16**, **TailwindCSS v4**, and **Wagmi**. It bridges the gap between Web2 market intelligence and Web3 personal asset management. 

By combining real-time data from **Binance** and **CoinGecko** with a decentralized watchlist stored on the **Sepolia Testnet**, CoinPulse provides a professional-grade environment for tracking and managing crypto assets with zero latency and true ownership.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Next.js 16 (App Router)](https://nextjs.org)**: For the latest React features and lightning-fast server-side rendering.
- **[Wagmi & Viem](https://wagmi.sh)**: High-performance hooks and utilities for Ethereum interaction and MetaMask connectivity.
- **[Binance WebSocket](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)**: Sub-second live price streaming for core assets.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Cutting-edge CSS engine for modern, high-performance styling.
- **[TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/)**: Professional financial visualization for surgical-precision OHLCV data.
- **[CoinGecko API](https://www.coingecko.com/en/api)**: The industry standard for comprehensive crypto market data.

## <a name="features">🔋 Features</a>

👉 **Real-Time Trading Hero**: Experience sub-second price updates on the home dashboard powered by a direct Binance WebSocket connection.

👉 **On-Chain Watchlist (V2)**: Save your favorite coins directly to the blockchain. Our custom **Solidity Smart Contract** manages your personal watchlist with individual wallet-based persistence.

👉 **Optimistic Web3 UI**: Toggle coins on/off your watchlist with **zero latency**. The UI updates instantly while the transaction mines in the background, featuring automatic rollbacks on rejection.

👉 **Smart Multi-Sector Filtering**: Instantly browse market categories like DeFi, AI, or Layer 1s using URL-synced search parameters.

👉 **Interactive Candlestick Charts**: Professional-grade TradingView integration for deep technical analysis across multiple timeframes.

👉 **Unified Global Search**: Search thousands of tokens instantly with debounced search and direct navigation to detailed token analytics.

## <a name="quick-start">🤸 Quick Start</a>

**Prerequisites**

- [Node.js](https://nodejs.org/en) (v18+)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) (for Web3 features)

**Installation**

```bash
# Clone the repository
git clone https://github.com/Yash1510s/Coinpulse.git
cd coinpulse

# Install dependencies
npm install
```

**Set Up Environment Variables**

Create a `.env.local` file in the root directory:

```env
COINGECKO_BASE_URL=https://pro-api.coingecko.com/api/v3
COINGECKO_API_KEY=your_api_key

NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL=wss://ws.coingecko.com/ws/v2
NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key
```

**Running the Project**

```bash
npm run dev
```

## <a name="web3-integration">🛡️ Web3 Integration</a>

**Smart Contract Address:** `0x7C6a623Ec16d436cc4EFcF959Ed2Ef2F71A64654`  
**Network:** Sepolia Testnet  

The application uses **Wagmi** to interact with a custom Solidity contract that stores user watchlists securely on-chain. Connect your wallet to start building your decentralized portfolio.

---
**CoinPulse** — Built for the modern crypto era.
