export type LesionType = 
  | 'ulcera_venosa'
  | 'ulcera_arterial'
  | 'lesao_pressao_e1'
  | 'lesao_pressao_e2'
  | 'lesao_pressao_e3'
  | 'lesao_pressao_e4'
  | 'lesao_pressao_nc'
  | 'pe_diabetico'
  | 'ferida_cirurgica'
  | 'queimadura'
  | 'dermatite_umidade_masd'
  | 'estomia_complicacao'
  | 'outra';

export type WoundStatus = 'em_tratamento' | 'cicatrizada' | 'estacionaria' | 'encaminhada';

export type ExudateAmount = 'ausente' | 'escasso' | 'moderado' | 'abundante';
export type ExudateType = 'seroso' | 'hematico' | 'serohematico' | 'purulento';
export type ExudateOdor = 'inodoro' | 'caracteristico' | 'fetido';

export type EdgeType = 'integra' | 'macerada' | 'hiperqueratotica' | 'solapada' | 'aderida' | 'desvitalizada';
export type PerilesionalSkin = 'integra' | 'eritematosa' | 'edemaciada' | 'descamativa' | 'hiperpigmentada' | 'macerada';

export interface WoundPhoto {
  id: string;
  url: string;
  date: string;
  stageTag: 'antes' | 'durante' | 'depois' | 'avaliacao_inicial';
  areaCm2: number;
  tissueGranulationPercent: number;
  notes?: string;
}

export interface EvolutionSupplyItem {
  supplyId: string;
  name: string;
  unit: string;
  quantityUsed: number;
  unitPrice: number;
  subtotal: number;
}

export interface ClinicalEvolution {
  id: string;
  woundId: string;
  patientId: string;
  appointmentId?: string;
  date: string;
  time: string;
  nurseName: string;
  nurseCoren: string;
  
  // Mensuração
  lengthCm: number;
  widthCm: number;
  depthCm: number;
  areaCm2: number; // calculated length x width or elliptic
  tunneling?: string; // e.g. "2cm às 2h"
  
  // Tecidos no leito (somatório deve fechar 100%)
  granulationPercent: number; // Granulação (%)
  sloughPercent: number;      // Esfacelo (%)
  necrosisPercent: number;    // Necrose (%)
  epithelializationPercent: number; // Epitelização (%)
  
  // Bordas e Pele Perilesional
  edges: EdgeType[];
  perilesional: PerilesionalSkin[];
  
  // Exsudato e Infecção
  exudateAmount: ExudateAmount;
  exudateType: ExudateType;
  exudateOdor: ExudateOdor;
  painScoreEVA: number; // 0-10
  infectionSigns: string[]; // calor, rubor, edema, dor acentuada, febre, biofilme suspeito
  
  // Conduta / Procedimentos
  cleansingSolution: string; // SF 0.9%, Solução PHMB 0.1%, Água purificada
  debridementType: 'nenhum' | 'autolitico' | 'enzimatico' | 'instrumental_conservador' | 'mecanico';
  adjuvantTherapy?: string; // Laserterapia 660nm/808nm, Terapia Compressiva, TPN
  laserDoseJoules?: number;
  
  // Coberturas e Insumos
  primaryDressing: string; // ex: Hidrogel com Alginato, Prata Nanocristalina
  secondaryDressing: string; // ex: Espuma com Silicone, Gaze estéril + Atadura
  suppliesUsed: EvolutionSupplyItem[];
  
  // Financeiro da Sessão
  consultationFee: number;
  suppliesTotalFee: number;
  travelFee: number;
  totalSessionFee: number;
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'convenio_reembolso';
  paymentStatus: 'pago' | 'pendente' | 'faturado';
  
  // Fotografias
  photos: WoundPhoto[];
  
  // Orientações e Próximos passos
  clinicalObservations: string;
  patientInstructions: string;
  nextSessionRecommendedDate: string;
  pushToolScore?: number; // Pressure Ulcer Scale for Healing
}

export interface Wound {
  id: string;
  patientId: string;
  patientName?: string;
  title: string;
  lesionType: LesionType;
  anatomicalLocation: string;
  etiology: string;
  startDate: string;
  status: WoundStatus;
  initialAreaCm2: number;
  currentAreaCm2: number;
  healingProgressPercent: number; // calculated: (initial - current) / initial * 100
  evolutions: ClinicalEvolution[];
  photos: WoundPhoto[];
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  gender: 'M' | 'F' | 'Outro';
  phone: string;
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    complement?: string;
    estimatedTravelMinutes?: number; // Tempo médio de deslocamento até este paciente
  };
  comorbidities: string[]; // Diabetes Mellitus, HAS, Insuficiência Venosa Crônica, Tabagismo, etc.
  allergies: string[];
  mobilityStatus: 'deambulante' | 'deambulante_com_apoio' | 'cadeirante' | 'acamado';
  nutritionalStatus: 'eutrofico' | 'desnutrido' | 'sobrepeso' | 'obeso';
  bloodType?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  wounds: Wound[];
  createdAt: string;
}

export type ServiceType = 
  | 'consulta_clinica'
  | 'visita_domiciliar'
  | 'troca_curativo_simples'
  | 'curativo_complexo'
  | 'avaliacao_estomia'
  | 'laserterapia'
  | 'desbridamento'
  | 'terapia_compressiva';

export type AppointmentStatus = 'confirmado' | 'pendente' | 'em_andamento' | 'realizado' | 'cancelado';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAddress?: string;
  serviceType: ServiceType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (ex: "09:00")
  durationMinutes: number; // ex: 60
  isDomiciliary: boolean;
  travelTimeMinutes: number; // Tempo de ida/deslocamento
  bufferTimeMinutes: number; // Margem de segurança pós-atendimento
  status: AppointmentStatus;
  nurseAssigned: string;
  estimatedValue: number;
  woundId?: string;
  notes?: string;
  isConfirmedByPatient?: boolean;
}

export type SupplyCategory = 
  | 'cobertura_primaria'
  | 'cobertura_secundaria'
  | 'solucao_limpeza'
  | 'estomia'
  | 'terapia_compressiva'
  | 'fixacao_protecao'
  | 'desbridante'
  | 'instrumental'
  | 'equipamento_laser';

export interface SupplyStockItem {
  id: string;
  name: string;
  category: SupplyCategory;
  description: string;
  currentStock: number;
  minStockAlert: number;
  unit: string; // unidade, frasco 350ml, placa 10x10, tubo 25g, rolo
  costPrice: number;
  sellPrice: number;
  manufacturer: string;
  batchNumber: string;
  expirationDate: string;
  code?: string;
}

export interface ProfessionalProfile {
  name: string;
  title: string;
  coren: string;
  specialization: string; // "Enfermeira Estomaterapeuta SOBEST"
  clinicName: string;
  clinicAddress: string;
  phone: string;
  email: string;
  defaultConsultationFee: number;
  defaultHomeVisitFee: number;
  defaultKmRate: number;
  cpf?: string;
  uf?: string;
  bio?: string;
  avatarUrl?: string;
  digitalSignaturePin?: string;
  digitalSignatureHash?: string;
}

export type ProfessionalRole = 
  | 'estomaterapeuta_chefe' 
  | 'enfermeiro_estomaterapeuta' 
  | 'enfermeiro_assistencial' 
  | 'enfermeiro_geral' 
  | 'tecnico_enfermagem';

export type ProfessionalCategory = 'enfermeiro' | 'tecnico_enfermagem';

export interface NurseAccount {
  id: string;
  name: string;
  title: string;
  coren: string;
  uf: string;
  cpf: string;
  email: string; // E-mail / Usuário de Login
  password: string; // Senha de Acesso
  digitalSignaturePin: string; // PIN de 4 dígitos para carimbo e validação rápida
  digitalSignatureHash?: string;
  phone: string;
  specialization: string;
  clinicName: string;
  clinicAddress: string;
  bio?: string;
  avatarUrl?: string;
  role: ProfessionalRole;
  category?: ProfessionalCategory;
  isActive: boolean;
  defaultConsultationFee: number;
  defaultHomeVisitFee: number;
  defaultKmRate: number;
  createdAt: string;
  lastLoginAt: string;
  twoFactorEnabled?: boolean;
}

export type UserRole = 'nurse' | 'admin' | 'patient';

export type AdminRoleType = 'administrador_geral' | 'financeiro_recepcao' | 'coordenador_clinico' | 'gestor_ti' | 'recepcao_atendimento';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: AdminRoleType;
  roleTitle?: string;
  avatarUrl?: string;
  clinicName: string;
  phone?: string;
  cpf?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  role: UserRole;
  user: {
    id: string;
    name: string;
    email?: string;
    cpf?: string;
    coren?: string;
    roleTitle: string;
    avatarUrl?: string;
  };
  loginTime: string;
}

export interface CompanyInfo {
  id: string;
  companyName: string; // Razão Social
  tradeName: string; // Nome Fantasia
  cnpj: string; // CNPJ
  stateRegistration?: string; // Inscrição Estadual
  municipalRegistration?: string; // Inscrição Municipal
  cnes?: string; // CNES
  technicalResponsible: string; // Responsável Técnico (RT)
  technicalResponsibleCoren: string; // COREN do RT
  technicalResponsibleCpf?: string;
  cofenCertificateNumber?: string; // Certificado de Responsabilidade Técnica (CRT)
  
  // Contato
  phone: string;
  whatsapp: string;
  email: string;
  billingEmail?: string;
  website?: string;
  
  // Endereço
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Dados Financeiros & PIX
  pixKey: string;
  pixKeyType: 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  bankName: string;
  bankAgency: string;
  bankAccount: string;
  bankAccountType?: string;
  
  // Identidade & Operacional
  logoUrl?: string;
  operatingHours?: string;
  legalNotes?: string;
}

export interface NurseAuditLog {
  id: string;
  nurseId: string;
  nurseName: string;
  action: 'login' | 'logout' | 'update_profile' | 'change_password' | 'sign_evolution' | 'register_nurse' | 'toggle_lock' | 'update_company' | 'register_admin' | 'update_admin' | 'delete_admin';
  timestamp: string;
  details: string;
  ipAddress?: string;
  device?: string;
}
