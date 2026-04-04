'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WATCHLIST_CONTRACT_ADDRESS, WATCHLIST_ABI } from '@/lib/contractConfig';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export function WatchlistButton({ coinId }: { coinId: string }) {
  const { address, isConnected } = useAccount();
  const [optimisticSaved, setOptimisticSaved] = useState<boolean | null>(null);

  // 1. Blockchain se current watchlist read karo
  const { data: watchlist, refetch } = useReadContract({
    address: WATCHLIST_CONTRACT_ADDRESS,
    abi: WATCHLIST_ABI,
    functionName: 'getMyWatchlist',
    account: address,
  });

  const { writeContract, data: hash, isPending } = useWriteContract();

  // 2. Transaction confirm hone ka wait karo
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Actual blockchain state
  const actualSaved = Array.isArray(watchlist) && watchlist.includes(coinId);

  // Display state: optimistic > actual
  const isSaved = optimisticSaved !== null ? optimisticSaved : actualSaved;

  // 3. Jab transaction confirm ho jaye, refetch karo aur optimistic state reset karo
  useEffect(() => {
    if (isConfirmed) {
      refetch();
      setOptimisticSaved(null); // Reset — ab actual data le lo
    }
  }, [isConfirmed, refetch]);

  // Jab watchlist data update ho, optimistic state reset karo
  useEffect(() => {
    setOptimisticSaved(null);
  }, [watchlist]);

  const handleToggleWatchlist = () => {
    if (!isConnected) {
      alert("Bhai, pehle apna MetaMask wallet connect karo!");
      return;
    }

    const functionToCall = isSaved ? 'removeCoin' : 'addCoin';

    // INSTANT UI update — star turant toggle ho jayega!
    setOptimisticSaved(!isSaved);

    writeContract(
      {
        address: WATCHLIST_CONTRACT_ADDRESS,
        abi: WATCHLIST_ABI,
        functionName: functionToCall,
        args: [coinId],
      },
      {
        onError: () => {
          // Agar user ne MetaMask mein reject kiya ya error aaya, toh rollback karo
          setOptimisticSaved(null);
        }
      }
    );
  };

  return (
    <button 
      onClick={handleToggleWatchlist}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
        isSaved 
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-red-500/10 hover:text-red-400' 
          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
      }`}
    >
      <Star className={`w-5 h-5 transition-all ${isSaved ? 'fill-blue-400 text-blue-400' : ''}`} />
      {isPending 
        ? 'Confirm in MetaMask...' 
        : isSaved 
          ? 'Saved (Click to Remove)' 
          : 'Add to Watchlist'}
    </button>
  );
}
