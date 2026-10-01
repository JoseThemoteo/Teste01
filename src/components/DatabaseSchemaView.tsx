import { Database, Server, Smartphone, Key, Code, CheckCircle, Layers } from 'lucide-react';
import type { DatabaseTableSchema } from '../types';

const DATABASE_SCHEMAS: DatabaseTableSchema[] = [
  {
    tableName: 'pacientes',
    description: 'Armazena as informações cadastrais de todos os pacientes.',
    columns: [
      { name: 'id', type: 'INT / VARCHAR', key: 'PK', description: 'Identificador único do paciente' },
      { name: 'nome', type: 'VARCHAR(255)', description: 'Nome completo do paciente' },
      { name: 'cpf', type: 'VARCHAR(14)', key: 'UNI', description: 'CPF único formatado' },
      { name: 'email', type: 'VARCHAR(255)', key: 'UNI', description: 'Endereço de e-mail do paciente' },
      { name: 'telefone', type: 'VARCHAR(20)', description: 'Número de telefone / WhatsApp' },
      { name: 'senha', type: 'VARCHAR(255)', description: 'Hash da senha criptografada (bcrypt)' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Data e hora do cadastro' },
    ],
  },
  {
    tableName: 'nutricionistas',
    description: 'Armazena os dados dos profissionais nutricionistas cadastrados.',
    columns: [
      { name: 'id', type: 'INT / VARCHAR', key: 'PK', description: 'Identificador único do nutricionista' },
      { name: 'nome', type: 'VARCHAR(255)', description: 'Nome completo do profissional' },
      { name: 'crn', type: 'VARCHAR(20)', key: 'UNI', description: 'Registro do Conselho Regional de Nutricionistas' },
      { name: 'email', type: 'VARCHAR(255)', key: 'UNI', description: 'E-mail corporativo' },
      { name: 'telefone', type: 'VARCHAR(20)', description: 'Telefone de contato profissional' },
      { name: 'especialidade', type: 'VARCHAR(100)', description: 'Área de especialização médica/nutricional' },
    ],
  },
  {
    tableName: 'horarios',
    description: 'Disponibilidade de horários gerada ou configurada pelos nutricionistas.',
    columns: [
      { name: 'id', type: 'INT / VARCHAR', key: 'PK', description: 'Identificador único do slot de horário' },
      { name: 'nutricionista_id', type: 'INT / VARCHAR', key: 'FK', description: 'Referência ao nutricionista (nutricionistas.id)' },
      { name: 'data', type: 'DATE', description: 'Data do atendimento (YYYY-MM-DD)' },
      { name: 'hora', type: 'TIME', description: 'Horário do atendimento (HH:MM)' },
      { name: 'status', type: "ENUM('disponivel', 'reservado', 'bloqueado')", description: 'Status do horário' },
      { name: 'motivo_bloqueio', type: 'VARCHAR(255)', description: 'Motivo caso bloqueado pelo nutricionista' },
    ],
  },
  {
    tableName: 'consultas',
    description: 'Registro de agendamentos realizados entre pacientes e nutricionistas.',
    columns: [
      { name: 'id', type: 'INT / VARCHAR', key: 'PK', description: 'Identificador único da consulta' },
      { name: 'paciente_id', type: 'INT / VARCHAR', key: 'FK', description: 'Referência ao paciente (pacientes.id)' },
      { name: 'nutricionista_id', type: 'INT / VARCHAR', key: 'FK', description: 'Referência ao nutricionista (nutricionistas.id)' },
      { name: 'horario_id', type: 'INT / VARCHAR', key: 'FK', description: 'Referência ao slot do horário (horarios.id)' },
      { name: 'data', type: 'DATE', description: 'Data da consulta' },
      { name: 'hora', type: 'TIME', description: 'Horário da consulta' },
      { name: 'status', type: "ENUM('agendada', 'cancelada', 'concluida')", description: 'Status atual da consulta' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Data e hora da confirmação do agendamento' },
    ],
  },
];

export function DatabaseSchemaView() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto my-4 text-white">
      {/* Tech Stack Banner */}
      <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl">
        <div className="border-b border-stone-800 pb-4 mb-4">
          <h2 className="text-xl font-extrabold text-amber-500 flex items-center gap-2">
            <Layers className="w-6 h-6" /> Arquitetura & Especificações Técnicas
          </h2>
          <p className="text-stone-400 text-xs mt-1">
            Visão geral da pilha tecnológica e modelagem relacional conforme documentado na especificação do projeto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#121212] p-4 rounded-xl border border-stone-800 flex flex-col items-center text-center">
            <Smartphone className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="font-extrabold text-xs uppercase text-white">Frontend</h3>
            <p className="text-stone-400 text-xs font-semibold mt-1">React Native</p>
            <p className="text-[10px] text-stone-500 mt-1">App mobile responsivo com suporte iOS e Android</p>
          </div>

          <div className="bg-[#121212] p-4 rounded-xl border border-stone-800 flex flex-col items-center text-center">
            <Server className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="font-extrabold text-xs uppercase text-white">Backend</h3>
            <p className="text-stone-400 text-xs font-semibold mt-1">Node.js (Express/REST API)</p>
            <p className="text-[10px] text-stone-500 mt-1">Validação de regras de negócio (24h, bloqueio, duplicação)</p>
          </div>

          <div className="bg-[#121212] p-4 rounded-xl border border-stone-800 flex flex-col items-center text-center">
            <Database className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="font-extrabold text-xs uppercase text-white">Banco de Dados</h3>
            <p className="text-stone-400 text-xs font-semibold mt-1">MySQL</p>
            <p className="text-[10px] text-stone-500 mt-1">Modelagem relacional com integridade referencial (FK)</p>
          </div>
        </div>
      </div>

      {/* Business Rules Summary */}
      <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl">
        <h3 className="text-base font-extrabold text-white mb-3 flex items-center gap-2">
          <Code className="w-5 h-5 text-amber-500" /> Regras de Negócio Implementadas
        </h3>
        <ul className="space-y-2.5 text-xs text-stone-300">
          <li className="flex items-start gap-2 bg-[#121212] p-3 rounded-xl border border-stone-800">
            <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span><strong>Reserva Única:</strong> Um horário não pode ser reservado por dois pacientes simultaneamente.</span>
          </li>
          <li className="flex items-start gap-2 bg-[#121212] p-3 rounded-xl border border-stone-800">
            <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span><strong>Data e Hora Obrigatórias:</strong> Toda consulta exige estritamente data e horário válidos.</span>
          </li>
          <li className="flex items-start gap-2 bg-[#121212] p-3 rounded-xl border border-stone-800">
            <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span><strong>Cancelamento Prévio (24h):</strong> O paciente pode cancelar uma consulta se houver antecedência mínima de 24 horas.</span>
          </li>
          <li className="flex items-start gap-2 bg-[#121212] p-3 rounded-xl border border-stone-800">
            <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span><strong>Bloqueio pelo Nutricionista:</strong> O profissional pode bloquear horários específicos do seu calendário.</span>
          </li>
        </ul>
      </div>

      {/* Database Schema Visualizer */}
      <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl">
        <h3 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-500" /> Esquema do Banco de Dados (MySQL)
        </h3>
        <p className="text-xs text-stone-400 mb-6">
          Estrutura das tabelas relacionais do sistema.
        </p>

        <div className="space-y-6">
          {DATABASE_SCHEMAS.map((table) => (
            <div key={table.tableName} className="bg-[#121212] rounded-xl border border-stone-800 overflow-hidden">
              <div className="bg-stone-900/90 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-500" /> {table.tableName}
                </span>
                <span className="text-[11px] text-stone-400">{table.description}</span>
              </div>

              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300 font-mono">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-500 uppercase text-[10px]">
                      <th className="py-2 px-3">Coluna</th>
                      <th className="py-2 px-3">Tipo</th>
                      <th className="py-2 px-3">Chave</th>
                      <th className="py-2 px-3">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col) => (
                      <tr key={col.name} className="border-b border-stone-800/40 hover:bg-stone-800/20">
                        <td className="py-2 px-3 font-bold text-white">{col.name}</td>
                        <td className="py-2 px-3 text-stone-400">{col.type}</td>
                        <td className="py-2 px-3">
                          {col.key && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                col.key === 'PK'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : col.key === 'FK'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              <Key className="w-3 h-3 inline mr-0.5" />
                              {col.key}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-stone-400 text-[11px] font-sans">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
