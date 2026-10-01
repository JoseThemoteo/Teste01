import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  onOrderNow: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onOrderNow }) => {
  return (
    <div className="px-4 py-3">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6b140f] via-[#2d1211] to-[#1c1819] border border-red-900/40 p-5 shadow-lg">
        {/* Background ambient lighting blur */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top tags */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="px-3 py-1 rounded-full bg-[#f8be60] text-stone-950 font-bold text-[11px] tracking-wide uppercase">
            COMBO DO DIA • 20% OFF
          </span>
          <span className="flex items-center gap-1 text-[#f8be60] text-xs font-semibold">
            <Flame size={14} className="fill-[#f8be60] text-[#f8be60]" />
            Oferta limitada
          </span>
        </div>

        {/* Main Title */}
        <h2 className="text-xl font-black text-white leading-tight mb-2 tracking-tight">
          Smash Cheddar Duplo + Fritas Rústicas + Refri
        </h2>

        {/* Description */}
        <p className="text-stone-300 text-xs leading-relaxed mb-5 font-normal">
          Pão brioche dourado, duplo smash 90g com crostinha perfeita e molho especial da casa.
        </p>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#f8be60] tracking-tight">R$ 38,90</span>
            <span className="text-stone-400 text-sm line-through font-medium">R$ 48,90</span>
          </div>

          <button
            onClick={onOrderNow}
            className="flex items-center gap-2 bg-[#ea8b1f] hover:bg-amber-500 text-stone-950 font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            <span>Pedir agora</span>
            <ArrowRight size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
