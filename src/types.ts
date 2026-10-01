export interface Patient {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha?: string;
  criadoEm?: string;
}

export interface Nutritionist {
  id: string;
  nome: string;
  crn: string;
  email: string;
  telefone: string;
  especialidade: string;
}

export type SlotStatus = 'disponivel' | 'reservado' | 'bloqueado';

export interface TimeSlot {
  id: string;
  nutricionistaId: string;
  data: string; // Formato: YYYY-MM-DD
  hora: string; // Formato: HH:mm
  status: SlotStatus;
  motivoBloqueio?: string;
}

export type AppointmentStatus = 'agendada' | 'cancelada' | 'concluida';

export interface Appointment {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteTelefone: string;
  nutricionistaId: string;
  nutricionistaNome: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  status: AppointmentStatus;
  criadoEm: string;
  horarioId: string;
}

export type UserRole = 'paciente' | 'nutricionista';

export interface DatabaseTableSchema {
  tableName: string;
  description: string;
  columns: {
    name: string;
    type: string;
    key?: 'PK' | 'FK' | 'UNI';
    description: string;
  }[];
}
