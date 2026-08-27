import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartPulse, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Lock, 
  KeyRound, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  Stethoscope,
  DollarSign,
  TrendingDown,
  Phone
} from 'lucide-react';
import { UserRole } from '../../types';

interface LoginPortalProps {
  initialRole?: UserRole;
  onClose?: () => void;
  isStandaloneScreen?: boolean;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ 
  initialRole = 'nurse', 
  onClose,
  isStandaloneScreen = false 
}) => {
  const { 
    nurseAccounts, 
    adminAccount,
    adminAccounts,
    patients, 
    loginNurse, 
    loginAdmin, 
    loginPatient,
    setUserRole,
    setActiveTab,
    addToast
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  
  // Nurse Form State
  const [nurseEmail, setNurseEmail] = useState(nurseAccounts[0]?.email || 'mariana.estomaterapia@cuidebem.com.br');
  const [nursePassword, setNursePassword] = useState('CuideBem@2026');
  const [nursePin, setNursePin] = useState('');
  const [showNursePass, setShowNursePass] = useState(false);
  const [nurseAuthMethod, setNurseAuthMethod] = useState<'password' | 'pin'>('password');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState(adminAccount.email || 'admin@cuidebem.com.br');
  const [adminPassword, setAdminPassword] = useState('Admin@2026');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Patient Form State
  const [patientCpf, setPatientCpf] = useState(patients[0]?.cpf || '234.567.890-12');
  const [patientBirthDate, setPatientBirthDate] = useState(patients[0]?.birthDate || '1958-04-14');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Format CPF helper
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setPatientCpf(value);
  };

  const handleNurseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const secret = nurseAuthMethod === 'pin' ? nursePin : nursePassword;
      const res = loginNurse(nurseEmail, secret);
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Credenciais inválidas.');
      } else {
        if (onClose) onClose();
      }
    }, 300);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(adminEmail, adminPassword);
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Credenciais administrativas inválidas.');
      } else {
        if (onClose) onClose();
      }
    }, 300);
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginPatient(patientCpf, patientBirthDate);
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Paciente não localizado com este CPF.');
      } else {
        if (onClose) onClose();
      }
    }, 300);
  };

  // Quick 1-Click Nurse Select
  const handleQuickNurseSelect = (nurse: typeof nurseAccounts[0]) => {
    setNurseEmail(nurse.email);
    setNursePassword(nurse.password);
    setNursePin(nurse.digitalSignaturePin);
    setErrorMessage('');
  };

  // Quick 1-Click Patient Select
  const handleQuickPatientSelect = (pat: typeof patients[0]) => {
    setSelectedPatientId(pat.id);
    setPatientCpf(pat.cpf);
    setPatientBirthDate(pat.birthDate);
    setErrorMessage('');
  };

  return (
    <div className={`w-full ${isStandaloneScreen ? 'min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6' : 'p-2'}`}>
      <div className="w-full max-w-4xl mx-auto bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Branding */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0a0f1d] to-blue-950/80 p-6 sm:p-8 border-b border-slate-800 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-600/30 ring-4 ring-blue-500/20">
                CB
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Cuide Bem de Feridas
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                    Portal Unificado
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Plataforma Integrada de Estomaterapia, Gestão Clínica e Acompanhamento do Paciente
                </p>
              </div>
            </div>

            {onClose && !isStandaloneScreen && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                Voltar ao Sistema
              </button>
            )}
          </div>

          {/* Role Portal Selector Tabs */}
          <div className="mt-6 grid grid-cols-3 gap-2 p-1.5 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-800">
            {/* Tab 1: Nurse */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('nurse');
                setErrorMessage('');
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'nurse'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-white" />
              <span>Enfermeiro(a)</span>
              <span className="hidden md:inline text-[10px] font-normal opacity-80">(Assistencial)</span>
            </button>

            {/* Tab 2: Admin */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setErrorMessage('');
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Building2 className="w-4 h-4 text-white" />
              <span>Administrativo</span>
              <span className="hidden md:inline text-[10px] font-normal opacity-80">(Gestão & Finanças)</span>
            </button>

            {/* Tab 3: Patient Portal */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('patient');
                setErrorMessage('');
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'patient'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <UserCheck className="w-4 h-4 text-white" />
              <span>Portal do Paciente</span>
              <span className="hidden md:inline text-[10px] font-normal opacity-80">(Cuidador)</span>
            </button>
          </div>
        </div>

        {/* Form Body Area */}
        <div className="p-6 sm:p-8">
          
          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-300 text-xs font-medium animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ============================================================
              PORTAL 1: ENFERMEIRO(A)
             ============================================================ */}
          {selectedRole === 'nurse' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    Acesso Profissional de Enfermagem & Estomaterapia
                  </h3>
                  <p className="text-xs text-slate-400">
                    Acesse prontuários eletrônicos, registro de evoluções, galeria de feridas e laudos COFEN.
                  </p>
                </div>

                <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setNurseAuthMethod('password')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      nurseAuthMethod === 'password'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Senha
                  </button>
                  <button
                    type="button"
                    onClick={() => setNurseAuthMethod('pin')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      nurseAuthMethod === 'pin'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    PIN Rápido
                  </button>
                </div>
              </div>

              {/* Quick Demo Nurse Pickers */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Selecione um profissional para teste imediato (1-clique):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {nurseAccounts.map((n) => {
                    const isSelected = nurseEmail === n.email;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleQuickNurseSelect(n)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500/50 ring-1 ring-blue-500/40'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <img
                          src={n.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150'}
                          alt={n.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{n.name}</p>
                          <p className="text-[11px] text-blue-400 font-mono">COREN-{n.uf} {n.coren}</p>
                          <p className="text-[10px] text-slate-400 truncate">{n.specialization}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nurse Login Form */}
              <form onSubmit={handleNurseSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    E-mail Institucional ou COREN
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={nurseEmail}
                      onChange={(e) => setNurseEmail(e.target.value)}
                      placeholder="mariana.estomaterapia@cuidebem.com.br"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {nurseAuthMethod === 'password' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Senha Profissional
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showNursePass ? 'text' : 'password'}
                        value={nursePassword}
                        onChange={(e) => setNursePassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNursePass(!showNursePass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showNursePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      PIN de Assinatura Digital (4 dígitos)
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        maxLength={4}
                        value={nursePin}
                        onChange={(e) => setNursePin(e.target.value)}
                        placeholder="1234"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Dica de demonstração: <strong>1234</strong> ou <strong>5678</strong></p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  {isLoading ? (
                    <span>Autenticando enfermeiro...</span>
                  ) : (
                    <>
                      <span>Entrar no Painel Clínico de Enfermagem</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================
              PORTAL 2: ADMINISTRATIVO & FINANCEIRO
             ============================================================ */}
          {selectedRole === 'admin' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  Portal de Gestão Administrativa & Faturamento
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Acesso aos relatórios de faturamento, controle de estoque de insumos, agenda da clínica e gestão da equipe.
                </p>
              </div>

              {/* Quick Select Admin Accounts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Selecione uma Conta Administrativa:</span>
                  <span>{adminAccounts.length} gestores cadastrados</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {adminAccounts.map((adm) => (
                    <button
                      key={adm.id}
                      type="button"
                      onClick={() => {
                        setAdminEmail(adm.email);
                        setAdminPassword(adm.password || 'Admin@2026');
                        setErrorMessage('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        adminEmail.toLowerCase() === adm.email.toLowerCase()
                          ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={adm.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'}
                          alt={adm.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-amber-500/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{adm.name}</h4>
                          <span className="text-[10px] text-amber-400 truncate block">
                            {adm.roleTitle || (adm.role === 'administrador_geral' ? 'Administrador Geral' : 'Gestor Financeiro')}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono shrink-0">
                        Preencher
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Login Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    E-mail Corporativo do Administrador
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@cuidebem.com.br"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Senha Administrativa Master
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showAdminPass ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Dica de demonstração: <strong>Admin@2026</strong></p>
                </div>

                {/* Scope capabilities list */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Faturamento e Extratos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Estoque & Preço de Venda</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Agenda Global de Visitas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Logs de Auditoria LGPD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  {isLoading ? (
                    <span>Validando acesso administrativo...</span>
                  ) : (
                    <>
                      <span>Acessar Painel de Gestão & Faturamento</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================
              PORTAL 3: PACIENTE & CUIDADOR
             ============================================================ */}
          {selectedRole === 'patient' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  Portal do Paciente & Cuidador Familiar
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Acompanhe a cicatrização da sua lesão, solicite visitas domiciliares e baixe laudos com fotos.
                </p>
              </div>

              {/* Quick Demo Patients */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Escolha um paciente cadastrado para testar o portal do paciente:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {patients.slice(0, 3).map((p) => {
                    const isSelected = patientCpf === p.cpf;
                    const wound = p.wounds[0];
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleQuickPatientSelect(p)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/40'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-white truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</p>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-emerald-400 font-mono mt-0.5">CPF: {p.cpf}</p>
                        {wound && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-300 font-medium bg-slate-950/60 px-2 py-0.5 rounded">
                            <TrendingDown className="w-3 h-3 text-emerald-400" />
                            <span>-{wound.healingProgressPercent}% de área</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Login Form */}
              <form onSubmit={handlePatientSubmit} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      CPF do Paciente (apenas números)
                    </label>
                    <div className="relative">
                      <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={patientCpf}
                        onChange={handleCpfChange}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Data de Nascimento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={patientBirthDate}
                        onChange={(e) => setPatientBirthDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Ambiente Protegido & Acessível
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Você poderá visualizar a regressão da ferida em fotos, as coberturas aplicadas pela enfermeira, agendar trocas de curativo e falar diretamente via WhatsApp.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  {isLoading ? (
                    <span>Acessando prontuário do paciente...</span>
                  ) : (
                    <>
                      <span>Entrar no Meu Portal de Cuidados</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Security Note */}
        <div className="bg-[#0a0f1d] px-6 py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Autenticação em conformidade com as normas <strong>COFEN 545/2017</strong> e <strong>LGPD</strong>.</span>
          </div>
          <span className="text-slate-500 font-mono text-[10px]">Criptografia ponta a ponta</span>
        </div>

      </div>
    </div>
  );
};
