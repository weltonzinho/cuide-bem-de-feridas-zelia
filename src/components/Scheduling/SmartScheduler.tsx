import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Car, 
  MapPin, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Edit, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  FileCheck2,
  CalendarCheck,
  AlertCircle
} from 'lucide-react';
import { Appointment } from '../../types';
import { SERVICE_TYPE_LABELS, formatCurrency, formatDateBR } from '../../utils/formatters';
import { AppointmentModal } from './AppointmentModal';
import { minutesToTime, timeToMinutes } from '../../utils/schedulerUtils';

export const SmartScheduler: React.FC = () => {
  const { 
    appointments, 
    setIsAppointmentModalOpen, 
    confirmAppointment, 
    cancelAppointment, 
    setSelectedPatient, 
    setSelectedWound, 
    setIsEvolutionModalOpen,
    patients 
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [viewMode, setViewMode] = useState<'timeline' | 'cards' | 'all'>('timeline');
  const [filterDomiciliaryOnly, setFilterDomiciliaryOnly] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Filter appointments
  const dateAppointments = appointments
    .filter((a) => {
      if (viewMode === 'all') return true;
      return a.date === selectedDate;
    })
    .filter((a) => {
      if (filterDomiciliaryOnly) return a.isDomiciliary;
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Change date helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate('2026-08-25');
  };

  // Launch Evolution Form for an appointment
  const handleStartEvolution = (apt: Appointment) => {
    const p = patients.find((pat) => pat.id === apt.patientId);
    if (p) {
      setSelectedPatient(p);
      if (apt.woundId) {
        const w = p.wounds.find((wnd) => wnd.id === apt.woundId);
        if (w) setSelectedWound(w);
      } else if (p.wounds.length > 0) {
        setSelectedWound(p.wounds[0]);
      }
    }
    setIsEvolutionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#0f172a] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Date Selector & Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            title="Dia Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-sm font-semibold text-white rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 bg-slate-900"
          />

          <button
            onClick={handleNextDay}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            title="Próximo Dia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-colors"
          >
            Hoje (25/08)
          </button>
        </div>

        {/* View Mode & Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'timeline' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linha do Tempo
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cartões
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'all' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ver Todos
            </button>
          </div>

          <button
            onClick={() => setFilterDomiciliaryOnly(!filterDomiciliaryOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              filterDomiciliaryOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Apenas Visitas Domiciliares</span>
          </button>

          <button
            onClick={() => {
              setEditingAppointment(null);
              setIsAppointmentModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {dateAppointments.length === 0 ? (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-12 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhum atendimento agendado para esta data</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Não há consultas clínicas ou visitas domiciliares marcadas para {formatDateBR(selectedDate)}.
          </p>
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Atendimento</span>
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* TIMELINE VIEW WITH VISUAL OCCUPIED AND TRAVEL BUFFERS */
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Agenda do Dia: {formatDateBR(selectedDate)}
            </h3>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              {dateAppointments.length} atendimento(s) programado(s)
            </span>
          </div>

          <div className="p-6 divide-y divide-slate-800/80 space-y-4">
            {dateAppointments.map((apt) => {
              const startM = timeToMinutes(apt.startTime);
              const endM = startM + apt.durationMinutes;
              const endTimeStr = minutesToTime(endM);
              const isCancelled = apt.status === 'cancelado';
              const isDone = apt.status === 'realizado';

              return (
                <div
                  key={apt.id}
                  className={`pt-4 first:pt-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                    isCancelled ? 'opacity-40' : ''
                  }`}
                >
                  {/* Time and Duration Badge */}
                  <div className="flex items-start gap-3 w-full md:w-56 shrink-0">
                    <div className="w-14 text-center">
                      <span className="text-base font-extrabold text-blue-400 block leading-tight font-mono">{apt.startTime}</span>
                      <span className="text-[11px] text-slate-500 font-medium font-mono">{endTimeStr}</span>
                    </div>

                    <div className="h-10 w-0.5 bg-blue-500 rounded-full hidden md:block shadow-sm shadow-blue-500/50" />

                    <div className="flex-1">
                      <span className="text-[11px] font-semibold text-slate-400 block">
                        Duração: {apt.durationMinutes} min
                      </span>
                      {apt.isDomiciliary && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 mt-1">
                          <Car className="w-3 h-3" />
                          +{apt.travelTimeMinutes}min trânsito
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Patient and Service Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{apt.patientName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        apt.status === 'confirmado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        apt.status === 'pendente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        apt.status === 'realizado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {apt.status.toUpperCase()}
                      </span>
                      {apt.isDomiciliary ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-1">
                          <Car className="w-3 h-3 text-blue-400" />
                          Visita Domiciliar
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full">
                          Em Consultório
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-blue-300">
                      {SERVICE_TYPE_LABELS[apt.serviceType]?.label || apt.serviceType}
                    </p>

                    {apt.isDomiciliary && apt.patientAddress && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{apt.patientAddress}</span>
                      </p>
                    )}

                    {apt.notes && (
                      <p className="text-xs text-slate-300 italic bg-slate-900/60 p-1.5 rounded border border-slate-800">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>

                  {/* Pricing & Fast Action Buttons */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0">
                    <div className="text-right mr-2 hidden sm:block">
                      <span className="text-xs text-slate-500 block">Previsto</span>
                      <span className="text-sm font-extrabold text-white font-mono">{formatCurrency(apt.estimatedValue)}</span>
                    </div>

                    {!isCancelled && !isDone && (
                      <>
                        <button
                          onClick={() => handleStartEvolution(apt)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/20 transition-colors"
                          title="Abrir Ficha de Evolução Clínica para este atendimento"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Evoluir</span>
                        </button>

                        {apt.status === 'pendente' && (
                          <button
                            onClick={() => confirmAppointment(apt.id)}
                            className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg border border-emerald-500/30 transition-colors"
                            title="Confirmar Agendamento"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setEditingAppointment(apt);
                            setIsAppointmentModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
                          title="Reagendar / Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg border border-rose-500/30 transition-colors"
                          title="Cancelar Atendimento"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {isDone && (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-xs font-bold rounded-lg border border-blue-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                        Concluído
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dateAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {apt.startTime} ({apt.durationMinutes} min)
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    apt.status === 'confirmado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    apt.status === 'pendente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{apt.patientName}</h4>
                  <p className="text-xs text-slate-400 font-medium">{SERVICE_TYPE_LABELS[apt.serviceType]?.label}</p>
                </div>

                {apt.isDomiciliary && (
                  <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-300 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <Car className="w-3 h-3 text-amber-400" />
                      Visita Domiciliar (+{apt.travelTimeMinutes}min trânsito)
                    </span>
                    <p className="truncate text-slate-300">{apt.patientAddress}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-extrabold text-white font-mono">{formatCurrency(apt.estimatedValue)}</span>
                <button
                  onClick={() => handleStartEvolution(apt)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/20 transition-colors"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Evoluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editing Appointment Modal */}
      {editingAppointment && (
        <AppointmentModal
          initialAppointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
        />
      )}
    </div>
  );
};

