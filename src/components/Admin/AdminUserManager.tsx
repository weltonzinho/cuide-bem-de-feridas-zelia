import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  Mail, 
  Phone, 
  Building2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Lock, 
  Check, 
  X,
  CreditCard,
  Briefcase,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminAccount, AdminRoleType } from '../../types';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300',
];

const ROLE_CONFIG: Record<AdminRoleType, { label: string; badgeColor: string; description: string }> = {
  administrador_geral: {
    label: 'Administrador Geral',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    description: 'Acesso irrestrito a configurações fiscais, cadastros, relatórios e equipe.'
  },
  financeiro_recepcao: {
    label: 'Gestor Financeiro',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Foco em fluxo de caixa, pagamentos PIX/cartão, fechamento de faturas e estoque.'
  },
  coordenador_clinico: {
    label: 'Coordenador Clínico',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: 'Gestão de escalas, distribuição de pacientes, auditoria de prontuários e protocolos.'
  },
  recepcao_atendimento: {
    label: 'Recepção & Agendamentos',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    description: 'Abertura de fichas, agendamento de consultas domiciliares/clínica e triagem inicial.'
  },
  gestor_ti: {
    label: 'Gestão de TI & Segurança',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Controle de acessos, logs de auditoria, backups e políticas de segurança.'
  }
};

export const AdminUserManager: React.FC = () => {
  const { 
    adminAccounts, 
    adminAccount: currentActiveAdmin, 
    currentAdminId,
    addAdminAccount, 
    updateAdminAccount, 
    deleteAdminAccount, 
    toggleAdminActive,
    switchActiveAdmin,
    companyInfo,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // New Admin Form State
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'administrador_geral' as AdminRoleType,
    roleTitle: '',
    phone: '',
    cpf: '',
    department: 'Diretoria & Operações',
    avatarUrl: AVATAR_PRESETS[0],
    isActive: true,
  });

  // Edit Admin Form State
  const [editFormData, setEditFormData] = useState<Partial<AdminAccount>>({});

  const toggleShowPassword = (id: string) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartEdit = (admin: AdminAccount) => {
    setEditingAdmin(admin);
    setEditFormData({
      name: admin.name,
      email: admin.email,
      password: admin.password || 'Admin@2026',
      role: admin.role,
      roleTitle: admin.roleTitle || '',
      phone: admin.phone || '',
      cpf: admin.cpf || '',
      department: admin.department || '',
      avatarUrl: admin.avatarUrl || AVATAR_PRESETS[0],
      isActive: admin.isActive
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (!editFormData.name?.trim() || !editFormData.email?.trim()) {
      addToast({
        type: 'error',
        title: 'Campos Obrigatórios',
        message: 'Por favor preencha nome e e-mail do usuário.'
      });
      return;
    }

    const updated: AdminAccount = {
      ...editingAdmin,
      name: editFormData.name.trim(),
      email: editFormData.email.trim().toLowerCase(),
      password: editFormData.password || editingAdmin.password || 'Admin@2026',
      role: editFormData.role || editingAdmin.role,
      roleTitle: editFormData.roleTitle?.trim() || ROLE_CONFIG[editFormData.role || editingAdmin.role].label,
      phone: editFormData.phone?.trim(),
      cpf: editFormData.cpf?.trim(),
      department: editFormData.department?.trim() || 'Administrativo',
      avatarUrl: editFormData.avatarUrl || editingAdmin.avatarUrl,
      isActive: editFormData.isActive !== undefined ? editFormData.isActive : editingAdmin.isActive,
      clinicName: companyInfo.tradeName || editingAdmin.clinicName
    };

    updateAdminAccount(updated);
    setEditingAdmin(null);
  };

  const handleCreateNewAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdminData.name.trim() || !newAdminData.email.trim() || !newAdminData.password.trim()) {
      addToast({
        type: 'error',
        title: 'Campos Obrigatórios',
        message: 'Nome, e-mail corporativo e senha inicial são obrigatórios.'
      });
      return;
    }

    // Check duplicate email
    const existing = adminAccounts.find(a => a.email.toLowerCase() === newAdminData.email.trim().toLowerCase());
    if (existing) {
      addToast({
        type: 'error',
        title: 'E-mail Já Cadastrado',
        message: 'Já existe um administrador utilizando este endereço de e-mail.'
      });
      return;
    }

    addAdminAccount({
      name: newAdminData.name.trim(),
      email: newAdminData.email.trim().toLowerCase(),
      password: newAdminData.password,
      role: newAdminData.role,
      roleTitle: newAdminData.roleTitle.trim() || ROLE_CONFIG[newAdminData.role].label,
      phone: newAdminData.phone.trim(),
      cpf: newAdminData.cpf.trim(),
      department: newAdminData.department.trim() || 'Administrativo',
      avatarUrl: newAdminData.avatarUrl,
      isActive: newAdminData.isActive,
      clinicName: companyInfo.tradeName || 'Cuide Bem de Feridas'
    });

    setIsCreateModalOpen(false);
    setNewAdminData({
      name: '',
      email: '',
      password: '',
      role: 'administrador_geral',
      roleTitle: '',
      phone: '',
      cpf: '',
      department: 'Diretoria & Operações',
      avatarUrl: AVATAR_PRESETS[0],
      isActive: true,
    });
  };

  const generateRandomPassword = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const special = '@#$%&*';
    const numbers = '23456789';
    let pass = 'Admin@';
    for (let i = 0; i < 4; i++) {
      pass += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return pass;
  };

  // Filtered admin accounts
  const filteredAdmins = adminAccounts.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.department && admin.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (admin.roleTitle && admin.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const activeCount = adminAccounts.filter(a => a.isActive).length;

  return (
    <div id="admin-user-manager-root" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Stats */}
      <div id="admin-user-manager-header" className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Painel Administrativo de Usuários & Gestores</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Gestão de Usuários Administrativos
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Cadastre novos usuários com permissões de gestão, edite dados dos administradores, 
              controle credenciais de acesso corporativo e defina cargos para faturamento, recepção e diretoria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-open-create-admin"
              type="button"
              onClick={() => {
                setNewAdminData(prev => ({ ...prev, password: generateRandomPassword() }));
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Usuário Administrativo</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Total de Gestores</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-white">{adminAccounts.length}</span>
              <span className="text-[11px] text-purple-400 font-medium">contas</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Status Ativo</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-emerald-400">{activeCount}</span>
              <span className="text-[11px] text-slate-400">/ {adminAccounts.length}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Administrador Geral</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-purple-400">
                {adminAccounts.filter(a => a.role === 'administrador_geral').length}
              </span>
              <span className="text-[11px] text-slate-400">ativos</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Sessão Atual</span>
            <div className="flex items-center gap-1.5 mt-1 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-white truncate" title={currentActiveAdmin.name}>
                {currentActiveAdmin.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Search, Filters & List */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-admin-users"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, e-mail, cargo ou setor..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              id="filter-admin-role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">Todos os Cargos</option>
              <option value="administrador_geral">Administrador Geral</option>
              <option value="financeiro_recepcao">Gestor Financeiro</option>
              <option value="coordenador_clinico">Coordenador Clínico</option>
              <option value="recepcao_atendimento">Recepção & Atendimento</option>
              <option value="gestor_ti">Gestão de TI</option>
            </select>
          </div>

          <span className="text-xs text-slate-400">
            Exibindo <strong className="text-white">{filteredAdmins.length}</strong> de {adminAccounts.length} gestores
          </span>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAdmins.map((admin) => {
            const isCurrentlyActive = admin.id === currentAdminId;
            const roleMeta = ROLE_CONFIG[admin.role] || ROLE_CONFIG.administrador_geral;

            return (
              <div 
                key={admin.id}
                id={`admin-card-${admin.id}`}
                className={`p-4 sm:p-5 rounded-xl border transition-all relative ${
                  isCurrentlyActive 
                    ? 'bg-purple-950/20 border-purple-500/50 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/30' 
                    : admin.isActive
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/60 border-slate-800/60 opacity-70'
                }`}
              >
                {/* Active Session Ribbon */}
                {isCurrentlyActive && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                    <span>Conectado Agora</span>
                  </div>
                )}

                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img 
                      src={admin.avatarUrl || AVATAR_PRESETS[0]} 
                      alt={admin.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-slate-700 shadow-md bg-slate-800"
                    />
                    <span 
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        admin.isActive ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                      title={admin.isActive ? 'Conta Ativa' : 'Conta Inativa'}
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-12">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-white truncate" title={admin.name}>
                        {admin.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${roleMeta.badgeColor}`}>
                        {roleMeta.label}
                      </span>
                      {admin.department && (
                        <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                          {admin.department}
                        </span>
                      )}
                    </div>

                    {admin.roleTitle && (
                      <p className="text-xs text-slate-300 font-medium mt-1">
                        {admin.roleTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details info */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate text-slate-300 font-mono">{admin.email}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {admin.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{admin.phone}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span>Sem telefone</span>
                      </div>
                    )}

                    {admin.cpf && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-mono">{admin.cpf}</span>
                      </div>
                    )}
                  </div>

                  {/* Password peek */}
                  <div className="flex items-center justify-between gap-2 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/60 mt-2">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[11px] text-slate-400">Senha:</span>
                      <span className="font-mono text-slate-200">
                        {showPasswordMap[admin.id] ? (admin.password || 'Admin@2026') : '••••••••'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleShowPassword(admin.id)}
                      className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
                      title={showPasswordMap[admin.id] ? "Ocultar senha" : "Ver senha"}
                    >
                      {showPasswordMap[admin.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {!isCurrentlyActive && (
                      <button
                        type="button"
                        onClick={() => switchActiveAdmin(admin.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                        title="Alternar sessão para este administrador"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Conectar</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleStartEdit(admin)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAdminActive(admin.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 border ${
                        admin.isActive 
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {admin.isActive ? 'Inativar' : 'Ativar'}
                    </button>
                  </div>

                  {adminAccounts.length > 1 && !isCurrentlyActive && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmationId(admin.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
                      title="Excluir administrador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredAdmins.length === 0 && (
          <div className="py-12 text-center space-y-3 bg-slate-900/40 rounded-xl border border-slate-800">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">
              Nenhum usuário administrativo encontrado com os filtros selecionados.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* EDIT ADMIN MODAL */}
      {editingAdmin && (
        <div id="modal-edit-admin" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f172a] rounded-2xl border border-slate-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Editar Usuário Administrativo</h3>
                  <p className="text-xs text-slate-400">Atualize dados cadastrais, cargo e credenciais de acesso.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Foto de Perfil / Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, avatarUrl: preset }))}
                      className={`relative rounded-full p-0.5 border-2 transition-all shrink-0 ${
                        editFormData.avatarUrl === preset ? 'border-purple-500 scale-105 ring-2 ring-purple-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={preset} 
                        alt={`Avatar preset ${idx + 1}`} 
                        className="w-12 h-12 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {editFormData.avatarUrl === preset && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    E-mail Corporativo de Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Perfil / Função de Gestão *
                  </label>
                  <select
                    value={editFormData.role || 'administrador_geral'}
                    onChange={(e) => {
                      const newRole = e.target.value as AdminRoleType;
                      setEditFormData(prev => ({ 
                        ...prev, 
                        role: newRole,
                        roleTitle: ROLE_CONFIG[newRole].label
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="administrador_geral">Administrador Geral (Acesso Pleno)</option>
                    <option value="financeiro_recepcao">Gestor Financeiro & Faturamento</option>
                    <option value="coordenador_clinico">Coordenador Clínico</option>
                    <option value="recepcao_atendimento">Recepção & Central de Agendamentos</option>
                    <option value="gestor_ti">Gestão de TI & Segurança</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Título / Cargo Personalizado
                  </label>
                  <input
                    type="text"
                    value={editFormData.roleTitle || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
                    placeholder="Ex: Diretora Administrativa & Operações"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordMap['edit-modal'] ? 'text' : 'password'}
                      value={editFormData.password || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('edit-modal')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPasswordMap['edit-modal'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Departamento / Setor
                  </label>
                  <input
                    type="text"
                    value={editFormData.department || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Ex: Diretoria, Controladoria, Recepção"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={editFormData.cpf || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={editFormData.isActive}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Usuário com status ativo e autorização de acesso ao sistema</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW ADMIN MODAL */}
      {isCreateModalOpen && (
        <div id="modal-create-admin" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f172a] rounded-2xl border border-slate-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Cadastrar Novo Usuário Administrativo</h3>
                  <p className="text-xs text-slate-400">Crie uma nova credencial com perfil de gestão para a clínica.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewAdmin} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Escolha um Avatar Inicial
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewAdminData(prev => ({ ...prev, avatarUrl: preset }))}
                      className={`relative rounded-full p-0.5 border-2 transition-all shrink-0 ${
                        newAdminData.avatarUrl === preset ? 'border-purple-500 scale-105 ring-2 ring-purple-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={preset} 
                        alt={`Avatar preset ${idx + 1}`} 
                        className="w-12 h-12 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {newAdminData.avatarUrl === preset && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminData.name}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Letícia Martins"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    E-mail Corporativo de Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="leticia.gestao@cuidebem.com.br"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Perfil / Função *
                  </label>
                  <select
                    value={newAdminData.role}
                    onChange={(e) => {
                      const r = e.target.value as AdminRoleType;
                      setNewAdminData(prev => ({ 
                        ...prev, 
                        role: r,
                        roleTitle: ROLE_CONFIG[r].label
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="administrador_geral">Administrador Geral (Acesso Pleno)</option>
                    <option value="financeiro_recepcao">Gestor Financeiro & Faturamento</option>
                    <option value="coordenador_clinico">Coordenador Clínico</option>
                    <option value="recepcao_atendimento">Recepção & Central de Agendamentos</option>
                    <option value="gestor_ti">Gestão de TI & Segurança</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Título / Cargo Personalizado
                  </label>
                  <input
                    type="text"
                    value={newAdminData.roleTitle}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, roleTitle: e.target.value }))}
                    placeholder="Ex: Supervisora de Atendimento"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Senha Inicial *
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewAdminData(prev => ({ ...prev, password: generateRandomPassword() }))}
                      className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Gerar Aleatória</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswordMap['create-modal'] ? 'text' : 'password'}
                      required
                      value={newAdminData.password}
                      onChange={(e) => setNewAdminData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Ex: Admin@2026"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('create-modal')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPasswordMap['create-modal'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Departamento / Setor
                  </label>
                  <input
                    type="text"
                    value={newAdminData.department}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Ex: Recepção Central"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newAdminData.phone}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={newAdminData.cpf}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  Criar Administrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmationId && (
        <div id="modal-delete-admin" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f172a] rounded-2xl border border-rose-500/40 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Excluir Administrador?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Esta ação removerá permanentemente a conta de acesso deste usuário administrativo ao sistema da clínica.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAdminAccount(deleteConfirmationId);
                  setDeleteConfirmationId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
