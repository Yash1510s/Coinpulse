import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { CoinOverviewFallback } from './fallback';
import CandlestickChart from '@/components/CandlestickChart';
import LiveCoinOverviewPrice from './LiveCoinOverviewPrice';

const CoinOverview = async () => {
  let coin: CoinDetailsData;
  let coinOHLCData: OHLCData[];

  try {
    const results = await Promise.all([
      fetcher<CoinDetailsData>('/coins/bitcoin', {
        dex_pair_format: 'symbol',
      }),
      fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        precision: 'full',
      }),
    ]);

    coin = results[0];
    coinOHLCData = results[1];
  } catch (error) {
    console.error('Error fetching coin overview:', error);
    return <CoinOverviewFallback />;
  }

  return (
    <div id="coin-overview">
      <CandlestickChart data={coinOHLCData} coinId="bitcoin">
        <div className="header pt-2">
          <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <LiveCoinOverviewPrice 
              coinSymbol={coin.symbol} 
              initialPrice={coin.market_data.current_price.usd} 
            />
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverview;
