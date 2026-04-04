'use client';

import { useAccount, useBalance } from 'wagmi';

export function WalletInfo() {
  // useAccount ab humein 'chain' object bhi dega jisme network ki details hain
  const { address, isConnected, chain } = useAccount();

  // 2. Us address ka balance fetch karo
  const { data: balance } = useBalance({ address });

  // 3. MAGIC LOGIC: Agar connected nahi hai, toh kuch mat dikhao (UI hidden)
  if (!isConnected) return null;

  // 4. Agar connected hai, toh yeh UI render karo
  return (
    <div className="w-full flex justify-center flex-col py-5 px-5 lg:px-6 mb-6 bg-dark-500 rounded-xl mt-5">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">My Web3 Portfolio</h2>

      <div className="flex flex-col gap-3 text-sm flex-1">
        <div className="flex justify-between items-center p-4 rounded-lg bg-dark-400">
          <span className="font-medium text-purple-100">Wallet Address</span>
          {/* Address ko chota karke dikhane ke liye (e.g., 0x12...abcd) */}
          <span className="font-mono font-medium">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 rounded-lg bg-dark-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-purple-100">Live Network Balance</span>
            {/* Agar current chain testnet hai, toh yeh badge dikhega */}
            {chain?.testnet && (
              <span className="text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded text-xs font-semibold">
                Testnet
              </span>
            )}
          </div>
          <span className="text-green-500 font-mono font-bold">
            {balance?.formatted ? Number(balance.formatted).toFixed(4) : '0.0000'} {balance?.symbol}
          </span>
        </div>
      </div>
    </div>
  );
}
