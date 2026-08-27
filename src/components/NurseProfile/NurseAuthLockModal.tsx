import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  KeyRound, 
  Fingerprint, 
  ShieldCheck, 
  Mail, 
  Eye, 
  EyeOff, 
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const NurseAuthLockModal: React.FC = () => {
  const { 
    isLockScreenOpen, 
    setIsLockScreenOpen, 
    currentNurse, 
    nurseAccounts, 
    loginNurse, 
    unlockNurseSession, 
    switchActiveNurse,
    addToast 
  } = useApp();

  const [authMode, setAuthMode] = useState<'pin' | 'password' | 'switch'>('pin');
  const [pinInput, setPinInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState(currentNurse.email);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isLockScreenOpen) return null;

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = unlockNurseSession(pinInput);
    if (!result.success) {
      setErrorMessage(result.error || 'PIN de assinatura inválido.');
    } else {
      setPinInput('');
    }
  };

  const handleLoginWithPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = loginNurse(emailInput, passwordInput);
    if (!result.success) {
      setErrorMessage(result.error || 'Falha ao autenticar.');
    } else {
      setPasswordInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] text-slate-100 rounded-3xl shadow-2xl border border-slate-800 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Header */}
        <div className="relative p-6 bg-gradient-to-b from-blue-900/30 to-slate-900 border-b border-slate-800 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-3 overflow-hidden border-2 border-blue-500/40 shadow-xl relative">
            <img
              src={currentNurse.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
              alt={currentNurse.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white drop-shadow" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">
            Sessão Protegida de Enfermagem
          </h2>
          <p className="text-xs text-blue-400 font-semibold mt-0.5">
            {currentNurse.name} • COREN-{currentNurse.uf} {currentNurse.coren}
          </p>
        </div>

        {/* Tab Switcher: PIN vs Senha vs Trocar Usuário */}
        <div className="p-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setErrorMessage(''); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              authMode === 'pin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>PIN Rápido</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('password'); setErrorMessage(''); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              authMode === 'password'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Senha Completa</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('switch'); setErrorMessage(''); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              authMode === 'switch'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Trocar Usuário</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="m-4 mb-0 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 font-medium">
            {errorMessage}
          </div>
        )}

        {/* PIN Unlock Form */}
        {authMode === 'pin' && (
          <form onSubmit={handleUnlockWithPin} className="p-6 space-y-5 text-center">
            <div>
              <span className="text-xs text-slate-400 block mb-2">
                Digite seu PIN de 4 dígitos para desbloquear o prontuário:
              </span>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-40 px-4 py-3 text-2xl tracking-[0.5em] text-center font-mono font-bold rounded-2xl border-2 border-slate-700 bg-slate-900 text-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-hidden mx-auto block"
              />
              <span className="text-[10px] text-slate-500 block mt-2">
                PIN padrão demonstrativo: <strong className="text-slate-400 font-mono">1234</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={pinInput.length < 4}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              Desbloquear Acesso
            </button>
          </form>
        )}

        {/* Password Login Form */}
        {authMode === 'password' && (
          <form onSubmit={handleLoginWithPassword} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                E-mail do Enfermeiro
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Senha padrão da Dra. Mariana: <strong className="text-slate-400 font-mono">CuideBem@2026</strong>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Entrar no Sistema
            </button>
          </form>
        )}

        {/* Switch Nurse List */}
        {authMode === 'switch' && (
          <div className="p-6 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Selecione o Enfermeiro Conectado:
            </span>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {nurseAccounts.map((nurse) => (
                <button
                  key={nurse.id}
                  type="button"
                  onClick={() => {
                    switchActiveNurse(nurse.id);
                    setEmailInput(nurse.email);
                    setAuthMode('pin');
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                    nurse.id === currentNurse.id
                      ? 'bg-blue-500/15 border-blue-500/40 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={nurse.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
                      alt={nurse.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{nurse.name}</div>
                      <div className="text-[11px] text-blue-400 font-mono">COREN-{nurse.uf} {nurse.coren}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Security Badge */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Autenticação em conformidade com as diretrizes COFEN e LGPD</span>
        </div>
      </div>
    </div>
  );
};
