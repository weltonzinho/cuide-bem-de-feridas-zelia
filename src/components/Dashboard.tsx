import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Calendar, 
  HeartPulse, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Car, 
  Plus, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  Package,
  Activity,
  Sparkles,
  Building2,
  DollarSign,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { formatDateBR, formatCurrency, LESION_TYPE_LABELS, SERVICE_TYPE_LABELS } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const { 
    patients, 
    appointments, 
    supplies, 
    profile, 
    companyInfo,
    adminAccount,
    adminAccounts,
    userRole,
    nurseAccounts,
    setActiveTab, 
    setIsEvolutionModalOpen, 
    setIsAppointmentModalOpen,
    setSelectedPatient,
    setSelectedWound,
    confirmAppointment
  } = useApp();

  // Metrics calculation
  const totalPatients = patients.length;
  const allWounds = patients.flatMap((p) => p.wounds);
  const activeWounds = allWounds.filter((w) => w.status === 'em_tratamento');
  
  const avgHealingProgress = activeWounds.length > 0
    ? Math.round(activeWounds.reduce((acc, w) => acc + (w.healingProgressPercent || 0), 0) / activeWounds.length)
    : 0;

  // Today's appointments (simulated date 2026-08-25)
  const todayAppointments = appointments.filter((a) => a.date === '2026-08-25');
  const domiciliaryToday = todayAppointments.filter((a) => a.isDomiciliary).length;
  const lowStockSupplies = supplies.filter((s) => s.currentStock <= s.minStockAlert);

  // Financial calculations for Admin
  const totalRevenue = appointments
    .filter(a => a.status === 'realizado' || a.status === 'confirmado')
    .reduce((acc, a) => acc + (a.estimatedValue || 250), 0);
  
  const totalTravelMinutes = appointments.reduce((acc, a) => acc + (a.travelTimeMinutes || 0), 0);

  const handleStartEvolution = (patientId: string, woundId?: string) => {
    const p = patients.find((pat) => pat.id === patientId);
    if (p) {
      setSelectedPatient(p);
      if (woundId) {
        const w = p.wounds.find((wnd) => wnd.id === woundId);
        if (w) setSelectedWound(w);
      } else if (p.wounds.length > 0) {
        setSelectedWound(p.wounds[0]);
      }
    }
    setIsEvolutionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      {userRole === 'admin' ? (
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-[#0f172a] border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/30">
                Gestão Administrativa & Financeira
              </span>
              <span className="text-xs text-amber-400 font-mono font-semibold">{adminAccount.clinicName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Painel de Gestão & Faturamento
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Bem-vinda, <strong className="text-white">{adminAccount.name}</strong>. A clínica possui <strong className="text-amber-400">{nurseAccounts.length} usuários cadastrados (enfermeiros e técnicos)</strong>, <strong className="text-amber-400">{totalPatients} pacientes</strong> e faturamento acumulado de <strong className="text-emerald-400">{formatCurrency(totalRevenue)}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              id="btn-dash-admin-users"
              onClick={() => setActiveTab('nurse_profile')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Usuários Administrativos ({adminAccounts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('nurse_profile')}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-white" />
              <span>Empresa & Clínica</span>
            </button>

            <button
              onClick={() => setActiveTab('nurse_profile')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-white" />
              <span>Enfermeiros & Técnicos ({nurseAccounts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Relatório Financeiro</span>
            </button>

            <button
              onClick={() => setActiveTab('supplies')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Controle de Estoque</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-[#0f172a] border border-blue-500/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">
                {profile.specialization}
              </span>
              <span className="text-xs text-blue-400 font-mono font-semibold">{profile.coren}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Painel Clínico de Estomaterapia
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Bem-vinda, <strong className="text-white">{profile.name}</strong>. Você tem <strong className="text-blue-400">{todayAppointments.length} atendimentos programados</strong> hoje ({domiciliaryToday} visitas domiciliares com cálculo de rota).
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsEvolutionModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Ficha de Evolução</span>
            </button>

            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Novo Agendamento</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Pacientes em Tratamento
            </span>
            <span className="text-2xl font-bold text-white mt-1.5 block">
              {totalPatients} <span className="text-xs font-medium text-slate-500 font-mono">({activeWounds.length} lesões)</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold shadow-lg shadow-blue-500/10">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Regressão Média de Área
            </span>
            <span className="text-2xl font-bold text-emerald-400 mt-1.5 flex items-center gap-1 font-mono">
              <TrendingDown className="w-5 h-5" />
              -{avgHealingProgress}%
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Agenda de Hoje (25/08)
            </span>
            <span className="text-2xl font-bold text-blue-400 mt-1.5 block font-mono">
              {todayAppointments.length} <span className="text-xs font-medium text-slate-500">({domiciliaryToday} em domicílio)</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Alerta de Reposição
            </span>
            <span className={`text-2xl font-bold mt-1.5 block font-mono ${lowStockSupplies.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {lowStockSupplies.length} <span className="text-xs font-medium text-slate-500">insumos críticos</span>
            </span>
          </div>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold ${
            lowStockSupplies.length > 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: TODAY'S SCHEDULE & WOUND HEALING TRACKER */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Agenda Card */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Agenda do Dia</h2>
                  <p className="text-xs text-slate-400">Horários com cálculo de tempo de trânsito inteligente</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('scheduler')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>Ver Agenda Completa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-900/60 border border-slate-800 rounded-xl">
                Nenhum atendimento agendado para hoje.
              </p>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl border border-slate-800 bg-[#0a0f1d] hover:border-blue-500/40 hover:bg-slate-800/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                          {apt.startTime}
                        </span>
                        <span className="text-xs font-bold text-white">{apt.patientName}</span>
                        {apt.isDomiciliary && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                            <Car className="w-3 h-3 text-amber-400" />
                            Domiciliar (+{apt.travelTimeMinutes}m)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {SERVICE_TYPE_LABELS[apt.serviceType]?.label || apt.serviceType}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <span className="text-xs font-mono font-bold text-slate-300 mr-2">
                        {formatCurrency(apt.estimatedValue)}
                      </span>
                      <button
                        onClick={() => handleStartEvolution(apt.patientId, apt.woundId)}
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
          </div>

          {/* Active Wounds Healing Progress Tracker */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Evolução & Regressão de Lesões</h2>
                  <p className="text-xs text-slate-400">Acompanhamento contínuo da área e escala PUSH Tool</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('gallery')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>Ver Galeria Comparativa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeWounds.map((wound) => (
                <div
                  key={wound.id}
                  className="p-4 rounded-xl border border-slate-800 bg-[#0a0f1d] hover:border-slate-700 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{wound.title}</span>
                      <span className="text-[11px] text-slate-400 block">{wound.patientName} • {wound.anatomicalLocation}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 font-mono">
                      <TrendingDown className="w-3.5 h-3.5" />
                      -{wound.healingProgressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${Math.min(100, wound.healingProgressPercent || 0)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Área Inicial: {wound.initialAreaCm2} cm²</span>
                      <span className="font-bold text-blue-400">Área Atual: {wound.currentAreaCm2} cm²</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUPPLIES ALERT & QUICK SUMMARY */}
        <div className="lg:col-span-5 space-y-6">
          {/* Low Stock Insumos Alert Box */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Insumos & Coberturas Críticas</h2>
                  <p className="text-xs text-slate-400">Reposição necessária para atendimentos</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('supplies')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>Ver Estoque</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {lowStockSupplies.length === 0 ? (
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Todos os insumos e coberturas especiais estão com estoque regular.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockSupplies.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-slate-200 block">{item.name}</strong>
                      <span className="text-[11px] text-amber-400 font-medium">
                        Restam {item.currentStock} {item.unit} (Mínimo: {item.minStockAlert})
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('supplies')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px] shadow-sm transition-colors"
                    >
                      Repor
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Guidance & Protocol Reminder */}
          <div className="bg-[#0a0f1d] border border-slate-800 text-slate-200 rounded-2xl p-6 shadow-xl space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md inline-block">
              Protocolos de Estomaterapia
            </span>
            <h3 className="text-sm font-bold text-white">Boas Práticas de Avaliação</h3>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
              <li>Mensuração rigorosa do maior comprimento x maior largura em centímetros.</li>
              <li>Inspeção de descolamentos e túneis seguindo sentido dos ponteiros do relógio.</li>
              <li>Classificação precisa do leito (% granulação, esfacelo e necrose).</li>
              <li>Orientação de cuidados no banho e proteção da pele perilesional.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

