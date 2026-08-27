import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Mail, 
  Phone, 
  Award, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Users, 
  FileCheck2, 
  History, 
  Save, 
  RefreshCw, 
  Sparkles,
  Fingerprint,
  FileBadge,
  LogOut,
  Trash2,
  Edit3,
  Search,
  Filter,
  Stethoscope,
  ClipboardList,
  Info
} from 'lucide-react';
import { NurseAccount, ProfessionalCategory, ProfessionalRole } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { CompanySettingsManager } from '../Admin/CompanySettingsManager';
import { AdminUserManager } from '../Admin/AdminUserManager';

export const NurseProfileManager: React.FC = () => {
  const { 
    currentNurse, 
    nurseAccounts, 
    adminAccounts,
    auditLogs, 
    userRole,
    adminAccount,
    updateCurrentNurse, 
    changeNursePassword, 
    registerNurseAccount, 
    switchActiveNurse, 
    deleteNurseAccount,
    lockNurseSession,
    logoutNurse,
    addToast 
  } = useApp();

  const isAdmin = userRole === 'admin';

  const [activeSubTab, setActiveSubTab] = useState<'empresa' | 'admin_users' | 'cadastro' | 'seguranca' | 'equipe' | 'carimbo' | 'auditoria'>(
    isAdmin ? 'empresa' : 'cadastro'
  );

  // Form states for profile data
  const [name, setName] = useState(currentNurse.name);
  const [title, setTitle] = useState(currentNurse.title);
  const [coren, setCoren] = useState(currentNurse.coren);
  const [uf, setUf] = useState(currentNurse.uf);
  const [cpf, setCpf] = useState(currentNurse.cpf);
  const [email, setEmail] = useState(currentNurse.email);
  const [phone, setPhone] = useState(currentNurse.phone);
  const [specialization, setSpecialization] = useState(currentNurse.specialization);
  const [clinicName, setClinicName] = useState(currentNurse.clinicName);
  const [clinicAddress, setClinicAddress] = useState(currentNurse.clinicAddress);
  const [bio, setBio] = useState(currentNurse.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentNurse.avatarUrl || '');
  const [role, setRole] = useState(currentNurse.role);
  const [defaultConsultationFee, setDefaultConsultationFee] = useState(currentNurse.defaultConsultationFee);
  const [defaultHomeVisitFee, setDefaultHomeVisitFee] = useState(currentNurse.defaultHomeVisitFee);
  const [defaultKmRate, setDefaultKmRate] = useState(currentNurse.defaultKmRate);

  // Security / Password Form states
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [digitalSignaturePin, setDigitalSignaturePin] = useState(currentNurse.digitalSignaturePin || '1234');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentNurse.twoFactorEnabled ?? true);

  // Team search & filter states
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  const [teamCategoryFilter, setTeamCategoryFilter] = useState<'all' | 'enfermeiro' | 'tecnico_enfermagem'>('all');

  // New / Edit User Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Modal Form Fields
  const [modalName, setModalName] = useState('');
  const [modalCategory, setModalCategory] = useState<ProfessionalCategory>('enfermeiro');
  const [modalRole, setModalRole] = useState<ProfessionalRole>('enfermeiro_estomaterapeuta');
  const [modalCoren, setModalCoren] = useState('');
  const [modalUf, setModalUf] = useState('SP');
  const [modalCpf, setModalCpf] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalPin, setModalPin] = useState('1234');
  const [modalPhone, setModalPhone] = useState('');
  const [modalSpecialization, setModalSpecialization] = useState('Especialista em Tratamento Avançado de Feridas e Estomaterapia');
  const [modalConsultationFee, setModalConsultationFee] = useState(160);
  const [modalHomeVisitFee, setModalHomeVisitFee] = useState(240);
  const [modalKmRate, setModalKmRate] = useState(4.5);
  const [modalAvatarUrl, setModalAvatarUrl] = useState('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'Vazia', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, text: 'Fraca', color: 'bg-red-500 text-red-300' };
    if (score <= 4) return { score: 2, text: 'Média', color: 'bg-amber-500 text-amber-300' };
    return { score: 3, text: 'Forte & Segura', color: 'bg-emerald-500 text-emerald-300' };
  };

  const passStrength = getPasswordStrength(newPasswordInput);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentNurse({
      name,
      title,
      coren,
      uf,
      cpf,
      email,
      phone,
      specialization,
      clinicName,
      clinicAddress,
      bio,
      avatarUrl,
      role,
      defaultConsultationFee,
      defaultHomeVisitFee,
      defaultKmRate,
      digitalSignaturePin,
      twoFactorEnabled
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordInput) {
      addToast({ type: 'error', title: 'Erro', message: 'Digite a senha atual para confirmar a alteração.' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      addToast({ type: 'error', title: 'Erro de Senha', message: 'A nova senha e a confirmação não conferem.' });
      return;
    }
    const result = changeNursePassword(currentPasswordInput, newPasswordInput);
    if (result.success) {
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } else {
      addToast({ type: 'error', title: 'Falha ao Alterar Senha', message: result.error || 'Erro na operação.' });
    }
  };

  // Open modal to create new user
  const handleOpenCreateUser = () => {
    if (!isAdmin) {
      addToast({
        type: 'error',
        title: 'Acesso Restrito',
        message: 'Apenas a administração possui permissão para cadastrar novos usuários.',
      });
      return;
    }
    setEditingUserId(null);
    setModalName('');
    setModalCategory('enfermeiro');
    setModalRole('enfermeiro_estomaterapeuta');
    setModalCoren('');
    setModalUf('SP');
    setModalCpf('');
    setModalEmail('');
    setModalPassword('Saude@2026');
    setModalPin('1234');
    setModalPhone('(11) 9');
    setModalSpecialization('Enfermeiro(a) especializado em Tratamento Avançado de Feridas');
    setModalConsultationFee(160);
    setModalHomeVisitFee(240);
    setModalKmRate(4.5);
    setModalAvatarUrl('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300');
    setIsUserModalOpen(true);
  };

  // Open modal to edit existing user
  const handleOpenEditUser = (nurse: NurseAccount) => {
    if (!isAdmin && nurse.id !== currentNurse.id) {
      addToast({
        type: 'error',
        title: 'Acesso Restrito',
        message: 'Apenas administradores podem editar o cadastro de outros membros da equipe.',
      });
      return;
    }
    setEditingUserId(nurse.id);
    setModalName(nurse.name);
    setModalCategory(nurse.category || (nurse.role === 'tecnico_enfermagem' ? 'tecnico_enfermagem' : 'enfermeiro'));
    setModalRole(nurse.role);
    setModalCoren(nurse.coren);
    setModalUf(nurse.uf);
    setModalCpf(nurse.cpf);
    setModalEmail(nurse.email);
    setModalPassword(nurse.password);
    setModalPin(nurse.digitalSignaturePin);
    setModalPhone(nurse.phone);
    setModalSpecialization(nurse.specialization);
    setModalConsultationFee(nurse.defaultConsultationFee);
    setModalHomeVisitFee(nurse.defaultHomeVisitFee);
    setModalKmRate(nurse.defaultKmRate);
    setModalAvatarUrl(nurse.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300');
    setIsUserModalOpen(true);
  };

  // Submit modal (Create or Update)
  const handleSubmitUserModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      addToast({ type: 'error', title: 'Permissão Negada', message: 'Apenas administradores podem gerenciar usuários.' });
      return;
    }
    if (!modalName || !modalEmail || !modalPassword || !modalCoren) {
      addToast({ type: 'error', title: 'Campos Obrigatórios', message: 'Preencha Nome, E-mail, Senha e COREN.' });
      return;
    }

    const titleStr = modalRole === 'tecnico_enfermagem'
      ? 'Técnico(a) de Enfermagem em Cuidados Domiciliares'
      : modalRole === 'estomaterapeuta_chefe'
      ? 'Enfermeiro(a) Estomaterapeuta Responsável Técnico(a)'
      : 'Enfermeiro(a) Estomaterapeuta Assistencial';

    if (editingUserId) {
      // Editing existing
      const existing = nurseAccounts.find(n => n.id === editingUserId);
      if (existing) {
        updateCurrentNurse({
          ...existing,
          name: modalName,
          title: titleStr,
          coren: modalCoren,
          uf: modalUf,
          cpf: modalCpf || '000.000.000-00',
          email: modalEmail,
          password: modalPassword,
          digitalSignaturePin: modalPin || '1234',
          phone: modalPhone || '(11) 90000-0000',
          specialization: modalSpecialization,
          role: modalRole,
          category: modalCategory,
          avatarUrl: modalAvatarUrl,
          defaultConsultationFee: modalConsultationFee,
          defaultHomeVisitFee: modalHomeVisitFee,
          defaultKmRate: modalKmRate,
        });
        addToast({
          type: 'success',
          title: 'Usuário Atualizado',
          message: `O cadastro de ${modalName} foi salvo com sucesso.`,
        });
      }
    } else {
      // Registering new
      registerNurseAccount({
        name: modalName,
        title: titleStr,
        coren: modalCoren,
        uf: modalUf,
        cpf: modalCpf || '000.000.000-00',
        email: modalEmail,
        password: modalPassword,
        digitalSignaturePin: modalPin || '1234',
        phone: modalPhone || '(11) 90000-0000',
        specialization: modalSpecialization,
        clinicName: currentNurse.clinicName,
        clinicAddress: currentNurse.clinicAddress,
        bio: 'Profissional assistencial integrado ao corpo clínico Cuide Bem.',
        avatarUrl: modalAvatarUrl,
        role: modalRole,
        category: modalCategory,
        isActive: true,
        defaultConsultationFee: modalConsultationFee,
        defaultHomeVisitFee: modalHomeVisitFee,
        defaultKmRate: modalKmRate,
        twoFactorEnabled: false
      });
    }

    setIsUserModalOpen(false);
  };

  // Filtered team members
  const filteredTeam = nurseAccounts.filter((nurse) => {
    const matchesSearch = 
      nurse.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
      nurse.coren.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
      nurse.email.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
      (nurse.cpf && nurse.cpf.includes(teamSearchTerm));
    
    const isTech = nurse.role === 'tecnico_enfermagem' || nurse.category === 'tecnico_enfermagem';
    const matchesCat = 
      teamCategoryFilter === 'all' ||
      (teamCategoryFilter === 'tecnico_enfermagem' && isTech) ||
      (teamCategoryFilter === 'enfermeiro' && !isTech);

    return matchesSearch && matchesCat;
  });

  const nursesCount = nurseAccounts.filter(n => n.role !== 'tecnico_enfermagem' && n.category !== 'tecnico_enfermagem').length;
  const techsCount = nurseAccounts.filter(n => n.role === 'tecnico_enfermagem' || n.category === 'tecnico_enfermagem').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isAdmin ? 'bg-amber-600/10' : 'bg-blue-600/10'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={isAdmin ? adminAccount.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' : currentNurse.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
                alt={isAdmin ? adminAccount.name : currentNurse.name}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 shadow-lg ${
                  isAdmin ? 'border-amber-500/40' : 'border-blue-500/40'
                }`}
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[#0f172a] rounded-full flex items-center justify-center shadow-md" title="Usuário Ativo & Autenticado">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {isAdmin ? 'Gestão de Usuários (Enfermeiros & Técnicos)' : currentNurse.name}
                </h1>
                {isAdmin ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Portal Administrativo
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    COREN-{currentNurse.uf} {currentNurse.coren}
                  </span>
                )}
                {!isAdmin && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {currentNurse.role === 'tecnico_enfermagem' ? 'Técnico(a) de Enfermagem' : currentNurse.role === 'estomaterapeuta_chefe' ? 'Estomaterapeuta RT' : 'Enfermeiro Assistencial'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {isAdmin 
                  ? `Administração central de contas: ${nurseAccounts.length} usuários cadastrados (${nursesCount} Enfermeiros, ${techsCount} Técnicos de Enfermagem).`
                  : currentNurse.specialization
                }
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  {isAdmin ? adminAccount.email : currentNurse.email}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  {isAdmin ? adminAccount.clinicName : currentNurse.clinicName}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            {isAdmin ? (
              <button
                onClick={handleOpenCreateUser}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar Novo Usuário</span>
              </button>
            ) : (
              <>
                <button
                  onClick={lockNurseSession}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm cursor-pointer"
                  title="Bloquear a tela com senha/PIN para segurança"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bloquear Tela</span>
                </button>

                <button
                  onClick={logoutNurse}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                  title="Sair da conta de enfermeiro"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[#0f172a] p-1.5 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar text-xs font-medium">
        {isAdmin && (
          <>
            <button
              id="tab-admin-empresa"
              onClick={() => setActiveSubTab('empresa')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeSubTab === 'empresa'
                  ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Dados da Empresa & Clínica</span>
            </button>

            <button
              id="tab-admin-users"
              onClick={() => setActiveSubTab('admin_users')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeSubTab === 'admin_users'
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Usuários Administrativos ({adminAccounts.length})</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveSubTab('equipe')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'equipe'
              ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isAdmin ? `Equipe de Enfermagem & Técnicos (${nurseAccounts.length})` : `Equipe de Enfermagem (${nurseAccounts.length})`}</span>
        </button>

        {!isAdmin && (
          <button
            onClick={() => setActiveSubTab('cadastro')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'cadastro'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Meus Dados & COREN</span>
          </button>
        )}

        <button
          onClick={() => setActiveSubTab('seguranca')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'seguranca'
              ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>{isAdmin ? 'Políticas de Acesso & PINs' : 'Login, Senha & PIN Digital'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('carimbo')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'carimbo'
              ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
          }`}
        >
          <FileBadge className="w-4 h-4" />
          <span>Carimbo Digital COFEN</span>
        </button>

        <button
          onClick={() => setActiveSubTab('auditoria')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'auditoria'
              ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Logs de Auditoria ({auditLogs.length})</span>
        </button>
      </div>

      {/* Sub-Tab: Dados da Empresa (Admin) */}
      {isAdmin && activeSubTab === 'empresa' && (
        <CompanySettingsManager />
      )}

      {/* Sub-Tab: Gestão de Usuários Administrativos (Admin) */}
      {isAdmin && activeSubTab === 'admin_users' && (
        <AdminUserManager />
      )}

      {/* Sub-Tab: Equipe & Usuários */}
      {activeSubTab === 'equipe' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  {isAdmin ? 'Gestão de Usuários do Sistema (Enfermeiros & Técnicos)' : 'Corpo Clínico & Equipe de Enfermagem'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAdmin 
                    ? 'Cadastre novos profissionais, altere permissões de acesso, credenciais e taxas de atendimento.'
                    : 'Lista dos profissionais de enfermagem e estomaterapia credenciados na clínica.'}
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenCreateUser}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/25 transition-all cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar Usuário (Enf./Téc.)</span>
                </button>
              )}
            </div>

            {/* Filter Bar & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar por nome, COREN, e-mail ou CPF..."
                  value={teamSearchTerm}
                  onChange={(e) => setTeamSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setTeamCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    teamCategoryFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Todos ({nurseAccounts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTeamCategoryFilter('enfermeiro')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    teamCategoryFilter === 'enfermeiro'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🩺 Enfermeiros ({nursesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTeamCategoryFilter('tecnico_enfermagem')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    teamCategoryFilter === 'tecnico_enfermagem'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📋 Técnicos de Enfermagem ({techsCount})
                </button>
              </div>
            </div>

            {/* Grid of registered users */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTeam.map((nurse) => {
                const isCurrent = nurse.id === currentNurse.id;
                const isTech = nurse.role === 'tecnico_enfermagem' || nurse.category === 'tecnico_enfermagem';
                const isChief = nurse.role === 'estomaterapeuta_chefe';

                return (
                  <div
                    key={nurse.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isCurrent && !isAdmin
                        ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={nurse.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
                          alt={nurse.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{nurse.name}</h4>
                            {isCurrent && (
                              <span className="text-[10px] uppercase font-bold bg-blue-600 text-white px-2 py-0.2 rounded-full">
                                Usuário Ativo
                              </span>
                            )}
                          </div>
                          
                          {/* Professional badge */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              isTech 
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : isChief
                                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                                : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                            }`}>
                              {isTech ? '📋 Técnico(a) de Enfermagem' : isChief ? '👑 Estomaterapeuta RT' : '🩺 Enfermeiro(a) Assistencial'}
                            </span>
                            
                            <span className="text-xs text-blue-400 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                              COREN-{nurse.uf} {nurse.coren}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5">{nurse.specialization}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fees & Contact summary */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl">
                      <div>
                        <span className="text-slate-500 block text-[10px]">E-mail de Login:</span>
                        <span className="font-mono text-slate-300 truncate block">{nurse.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Taxa Visita / Consulta:</span>
                        <span className="text-emerald-400 font-semibold">{formatCurrency(nurse.defaultHomeVisitFee)} / {formatCurrency(nurse.defaultConsultationFee)}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <span>CPF: {nurse.cpf || 'Não inf.'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(nurse)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Editar dados e credenciais"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Editar</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => switchActiveNurse(nurse.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                          title="Alternar sessão de trabalho para este profissional"
                        >
                          Conectar
                        </button>

                        {isAdmin && nurseAccounts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteNurseAccount(nurse.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab: Cadastro & Dados Profissionais (for Nurse) */}
      {!isAdmin && activeSubTab === 'cadastro' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Identificação & COREN */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-400" />
                    Identificação Profissional & Habilitação Legal
                  </h3>
                  <span className="text-[11px] text-blue-400 font-mono">Conselho Regional de Enfermagem</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Nome Completo do Profissional
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Número do COREN
                    </label>
                    <input
                      type="text"
                      value={coren}
                      onChange={(e) => setCoren(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      placeholder="184.920-ENF ou 542.119-TE"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      UF do Conselho
                    </label>
                    <select
                      value={uf}
                      onChange={(e) => setUf(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'ES', 'AM', 'PA', 'MT', 'MS'].map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      CPF do Profissional
                    </label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Especialização & Formação Acadêmica
                    </label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Fees & Save */}
            <div className="space-y-6">
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Valores Padrão de Honorários
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Consulta Clínica em Consultório (R$)
                  </label>
                  <input
                    type="number"
                    value={defaultConsultationFee}
                    onChange={(e) => setDefaultConsultationFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Atendimento / Visita Domiciliar (R$)
                  </label>
                  <input
                    type="number"
                    value={defaultHomeVisitFee}
                    onChange={(e) => setDefaultHomeVisitFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Deslocamento por Km Rodado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={defaultKmRate}
                    onChange={(e) => setDefaultKmRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm font-semibold"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Dados Cadastrais</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Sub-Tab: Segurança & Credenciais */}
      {activeSubTab === 'seguranca' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
          {/* Change password card */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <KeyRound className="w-4 h-4 text-blue-400" />
              Alteração de Senha de Acesso
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="No mínimo 6 caracteres"
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer"
              >
                Salvar Nova Senha
              </button>
            </form>
          </div>

          {/* PIN & Digital signature info */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              PIN de Assinatura & Carimbo Digital
            </h3>

            <p className="text-xs text-slate-300">
              O PIN numérico de 4 dígitos é utilizado para validar rapidamente evoluções clínicas e autorizar carimbos digitais nos laudos e relatórios em PDF.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">PIN de Assinatura Ativo</span>
                <span className="px-3 py-1 font-mono text-sm font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
                  {digitalSignaturePin}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Padrão inicial de fábrica: <code className="text-amber-300">1234</code>. Você pode alterar o PIN na edição de cadastro.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab: Carimbo Digital COFEN */}
      {activeSubTab === 'carimbo' && (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-blue-400" />
                Carimbo Digital Padronizado (Normativa COFEN nº 545/2017)
              </h3>
              <p className="text-xs text-slate-400">
                Visualização do carimbo oficial emitido automaticamente em receitas, prescrições e relatórios clínicos em PDF.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white text-slate-900 max-w-md mx-auto border-2 border-slate-900 shadow-2xl font-serif space-y-2 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-blue-900 text-blue-900 flex items-center justify-center mx-auto font-black text-xs">
              COFEN
            </div>
            <h4 className="font-bold text-base tracking-tight uppercase text-slate-900">
              {currentNurse.name}
            </h4>
            <p className="text-xs font-semibold text-slate-700">
              {currentNurse.title}
            </p>
            <p className="text-xs font-mono font-bold text-blue-900 border-t border-b border-slate-300 py-1 my-1">
              COREN-{currentNurse.uf} nº {currentNurse.coren}
            </p>
            <p className="text-[10px] text-slate-500 italic">
              {currentNurse.clinicName}
            </p>
            <div className="pt-2 text-[9px] text-slate-400 font-mono">
              HASH SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab: Auditoria */}
      {activeSubTab === 'auditoria' && (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                Trilha de Auditoria & Segurança de Acesso ({auditLogs.length})
              </h3>
              <p className="text-xs text-slate-400">
                Registro cronológico inviolável de autenticações, alterações cadastrais e desbloqueios de sessão.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Data e Hora</th>
                  <th className="p-3">Tipo de Evento</th>
                  <th className="p-3">Descrição da Atividade</th>
                  <th className="p-3">IP / Dispositivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-300">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {log.action.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200 font-medium">
                      {log.details}
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {log.ipAddress || '192.168.1.42 (TLS 1.3)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar ou Editar Usuário (Enfermeiro / Técnico de Enfermagem) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0f172a] text-slate-100 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30 font-bold">
                  {editingUserId ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingUserId ? 'Editar Dados do Usuário' : 'Cadastrar Novo Usuário (Enfermeiro / Técnico)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Controle de credenciais, categoria profissional COREN e permissões de acesso
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitUserModal} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Categoria Profissional *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setModalCategory('enfermeiro');
                      if (modalRole === 'tecnico_enfermagem') setModalRole('enfermeiro_estomaterapeuta');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      modalCategory === 'enfermeiro'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      modalCategory === 'enfermeiro' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Enfermeiro(a)</div>
                      <div className="text-[10px] text-slate-400">COREN-ENF • Nível Superior</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setModalCategory('tecnico_enfermagem');
                      setModalRole('tecnico_enfermagem');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      modalCategory === 'tecnico_enfermagem'
                        ? 'bg-amber-600/20 border-amber-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      modalCategory === 'tecnico_enfermagem' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Técnico(a) de Enfermagem</div>
                      <div className="text-[10px] text-slate-400">COREN-TE • Nível Técnico</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Specific Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder={modalCategory === 'tecnico_enfermagem' ? "Ex: Téc. Marcos Vinicius" : "Ex: Enf. Juliana Ferreira"}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Função no Sistema *
                  </label>
                  <select
                    value={modalRole}
                    onChange={(e) => {
                      const newRole = e.target.value as ProfessionalRole;
                      setModalRole(newRole);
                      if (newRole === 'tecnico_enfermagem') {
                        setModalCategory('tecnico_enfermagem');
                      } else {
                        setModalCategory('enfermeiro');
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    {modalCategory === 'enfermeiro' ? (
                      <>
                        <option value="enfermeiro_estomaterapeuta">Enfermeiro(a) Estomaterapeuta</option>
                        <option value="enfermeiro_assistencial">Enfermeiro(a) Assistencial Geral</option>
                        <option value="estomaterapeuta_chefe">Responsável Técnico(a) (RT)</option>
                      </>
                    ) : (
                      <option value="tecnico_enfermagem">Técnico(a) de Enfermagem em Curativos & Cuidados</option>
                    )}
                  </select>
                </div>
              </div>

              {/* COREN, UF & CPF */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    COREN *
                  </label>
                  <input
                    type="text"
                    value={modalCoren}
                    onChange={(e) => setModalCoren(e.target.value)}
                    placeholder={modalCategory === 'tecnico_enfermagem' ? "542.119-TE" : "345.678-ENF"}
                    className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    UF *
                  </label>
                  <select
                    value={modalUf}
                    onChange={(e) => setModalUf(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'ES', 'AM', 'PA', 'MT', 'MS'].map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={modalCpf}
                    onChange={(e) => setModalCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Login Email, Password & Digital PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    E-mail de Login *
                  </label>
                  <input
                    type="email"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    placeholder="usuario@cuidebem.com.br"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Senha de Acesso *
                  </label>
                  <input
                    type="text"
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                    placeholder="Senha de acesso"
                    className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    PIN Digital (4 dígitos)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={modalPin}
                    onChange={(e) => setModalPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="w-full px-3 py-2 text-sm font-mono text-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Phone & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Especialidade / Foco de Atuação
                  </label>
                  <input
                    type="text"
                    value={modalSpecialization}
                    onChange={(e) => setModalSpecialization(e.target.value)}
                    placeholder="Ex: Terapia Compressiva, Curativos Complexos, Pés Diabéticos"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Suggested Fees */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Consulta (R$)
                  </label>
                  <input
                    type="number"
                    value={modalConsultationFee}
                    onChange={(e) => setModalConsultationFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Visita Domiciliar (R$)
                  </label>
                  <input
                    type="number"
                    value={modalHomeVisitFee}
                    onChange={(e) => setModalHomeVisitFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Taxa / Km (R$)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={modalKmRate}
                    onChange={(e) => setModalKmRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg shadow-amber-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingUserId ? 'Salvar Alterações' : 'Cadastrar Usuário'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
