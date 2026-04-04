'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const CATEGORIES = [
  { id: '', name: 'All Coins' },
  { id: 'smart-contract-platform', name: 'Smart Contracts (L1/L2)' },
  { id: 'decentralized-finance-defi', name: 'DeFi' },
  { id: 'artificial-intelligence', name: 'AI & Big Data' },
  { id: 'meme-token', name: 'Meme Coins' },
  { id: 'gaming', name: 'Gaming (GameFi)' },
];

export function CategorySelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(CATEGORIES[0]);

  // Agar URL mein pehle se category hai, toh UI mein selected dikhao
  useEffect(() => {
    const currentCategory = searchParams.get('category');
    if (currentCategory) {
      const found = CATEGORIES.find(c => c.id === currentCategory);
      if (found) setSelected(found);
    } else {
      setSelected(CATEGORIES[0]);
    }
  }, [searchParams]);

  const handleSelect = (category: typeof CATEGORIES[0]) => {
    setSelected(category);
    setIsOpen(false);
    
    // Naya URL parameter banao
    const params = new URLSearchParams(searchParams.toString());
    
    if (category.id) {
      params.set('category', category.id);
    } else {
      params.delete('category');
    }

    // Page param reset karo jab category change ho (warna wrong page dikhega)
    params.delete('page');

    // Current pathname ke saath URL update karo — /coins pe bhi kaam karega
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
      >
        <span>{selected.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 p-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleSelect(category)}
              className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${
                selected.id === category.id 
                  ? 'bg-blue-500/10 text-blue-400 font-semibold' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
