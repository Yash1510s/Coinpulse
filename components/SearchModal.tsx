'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency } from '@/lib/utils';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

interface SearchResponse {
  coins: SearchResult[];
}

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcut: Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Debounced search
  const searchCoins = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetcher<SearchResponse>('/search', { query: searchQuery });
      setResults(data.coins?.slice(0, 8) || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(0);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCoins(value), 300);
  };

  const handleSelect = (coinId: string) => {
    setIsOpen(false);
    router.push(`/coins/${coinId}`);
  };

  // Keyboard navigation in results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      handleSelect(results[activeIndex].id);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div id="search-modal">
      {/* Trigger Button */}
      <button className="trigger" onClick={() => setIsOpen(true)}>
        <Search size={16} />
        <span>Search</span>
        <kbd className="kbd">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          onClick={handleBackdropClick}
        >
          <div ref={dialogRef} className="dialog rounded-lg border border-dark-400 shadow-2xl w-full" role="dialog">
            {/* Search Input */}
            <div className="cmd-input flex items-center gap-3 px-4 py-3 border-b border-dark-400">
              <Search size={18} className="text-purple-100 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search coins..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-purple-100"
              />
              <button aria-label="Close search" onClick={() => setIsOpen(false)} className="text-purple-100 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Results List */}
            <div className="list overflow-y-auto custom-scrollbar">
              {isLoading && (
                <div className="py-8 text-center text-sm text-purple-100">Searching...</div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="empty py-6 text-center text-sm text-gray-400">
                  No coins found for &quot;{query}&quot;
                </div>
              )}

              {!isLoading && !query && (
                <div className="py-8 text-center text-sm text-purple-100 flex flex-col items-center gap-2">
                  <TrendingUp size={24} className="text-purple-100/50" />
                  <span>Type to search for any cryptocurrency</span>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="group p-2">
                  <div className="heading px-3 py-2 text-xs font-semibold uppercase tracking-wider">
                    <Search size={14} />
                    <span>Coins</span>
                  </div>
                  {results.map((coin, index) => (
                    <div
                      key={coin.id}
                      className="search-item px-3 rounded-md"
                      data-selected={index === activeIndex}
                      onClick={() => handleSelect(coin.id)}
                    >
                      <div className="coin-info">
                        <Image src={coin.thumb} alt={coin.name} width={36} height={36} />
                        <div>
                          <p className="font-medium text-white">{coin.name}</p>
                          <p className="coin-symbol">{coin.symbol}</p>
                        </div>
                      </div>
                      <p className="coin-price text-purple-100">
                        {coin.market_cap_rank ? `#${coin.market_cap_rank}` : '-'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModal;
