import React from 'react';
import { MapPin, ChevronDown, ShoppingBag, User, Search, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenProfile,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="px-4 pt-4 pb-2 bg-[#121212] text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-5">
        {/* Logo & Location */}
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-stone-800 flex items-center justify-center text-xl shadow-inner">
            🍔
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">Burger Craft</span>
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">• INÍCIO</span>
            </div>
            <button className="flex items-center gap-1 text-xs text-stone-300 hover:text-white transition-colors mt-0.5">
              <MapPin size={13} className="text-amber-500 shrink-0" />
              <span className="truncate max-w-[140px] font-medium text-stone-200">Rua das Flores, 1...</span>
              <span className="text-stone-400">• 25-35 min</span>
              <ChevronDown size={14} className="text-stone-400 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Action Buttons (Cart & Profile) */}
        <div className="flex items-center gap-2.5">
          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative w-10 h-10 rounded-full bg-[#1f1f1f] border border-stone-800 flex items-center justify-center text-stone-200 hover:text-white transition-all active:scale-95"
            aria-label="Ver carrinho"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-bold text-[11px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border border-[#121212]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile button */}
          <button
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-full bg-[#f3ab51] text-stone-950 flex items-center justify-center hover:bg-amber-400 transition-all active:scale-95 shadow-md"
            aria-label="Perfil do usuário"
          >
            <User size={19} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Greeting Section */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 leading-tight">
            Boa noite, Matheus
          </h1>
          <div className="text-2xl mt-0.5 mb-1">👋</div>
          <p className="text-stone-400 text-sm font-medium">O que vamos saborear hoje?</p>
        </div>

        {/* Hot Plate Badge */}
        <div className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#222321] border border-stone-800 text-xs font-semibold text-emerald-400 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-stone-300">Chapa <br className="hidden" />quente</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3.5 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar smash, combos, sobremesas..."
          className="w-full bg-[#1c1c1e] text-stone-200 placeholder-stone-500 text-sm rounded-xl py-3 pl-10 pr-12 border border-stone-800/80 focus:outline-none focus:border-amber-500/60 transition-all"
        />
        <button
          className="absolute right-2 p-1.5 text-stone-400 hover:text-white rounded-lg bg-[#27272a] hover:bg-stone-700 transition-colors"
          aria-label="Filtrar busca"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>
    </header>
  );
};
