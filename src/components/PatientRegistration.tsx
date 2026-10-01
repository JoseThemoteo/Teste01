import React, { useState } from 'react';
import { User, CreditCard, Mail, Phone, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { savePatient, getPatients } from '../storage';
import type { Patient } from '../types';

interface PatientRegistrationProps {
  onSuccess?: (patient: Patient) => void;
}

export function PatientRegistration({ onSuccess }: PatientRegistrationProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!nome.trim()) {
      setMessage({ type: 'error', text: 'Por favor, informe seu nome completo.' });
      return;
    }

    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) {
      setMessage({ type: 'error', text: 'Por favor, informe um CPF válido com 11 dígitos.' });
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setMessage({ type: 'error', text: 'Por favor, informe um endereço de e-mail válido.' });
      return;
    }

    const cleanPhone = telefone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setMessage({ type: 'error', text: 'Por favor, informe um número de telefone com DDD.' });
      return;
    }

    if (senha.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve conter no mínimo 6 caracteres.' });
      return;
    }

    const result = savePatient({
      nome: nome.trim(),
      cpf: cpf.trim(),
      email: email.trim().toLowerCase(),
      telefone: telefone.trim(),
      senha,
    });

    if (result.success && result.patient) {
      setMessage({ type: 'success', text: result.message });
      setNome('');
      setCpf('');
      setEmail('');
      setTelefone('');
      setSenha('');
      if (onSuccess) {
        onSuccess(result.patient);
      }
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const registeredPatients = getPatients();

  return (
    <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-stone-800 shadow-xl max-w-lg mx-auto my-4 text-white">
      <div className="mb-6 border-b border-stone-800 pb-4">
        <h2 className="text-xl font-extrabold text-amber-500 flex items-center gap-2">
          <User className="w-6 h-6" /> Cadastro de Paciente
        </h2>
        <p className="text-stone-400 text-xs mt-1">
          Informe seus dados para realizar o cadastro e agendar suas consultas nutricionais.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl mb-6 flex items-start gap-3 border text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500 text-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">Nome Completo</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
            <input
              type="text"
              required
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-[#121212] border border-stone-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">CPF</label>
          <div className="relative">
            <CreditCard className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
            <input
              type="text"
              required
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              className="w-full bg-[#121212] border border-stone-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">E-mail</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
            <input
              type="email"
              required
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-stone-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">Telefone / WhatsApp</label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
            <input
              type="text"
              required
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(formatPhone(e.target.value))}
              className="w-full bg-[#121212] border border-stone-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">Senha</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-[#121212] border border-stone-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-amber-500/20 active:scale-[0.99] text-sm cursor-pointer"
        >
          Finalizar Cadastro
        </button>
      </form>

      {/* List of Registered Patients */}
      <div className="mt-8 pt-6 border-t border-stone-800">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
          Pacientes Cadastrados ({registeredPatients.length})
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {registeredPatients.map((p) => (
            <div key={p.id} className="bg-[#121212] p-3 rounded-xl border border-stone-800/80 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">{p.nome}</p>
                <p className="text-stone-400 text-[11px]">{p.email} • {p.telefone}</p>
              </div>
              <span className="bg-stone-800 text-stone-300 font-mono px-2 py-0.5 rounded text-[10px]">
                {p.cpf}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
