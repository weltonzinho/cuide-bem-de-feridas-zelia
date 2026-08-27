import { LesionType, ServiceType, WoundStatus } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function formatDateTimeBR(dateStr: string, timeStr?: string): string {
  const formattedDate = formatDateBR(dateStr);
  return timeStr ? `${formattedDate} às ${timeStr}` : formattedDate;
}

export const LESION_TYPE_LABELS: Record<LesionType, { label: string; color: string; bg: string }> = {
  ulcera_venosa: {
    label: 'Úlcera Venosa (MMII)',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  ulcera_arterial: {
    label: 'Úlcera Arterial (Isquêmica)',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
  lesao_pressao_e1: {
    label: 'Lesão por Pressão (Estágio 1)',
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
  },
  lesao_pressao_e2: {
    label: 'Lesão por Pressão (Estágio 2)',
    color: 'text-orange-800',
    bg: 'bg-orange-100 border-orange-300',
  },
  lesao_pressao_e3: {
    label: 'Lesão por Pressão (Estágio 3)',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
  },
  lesao_pressao_e4: {
    label: 'Lesão por Pressão (Estágio 4)',
    color: 'text-red-900',
    bg: 'bg-red-100 border-red-300',
  },
  lesao_pressao_nc: {
    label: 'Lesão por Pressão (Não Classificável)',
    color: 'text-purple-800',
    bg: 'bg-purple-50 border-purple-200',
  },
  pe_diabetico: {
    label: 'Pé Diabético (Neuropático/Misto)',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  ferida_cirurgica: {
    label: 'Ferida Cirúrgica / Deiscência',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
  },
  queimadura: {
    label: 'Queimadura Térmica/Química',
    color: 'text-amber-800',
    bg: 'bg-amber-100 border-amber-300',
  },
  dermatite_umidade_masd: {
    label: 'Dermatite por Umidade (MASD)',
    color: 'text-teal-700',
    bg: 'bg-teal-50 border-teal-200',
  },
  estomia_complicacao: {
    label: 'Estomia / Lesão Periestoma',
    color: 'text-cyan-800',
    bg: 'bg-cyan-50 border-cyan-200',
  },
  outra: {
    label: 'Outra Etiologia',
    color: 'text-slate-700',
    bg: 'bg-slate-100 border-slate-200',
  },
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, { label: string; duration: number; defaultPrice: number }> = {
  consulta_clinica: { label: 'Consulta de Avaliação em Clínica', duration: 45, defaultPrice: 180 },
  visita_domiciliar: { label: 'Visita Domiciliar Especializada (Home Care)', duration: 75, defaultPrice: 260 },
  troca_curativo_simples: { label: 'Troca de Curativo Simples', duration: 30, defaultPrice: 130 },
  curativo_complexo: { label: 'Curativo Complexo Especializado', duration: 60, defaultPrice: 200 },
  avaliacao_estomia: { label: 'Avaliação & Troca de Dispositivo de Estomia', duration: 60, defaultPrice: 220 },
  laserterapia: { label: 'Sessão de Laserterapia Cicatrizante', duration: 40, defaultPrice: 160 },
  desbridamento: { label: 'Desbridamento Instrumental / Enzimático', duration: 60, defaultPrice: 250 },
  terapia_compressiva: { label: 'Aplicação de Terapia Compressiva (Bota de Unna)', duration: 60, defaultPrice: 240 },
};

export const STATUS_LABELS: Record<WoundStatus, { label: string; badge: string }> = {
  em_tratamento: { label: 'Em Tratamento Ativo', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cicatrizada: { label: 'Cicatrizada / Alta', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  estacionaria: { label: 'Estacionária', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  encaminhada: { label: 'Encaminhada ao Cirurgião/Vascular', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
};
