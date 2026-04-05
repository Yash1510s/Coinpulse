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

export function useBinanceLiveStream(coinSymbol: string, liveInterval: '1s' | '1m' = '1s', updateIntervalMs: number = 30000) {
  const [trades, setTrades] = useState<BinanceTrade[]>([]);
  const [ticker, setTicker] = useState<LiveTicker | null>(null);
  const [ohlcv, setOhlcv] = useState<[number, number, number, number, number] | null>(null);
  const accumulatedTrades = useRef<BinanceTrade[]>([]);
  const initialUpdateDone = useRef<boolean>(false);

  useEffect(() => {
    if (!coinSymbol) return;

    // Binance ko symbol aese chahiye hota hai: btcusdt, ethusdt
    const symbol = coinSymbol === 'bitcoin' ? 'btc' : coinSymbol.toLowerCase();
    const formattedSymbol = `${symbol}usdt`;

    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${formattedSymbol}@trade/${formattedSymbol}@ticker/${formattedSymbol}@kline_${liveInterval}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!message.data) return;

      const stream = message.stream;
      const data = message.data;

      if (stream.includes('@ticker')) {
        setTicker({
          price: parseFloat(data.c),
          priceChangePercent: parseFloat(data.P),
        });
      }

      if (stream.includes('@kline')) {
        const kline = data.k;
        setOhlcv([
          kline.t,
          parseFloat(kline.o),
          parseFloat(kline.h),
          parseFloat(kline.l),
          parseFloat(kline.c)
        ]);
      }

      if (stream.includes('@trade')) {
        const newTrade: BinanceTrade = {
          id: data.t.toString(),
          price: parseFloat(data.p),
          amount: parseFloat(data.q),
          value: parseFloat(data.p) * parseFloat(data.q),
          type: data.m ? 'Sell' : 'Buy',
          time: new Date(data.T).toLocaleTimeString([], { hour12: false }),
        };

        accumulatedTrades.current = [newTrade, ...accumulatedTrades.current].slice(0, 100);

        if (!initialUpdateDone.current && accumulatedTrades.current.length >= 1) {
          setTrades([...accumulatedTrades.current]);
          initialUpdateDone.current = true;
        }
      }
    };

    const intervalId = setInterval(() => {
      if (accumulatedTrades.current.length > 0) {
        setTrades([...accumulatedTrades.current]);
      }
    }, updateIntervalMs);

    return () => {
      ws.close();
      clearInterval(intervalId);
    };
  }, [coinSymbol, liveInterval, updateIntervalMs]);

  return { trades, ticker, ohlcv };
}
