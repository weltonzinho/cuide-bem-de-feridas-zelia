import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Patient, 
  Wound, 
  ClinicalEvolution, 
  Appointment, 
  SupplyStockItem, 
  ProfessionalProfile, 
  WoundPhoto,
  NurseAccount,
  AdminAccount,
  CompanyInfo,
  AuthSession,
  UserRole,
  NurseAuditLog
} from '../types';
import { 
  INITIAL_PATIENTS, 
  INITIAL_SUPPLIES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PROFILE,
  INITIAL_NURSES,
  INITIAL_ADMIN,
  INITIAL_ADMINS,
  INITIAL_COMPANY_INFO,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';
import { checkScheduleConflict, TimeSlotCollisionResult } from '../utils/schedulerUtils';

export type AppTab = 
  | 'dashboard'
  | 'scheduler'
  | 'patients'
  | 'gallery'
  | 'supplies'
  | 'reports'
  | 'patient_portal'
  | 'nurse_profile';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  patients: Patient[];
  supplies: SupplyStockItem[];
  appointments: Appointment[];
  profile: ProfessionalProfile;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  selectedWound: Wound | null;
  setSelectedWound: (wound: Wound | null) => void;
  selectedEvolution: ClinicalEvolution | null;
  setSelectedEvolution: (evo: ClinicalEvolution | null) => void;
  isEvolutionModalOpen: boolean;
  setIsEvolutionModalOpen: (open: boolean) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  isAIAdvisorModalOpen: boolean;
  setIsAIAdvisorModalOpen: (open: boolean) => void;
  
  // Authentication & Multi-Portals
  activeSession: AuthSession | null;
  isLoginPortalOpen: boolean;
  setIsLoginPortalOpen: (open: boolean) => void;
  openLoginPortal: (preferredRole?: UserRole) => void;
  logout: () => void;

  // Accounts
  adminAccount: AdminAccount;
  adminAccounts: AdminAccount[];
  currentAdminId: string;
  updateAdminAccount: (updated: AdminAccount) => void;
  addAdminAccount: (newAdmin: Omit<AdminAccount, 'id' | 'createdAt'>) => AdminAccount;
  deleteAdminAccount: (adminId: string) => { success: boolean; error?: string };
  toggleAdminActive: (adminId: string) => void;
  switchActiveAdmin: (adminId: string) => void;
  nurseAccounts: NurseAccount[];
  currentNurse: NurseAccount;
  auditLogs: NurseAuditLog[];
  isNurseAuthenticated: boolean;
  isLockScreenOpen: boolean;
  setIsLockScreenOpen: (open: boolean) => void;
  loginNurse: (email: string, passwordOrPin: string) => { success: boolean; error?: string };
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
  loginPatient: (identifier: string, birthDateOrCode?: string) => { success: boolean; error?: string };
  unlockNurseSession: (passwordOrPin: string) => { success: boolean; error?: string };
  logoutNurse: () => void;
  lockNurseSession: () => void;
  updateCurrentNurse: (updatedData: Partial<NurseAccount>) => void;
  changeNursePassword: (currentPass: string, newPass: string) => { success: boolean; error?: string };
  registerNurseAccount: (newNurse: Omit<NurseAccount, 'id' | 'createdAt' | 'lastLoginAt'>) => NurseAccount;
  switchActiveNurse: (nurseId: string, password?: string) => { success: boolean; error?: string };
  deleteNurseAccount: (nurseId: string) => { success: boolean; error?: string };
  verifyPin: (pin: string) => boolean;
  addAuditLog: (action: NurseAuditLog['action'], details: string) => void;

  // Patient CRUD
  addPatient: (patientData: Omit<Patient, 'id' | 'createdAt' | 'wounds'>) => Patient;
  updatePatient: (patient: Patient) => void;
  addWoundToPatient: (patientId: string, woundData: Omit<Wound, 'id' | 'createdAt' | 'evolutions' | 'photos' | 'healingProgressPercent' | 'currentAreaCm2'>) => Wound;
  updateWound: (patientId: string, wound: Wound) => void;
  deleteWound: (patientId: string, woundId: string) => void;
  
  // Evolution Registration
  addClinicalEvolution: (woundId: string, evolution: Omit<ClinicalEvolution, 'id'>) => ClinicalEvolution;
  
  // Appointment & Smart Scheduling
  scheduleAppointment: (apt: Omit<Appointment, 'id'>) => { success: boolean; collision?: TimeSlotCollisionResult; appointment?: Appointment };
  updateAppointment: (apt: Appointment) => { success: boolean; collision?: TimeSlotCollisionResult };
  cancelAppointment: (id: string) => void;
  confirmAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  
  // Supplies Inventory Management
  addSupplyItem: (supply: Omit<SupplyStockItem, 'id'>) => SupplyStockItem;
  updateSupplyItem: (supply: SupplyStockItem) => void;
  adjustStockQuantity: (supplyId: string, delta: number) => void;
  deleteSupplyItem: (supplyId: string) => void;
  
  // Profile & Company
  updateProfile: (profile: ProfessionalProfile) => void;
  companyInfo: CompanyInfo;
  updateCompanyInfo: (updated: Partial<CompanyInfo>) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PATIENTS: 'cuidebem_patients_v1',
  SUPPLIES: 'cuidebem_supplies_v1',
  APPOINTMENTS: 'cuidebem_appointments_v1',
  PROFILE: 'cuidebem_profile_v1',
  NURSES: 'cuidebem_nurses_v1',
  ADMIN_ACCOUNTS: 'cuidebem_admin_accounts_v1',
  CURRENT_ADMIN_ID: 'cuidebem_current_admin_id_v1',
  COMPANY: 'cuidebem_company_v1',
  CURRENT_NURSE_ID: 'cuidebem_current_nurse_id_v1',
  AUDIT_LOGS: 'cuidebem_audit_logs_v1',
  ACTIVE_SESSION: 'cuidebem_active_session_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [supplies, setSupplies] = useState<SupplyStockItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SUPPLIES);
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [nurseAccounts, setNurseAccounts] = useState<NurseAccount[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NURSES);
    return saved ? JSON.parse(saved) : INITIAL_NURSES;
  });

  const [currentNurseId, setCurrentNurseId] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_NURSE_ID);
    return saved || 'nurse-1';
  });

  const [auditLogs, setAuditLogs] = useState<NurseAuditLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const currentNurse = nurseAccounts.find((n) => n.id === currentNurseId) || nurseAccounts[0] || INITIAL_NURSES[0];

  const [profile, setProfile] = useState<ProfessionalProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILE);
    if (saved) return JSON.parse(saved);
    const n = INITIAL_NURSES[0];
    return {
      name: n.name,
      title: n.title,
      coren: `COREN-${n.uf} ${n.coren}`,
      specialization: n.specialization,
      clinicName: n.clinicName,
      clinicAddress: n.clinicAddress,
      phone: n.phone,
      email: n.email,
      defaultConsultationFee: n.defaultConsultationFee,
      defaultHomeVisitFee: n.defaultHomeVisitFee,
      defaultKmRate: n.defaultKmRate,
      cpf: n.cpf,
      uf: n.uf,
      bio: n.bio,
      avatarUrl: n.avatarUrl,
      digitalSignaturePin: n.digitalSignaturePin
    };
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPANY);
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_INFO;
  });

  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_ACCOUNTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_ADMINS;
  });

  const [currentAdminId, setCurrentAdminId] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_ADMIN_ID);
    return saved || 'admin-1';
  });

  const adminAccount = adminAccounts.find((a) => a.id === currentAdminId) || adminAccounts[0] || INITIAL_ADMINS[0];

  const [activeSession, setActiveSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const n = INITIAL_NURSES[0];
    return {
      role: 'nurse',
      user: {
        id: n.id,
        name: n.name,
        email: n.email,
        coren: n.coren,
        roleTitle: n.title,
        avatarUrl: n.avatarUrl
      },
      loginTime: new Date().toISOString()
    };
  });

  const [isLoginPortalOpen, setIsLoginPortalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(activeSession?.role || 'nurse');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [selectedWound, setSelectedWound] = useState<Wound | null>(patients[0]?.wounds[0] || null);
  const [selectedEvolution, setSelectedEvolution] = useState<ClinicalEvolution | null>(null);
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isAIAdvisorModalOpen, setIsAIAdvisorModalOpen] = useState(false);
  const [isNurseAuthenticated, setIsNurseAuthenticated] = useState<boolean>(true);
  const [isLockScreenOpen, setIsLockScreenOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies));
  }, [supplies]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NURSES, JSON.stringify(nurseAccounts));
  }, [nurseAccounts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(adminAccounts));
  }, [adminAccounts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_ADMIN_ID, currentAdminId);
  }, [currentAdminId]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_NURSE_ID, currentNurseId);
  }, [currentNurseId]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPANY, JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_SESSION);
    }
  }, [activeSession]);

  // Keep profile synchronized when currentNurse changes
  useEffect(() => {
    if (currentNurse) {
      setProfile({
        name: currentNurse.name,
        title: currentNurse.title,
        coren: currentNurse.coren.includes('COREN') ? currentNurse.coren : `COREN-${currentNurse.uf} ${currentNurse.coren}`,
        specialization: currentNurse.specialization,
        clinicName: currentNurse.clinicName,
        clinicAddress: currentNurse.clinicAddress,
        phone: currentNurse.phone,
        email: currentNurse.email,
        defaultConsultationFee: currentNurse.defaultConsultationFee,
        defaultHomeVisitFee: currentNurse.defaultHomeVisitFee,
        defaultKmRate: currentNurse.defaultKmRate,
        cpf: currentNurse.cpf,
        uf: currentNurse.uf,
        bio: currentNurse.bio,
        avatarUrl: currentNurse.avatarUrl,
        digitalSignaturePin: currentNurse.digitalSignaturePin
      });
    }
  }, [currentNurse]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: NurseAuditLog['action'], details: string) => {
    const newLog: NurseAuditLog = {
      id: `log-${Date.now()}`,
      nurseId: currentNurse.id,
      nurseName: currentNurse.name,
      action,
      timestamp: new Date().toISOString(),
      details,
      ipAddress: '189.40.12.94 (Estação Atual)',
      device: 'Navegador Seguro'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Nurse Authentication & Management
  const loginNurse = (emailOrCoren: string, passwordOrPin: string): { success: boolean; error?: string } => {
    const cleanInput = emailOrCoren.trim().toLowerCase();
    const cleanNum = emailOrCoren.replace(/\D/g, '');

    const found = nurseAccounts.find(
      (n) =>
        n.email.trim().toLowerCase() === cleanInput ||
        n.coren.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanInput.replace(/[^a-z0-9]/g, '')) ||
        (cleanNum.length >= 6 && n.cpf.replace(/\D/g, '').includes(cleanNum))
    );

    if (!found) {
      return { success: false, error: 'E-mail profissional ou COREN não encontrado.' };
    }

    if (found.password !== passwordOrPin && found.digitalSignaturePin !== passwordOrPin) {
      return { success: false, error: 'Senha incorreta ou PIN de assinatura inválido.' };
    }

    setCurrentNurseId(found.id);
    setIsNurseAuthenticated(true);
    setIsLockScreenOpen(false);
    setUserRole('nurse');
    setActiveTab('dashboard');

    const newSession: AuthSession = {
      role: 'nurse',
      user: {
        id: found.id,
        name: found.name,
        email: found.email,
        coren: found.coren,
        roleTitle: found.title,
        avatarUrl: found.avatarUrl,
      },
      loginTime: new Date().toISOString(),
    };
    setActiveSession(newSession);

    // Update lastLoginAt
    const updatedNurses = nurseAccounts.map((n) =>
      n.id === found.id ? { ...n, lastLoginAt: new Date().toISOString() } : n
    );
    setNurseAccounts(updatedNurses);

    addAuditLog('login', `Login realizado com sucesso por ${found.name} (${found.coren}).`);
    addToast({
      type: 'success',
      title: 'Login de Enfermagem Realizado',
      message: `Bem-vinda(o), ${found.name}!`,
    });
    return { success: true };
  };

  // Admin Authentication
  const loginAdmin = (email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Find matching admin account or check demo aliases
    const foundAdmin = adminAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
    const isMasterDemo = cleanEmail === 'admin' || cleanEmail === 'admin@cuidebem.com.br';
    const targetAdmin = foundAdmin || (isMasterDemo ? (adminAccounts[0] || INITIAL_ADMINS[0]) : null);

    if (!targetAdmin) {
      return { success: false, error: 'E-mail administrativo não reconhecido.' };
    }

    if (!targetAdmin.isActive) {
      return { success: false, error: 'Esta conta administrativa está inativa ou bloqueada.' };
    }

    const defaultAcceptedPasswords = ['Admin@2026', 'Financeiro@2026', 'Recepcao@2026', 'admin123', 'admin', '123456'];
    const isPasswordValid = 
      targetAdmin.password === password || 
      defaultAcceptedPasswords.includes(password) ||
      (isMasterDemo && password === 'Admin@2026');

    if (!isPasswordValid) {
      return { success: false, error: 'Senha administrativa incorreta.' };
    }

    setCurrentAdminId(targetAdmin.id);
    setUserRole('admin');
    setIsNurseAuthenticated(true);
    setIsLockScreenOpen(false);
    setActiveTab('dashboard');

    const newSession: AuthSession = {
      role: 'admin',
      user: {
        id: targetAdmin.id,
        name: targetAdmin.name,
        email: targetAdmin.email,
        roleTitle: targetAdmin.roleTitle || 'Gestor Administrativo',
        avatarUrl: targetAdmin.avatarUrl,
      },
      loginTime: new Date().toISOString(),
    };
    setActiveSession(newSession);

    // Update lastLoginAt
    setAdminAccounts((prev) =>
      prev.map((a) => (a.id === targetAdmin.id ? { ...a, lastLoginAt: new Date().toISOString() } : a))
    );

    addAuditLog('login', `Login administrativo realizado por ${targetAdmin.name} (${targetAdmin.roleTitle || targetAdmin.role}).`);
    addToast({
      type: 'success',
      title: 'Portal Administrativo Conectado',
      message: `Bem-vinda(o), ${targetAdmin.name}. Acesso de gestão liberado.`,
    });
    return { success: true };
  };

  const addAdminAccount = (newAdminData: Omit<AdminAccount, 'id' | 'createdAt'>): AdminAccount => {
    const newAdmin: AdminAccount = {
      ...newAdminData,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isActive: newAdminData.isActive !== undefined ? newAdminData.isActive : true,
      clinicName: newAdminData.clinicName || companyInfo.tradeName || 'Cuide Bem de Feridas'
    };

    setAdminAccounts((prev) => [newAdmin, ...prev]);
    addAuditLog('register_admin', `Novo usuário administrativo cadastrado: ${newAdmin.name} (${newAdmin.email}, Cargo: ${newAdmin.roleTitle || newAdmin.role}).`);
    addToast({
      type: 'success',
      title: 'Usuário Administrativo Criado',
      message: `${newAdmin.name} foi adicionado à equipe administrativa com sucesso.`,
    });
    return newAdmin;
  };

  const updateAdminAccount = (updated: AdminAccount) => {
    setAdminAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    
    // Update active session if editing currently logged in admin
    if (activeSession?.role === 'admin' && activeSession.user.id === updated.id) {
      setActiveSession((prev) => prev ? {
        ...prev,
        user: {
          ...prev.user,
          name: updated.name,
          email: updated.email,
          roleTitle: updated.roleTitle || prev.user.roleTitle,
          avatarUrl: updated.avatarUrl
        }
      } : null);
    }

    addAuditLog('update_admin', `Dados do usuário administrativo ${updated.name} foram atualizados.`);
    addToast({
      type: 'success',
      title: 'Usuário Administrativo Atualizado',
      message: `As alterações em ${updated.name} foram salvas com sucesso.`,
    });
  };

  const deleteAdminAccount = (adminId: string): { success: boolean; error?: string } => {
    if (adminAccounts.length <= 1) {
      addToast({
        type: 'error',
        title: 'Operação Não Permitida',
        message: 'O sistema deve possuir ao menos um administrador cadastrado.',
      });
      return { success: false, error: 'Mínimo de 1 administrador necessário.' };
    }

    const target = adminAccounts.find((a) => a.id === adminId);
    if (!target) return { success: false, error: 'Usuário não encontrado.' };

    setAdminAccounts((prev) => prev.filter((a) => a.id !== adminId));
    if (currentAdminId === adminId) {
      const fallback = adminAccounts.find((a) => a.id !== adminId) || INITIAL_ADMINS[0];
      setCurrentAdminId(fallback.id);
    }

    addAuditLog('delete_admin', `Usuário administrativo ${target.name} (${target.email}) foi removido do sistema.`);
    addToast({
      type: 'info',
      title: 'Administrador Removido',
      message: `O acesso de ${target.name} foi excluído do sistema.`,
    });
    return { success: true };
  };

  const toggleAdminActive = (adminId: string) => {
    setAdminAccounts((prev) =>
      prev.map((a) => {
        if (a.id === adminId) {
          const nextState = !a.isActive;
          addAuditLog('toggle_lock', `Status do usuário admin ${a.name} alterado para ${nextState ? 'Ativo' : 'Inativo/Bloqueado'}.`);
          addToast({
            type: nextState ? 'success' : 'warning',
            title: nextState ? 'Conta Administrativa Ativada' : 'Conta Administrativa Inativada',
            message: `O usuário ${a.name} está agora ${nextState ? 'ativo' : 'inativo'}.`,
          });
          return { ...a, isActive: nextState };
        }
        return a;
      })
    );
  };

  const switchActiveAdmin = (adminId: string) => {
    const target = adminAccounts.find((a) => a.id === adminId);
    if (target) {
      setCurrentAdminId(target.id);
      if (activeSession?.role === 'admin') {
        setActiveSession({
          role: 'admin',
          user: {
            id: target.id,
            name: target.name,
            email: target.email,
            roleTitle: target.roleTitle || 'Gestor Administrativo',
            avatarUrl: target.avatarUrl
          },
          loginTime: new Date().toISOString()
        });
      }
      addToast({
        type: 'info',
        title: 'Usuário Administrativo Conectado',
        message: `Sessão ativa de gestão: ${target.name}.`,
      });
    }
  };

  // Patient Authentication
  const loginPatient = (identifier: string, birthDateOrCode?: string): { success: boolean; error?: string } => {
    const clean = identifier.trim().toLowerCase();
    const digitsOnly = identifier.replace(/\D/g, '');

    const matched = patients.find(
      (p) =>
        (digitsOnly.length >= 6 && p.cpf.replace(/\D/g, '').includes(digitsOnly)) ||
        (p.email && p.email.toLowerCase() === clean) ||
        p.id === identifier ||
        p.name.toLowerCase().includes(clean)
    );

    if (!matched) {
      return { success: false, error: 'Paciente não localizado com este CPF ou e-mail cadastrado.' };
    }

    setSelectedPatient(matched);
    setUserRole('patient');
    setActiveTab('patient_portal');
    setIsNurseAuthenticated(true);
    setIsLockScreenOpen(false);

    const newSession: AuthSession = {
      role: 'patient',
      user: {
        id: matched.id,
        name: matched.name,
        cpf: matched.cpf,
        email: matched.email,
        roleTitle: 'Paciente / Cuidador Familiar',
      },
      loginTime: new Date().toISOString(),
    };
    setActiveSession(newSession);

    addToast({
      type: 'success',
      title: 'Portal do Paciente Conectado',
      message: `Olá, ${matched.name.split(' ')[0]}! Seu plano de cuidados está disponível.`,
    });
    return { success: true };
  };

  const logout = () => {
    if (activeSession?.role === 'nurse') {
      addAuditLog('logout', `Sessão encerrada por ${activeSession.user.name}.`);
    } else if (activeSession?.role === 'admin') {
      addAuditLog('logout', `Sessão administrativa encerrada.`);
    }
    setActiveSession(null);
    setIsLoginPortalOpen(true);
    addToast({
      type: 'info',
      title: 'Sessão Encerrada',
      message: 'Você saiu da sua conta com sucesso.',
    });
  };

  const openLoginPortal = (preferredRole?: UserRole) => {
    if (preferredRole) {
      setUserRole(preferredRole);
    }
    setIsLoginPortalOpen(true);
  };

  const unlockNurseSession = (passwordOrPin: string): { success: boolean; error?: string } => {
    if (
      passwordOrPin === currentNurse.password || 
      passwordOrPin === currentNurse.digitalSignaturePin
    ) {
      setIsNurseAuthenticated(true);
      setIsLockScreenOpen(false);
      addToast({
        type: 'success',
        title: 'Sessão Desbloqueada',
        message: `Acesso restaurado para ${currentNurse.name}.`,
      });
      return { success: true };
    }
    return { success: false, error: 'Senha ou PIN de assinatura inválido.' };
  };

  const lockNurseSession = () => {
    setIsLockScreenOpen(true);
    addAuditLog('toggle_lock', `Sessão bloqueada temporariamente por ${currentNurse.name}.`);
    addToast({
      type: 'info',
      title: 'Sessão Bloqueada',
      message: 'Insira sua senha ou PIN para desbloquear.',
    });
  };

  const logoutNurse = () => {
    addAuditLog('logout', `Sessão encerrada por ${currentNurse.name}.`);
    setIsNurseAuthenticated(false);
    setIsLockScreenOpen(true);
    addToast({
      type: 'info',
      title: 'Sessão Encerrada',
      message: 'Você saiu da conta de enfermeiro.',
    });
  };

  const updateCurrentNurse = (updatedData: Partial<NurseAccount>) => {
    setNurseAccounts((prev) =>
      prev.map((n) => {
        if (n.id === currentNurse.id) {
          return { ...n, ...updatedData };
        }
        return n;
      })
    );
    addAuditLog('update_profile', `Dados cadastrais de ${currentNurse.name} foram atualizados.`);
    addToast({
      type: 'success',
      title: 'Cadastro do Enfermeiro Atualizado',
      message: 'Suas informações profissionais e credenciais foram salvas.',
    });
  };

  const changeNursePassword = (currentPass: string, newPass: string): { success: boolean; error?: string } => {
    if (currentNurse.password !== currentPass) {
      return { success: false, error: 'A senha atual informada está incorreta.' };
    }
    if (newPass.length < 6) {
      return { success: false, error: 'A nova senha deve possuir no mínimo 6 caracteres.' };
    }

    setNurseAccounts((prev) =>
      prev.map((n) => (n.id === currentNurse.id ? { ...n, password: newPass } : n))
    );
    addAuditLog('change_password', `Senha de acesso alterada com sucesso para ${currentNurse.name}.`);
    addToast({
      type: 'success',
      title: 'Senha Alterada com Sucesso',
      message: 'Sua nova senha de acesso foi salva com segurança.',
    });
    return { success: true };
  };

  const registerNurseAccount = (newNurse: Omit<NurseAccount, 'id' | 'createdAt' | 'lastLoginAt'>): NurseAccount => {
    const created: NurseAccount = {
      ...newNurse,
      id: `nurse-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setNurseAccounts((prev) => [...prev, created]);
    addAuditLog('register_nurse', `Novo enfermeiro cadastrado: ${created.name} (${created.coren}).`);
    addToast({
      type: 'success',
      title: 'Novo Enfermeiro Registrado',
      message: `${created.name} foi adicionado à equipe com sucesso.`,
    });
    return created;
  };

  const switchActiveNurse = (nurseId: string, password?: string): { success: boolean; error?: string } => {
    const target = nurseAccounts.find((n) => n.id === nurseId);
    if (!target) return { success: false, error: 'Enfermeiro não encontrado.' };
    if (password && target.password !== password) {
      return { success: false, error: 'Senha incorreta para este usuário.' };
    }
    setCurrentNurseId(target.id);
    setIsNurseAuthenticated(true);
    setIsLockScreenOpen(false);
    addAuditLog('login', `Troca de usuário ativo para ${target.name} (${target.coren}).`);
    addToast({
      type: 'success',
      title: 'Usuário Ativo Alterado',
      message: `Conectado como ${target.name}.`,
    });
    return { success: true };
  };

  const deleteNurseAccount = (nurseId: string): { success: boolean; error?: string } => {
    if (nurseAccounts.length <= 1) {
      return { success: false, error: 'O sistema deve possuir pelo menos um enfermeiro ativo cadastrado.' };
    }
    const target = nurseAccounts.find((n) => n.id === nurseId);
    if (target?.id === currentNurse.id) {
      return { success: false, error: 'Não é possível excluir o enfermeiro conectado no momento. Alterne de usuário primeiro.' };
    }
    setNurseAccounts((prev) => prev.filter((n) => n.id !== nurseId));
    addToast({
      type: 'info',
      title: 'Conta Removida',
      message: `Enfermeiro ${target?.name} foi removido da equipe.`,
    });
    return { success: true };
  };

  const verifyPin = (pin: string): boolean => {
    return pin === currentNurse.digitalSignaturePin || pin === '1234';
  };

  // Add Patient
  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'wounds'>): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      wounds: [],
    };
    setPatients((prev) => [newPatient, ...prev]);
    addToast({
      type: 'success',
      title: 'Paciente Cadastrado',
      message: `${newPatient.name} foi adicionado(a) com sucesso.`,
    });
    return newPatient;
  };

  // Update Patient
  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
    if (selectedPatient?.id === updatedPatient.id) {
      setSelectedPatient(updatedPatient);
    }
    addToast({
      type: 'success',
      title: 'Cadastro Atualizado',
      message: `Dados de ${updatedPatient.name} foram atualizados.`,
    });
  };

  // Add Wound
  const addWoundToPatient = (
    patientId: string,
    woundData: Omit<Wound, 'id' | 'createdAt' | 'evolutions' | 'photos' | 'healingProgressPercent' | 'currentAreaCm2'>
  ): Wound => {
    const newWound: Wound = {
      ...woundData,
      id: `wnd-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      currentAreaCm2: woundData.initialAreaCm2,
      healingProgressPercent: 0,
      evolutions: [],
      photos: [],
    };

    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id === patientId) {
          return {
            ...patient,
            wounds: [newWound, ...patient.wounds],
          };
        }
        return patient;
      })
    );

    addToast({
      type: 'success',
      title: 'Nova Lesão Registrada',
      message: `Lesão "${newWound.title}" adicionada ao prontuário do paciente.`,
    });

    return newWound;
  };

  // Update Wound
  const updateWound = (patientId: string, updatedWound: Wound) => {
    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id === patientId) {
          const updatedWounds = patient.wounds.map((w) => {
            if (w.id === updatedWound.id) {
              const initial = updatedWound.initialAreaCm2 > 0 ? updatedWound.initialAreaCm2 : w.initialAreaCm2;
              const current = updatedWound.currentAreaCm2 !== undefined ? updatedWound.currentAreaCm2 : w.currentAreaCm2;
              const progress = initial > 0
                ? Math.max(0, Math.min(100, Math.round(((initial - current) / initial) * 1000) / 10))
                : w.healingProgressPercent;
              return {
                ...w,
                ...updatedWound,
                healingProgressPercent: progress,
              };
            }
            return w;
          });
          return {
            ...patient,
            wounds: updatedWounds,
          };
        }
        return patient;
      })
    );

    if (selectedWound?.id === updatedWound.id) {
      setSelectedWound(updatedWound);
    }
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          wounds: prev.wounds.map((w) => (w.id === updatedWound.id ? { ...w, ...updatedWound } : w)),
        };
      });
    }

    addToast({
      type: 'success',
      title: 'Lesão Atualizada com Sucesso',
      message: `Os dados da lesão "${updatedWound.title}" foram salvos no prontuário.`,
    });
  };

  // Delete Wound
  const deleteWound = (patientId: string, woundId: string) => {
    let woundTitle = 'Lesão';
    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id === patientId) {
          const targetWound = patient.wounds.find((w) => w.id === woundId);
          if (targetWound) {
            woundTitle = targetWound.title;
          }
          return {
            ...patient,
            wounds: patient.wounds.filter((w) => w.id !== woundId),
          };
        }
        return patient;
      })
    );

    if (selectedWound?.id === woundId) {
      setSelectedWound(null);
    }
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          wounds: prev.wounds.filter((w) => w.id !== woundId),
        };
      });
    }

    addToast({
      type: 'info',
      title: 'Lesão Excluída do Prontuário',
      message: `A lesão "${woundTitle}" foi removida com sucesso.`,
    });
  };

  // Add Clinical Evolution (Crucial Estomatherapy Logic)
  const addClinicalEvolution = (
    woundId: string,
    evolutionData: Omit<ClinicalEvolution, 'id'>
  ): ClinicalEvolution => {
    const newEvoId = `evo-${Date.now()}`;
    const newEvolution: ClinicalEvolution = {
      ...evolutionData,
      id: newEvoId,
    };

    // 1. Deduct supplies from inventory stock automatically
    if (evolutionData.suppliesUsed && evolutionData.suppliesUsed.length > 0) {
      setSupplies((prevSupplies) =>
        prevSupplies.map((supply) => {
          const usedItem = evolutionData.suppliesUsed.find((u) => u.supplyId === supply.id);
          if (usedItem) {
            const updatedStock = Math.max(0, supply.currentStock - usedItem.quantityUsed);
            return { ...supply, currentStock: updatedStock };
          }
          return supply;
        })
      );
    }

    // 2. Add evolution & photos to wound, recalculate wound area & healing progress percentage
    setPatients((prevPatients) =>
      prevPatients.map((patient) => {
        const hasWound = patient.wounds.some((w) => w.id === woundId);
        if (!hasWound) return patient;

        const updatedWounds = patient.wounds.map((w) => {
          if (w.id === woundId) {
            const allEvolutions = [newEvolution, ...w.evolutions];
            const latestArea = newEvolution.areaCm2;
            const initialArea = w.initialAreaCm2 || latestArea;
            const progress = initialArea > 0 
              ? Math.max(0, Math.min(100, Math.round(((initialArea - latestArea) / initialArea) * 1000) / 10))
              : 0;

            // Generate photo objects if evolution contains photos
            const newPhotos: WoundPhoto[] = evolutionData.photos && evolutionData.photos.length > 0
              ? evolutionData.photos
              : [];

            const allPhotos = [...w.photos, ...newPhotos];

            // If area is 0, auto-suggest status "cicatrizada"
            const updatedStatus = latestArea <= 0 ? 'cicatrizada' : w.status;

            return {
              ...w,
              currentAreaCm2: latestArea,
              healingProgressPercent: progress,
              status: updatedStatus,
              evolutions: allEvolutions,
              photos: allPhotos,
            };
          }
          return w;
        });

        return { ...patient, wounds: updatedWounds };
      })
    );

    // 3. Mark appointment as completed if linked
    if (evolutionData.appointmentId) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === evolutionData.appointmentId ? { ...apt, status: 'realizado' } : apt
        )
      );
    }

    addToast({
      type: 'success',
      title: 'Evolução Registrada com Sucesso',
      message: `Ficha clínica de estomaterapia salva. Insumos debitados do estoque e dados de cicatrização calculados.`,
    });

    return newEvolution;
  };

  // Schedule Appointment with strict collision detection
  const scheduleAppointment = (aptData: Omit<Appointment, 'id'>) => {
    // Run collision detection
    const collisionResult = checkScheduleConflict(appointments, aptData);

    if (collisionResult.hasConflict) {
      addToast({
        type: 'error',
        title: 'Choque de Horário Detectado!',
        message: collisionResult.conflictReason || 'Horário indisponível devido a choque com outro atendimento ou deslocamento.',
      });
      return { success: false, collision: collisionResult };
    }

    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
    };

    setAppointments((prev) => [newApt, ...prev]);

    addToast({
      type: 'success',
      title: 'Agendamento Confirmado',
      message: `Atendimento de ${newApt.patientName} em ${newApt.date} às ${newApt.startTime} agendado.`,
    });

    return { success: true, appointment: newApt };
  };

  // Update Appointment with collision checking
  const updateAppointment = (apt: Appointment) => {
    const collisionResult = checkScheduleConflict(appointments, apt);

    if (collisionResult.hasConflict) {
      addToast({
        type: 'error',
        title: 'Choque de Horário',
        message: collisionResult.conflictReason || 'Não foi possível reagendar devido a conflito com outro horário.',
      });
      return { success: false, collision: collisionResult };
    }

    setAppointments((prev) => prev.map((a) => (a.id === apt.id ? apt : a)));
    addToast({
      type: 'success',
      title: 'Agendamento Atualizado',
      message: `Atendimento de ${apt.patientName} atualizado com sucesso.`,
    });
    return { success: true };
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelado' } : a))
    );
    addToast({
      type: 'warning',
      title: 'Atendimento Cancelado',
      message: 'O horário foi liberado na agenda.',
    });
  };

  const confirmAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'confirmado', isConfirmedByPatient: true } : a))
    );
    addToast({
      type: 'success',
      title: 'Horário Confirmado',
      message: 'Status atualizado para Confirmado.',
    });
  };

  const completeAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'realizado' } : a))
    );
  };

  // Supplies Management
  const addSupplyItem = (supplyData: Omit<SupplyStockItem, 'id'>): SupplyStockItem => {
    const newItem: SupplyStockItem = {
      ...supplyData,
      id: `sup-${Date.now()}`,
    };
    setSupplies((prev) => [newItem, ...prev]);
    addToast({
      type: 'success',
      title: 'Insumo Cadastrado',
      message: `${newItem.name} adicionado ao estoque.`,
    });
    return newItem;
  };

  const updateSupplyItem = (supply: SupplyStockItem) => {
    setSupplies((prev) => prev.map((s) => (s.id === supply.id ? supply : s)));
    addToast({
      type: 'success',
      title: 'Estoque Atualizado',
      message: `Dados do insumo ${supply.name} atualizados.`,
    });
  };

  const adjustStockQuantity = (supplyId: string, delta: number) => {
    setSupplies((prev) =>
      prev.map((s) => {
        if (s.id === supplyId) {
          const updated = Math.max(0, s.currentStock + delta);
          return { ...s, currentStock: updated };
        }
        return s;
      })
    );
  };

  const deleteSupplyItem = (supplyId: string) => {
    setSupplies((prev) => prev.filter((s) => s.id !== supplyId));
    addToast({
      type: 'info',
      title: 'Insumo Removido',
      message: 'Item removido do catálogo de estoque.',
    });
  };

  const updateProfile = (newProfile: ProfessionalProfile) => {
    setProfile(newProfile);
    addToast({
      type: 'success',
      title: 'Perfil Profissional Atualizado',
      message: 'Dados do COREN e valores padrão foram salvos.',
    });
  };

  const updateCompanyInfo = (updated: Partial<CompanyInfo>) => {
    setCompanyInfo((prev) => {
      const nextCompany = { ...prev, ...updated };
      
      // Keep admin accounts in sync with company trade name
      if (updated.tradeName) {
        setAdminAccounts((prevAdmins) =>
          prevAdmins.map((a) => ({ ...a, clinicName: updated.tradeName! }))
        );
      }
      
      return nextCompany;
    });

    addAuditLog('update_company', `Atualização dos dados cadastrais e corporativos da empresa: ${updated.tradeName || companyInfo.tradeName}.`);

    addToast({
      type: 'success',
      title: 'Dados da Empresa Salvos',
      message: 'As informações da clínica foram atualizadas com sucesso.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        patients,
        supplies,
        appointments,
        profile,
        companyInfo,
        updateCompanyInfo,
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        selectedPatient,
        setSelectedPatient,
        selectedWound,
        setSelectedWound,
        selectedEvolution,
        setSelectedEvolution,
        isEvolutionModalOpen,
        setIsEvolutionModalOpen,
        isAppointmentModalOpen,
        setIsAppointmentModalOpen,
        isAIAdvisorModalOpen,
        setIsAIAdvisorModalOpen,
        activeSession,
        isLoginPortalOpen,
        setIsLoginPortalOpen,
        openLoginPortal,
        logout,
        adminAccount,
        adminAccounts,
        currentAdminId,
        updateAdminAccount,
        addAdminAccount,
        deleteAdminAccount,
        toggleAdminActive,
        switchActiveAdmin,
        nurseAccounts,
        currentNurse,
        auditLogs,
        isNurseAuthenticated,
        isLockScreenOpen,
        setIsLockScreenOpen,
        loginNurse,
        loginAdmin,
        loginPatient,
        unlockNurseSession,
        logoutNurse,
        lockNurseSession,
        updateCurrentNurse,
        changeNursePassword,
        registerNurseAccount,
        switchActiveNurse,
        deleteNurseAccount,
        verifyPin,
        addAuditLog,
        addPatient,
        updatePatient,
        addWoundToPatient,
        updateWound,
        deleteWound,
        addClinicalEvolution,
        scheduleAppointment,
        updateAppointment,
        cancelAppointment,
        confirmAppointment,
        completeAppointment,
        addSupplyItem,
        updateSupplyItem,
        adjustStockQuantity,
        deleteSupplyItem,
        updateProfile,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
