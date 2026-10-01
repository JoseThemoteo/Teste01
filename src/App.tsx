import { useState } from 'react';
import { Calendar, UserPlus, UserCheck, Database, HeartPulse, Sparkles } from 'lucide-react';
import { PatientRegistration } from './components/PatientRegistration';
import { AppointmentScheduler } from './components/AppointmentScheduler';
import { NutritionistDashboard } from './components/NutritionistDashboard';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import type { UserRole } from './types';

type TabView = 'agendamento' | 'cadastro' | 'nutricionista' | 'arquitetura';

export function App() {
  const [activeTab, setActiveTab] = useState<TabView>('agendamento');
  const [activeRole, setActiveRole] = useState<UserRole>('paciente');

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-stone-100 flex flex-col items-center selection:bg-amber-500 selection:text-stone-950">
      {/* Top Banner Header */}
      <header className="w-full bg-[#121212] border-b border-stone-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/20">
              <HeartPulse className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white flex items-center gap-1.5 leading-tight">
                NutriAgenda <Sparkles className="w-4 h-4 text-amber-500" />
              </h1>
              <p className="text-[11px] text-stone-400 font-medium">Sistema de Agendamento de Consultas</p>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex bg-[#1c1c1e] p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => {
                setActiveRole('paciente');
                if (activeTab === 'nutricionista') setActiveTab('agendamento');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeRole === 'paciente'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Paciente
            </button>
            <button
              onClick={() => {
                setActiveRole('nutricionista');
                setActiveTab('nutricionista');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeRole === 'nutricionista'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Nutricionista
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-4xl mx-auto px-4 flex gap-2 border-t border-stone-800/60 pt-2 pb-2 overflow-x-auto">
          {activeRole === 'paciente' && (
            <>
              <button
                onClick={() => setActiveTab('agendamento')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'agendamento'
                    ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <Calendar className="w-4 h-4" /> Agendamento
              </button>

              <button
                onClick={() => setActiveTab('cadastro')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'cadastro'
                    ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Cadastro de Paciente
              </button>
            </>
          )}

          {activeRole === 'nutricionista' && (
            <button
              onClick={() => setActiveTab('nutricionista')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'nutricionista'
                  ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Painel & Bloqueio de Horários
            </button>
          )}

          <button
            onClick={() => setActiveTab('arquitetura')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'arquitetura'
                ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Database className="w-4 h-4" /> Banco de Dados & Tech
          </button>
        </nav>
      </header>

      {/* Main Body Area */}
      <main className="w-full max-w-4xl px-4 py-6 flex-1">
        {activeTab === 'agendamento' && <AppointmentScheduler />}

        {activeTab === 'cadastro' && (
          <PatientRegistration
            onSuccess={() => {
              setActiveTab('agendamento');
            }}
          />
        )}

        {activeTab === 'nutricionista' && <NutritionistDashboard />}

        {activeTab === 'arquitetura' && <DatabaseSchemaView />}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#121212] border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        <p>Sistema de Agendamento Nutricional • React + Node.js + MySQL</p>
      </footer>
    </div>
  );
}

export default App;
