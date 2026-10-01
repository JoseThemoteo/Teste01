import React from 'react';
import { Home, Tag, User } from 'lucide-react';

export type NavTab = 'home' | 'menu' | 'loyalty' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Início', icon: Home },
    {
      id: 'menu' as NavTab,
      label: 'Cardápio',
      icon: (props: any) => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M5 11a7 7 0 0 1 14 0" />
          <path d="M3 14h18" />
          <path d="M3 18h18" />
          <path d="M5 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
        </svg>
      ),
    },
    { id: 'loyalty' as NavTab, label: 'Fidelidade', icon: Tag },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#121212]/95 backdrop-blur-md border-t border-stone-800 px-4 py-2.5 z-40">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl ${
                isActive ? 'text-white' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              <IconComponent
                size={22}
                className={isActive ? 'text-white stroke-[2.2]' : 'stroke-[1.8]'}
              />
              <span className={`text-[11px] font-semibold tracking-tight ${isActive ? 'text-white font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
