import { useState, useEffect } from 'react';
import { UserCheck, Calendar, Lock, Unlock, AlertCircle, CheckCircle2, Phone, Mail, Clock } from 'lucide-react';
import { getNutritionists, getTimeSlots, getAppointments, toggleBlockTimeSlot } from '../storage';
import type { Nutritionist, TimeSlot, Appointment } from '../types';

export function NutritionistDashboard() {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [selectedNutritionistId, setSelectedNutritionistId] = useState<string>('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshData = () => {
    const loadedNutritionists = getNutritionists();
    const loadedSlots = getTimeSlots();
    const loadedAppointments = getAppointments();

    setNutritionists(loadedNutritionists);
    setSlots(loadedSlots);
    setAppointments(loadedAppointments);

    if (!selectedNutritionistId && loadedNutritionists.length > 0) {
      setSelectedNutritionistId(loadedNutritionists[0].id);
    }

    if (!selectedDate && loadedSlots.length > 0) {
      setSelectedDate(loadedSlots[0].data);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const activeNutritionist = nutritionists.find((n) => n.id === selectedNutritionistId);

  const availableDates = Array.from(
    new Set(
      slots
        .filter((s) => s.nutricionistaId === selectedNutritionistId)
        .map((s) => s.data)
    )
  ).sort();

  const currentSlots = slots.filter(
    (s) => s.nutricionistaId === selectedNutritionistId && s.data === selectedDate
  );

  const nutritionistAppointments = appointments.filter(
    (a) => a.nutricionistaId === selectedNutritionistId && a.status === 'agendada'
  );

  const handleToggleBlock = (slotId: string) => {
    setFeedback(null);
    const res = toggleBlockTimeSlot(slotId, 'Bloqueado via Painel do Nutricionista');
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      refreshData();
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto my-4 text-white">
      {/* Nutritionist Selector Header */}
      <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-stone-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-amber-500 flex items-center gap-2">
              <UserCheck className="w-6 h-6" /> Painel do Nutricionista
            </h2>
            <p className="text-stone-400 text-xs mt-1">
              Gerencie seus horários, bloqueie datas/horas e visualize sua agenda de consultas.
            </p>
          </div>

          <select
            value={selectedNutritionistId}
            onChange={(e) => setSelectedNutritionistId(e.target.value)}
            className="bg-[#121212] border border-stone-700 rounded-xl p-2.5 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
          >
            {nutritionists.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nome}
              </option>
            ))}
          </select>
        </div>

        {activeNutritionist && (
          <div className="bg-[#121212] p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-white text-sm">{activeNutritionist.nome}</p>
              <p className="text-amber-400 font-medium">{activeNutritionist.especialidade} ({activeNutritionist.crn})</p>
            </div>
            <div className="space-y-1 text-stone-400">
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-stone-500" /> {activeNutritionist.email}</p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-stone-500" /> {activeNutritionist.telefone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Management & Slot Blocking */}
      <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl">
        <h3 className="text-base font-extrabold text-white mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-500" /> Bloqueio / Liberacao de Horários
        </h3>
        <p className="text-xs text-stone-400 mb-5">
          Regra de Negócio: O nutricionista pode bloquear determinados horários para impedir novas reservas de pacientes.
        </p>

        {feedback && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-start gap-3 border text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500 text-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>{feedback.text}</div>
          </div>
        )}

        {/* Date Tabs */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-400 uppercase mb-2">
            Selecione a Data para Configurar Horários
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {availableDates.map((d) => {
              const [year, month, day] = d.split('-');
              const dateFormatted = `${day}/${month}/${year}`;
              const isSelected = selectedDate === d;

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md'
                      : 'bg-[#121212] border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  {dateFormatted}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid of Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {currentSlots.map((slot) => {
            const isAvailable = slot.status === 'disponivel';
            const isReserved = slot.status === 'reservado';
            const isBlocked = slot.status === 'bloqueado';

            return (
              <div
                key={slot.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isReserved
                    ? 'bg-amber-950/20 border-amber-800/40'
                    : isBlocked
                    ? 'bg-rose-950/30 border-rose-900/50'
                    : 'bg-[#121212] border-stone-800'
                }`}
              >
                <div>
                  <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> {slot.hora}
                  </span>
                  <p className="text-[11px] mt-0.5">
                    Status:{' '}
                    <span
                      className={`font-bold ${
                        isAvailable
                          ? 'text-emerald-400'
                          : isReserved
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {isAvailable
                        ? 'Disponível'
                        : isReserved
                        ? 'Reservado por Paciente'
                        : 'Bloqueado'}
                    </span>
                  </p>
                </div>

                {!isReserved ? (
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(slot.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isBlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-stone-950'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white'
                    }`}
                  >
                    {isBlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Liberar
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Bloquear
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30 font-bold">
                    Ocupado
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmed Patient Appointments View */}
      <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl">
        <h3 className="text-base font-extrabold text-white mb-1 flex items-center justify-between">
          <span>Agenda de Pacientes Agendados</span>
          <span className="text-xs font-bold text-amber-500">
            {nutritionistAppointments.length} consultas ativas
          </span>
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          Visualização de pacientes com consultas agendadas com o nutricionista selecionado.
        </p>

        {nutritionistAppointments.length === 0 ? (
          <p className="text-xs text-stone-500 bg-[#121212] p-4 rounded-xl border border-stone-800 text-center">
            Nenhuma consulta agendada para este nutricionista até o momento.
          </p>
        ) : (
          <div className="space-y-3">
            {nutritionistAppointments.map((app) => {
              const [year, month, day] = app.data.split('-');
              const dateFormatted = `${day}/${month}/${year}`;

              return (
                <div
                  key={app.id}
                  className="bg-[#121212] p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-sm text-white">{app.pacienteNome}</p>
                    <p className="text-stone-400 mt-0.5">Telefone: {app.pacienteTelefone}</p>
                  </div>
                  <div className="bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700 font-mono text-amber-400 font-bold text-right">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" /> {dateFormatted} - {app.hora}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
