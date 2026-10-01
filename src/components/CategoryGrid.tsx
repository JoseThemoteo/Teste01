import React from 'react';
import { Star, Receipt, User, Info, Share2 } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory?: (category: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const items = [
    {
      id: 'menu',
      label: 'Cardápio',
      icon: (
        <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-white mb-2">
          {/* Custom burger line icon */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 11a7 7 0 0 1 14 0" />
            <path d="M3 14h18" />
            <path d="M3 18h18" />
            <path d="M5 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
          </svg>
        </div>
      ),
    },
    {
      id: 'loyalty',
      label: 'Junte e ganhe',
      badge: '320 pts',
      icon: (
        <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-white mb-2 relative">
          <div className="border-2 border-stone-100 rounded-full p-1">
            <Star size={18} className="fill-stone-100 text-stone-100" />
          </div>
        </div>
      ),
    },
    {
      id: 'orders',
      label: 'Meus Pedidos',
      icon: (
        <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-white mb-2">
          <Receipt size={22} />
        </div>
      ),
    },
    {
      id: 'account',
      label: 'Minha conta',
      icon: (
        <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-white mb-2">
          <User size={22} />
        </div>
      ),
    },
    {
      id: 'info',
      label: 'Informações',
      icon: (
        <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-white mb-2">
          <Info size={22} />
        </div>
      ),
    },
    {
      id: 'share',
      label: 'Compartilhe',
      icon: (
        <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-white mb-2">
          <Share2 size={22} />
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectCategory?.(item.id)}
            className="relative flex flex-col items-center justify-center bg-[#f4ebd0] text-stone-900 p-4 rounded-2xl font-bold text-xs hover:bg-[#ebdca8] transition-all active:scale-95 shadow-sm min-h-[110px]"
          >
            {item.badge && (
              <span className="absolute -top-1.5 right-3 bg-[#e08e23] text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                {item.badge}
              </span>
            )}
            {item.icon}
            <span className="text-stone-900 text-[13px] font-bold tracking-tight text-center leading-snug">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
