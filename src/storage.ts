import type { Patient, Nutritionist, TimeSlot, Appointment } from './types';

const STORAGE_KEYS = {
  PATIENTS: 'nutri_patients',
  NUTRITIONISTS: 'nutri_nutritionists',
  SLOTS: 'nutri_slots',
  APPOINTMENTS: 'nutri_appointments',
  CURRENT_USER_ID: 'nutri_current_user_id',
};

// Initial Mock Data
const INITIAL_NUTRITIONISTS: Nutritionist[] = [
  {
    id: 'nutri-1',
    nome: 'Dra. Ana Beatris Souza',
    crn: 'CRN-3 45892',
    email: 'ana.souza@nutri.com.br',
    telefone: '(11) 98765-4321',
    especialidade: 'Nutrição Esportiva e Funcional',
  },
  {
    id: 'nutri-2',
    nome: 'Dr. Carlos Eduardo Lima',
    crn: 'CRN-3 31204',
    email: 'carlos.lima@nutri.com.br',
    telefone: '(11) 97123-8899',
    especialidade: 'Nutrição Clínica e Emagrecimento',
  },
];

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pac-1',
    nome: 'Mariana Oliveira',
    cpf: '123.456.789-00',
    email: 'mariana.oliveira@email.com',
    telefone: '(11) 99887-6655',
    senha: 'password123',
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'pac-2',
    nome: 'Lucas Santos',
    cpf: '987.654.321-11',
    email: 'lucas.santos@email.com',
    telefone: '(11) 98877-1122',
    senha: 'password123',
    criadoEm: new Date().toISOString(),
  },
];

// Helper to generate dates for today, tomorrow, and upcoming days
const getFormattedDate = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const defaultTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

const generateInitialSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  INITIAL_NUTRITIONISTS.forEach((nutri) => {
    // For 5 days starting from today
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const dateStr = getFormattedDate(dayOffset);
      defaultTimes.forEach((time) => {
        // Block 10:00 on day 1 for Dr. Carlos as mock blocked slot
        const isBlocked = nutri.id === 'nutri-2' && dayOffset === 1 && time === '10:00';
        slots.push({
          id: `slot-${nutri.id}-${dateStr}-${time.replace(':', '')}`,
          nutricionistaId: nutri.id,
          data: dateStr,
          hora: time,
          status: isBlocked ? 'bloqueado' : 'disponivel',
          motivoBloqueio: isBlocked ? 'compromisso_pessoal' : undefined,
        });
      });
    }
  });
  return slots;
};

const INITIAL_SLOTS = generateInitialSlots();

// Initial appointment mock
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    pacienteId: 'pac-1',
    pacienteNome: 'Mariana Oliveira',
    pacienteTelefone: '(11) 99887-6655',
    nutricionistaId: 'nutri-1',
    nutricionistaNome: 'Dra. Ana Beatris Souza',
    data: getFormattedDate(2), // 2 days in future (> 24 hours)
    hora: '09:00',
    status: 'agendada',
    criadoEm: new Date().toISOString(),
    horarioId: `slot-nutri-1-${getFormattedDate(2)}-0900`,
  },
];

// Update slot status in INITIAL_SLOTS for app-1
const slotToReserve = INITIAL_SLOTS.find(s => s.id === INITIAL_APPOINTMENTS[0].horarioId);
if (slotToReserve) {
  slotToReserve.status = 'reservado';
}

// Local Storage helpers
export function getPatients(): Patient[] {
  const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    return INITIAL_PATIENTS;
  }
  return JSON.parse(data);
}

export function savePatient(patient: Omit<Patient, 'id' | 'criadoEm'>): { success: boolean; message: string; patient?: Patient } {
  const patients = getPatients();

  // Check duplicate CPF or Email
  const existingCPF = patients.find(p => p.cpf.replace(/\D/g, '') === patient.cpf.replace(/\D/g, ''));
  if (existingCPF) {
    return { success: false, message: 'Já existe um paciente cadastrado com este CPF.' };
  }

  const existingEmail = patients.find(p => p.email.toLowerCase() === patient.email.toLowerCase());
  if (existingEmail) {
    return { success: false, message: 'Já existe um paciente cadastrado com este e-mail.' };
  }

  const newPatient: Patient = {
    ...patient,
    id: `pac-${Date.now()}`,
    criadoEm: new Date().toISOString(),
  };

  patients.push(newPatient);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  return { success: true, message: 'Paciente cadastrado com sucesso!', patient: newPatient };
}

export function getNutritionists(): Nutritionist[] {
  const data = localStorage.getItem(STORAGE_KEYS.NUTRITIONISTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.NUTRITIONISTS, JSON.stringify(INITIAL_NUTRITIONISTS));
    return INITIAL_NUTRITIONISTS;
  }
  return JSON.parse(data);
}

export function getTimeSlots(): TimeSlot[] {
  const data = localStorage.getItem(STORAGE_KEYS.SLOTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(INITIAL_SLOTS));
    return INITIAL_SLOTS;
  }
  return JSON.parse(data);
}

export function saveTimeSlots(slots: TimeSlot[]): void {
  localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
}

export function getAppointments(): Appointment[] {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    return INITIAL_APPOINTMENTS;
  }
  return JSON.parse(data);
}

export function saveAppointments(appointments: Appointment[]): void {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

// Business Logic Functions

/**
 * Business Rule: Um horário não pode ser reservado por dois pacientes.
 * Business Rule: Uma consulta deve possuir data e horário.
 */
export function bookAppointment(
  patientId: string,
  nutritionistId: string,
  data: string,
  hora: string
): { success: boolean; message: string; appointment?: Appointment } {
  if (!data || !hora) {
    return { success: false, message: 'Uma consulta deve possuir data e horário válidos.' };
  }

  const patients = getPatients();
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    return { success: false, message: 'Paciente não encontrado.' };
  }

  const nutritionists = getNutritionists();
  const nutritionist = nutritionists.find(n => n.id === nutritionistId);
  if (!nutritionist) {
    return { success: false, message: 'Nutricionista não encontrado.' };
  }

  const slots = getTimeSlots();
  const slot = slots.find(
    s => s.nutricionistaId === nutritionistId && s.data === data && s.hora === hora
  );

  if (!slot) {
    return { success: false, message: 'Horário não cadastrado para esta data.' };
  }

  if (slot.status === 'reservado') {
    return { success: false, message: 'Este horário já foi reservado por outro paciente.' };
  }

  if (slot.status === 'bloqueado') {
    return { success: false, message: 'Este horário foi bloqueado pelo nutricionista.' };
  }

  // Update Slot Status
  slot.status = 'reservado';
  saveTimeSlots(slots);

  // Create Appointment
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    id: `app-${Date.now()}`,
    pacienteId: patient.id,
    pacienteNome: patient.nome,
    pacienteTelefone: patient.telefone,
    nutricionistaId: nutritionist.id,
    nutricionistaNome: nutritionist.nome,
    data,
    hora,
    status: 'agendada',
    criadoEm: new Date().toISOString(),
    horarioId: slot.id,
  };

  appointments.push(newAppointment);
  saveAppointments(appointments);

  return { success: true, message: 'Consulta agendada com sucesso!', appointment: newAppointment };
}

/**
 * Business Rule: O paciente poderá cancelar uma consulta com antecedência mínima de 24 horas.
 */
export function canCancelAppointment(appointmentData: string, appointmentHora: string): { canCancel: boolean; hoursRemaining: number; message: string } {
  const [year, month, day] = appointmentData.split('-').map(Number);
  const [hours, minutes] = appointmentHora.split(':').map(Number);

  const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();

  const diffMs = appointmentDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return {
      canCancel: false,
      hoursRemaining: diffHours,
      message: 'O cancelamento só pode ser realizado com antecedência mínima de 24 horas da consulta.',
    };
  }

  return {
    canCancel: true,
    hoursRemaining: diffHours,
    message: 'Cancelamento permitido.',
  };
}

export function cancelAppointment(appointmentId: string): { success: boolean; message: string } {
  const appointments = getAppointments();
  const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);

  if (appointmentIndex === -1) {
    return { success: false, message: 'Consulta não encontrada.' };
  }

  const appointment = appointments[appointmentIndex];

  if (appointment.status === 'cancelada') {
    return { success: false, message: 'Esta consulta já está cancelada.' };
  }

  const cancelCheck = canCancelAppointment(appointment.data, appointment.hora);
  if (!cancelCheck.canCancel) {
    return { success: false, message: cancelCheck.message };
  }

  // Update appointment status
  appointment.status = 'cancelada';
  appointments[appointmentIndex] = appointment;
  saveAppointments(appointments);

  // Free up time slot
  const slots = getTimeSlots();
  const slot = slots.find(s => s.id === appointment.horarioId || (s.nutricionistaId === appointment.nutricionistaId && s.data === appointment.data && s.hora === appointment.hora));
  if (slot) {
    slot.status = 'disponivel';
    saveTimeSlots(slots);
  }

  return { success: true, message: 'Consulta cancelada com sucesso.' };
}

/**
 * Business Rule: O nutricionista pode bloquear determinados horários.
 */
export function toggleBlockTimeSlot(
  slotId: string,
  motivo?: string
): { success: boolean; message: string; newStatus?: string } {
  const slots = getTimeSlots();
  const slot = slots.find(s => s.id === slotId);

  if (!slot) {
    return { success: false, message: 'Horário não encontrado.' };
  }

  if (slot.status === 'reservado') {
    return { success: false, message: 'Não é possível bloquear um horário já reservado por um paciente.' };
  }

  if (slot.status === 'bloqueado') {
    slot.status = 'disponivel';
    slot.motivoBloqueio = undefined;
    saveTimeSlots(slots);
    return { success: true, message: 'Horário desbloqueado com sucesso.', newStatus: 'disponivel' };
  } else {
    slot.status = 'bloqueado';
    slot.motivoBloqueio = motivo || 'Bloqueado pelo nutricionista';
    saveTimeSlots(slots);
    return { success: true, message: 'Horário bloqueado com sucesso.', newStatus: 'bloqueado' };
  }
}
