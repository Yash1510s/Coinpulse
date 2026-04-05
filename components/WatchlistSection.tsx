'use client';

import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { WATCHLIST_CONTRACT_ADDRESS, WATCHLIST_ABI } from '@/lib/contractConfig';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetcher } from '@/lib/coingecko.actions';

export function WatchlistSection() {
  const { address, isConnected } = useAccount();
  const [watchlistData, setWatchlistData] = useState<any[]>([]);

  // 1. Blockchain se saved IDs read karo — har 5 sec auto-poll
  const { data: coinIds, isLoading: isContractLoading, refetch } = useReadContract({
    address: WATCHLIST_CONTRACT_ADDRESS,
    abi: WATCHLIST_ABI,
    functionName: 'getMyWatchlist',
    account: address,
  });

  // 2. Blockchain events sunno — jaise hi CoinAdded/CoinRemoved fire ho, turant refetch
  useWatchContractEvent({
    address: WATCHLIST_CONTRACT_ADDRESS,
    abi: WATCHLIST_ABI,
    eventName: 'CoinAdded',
    onLogs: () => {
      refetch();
    },
  });

  useWatchContractEvent({
    address: WATCHLIST_CONTRACT_ADDRESS,
    abi: WATCHLIST_ABI,
    eventName: 'CoinRemoved',
    onLogs: () => {
      refetch();
    },
  });

  const fetchWatchlistPrices = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setWatchlistData([]);
      return;
    }
    try {
      const idsStr = ids.join(',');
      const data = await fetcher<any[]>('coins/markets', {
        vs_currency: 'usd',
        ids: idsStr,
        order: 'market_cap_desc',
        sparkline: false
      });
      if (Array.isArray(data)) {
        setWatchlistData(data);
      }
    } catch (err) {
      console.error('Error fetching watchlist prices:', err);
    }
  }, []);

  useEffect(() => {
    if (coinIds && Array.isArray(coinIds)) {
      fetchWatchlistPrices(coinIds as string[]);
    } else {
      setWatchlistData([]);
    }
  }, [coinIds, fetchWatchlistPrices]);

  if (!isConnected) return null;

  return (
    <div className="mt-10 mb-10 p-6 bg-white/5 border border-white/10 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Your On-Chain Watchlist 🛡️
      </h2>

      {isContractLoading ? (
        <p className="text-gray-400 italic">Syncing with Blockchain...</p>
      ) : watchlistData.length === 0 ? (
        <p className="text-gray-400 italic">Watchlist khali hai bhai, kuch coins add karo!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlistData.map((coin) => (
            <Link href={`/coins/${coin.id}`} key={coin.id}>
              <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-xl hover:border-blue-500/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                    <div>
                      <p className="font-bold text-white group-hover:text-blue-400">{coin.name}</p>
                      <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${coin.current_price.toLocaleString()}</p>
                    <p className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
