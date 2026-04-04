'use client';

import { Separator } from '@/components/ui/separator';
import CandlestickChart from '@/components/CandlestickChart';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import { useBinanceLiveStream, BinanceTrade } from '@/hooks/useBinanceLiveStream';
import DataTable from '@/components/DataTable';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { useState } from 'react';
import CoinHeader from '@/components/CoinHeader';

const LiveDataWrapper = ({
  children,
  coinId,
  poolId,
  coin,
  coinOHLCData,
  securityScore,
}: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');
  const { ohlcv, price, trades: cgTrades } = useCoinGeckoWebSocket({ coinId, poolId, liveInterval });
  const { trades: binanceTrades } = useBinanceLiveStream(coin.symbol);

  const mappedCgTrades: BinanceTrade[] = (cgTrades || []).map((t, idx) => ({
    id: `cg-${t.timestamp}-${idx}`,
    price: t.price || 0,
    amount: t.amount || 0,
    value: t.value || 0,
    type: t.type === 'buy' ? 'Buy' : 'Sell',
    time: t.timestamp ? new Date(t.timestamp * 1000).toLocaleTimeString([], { hour12: false }) : '-',
  }));

  const displayTrades = binanceTrades.length > 0 ? binanceTrades : mappedCgTrades;

  const tradeColumns: DataTableColumn<BinanceTrade>[] = [
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : '-'),
    },
    {
      header: 'Amount',
      cellClassName: 'amount-cell',
      cell: (trade) => trade.amount?.toFixed(4) ?? '-',
    },
    {
      header: 'Value',
      cellClassName: 'value-cell',
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : '-'),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'type-cell',
      cell: (trade) => (
        <span className={trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>
          {trade.type}
        </span>
      ),
    },
    {
      header: 'Time',
      cellClassName: 'time-cell',
      cell: (trade) => trade.time ?? '-',
    },
  ];

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
        securityScore={securityScore}
        coinId={coinId}
      />
      <Separator className="divider" />

      <div className="trend">
        <CandlestickChart
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          initialPeriod="daily"
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      {tradeColumns && (
        <div className="trades flex flex-col pt-4">
          <h4>Recent Trades</h4>

          <div className="max-h-[500px] overflow-y-auto mt-4 custom-scrollbar rounded-lg relative bg-dark-400/10">
            <DataTable
              columns={tradeColumns}
              data={displayTrades}
              rowKey={(trade) => trade.id}
              tableClassName="trades-table border-0 w-full"
              headerCellClassName="sticky top-0 z-10 bg-dark-500 shadow-sm"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default LiveDataWrapper;
