import { useState, useEffect } from 'react';
import { Calendar, Clock, UserCheck, AlertCircle, CheckCircle2, XCircle, ShieldAlert, RefreshCw } from 'lucide-react';
import {
  getNutritionists,
  getPatients,
  getTimeSlots,
  getAppointments,
  bookAppointment,
  cancelAppointment,
  canCancelAppointment,
} from '../storage';
import type { Nutritionist, Patient, TimeSlot, Appointment } from '../types';

export function AppointmentScheduler() {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedNutritionistId, setSelectedNutritionistId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshData = () => {
    const loadedNutritionists = getNutritionists();
    const loadedPatients = getPatients();
    const loadedSlots = getTimeSlots();
    const loadedAppointments = getAppointments();

    setNutritionists(loadedNutritionists);
    setPatients(loadedPatients);
    setSlots(loadedSlots);
    setAppointments(loadedAppointments);

    if (!selectedNutritionistId && loadedNutritionists.length > 0) {
      setSelectedNutritionistId(loadedNutritionists[0].id);
    }
    if (!selectedPatientId && loadedPatients.length > 0) {
      setSelectedPatientId(loadedPatients[0].id);
    }

    // Default to today or first available slot date if not selected
    if (!selectedDate && loadedSlots.length > 0) {
      setSelectedDate(loadedSlots[0].data);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter available dates for selected nutritionist
  const datesForNutritionist = Array.from(
    new Set(
      slots
        .filter((s) => s.nutricionistaId === selectedNutritionistId)
        .map((s) => s.data)
    )
  ).sort();

  // Filter slots for selected nutritionist & date
  const currentSlots = slots.filter(
    (s) => s.nutricionistaId === selectedNutritionistId && s.data === selectedDate
  );

  const handleBook = () => {
    setFeedback(null);

    if (!selectedPatientId) {
      setFeedback({ type: 'error', text: 'Selecione um paciente para agendar.' });
      return;
    }

    if (!selectedNutritionistId) {
      setFeedback({ type: 'error', text: 'Selecione um nutricionista.' });
      return;
    }

    if (!selectedDate) {
      setFeedback({ type: 'error', text: 'Escolha uma data para a consulta.' });
      return;
    }

    if (!selectedSlot) {
      setFeedback({ type: 'error', text: 'Escolha um horário disponível.' });
      return;
    }

    const res = bookAppointment(
      selectedPatientId,
      selectedNutritionistId,
      selectedDate,
      selectedSlot.hora
    );

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setSelectedSlot(null);
      refreshData();
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleCancel = (appointmentId: string) => {
    setFeedback(null);
    const res = cancelAppointment(appointmentId);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      refreshData();
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const selectedPatientAppointments = appointments.filter(
    (a) => a.pacienteId === selectedPatientId
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto my-4 text-white">
      {/* Main Scheduling Card */}
      <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-stone-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-amber-500 flex items-center gap-2">
              <Calendar className="w-6 h-6" /> Agendamento de Consulta
            </h2>
            <p className="text-stone-400 text-xs mt-1">
              Consulte horários disponíveis, selecione data/horário e confirme seu agendamento.
            </p>
          </div>
          <button
            onClick={refreshData}
            title="Atualizar horários"
            className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

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

        <div className="space-y-5">
          {/* Step 1: Select Patient */}
          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              1. Selecionar Paciente
            </label>
            {patients.length === 0 ? (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-900">
                Nenhum paciente cadastrado. Cadastre um paciente na aba de Cadastro primeiro.
              </p>
            ) : (
              <div className="relative">
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-[#121212] border border-stone-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (CPF: {p.cpf})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Step 2: Select Nutritionist */}
          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              2. Escolher Nutricionista
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nutritionists.map((nutri) => {
                const isSelected = selectedNutritionistId === nutri.id;
                return (
                  <button
                    key={nutri.id}
                    type="button"
                    onClick={() => {
                      setSelectedNutritionistId(nutri.id);
                      setSelectedSlot(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/5'
                        : 'bg-[#121212] border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center justify-between">
                      {nutri.nome}
                      {isSelected && <UserCheck className="w-4 h-4 text-amber-500" />}
                    </div>
                    <p className="text-xs text-amber-400/90 font-medium mt-0.5">{nutri.especialidade}</p>
                    <p className="text-[11px] text-stone-400 mt-1">{nutri.crn}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Select Date */}
          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              3. Escolher Data
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {datesForNutritionist.map((d) => {
                const [year, month, day] = d.split('-');
                const formattedLabel = `${day}/${month}/${year}`;
                const isSelected = selectedDate === d;

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedSlot(null);
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold shrink-0 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-500 font-extrabold shadow-md'
                        : 'bg-[#121212] border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {formattedLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Choose Available Time Slot */}
          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 4. Consultar Horários Disponíveis
            </label>

            {currentSlots.length === 0 ? (
              <p className="text-xs text-stone-400 bg-[#121212] p-4 rounded-xl border border-stone-800 text-center">
                Nenhum horário cadastrado para a data selecionada.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currentSlots.map((slot) => {
                  const isAvailable = slot.status === 'disponivel';
                  const isReserved = slot.status === 'reservado';
                  const isBlocked = slot.status === 'bloqueado';
                  const isSelected = selectedSlot?.id === slot.id;

                  let statusBg = 'bg-[#121212] border-stone-800 text-stone-300 hover:border-amber-500/50';
                  if (isSelected) {
                    statusBg = 'bg-amber-500 text-stone-950 border-amber-400 font-bold ring-2 ring-amber-400/50';
                  } else if (isReserved) {
                    statusBg = 'bg-stone-900/60 border-stone-800 text-stone-600 cursor-not-allowed line-through';
                  } else if (isBlocked) {
                    statusBg = 'bg-rose-950/20 border-rose-900/40 text-rose-500/70 cursor-not-allowed';
                  }

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-xs text-center flex flex-col items-center justify-center gap-1 transition-all ${statusBg}`}
                    >
                      <span className="font-extrabold text-sm">{slot.hora}</span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider">
                        {isAvailable ? 'Disponível' : isReserved ? 'Reservado' : 'Bloqueado'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            disabled={!selectedSlot}
            onClick={handleBook}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              selectedSlot
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer shadow-amber-500/20 active:scale-[0.99]'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            {selectedSlot
              ? `Confirmar Agendamento para ${selectedSlot.hora}`
              : 'Selecione um horário para agendar'}
          </button>
        </div>
      </div>

      {/* Patient's Existing Appointments List */}
      <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl">
        <h3 className="text-base font-extrabold text-white mb-1 flex items-center justify-between">
          <span>Minhas Consultas Agendadas</span>
          <span className="text-xs font-medium text-stone-400">
            Regra: Cancelamento mín. 24h
          </span>
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          Visualização das consultas do paciente selecionado acima.
        </p>

        {selectedPatientAppointments.length === 0 ? (
          <p className="text-xs text-stone-500 bg-[#121212] p-4 rounded-xl border border-stone-800 text-center">
            Nenhuma consulta agendada para o paciente selecionado.
          </p>
        ) : (
          <div className="space-y-3">
            {selectedPatientAppointments.map((app) => {
              const cancelCheck = canCancelAppointment(app.data, app.hora);
              const isCanceled = app.status === 'cancelada';

              const [year, month, day] = app.data.split('-');
              const dateFormatted = `${day}/${month}/${year}`;

              return (
                <div
                  key={app.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCanceled
                      ? 'bg-[#121212]/50 border-stone-800/80 opacity-60'
                      : 'bg-[#121212] border-stone-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{app.nutricionistaNome}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          isCanceled
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400 mt-1 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" /> {dateFormatted} às {app.hora}
                    </p>
                  </div>

                  {!isCanceled && (
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleCancel(app.id)}
                        disabled={!cancelCheck.canCancel}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          cancelCheck.canCancel
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white cursor-pointer'
                            : 'bg-stone-800/80 text-stone-500 border border-stone-700 cursor-not-allowed'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancelar Consulta
                      </button>

                      {!cancelCheck.canCancel && (
                        <p className="text-[10px] text-rose-400 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 shrink-0" />
                          Menos de 24h restantes para a consulta
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
