'use client';

import { useEffect, useRef, useState } from 'react';

// Table ko kaisa data chahiye uska format
export interface BinanceTrade {
  id: string;
  price: number;
  amount: number;
  value: number;
  type: 'Buy' | 'Sell';
  time: string;
}

export interface LiveTicker {
  price: number;
  priceChangePercent: number;
}

export function useBinanceLiveStream(coinSymbol: string, updateIntervalMs: number = 30000) {
  const [trades, setTrades] = useState<BinanceTrade[]>([]);
  const [ticker, setTicker] = useState<LiveTicker | null>(null);
  const accumulatedTrades = useRef<BinanceTrade[]>([]);
  const initialUpdateDone = useRef<boolean>(false);

  useEffect(() => {
    if (!coinSymbol) return;

    // Binance ko symbol aese chahiye hota hai: btcusdt, ethusdt
    const symbol = coinSymbol === 'bitcoin' ? 'btc' : coinSymbol.toLowerCase();
    const formattedSymbol = `${symbol}usdt`;

    // COMBINED STREAM: Trade (Table ke liye) + Ticker (Price ke liye)
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${formattedSymbol}@trade/${formattedSymbol}@ticker`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!message.data) return;

      const stream = message.stream;
      const data = message.data;

      // 1. Agar data Ticker (Price) ka hai
      if (stream.includes('@ticker')) {
        setTicker({
          price: parseFloat(data.c), // c = Current Price
          priceChangePercent: parseFloat(data.P), // P = Price Change %
        });
      }

      // 2. Agar data Trade (Table) ka hai
      if (stream.includes('@trade')) {
        const newTrade: BinanceTrade = {
          id: data.t.toString(),
          price: parseFloat(data.p),
          amount: parseFloat(data.q),
          value: parseFloat(data.p) * parseFloat(data.q),
          type: data.m ? 'Sell' : 'Buy',
          time: new Date(data.T).toLocaleTimeString([], { hour12: false }),
        };

        // Naya trade list mein dalo, aur sirf latest 100 rakho scroll karne ke liye
        accumulatedTrades.current = [newTrade, ...accumulatedTrades.current].slice(0, 100);

        // Do a quick initial render after 1st trade so the table isn't empty for the first 30 seconds
        if (!initialUpdateDone.current && accumulatedTrades.current.length >= 1) {
          setTrades([...accumulatedTrades.current]);
          initialUpdateDone.current = true;
        }
      }
    };

    // Update the React state every 30 seconds 
    const intervalId = setInterval(() => {
      if (accumulatedTrades.current.length > 0) {
        setTrades([...accumulatedTrades.current]);
      }
    }, updateIntervalMs);

    // Jab component close ho toh connection band kar do
    return () => {
      ws.close();
      clearInterval(intervalId);
    };
  }, [coinSymbol, updateIntervalMs]);

  // Yeh hook trades aur ticker dono wapas dega
  return { trades, ticker };
}
