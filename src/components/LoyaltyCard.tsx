import React from 'react';
import { Tag } from 'lucide-react';

interface LoyaltyCardProps {
  currentPts?: number;
  maxPts?: number;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  currentPts = 320,
  maxPts = 400,
}) => {
  const percentage = Math.min(100, Math.round((currentPts / maxPts) * 100));
  const remainingPts = maxPts - currentPts;

  return (
    <div className="px-4 py-2">
      <div className="bg-[#1c1c1e] border border-stone-800/80 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-3 mb-2.5">
          {/* Green Tag Icon Box */}
          <div className="w-10 h-10 rounded-xl bg-[#233527] border border-emerald-800/50 flex items-center justify-center shrink-0">
            <Tag size={20} className="text-emerald-400 rotate-90" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white font-extrabold text-sm tracking-tight">Burger Grátis</span>
              <span className="text-stone-300 font-bold text-xs tracking-tight">
                {currentPts} / {maxPts} pts
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-2.5 bg-[#2a2a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom indicator text */}
        <p className="text-stone-400 text-[11px] font-medium pl-13">
          Faltam apenas <span className="text-stone-100 font-bold">{remainingPts} pontos</span> para o seu resgate!
        </p>
      </div>
    </div>
  );
};
