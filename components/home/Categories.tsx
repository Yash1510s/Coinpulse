import { fetcher } from '@/lib/coingecko.actions';
import DataTable from '@/components/DataTable';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { CategoriesFallback } from './fallback';
import Link from 'next/link';

const TopCoins = async ({ categoryId = '' }: { categoryId?: string }) => {
  try {
    let apiUrl = '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false';
    
    if (categoryId) {
      apiUrl += `&category=${categoryId}`;
    }

    const coins = await fetcher<CoinMarketData[]>(apiUrl);

    const columns: DataTableColumn<CoinMarketData>[] = [
      {
        header: '#',
        cellClassName: 'text-sm font-medium w-12',
        cell: (coin) => coin.market_cap_rank,
      },
      {
        header: 'Coin',
        cellClassName: 'category-cell',
        cell: (coin) => (
          <Link href={`/coins/${coin.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src={coin.image} alt={coin.name} width={28} height={28} className="rounded-full" />
            <div>
              <p className="font-semibold text-sm">{coin.name}</p>
              <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
            </div>
          </Link>
        ),
      },
      {
        header: 'Price',
        cellClassName: 'font-medium',
        cell: (coin) => formatCurrency(coin.current_price),
      },
      {
        header: '24h Change',
        cellClassName: 'change-header-cell',
        cell: (coin) => {
          const isTrendingUp = coin.price_change_percentage_24h > 0;

          return (
            <div className={cn('change-cell', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
              <p className="flex items-center">
                {formatPercentage(coin.price_change_percentage_24h)}
                {isTrendingUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                )}
              </p>
            </div>
          );
        },
      },
      {
        header: 'Market Cap',
        cellClassName: 'market-cap-cell',
        cell: (coin) => formatCurrency(coin.market_cap),
      },
    ];

    return (
      <div id="top-coins" className="custom-scrollbar">
        <h4 className="font-bold text-lg mb-4">Top Cryptocurrencies by Market Cap</h4>

        <DataTable
          columns={columns}
          data={coins}
          rowKey={(coin) => coin.id}
          tableClassName="mt-3"
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return <CategoriesFallback />;
  }
};

export default TopCoins;
