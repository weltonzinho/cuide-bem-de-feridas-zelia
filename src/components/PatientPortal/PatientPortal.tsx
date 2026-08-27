import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartPulse, 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Droplet, 
  Sun, 
  Info,
  CalendarCheck,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { ServiceType } from '../../types';
import { SERVICE_TYPE_LABELS, formatCurrency, formatDateBR } from '../../utils/formatters';

export const PatientPortal: React.FC = () => {
  const { 
    patients, 
    appointments, 
    scheduleAppointment, 
    profile, 
    addToast 
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Self booking form
  const [serviceType, setServiceType] = useState<ServiceType>('curativo_complexo');
  const [date, setDate] = useState<string>('2026-08-27');
  const [startTime, setStartTime] = useState<string>('14:00');
  const [isDomiciliary, setIsDomiciliary] = useState<boolean>(true);
  const [patientAddress, setPatientAddress] = useState<string>(
    activePatient ? `${activePatient.address.street}, ${activePatient.address.number} - ${activePatient.address.neighborhood}` : ''
  );
  const [notes, setNotes] = useState<string>('');

  const patientAppointments = appointments.filter((a) => a.patientId === activePatient?.id);
  const activeWound = activePatient?.wounds[0];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const res = scheduleAppointment({
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientPhone: activePatient.phone,
      patientAddress: isDomiciliary ? patientAddress : undefined,
      serviceType,
      date,
      startTime,
      durationMinutes: SERVICE_TYPE_LABELS[serviceType]?.duration || 60,
      isDomiciliary,
      travelTimeMinutes: activePatient.address.estimatedTravelMinutes || 25,
      bufferTimeMinutes: 15,
      status: 'pendente',
      nurseAssigned: profile.name,
      estimatedValue: isDomiciliary ? profile.defaultHomeVisitFee : SERVICE_TYPE_LABELS[serviceType]?.defaultPrice || 180,
      notes: `[Agendado pelo Paciente] ${notes}`,
      isConfirmedByPatient: true,
    });

    if (res.success) {
      setNotes('');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Patient Welcome Header */}
      <div className="bg-linear-to-r from-slate-900 via-[#0f172a] to-blue-950/80 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
              Portal do Paciente & Cuidador
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-2">
              Olá, {activePatient?.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Acompanhe seu tratamento estomaterápico com a {profile.name} ({profile.coren}), agende visitas domiciliares e veja as orientações para o seu curativo.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <label className="text-[11px] text-slate-400">Alternar paciente de demonstração:</label>
            <select
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                const p = patients.find((pat) => pat.id === e.target.value);
                if (p) {
                  setPatientAddress(`${p.address.street}, ${p.address.number} - ${p.address.neighborhood}`);
                }
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-slate-200 border border-slate-700 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wound Healing Status Mini-Card */}
        {activeWound && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
                Tratamento em Andamento
              </span>
              <h3 className="text-sm font-bold text-white">{activeWound.title}</h3>
              <p className="text-xs text-slate-400">{activeWound.anatomicalLocation}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Evolução da Cicatrização</span>
                <span className="text-lg font-black text-emerald-400 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  -{activeWound.healingProgressPercent}% de área
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Self Scheduling + Patient Appointments & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: SELF SCHEDULING FORM */}
        <div className="lg:col-span-6 bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Solicitar Agendamento / Visita</h2>
              <p className="text-xs text-slate-400">Validação automática de horários disponíveis</p>
            </div>
          </div>

          <form onSubmit={handleBook} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tipo de Atendimento Desejado *
              </label>
              <select
                value={serviceType}
                onChange={(e) => {
                  const val = e.target.value as ServiceType;
                  setServiceType(val);
                  if (val === 'visita_domiciliar') setIsDomiciliary(true);
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              >
                {Object.entries(SERVICE_TYPE_LABELS).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label} ({cfg.duration} min) - {formatCurrency(cfg.defaultPrice)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Data de Preferência *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Horário Sugerido *</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 font-semibold"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                <input
                  type="checkbox"
                  checked={isDomiciliary}
                  onChange={(e) => setIsDomiciliary(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
                <span className="flex items-center gap-1 text-slate-200">
                  <Car className="w-3.5 h-3.5 text-blue-400" />
                  Desejo atendimento domiciliar (na minha residência)
                </span>
              </label>

              {isDomiciliary && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Meu Endereço Completo</label>
                  <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="Rua, Número, Bairro, Apto"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                    required={isDomiciliary}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Observações ou sintomas atuais</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Curativo está saturando mais rápido ou sinto leve ardência nas bordas..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Solicitar Agendamento</span>
            </button>
          </form>
        </div>

        {/* RIGHT: UPCOMING APPOINTMENTS & HOME CARE GUIDELINES */}
        <div className="lg:col-span-6 space-y-5">
          {/* Upcoming Visits */}
          <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Meus Atendimentos Agendados ({patientAppointments.length})
            </h3>

            {patientAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                Você não possui consultas agendadas no momento.
              </p>
            ) : (
              <div className="space-y-2">
                {patientAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-100">{formatDateBR(apt.date)} às {apt.startTime}</strong>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          apt.status === 'confirmado' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          apt.status === 'pendente' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}>
                          {apt.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-400">{SERVICE_TYPE_LABELS[apt.serviceType]?.label}</p>
                      {apt.isDomiciliary && (
                        <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                          <Car className="w-3 h-3 text-blue-400" /> Visita Domiciliar
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-slate-200 block">{formatCurrency(apt.estimatedValue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Educational Wound Care Guidelines */}
          <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Orientações para o Seu Curativo
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-start gap-2.5">
                <Droplet className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-300 font-bold block">Proteção no Banho</strong>
                  <span className="text-slate-300">Proteja sempre o curativo com filme plástico ou saco protetor. O curativo não deve molhar durante a higiene pessoal.</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block">Sinais de Alerta para Contato Imediato</strong>
                  <span className="text-slate-300">Caso observe febre, odor forte anormal, sangramento abundante ou dor súbita intensa, avise a enfermeira imediatamente.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <Sun className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 font-bold block">Hábitos que Aceleram a Cicatrização</strong>
                  <span className="text-slate-400">Ingira pelo menos 2 litros de água ao dia, mantenha boa alimentação rica em proteínas e eleve as pernas ao repousar.</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/5511987654321?text=Ola%20Dra%20Mariana,%20sou%20${encodeURIComponent(activePatient?.name || 'Paciente')}%20e%20gostaria%20de%20tirar%20uma%20duvida%20sobre%20o%20meu%20curativo.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Falar no WhatsApp da Enfermeira ({profile.phone})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

