import React, { useState } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import { 
  HeartPulse, 
  Calendar, 
  Users, 
  FileText, 
  Camera, 
  Package, 
  PlusCircle, 
  Activity, 
  Sparkles,
  UserCheck,
  Building2,
  CalendarCheck,
  AlertTriangle,
  ShieldCheck,
  Lock,
  KeyRound,
  LogOut,
  ChevronDown,
  Stethoscope,
  DollarSign
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userRole, 
    setUserRole, 
    profile, 
    adminAccount,
    currentNurse,
    activeSession,
    appointments, 
    supplies, 
    setIsAppointmentModalOpen, 
    setIsEvolutionModalOpen,
    setIsAIAdvisorModalOpen,
    openLoginPortal,
    logout
  } = useApp();

  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);

  const lowStockCount = supplies.filter(s => s.currentStock <= s.minStockAlert).length;
  const todayStr = '2026-08-25'; // Match simulated timeline
  const todayAppointmentsCount = appointments.filter(a => a.date === todayStr && a.status !== 'cancelado').length;

  // Nav Items for Nurse
  const nurseNavItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Painel Clínico', icon: Activity },
    { id: 'scheduler', label: 'Agenda & Visitas', icon: Calendar, badge: todayAppointmentsCount },
    { id: 'patients', label: 'Pacientes & Prontuários', icon: Users },
    { id: 'gallery', label: 'Galeria Comparativa', icon: Camera },
    { id: 'supplies', label: 'Insumos & Coberturas', icon: Package, badge: lowStockCount },
    { id: 'reports', label: 'Relatórios & Laudo PDF', icon: FileText },
    { id: 'nurse_profile', label: 'Registro do Enfermeiro', icon: ShieldCheck },
  ];

  // Nav Items for Admin
  const adminNavItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Painel de Gestão', icon: Activity },
    { id: 'nurse_profile', label: 'Empresa & Usuários', icon: Building2 },
    { id: 'reports', label: 'Faturamento & Relatórios', icon: DollarSign },
    { id: 'scheduler', label: 'Agenda Global', icon: Calendar, badge: todayAppointmentsCount },
    { id: 'supplies', label: 'Estoque & Insumos', icon: Package, badge: lowStockCount },
    { id: 'patients', label: 'Pacientes', icon: Users },
  ];

  const currentNavItems = userRole === 'admin' ? adminNavItems : userRole === 'nurse' ? nurseNavItems : [];

  return (
    <header className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-30 shadow-xl">
      {/* Top Bar with Professional Status & Role Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-500/20">
              CB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Cuide Bem</span>
                {userRole === 'admin' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
                    Gestão & Faturamento
                  </span>
                ) : userRole === 'patient' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    Portal do Paciente
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                    Estomaterapia Pro
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Prevenção e Tratamento Avançado de Feridas & Cicatrização
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Nurse Quick Actions */}
            {userRole === 'nurse' && (
              <>
                <button
                  onClick={() => setIsEvolutionModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-colors"
                  title="Registrar nova evolução clínica de ferida"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden md:inline">Nova Evolução</span>
                  <span className="md:hidden">Evoluir</span>
                </button>

                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  title="Agendar nova consulta ou visita domiciliar"
                >
                  <CalendarCheck className="w-4 h-4 text-blue-400" />
                  <span className="hidden md:inline">Agendar</span>
                </button>

                <button
                  onClick={() => setIsAIAdvisorModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/25 transition-colors"
                  title="Assistente de Conduta Clínica e Protocolo TIME"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="hidden lg:inline">Assistente IA</span>
                </button>
              </>
            )}

            {/* Admin Quick Action */}
            {userRole === 'admin' && (
              <button
                onClick={() => setActiveTab('reports')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar Faturamento</span>
                <span className="sm:hidden">Finanças</span>
              </button>
            )}

            {/* Patient Quick Action */}
            {userRole === 'patient' && (
              <button
                onClick={() => setActiveTab('patient_portal')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-colors"
              >
                <HeartPulse className="w-4 h-4" />
                <span>Minha Cicatrização</span>
              </button>
            )}

            {/* Unified Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  userRole === 'nurse'
                    ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                    : userRole === 'admin'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {userRole === 'nurse' && <Stethoscope className="w-3.5 h-3.5 text-blue-400" />}
                {userRole === 'admin' && <Building2 className="w-3.5 h-3.5 text-amber-400" />}
                {userRole === 'patient' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                
                <span className="hidden sm:inline">
                  {userRole === 'nurse' ? 'Enfermeiro' : userRole === 'admin' ? 'Administrativo' : 'Portal Paciente'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Dropdown Menu */}
              {isPortalDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setIsPortalDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Alternar Portal</p>
                    <p className="text-xs font-bold text-white truncate">
                      {activeSession?.user.name || (userRole === 'admin' ? adminAccount.name : profile.name)}
                    </p>
                  </div>

                  {/* Option 1: Nurse */}
                  <button
                    onClick={() => {
                      setUserRole('nurse');
                      setActiveTab('dashboard');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
                      userRole === 'nurse'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="font-semibold">Portal do Enfermeiro</p>
                      <p className="text-[10px] opacity-70">Prontuário, Fotos e PUSH</p>
                    </div>
                  </button>

                  {/* Option 2: Admin */}
                  <button
                    onClick={() => {
                      setUserRole('admin');
                      setActiveTab('dashboard');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all mt-1 ${
                      userRole === 'admin'
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="font-semibold">Portal Administrativo</p>
                      <p className="text-[10px] opacity-70">Finanças, Estoque e Gestão</p>
                    </div>
                  </button>

                  {/* Option 3: Patient */}
                  <button
                    onClick={() => {
                      setUserRole('patient');
                      setActiveTab('patient_portal');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all mt-1 ${
                      userRole === 'patient'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="font-semibold">Portal do Paciente</p>
                      <p className="text-[10px] opacity-70">Acompanhamento & Agendamento</p>
                    </div>
                  </button>

                  <div className="border-t border-slate-800 mt-2 pt-2 space-y-1">
                    <button
                      onClick={() => openLoginPortal()}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-blue-400 hover:bg-blue-950/40 hover:text-blue-300 font-medium transition-all"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Tela de Login / Autenticação</span>
                    </button>

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 font-medium transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair do Sistema</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Navigation Tabs (For Nurse & Admin View) */}
        {(userRole === 'nurse' || userRole === 'admin') && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5 border-t border-slate-800">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all relative ${
                    isActive
                      ? userRole === 'admin'
                        ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20 shadow-sm'
                        : 'bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isActive ? (userRole === 'admin' ? 'bg-amber-500' : 'bg-blue-500') : 'bg-slate-600'}`} />
                  <Icon className={`w-4 h-4 ${isActive ? (userRole === 'admin' ? 'text-amber-400' : 'text-blue-400') : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      item.id === 'supplies' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Professional Header Banner info */}
      <div className="bg-[#0a0f1d] border-t border-slate-800/80 px-4 py-1.5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-400">
          
          {userRole === 'nurse' && (
            <div 
              onClick={() => {
                setActiveTab('nurse_profile');
              }}
              className="flex items-center gap-2 truncate cursor-pointer hover:text-slate-200 transition-colors group"
              title="Clique para gerenciar o cadastro e credenciais do enfermeiro"
            >
              <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[9px] border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ShieldCheck className="w-2.5 h-2.5" />
              </div>
              <span className="font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">{profile.name}</span>
              <span className="text-slate-700">•</span>
              <span className="text-blue-400 font-mono font-medium">{profile.coren}</span>
              <span className="text-slate-700 hidden md:inline">•</span>
              <span className="text-slate-400 hidden md:inline truncate">{profile.specialization}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 hidden sm:inline">
                Sessão Ativa
              </span>
            </div>
          )}

          {userRole === 'admin' && (
            <div className="flex items-center gap-2 truncate">
              <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[9px] border border-amber-500/30">
                <Building2 className="w-2.5 h-2.5" />
              </div>
              <span className="font-semibold text-slate-200">{adminAccount.name}</span>
              <span className="text-slate-700">•</span>
              <span className="text-amber-400 font-medium">Gestão & Finanças</span>
              <span className="text-slate-700 hidden md:inline">•</span>
              <span className="text-slate-400 hidden md:inline">{adminAccount.clinicName}</span>
            </div>
          )}

          {userRole === 'patient' && (
            <div className="flex items-center gap-2 truncate">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[9px] border border-emerald-500/30">
                <UserCheck className="w-2.5 h-2.5" />
              </div>
              <span className="font-semibold text-slate-200">Portal do Paciente & Cuidador</span>
              <span className="text-slate-700">•</span>
              <span className="text-emerald-400 font-medium">Acompanhamento Domiciliar & Presencial</span>
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            {lowStockCount > 0 && userRole !== 'patient' && (
              <span 
                onClick={() => setActiveTab('supplies')}
                className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 font-medium"
              >
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>{lowStockCount} insumo(s) crítico(s)</span>
              </span>
            )}
            
            <button
              onClick={() => openLoginPortal()}
              className="text-blue-400 hover:text-blue-300 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Login / Portais</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
