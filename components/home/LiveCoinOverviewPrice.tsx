'use client';

import React from 'react';
import { useBinanceLiveStream } from '@/hooks/useBinanceLiveStream';
import { formatCurrency } from '@/lib/utils';

interface LiveCoinOverviewPriceProps {
  coinSymbol: string;
  initialPrice: number;
}

export default function LiveCoinOverviewPrice({ coinSymbol, initialPrice }: LiveCoinOverviewPriceProps) {
  const { ticker } = useBinanceLiveStream(coinSymbol);

  const displayPrice = ticker && ticker.price ? ticker.price : initialPrice;

  return (
    <div className="flex items-center gap-3">
      <h1>
        {formatCurrency(displayPrice)}
      </h1>
      
      {ticker?.priceChangePercent !== undefined && (
        <span className={`text-sm font-medium ${ticker.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {ticker.priceChangePercent > 0 ? '+' : ''}{ticker.priceChangePercent.toFixed(2)}%
        </span>
      )}
    </div>
  );
}
