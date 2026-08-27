import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Car, 
  User, 
  Phone, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { ServiceType, Appointment } from '../../types';
import { SERVICE_TYPE_LABELS, formatCurrency } from '../../utils/formatters';
import { checkScheduleConflict, findAvailableTimeSlots } from '../../utils/schedulerUtils';

interface AppointmentModalProps {
  initialAppointment?: Appointment | null;
  onClose?: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ initialAppointment, onClose }) => {
  const { 
    isAppointmentModalOpen, 
    setIsAppointmentModalOpen, 
    patients, 
    appointments, 
    scheduleAppointment, 
    updateAppointment, 
    profile, 
    addToast 
  } = useApp();

  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientAddress, setPatientAddress] = useState<string>('');
  
  const [serviceType, setServiceType] = useState<ServiceType>('curativo_complexo');
  const [date, setDate] = useState<string>('2026-08-25');
  const [startTime, setStartTime] = useState<string>('10:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [isDomiciliary, setIsDomiciliary] = useState<boolean>(false);
  const [travelTimeMinutes, setTravelTimeMinutes] = useState<number>(25);
  const [bufferTimeMinutes, setBufferTimeMinutes] = useState<number>(15);
  const [estimatedValue, setEstimatedValue] = useState<number>(200);
  const [notes, setNotes] = useState<string>('');
  const [woundId, setWoundId] = useState<string>('');

  // Handle Initial Data or Editing
  useEffect(() => {
    if (initialAppointment) {
      setPatientId(initialAppointment.patientId);
      setPatientName(initialAppointment.patientName);
      setPatientPhone(initialAppointment.patientPhone);
      setPatientAddress(initialAppointment.patientAddress || '');
      setServiceType(initialAppointment.serviceType);
      setDate(initialAppointment.date);
      setStartTime(initialAppointment.startTime);
      setDurationMinutes(initialAppointment.durationMinutes);
      setIsDomiciliary(initialAppointment.isDomiciliary);
      setTravelTimeMinutes(initialAppointment.travelTimeMinutes || 25);
      setBufferTimeMinutes(initialAppointment.bufferTimeMinutes || 15);
      setEstimatedValue(initialAppointment.estimatedValue);
      setNotes(initialAppointment.notes || '');
      setWoundId(initialAppointment.woundId || '');
    } else if (patients.length > 0) {
      const p = patients[0];
      setPatientId(p.id);
      setPatientName(p.name);
      setPatientPhone(p.phone);
      setPatientAddress(`${p.address.street}, ${p.address.number} - ${p.address.neighborhood}`);
      if (p.wounds.length > 0) setWoundId(p.wounds[0].id);
    }
  }, [initialAppointment, patients, isAppointmentModalOpen]);

  // When patient changes, auto fill address, phone and active wounds
  const handlePatientChange = (selectedId: string) => {
    setPatientId(selectedId);
    const p = patients.find((pat) => pat.id === selectedId);
    if (p) {
      setPatientName(p.name);
      setPatientPhone(p.phone);
      setPatientAddress(`${p.address.street}, ${p.address.number} - ${p.address.neighborhood}`);
      if (p.wounds.length > 0) setWoundId(p.wounds[0].id);
      if (p.address.estimatedTravelMinutes) {
        setTravelTimeMinutes(p.address.estimatedTravelMinutes);
      }
    }
  };

  // When service type changes, auto-set default duration & price & domiciliary flag
  const handleServiceTypeChange = (type: ServiceType) => {
    setServiceType(type);
    const config = SERVICE_TYPE_LABELS[type];
    setDurationMinutes(config.duration);
    setEstimatedValue(config.defaultPrice);
    if (type === 'visita_domiciliar') {
      setIsDomiciliary(true);
      setTravelTimeMinutes(30);
    }
  };

  // LIVE CONFLICT CHECKING
  const conflictEvaluation = useMemo(() => {
    return checkScheduleConflict(appointments, {
      id: initialAppointment?.id,
      date,
      startTime,
      durationMinutes,
      isDomiciliary,
      travelTimeMinutes,
      bufferTimeMinutes,
    });
  }, [appointments, initialAppointment, date, startTime, durationMinutes, isDomiciliary, travelTimeMinutes, bufferTimeMinutes]);

  const handleClose = () => {
    if (onClose) onClose();
    setIsAppointmentModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (conflictEvaluation.hasConflict) {
      addToast({
        type: 'error',
        title: 'Horário Conflitante',
        message: conflictEvaluation.conflictReason || 'Por favor escolha outro horário disponível.',
      });
      return;
    }

    if (initialAppointment) {
      const res = updateAppointment({
        ...initialAppointment,
        patientId,
        patientName,
        patientPhone,
        patientAddress,
        serviceType,
        date,
        startTime,
        durationMinutes,
        isDomiciliary,
        travelTimeMinutes,
        bufferTimeMinutes,
        estimatedValue,
        woundId,
        notes,
      });
      if (res.success) handleClose();
    } else {
      const res = scheduleAppointment({
        patientId,
        patientName,
        patientPhone,
        patientAddress,
        serviceType,
        date,
        startTime,
        durationMinutes,
        isDomiciliary,
        travelTimeMinutes,
        bufferTimeMinutes,
        status: 'confirmado',
        nurseAssigned: profile.name,
        estimatedValue,
        woundId,
        notes,
        isConfirmedByPatient: true,
      });
      if (res.success) handleClose();
    }
  };

  if (!isAppointmentModalOpen && !initialAppointment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">
                {initialAppointment ? 'Reagendar / Editar Atendimento' : 'Agendamento Inteligente & Validação'}
              </h2>
              <p className="text-xs text-slate-400">
                Prevenção de choque de horários e cálculo de rota para visitas domiciliares
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Patient Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Paciente *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={patientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 bg-slate-900 text-slate-100"
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="Telefone / WhatsApp"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Procedimento / Tipo de Atendimento *
            </label>
            <select
              value={serviceType}
              onChange={(e) => handleServiceTypeChange(e.target.value as ServiceType)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 bg-slate-900 text-slate-100"
              required
            >
              {Object.entries(SERVICE_TYPE_LABELS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label} ({config.duration} min) - {formatCurrency(config.defaultPrice)}
                </option>
              ))}
            </select>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Data *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 bg-slate-900 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Horário de Início *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 bg-slate-900 text-slate-100 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Duração do Procedimento</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
              >
                <option value={30}>30 minutos (Curativo simples)</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos (Padrão)</option>
                <option value={75}>75 minutos (Complexo/Estomia)</option>
                <option value={90}>90 minutos (Desbridamento extenso)</option>
              </select>
            </div>
          </div>

          {/* Domiciliary Visit & Travel Logistics */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0a0f1d] space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDomiciliary}
                  onChange={(e) => {
                    setIsDomiciliary(e.target.checked);
                    if (e.target.checked && estimatedValue < profile.defaultHomeVisitFee) {
                      setEstimatedValue(profile.defaultHomeVisitFee);
                    }
                  }}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-amber-400" />
                  Atendimento em Domicílio (Home Care)
                </span>
              </label>

              {isDomiciliary && (
                <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Deslocamento Ativo
                </span>
              )}
            </div>

            {isDomiciliary && (
              <div className="space-y-3 pt-2 border-t border-slate-800 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Endereço de Atendimento Domiciliar
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={patientAddress}
                      onChange={(e) => setPatientAddress(e.target.value)}
                      placeholder="Rua, Número, Bairro, Complemento"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Tempo de Deslocamento (Minutos)
                    </label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={travelTimeMinutes}
                      onChange={(e) => setTravelTimeMinutes(parseInt(e.target.value) || 20)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Margem / Buffer Pós-Curativo (Minutos)
                    </label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={bufferTimeMinutes}
                      onChange={(e) => setBufferTimeMinutes(parseInt(e.target.value) || 15)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* REAL-TIME COLLISION & CONFLICT FEEDBACK */}
          {conflictEvaluation.hasConflict ? (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300">Choque de Horário Detectado!</h4>
                  <p className="text-xs text-rose-200 mt-0.5">{conflictEvaluation.conflictReason}</p>
                </div>
              </div>

              {conflictEvaluation.suggestedAvailableSlots && conflictEvaluation.suggestedAvailableSlots.length > 0 && (
                <div className="pt-2 border-t border-rose-500/20">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                    Horários livres sugeridos para este dia:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {conflictEvaluation.suggestedAvailableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setStartTime(slot)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-bold transition-colors font-mono"
                      >
                        {slot} (Clique para usar)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-2 text-xs text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Horário 100% livre e validado. Sem choque com outros pacientes ou rotas de deslocamento.</span>
            </div>
          )}

          {/* Notes and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Notas Clínicas / Instruções</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Troca semanal de curativo compressivo"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Valor Estimado (R$)</label>
              <input
                type="number"
                step="10"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-bold text-white rounded-lg border border-slate-700 bg-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={conflictEvaluation.hasConflict}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-40"
            >
              {initialAppointment ? 'Salvar Alterações' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
