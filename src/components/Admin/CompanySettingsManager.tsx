import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  CreditCard, 
  FileText, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  QrCode, 
  Award, 
  Image as ImageIcon,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { CompanyInfo } from '../../types';

export const CompanySettingsManager: React.FC = () => {
  const { companyInfo, updateCompanyInfo, addToast } = useApp();

  const [formData, setFormData] = useState<CompanyInfo>({
    ...companyInfo
  });

  const [activeSection, setActiveSection] = useState<'geral' | 'rt' | 'endereco' | 'contato' | 'financeiro' | 'timbre'>('geral');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleInputChange = (field: keyof CompanyInfo, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    addToast({
      type: 'info',
      title: 'Copiado',
      message: `${label} copiado para a área de transferência.`
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.tradeName || !formData.cnpj) {
      addToast({
        type: 'error',
        title: 'Campos Obrigatórios',
        message: 'Preencha a Razão Social, Nome Fantasia e CNPJ da empresa.'
      });
      return;
    }

    updateCompanyInfo(formData);
  };

  const handleResetToCurrent = () => {
    setFormData({ ...companyInfo });
    addToast({
      type: 'info',
      title: 'Formulário Revertido',
      message: 'Os campos foram restaurados para os valores salvos atualmente.'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg text-amber-400">
              <Building2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Dados Cadastrais da Empresa & Clínica
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Módulo Administrativo
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Configure as informações jurídicas, fiscais, responsabilidade técnica (RT/COFEN), dados de faturamento e timbre de laudos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetToCurrent}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Descartar Alterações</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados da Empresa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Layout with Section Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-2 shadow-xl sticky top-24">
            <div className="px-3 py-2 border-b border-slate-800/80 mb-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Seções da Empresa</p>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection('geral')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'geral'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-left flex-1">Identificação & CNPJ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('rt')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'rt'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-left flex-1">Responsabilidade Técnica (RT)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('endereco')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'endereco'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-left flex-1">Endereço & Sede</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('contato')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'contato'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Phone className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-left flex-1">Contatos & Horários</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('financeiro')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'financeiro'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="text-left flex-1">Dados Bancários & PIX</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('timbre')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'timbre'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-left flex-1">Timbre de Laudos & Prévia</span>
            </button>

            {/* Quick Company Info Card */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>CNPJ:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(formData.cnpj, 'CNPJ')}
                  className="font-mono text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {formData.cnpj}
                  {copiedKey === 'CNPJ' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>CNES:</span>
                <span className="font-mono text-white">{formData.cnes || '7198234'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Chave PIX:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(formData.pixKey, 'PIX')}
                  className="font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer max-w-[130px] truncate"
                  title={formData.pixKey}
                >
                  <span className="truncate">{formData.pixKey}</span>
                  {copiedKey === 'PIX' ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <Copy className="w-3 h-3 opacity-60 shrink-0" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-9 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Identificação & CNPJ */}
            {activeSection === 'geral' && (
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    Identificação Jurídica e Fiscais da Empresa
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Esses dados são impressos no cabeçalho dos laudos clínicos, recibos de pagamento, declarações de comparecimento e relatórios financeiros.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Razão Social (Nome Empresarial Completo) *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Ex: Cuide Bem Estomaterapia & Cuidados Avançados Ltda."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nome Fantasia / Marca da Clínica *
                    </label>
                    <input
                      type="text"
                      value={formData.tradeName}
                      onChange={(e) => handleInputChange('tradeName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Ex: Cuide Bem de Feridas - Clínica & Atendimento Domiciliar"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      CNPJ (Cadastro Nacional de Pessoa Jurídica) *
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Inscrição Estadual (IE)
                    </label>
                    <input
                      type="text"
                      value={formData.stateRegistration || ''}
                      onChange={(e) => handleInputChange('stateRegistration', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Ex: 114.892.304.110 ou Isento"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Inscrição Municipal (IM / CCM)
                    </label>
                    <input
                      type="text"
                      value={formData.municipalRegistration || ''}
                      onChange={(e) => handleInputChange('municipalRegistration', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Ex: 7.892.103-9"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>CNES (Cadastro Nacional de Estab. de Saúde)</span>
                      <span className="text-[10px] text-amber-400 font-normal">Ministério da Saúde</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cnes || ''}
                      onChange={(e) => handleInputChange('cnes', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Ex: 7198234"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      URL do Logotipo da Empresa (PNG / JPG)
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl || ''}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="https://exemplo.com/logo-clinica.png"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Responsabilidade Técnica (RT) */}
            {activeSection === 'rt' && (
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-400" />
                    Responsabilidade Técnica (RT) & Homologação COFEN / COREN
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Defina o profissional enfermeiro responsável técnico pela clínica conforme exigência da Resolução COFEN nº 567/2018 e 501/2015.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Certificado de Responsabilidade Técnica (CRT)</strong>
                    O RT responde técnica e eticamente pelos serviços prestados na clínica de estomaterapia e nos atendimentos domiciliares. O número do CRT é inserido automaticamente nos laudos clínicos.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nome do Responsável Técnico(a) (RT) *
                    </label>
                    <input
                      type="text"
                      value={formData.technicalResponsible}
                      onChange={(e) => handleInputChange('technicalResponsible', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: Dra. Mariana Vasconcelos"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      COREN do Responsável Técnico *
                    </label>
                    <input
                      type="text"
                      value={formData.technicalResponsibleCoren}
                      onChange={(e) => handleInputChange('technicalResponsibleCoren', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: COREN-SP 148.920-ENF"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      CPF do Responsável Técnico
                    </label>
                    <input
                      type="text"
                      value={formData.technicalResponsibleCpf || ''}
                      onChange={(e) => handleInputChange('technicalResponsibleCpf', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nº do Certificado de Responsabilidade Técnica (CRT) COFEN / COREN
                    </label>
                    <input
                      type="text"
                      value={formData.cofenCertificateNumber || ''}
                      onChange={(e) => handleInputChange('cofenCertificateNumber', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: CRT-SP nº 2024/09812"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Endereço & Sede */}
            {activeSection === 'endereco' && (
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    Endereço Completo da Sede e Consultório
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Localização oficial para atendimento presencial de pacientes e ponto de partida de rotas para atendimentos domiciliares.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      CEP (Código de Endereçamento Postal) *
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="00000-000"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Logradouro (Avenida / Rua / Alameda) *
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Ex: Av. Paulista"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Ex: 1842"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={formData.complement || ''}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Ex: Cj 905 - 9º Andar"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Ex: Bela Vista"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Ex: São Paulo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Estado (UF) *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    >
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Contatos & Horários */}
            {activeSection === 'contato' && (
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Phone className="w-5 h-5 text-purple-400" />
                    Canais de Atendimento, Contatos & Horários
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Canais diretos disponibilizados para pacientes, médicos assistentes, agendamento de consultas e emissão de notas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Telefone Central / Recepção *
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="(11) 3288-4400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>WhatsApp Oficial de Atendimento *</span>
                      <span className="text-[10px] text-emerald-400 font-normal">Agendamentos & Dúvidas</span>
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="(11) 98765-4321"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      E-mail Institucional / Atendimento Geral *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="contato@cuidebemferidas.com.br"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      E-mail Financeiro & Faturamento
                    </label>
                    <input
                      type="email"
                      value={formData.billingEmail || ''}
                      onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="financeiro@cuidebemferidas.com.br"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Website Oficial
                    </label>
                    <input
                      type="text"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="www.cuidebemferidas.com.br"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Horário de Funcionamento & Plantão
                    </label>
                    <input
                      type="text"
                      value={formData.operatingHours || ''}
                      onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Ex: Seg a Sex: 07:30 às 19:00 | Sáb: 08:00 às 13:00"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Dados Bancários & PIX */}
            {activeSection === 'financeiro' && (
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-rose-400" />
                    Dados Bancários, Faturamento e Recebimento PIX
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Esses dados são utilizados para geração automática de instruções de pagamento, orçamentos e recibos para convênios e pacientes particulares.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Tipo de Chave PIX *
                    </label>
                    <select
                      value={formData.pixKeyType}
                      onChange={(e) => handleInputChange('pixKeyType', e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                    >
                      <option value="cnpj">CNPJ da Empresa</option>
                      <option value="email">E-mail Corporativo</option>
                      <option value="telefone">Telefone Celular</option>
                      <option value="aleatoria">Chave Aleatória (EVP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Chave PIX da Empresa *
                    </label>
                    <input
                      type="text"
                      value={formData.pixKey}
                      onChange={(e) => handleInputChange('pixKey', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-rose-500 transition-colors"
                      placeholder="Chave PIX para pagamentos"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Instituição Bancária / Banco
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                      placeholder="Ex: Banco Itaú Unibanco (341)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Agência Bancária
                    </label>
                    <input
                      type="text"
                      value={formData.bankAgency}
                      onChange={(e) => handleInputChange('bankAgency', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-rose-500 transition-colors"
                      placeholder="Ex: 0945"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Conta Corrente
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-rose-500 transition-colors"
                      placeholder="Ex: 38291-0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Tipo de Conta
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccountType || ''}
                      onChange={(e) => handleInputChange('bankAccountType', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                      placeholder="Ex: Conta Corrente Pessoa Jurídica (PJ)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Timbre de Laudos & Prévia Visual */}
            {activeSection === 'timbre' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-cyan-400" />
                      Observações Legais e Rodapé de Documentos
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Texto exibido nos rodapés dos laudos de evolução clínica e receitas de curativos.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Texto de Conformidade Legal e Regulamentar
                    </label>
                    <textarea
                      rows={3}
                      value={formData.legalNotes || ''}
                      onChange={(e) => handleInputChange('legalNotes', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Observações legais para rodapé de relatórios..."
                    />
                  </div>
                </div>

                {/* Live Preview Paper Card */}
                <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-black flex items-center justify-center text-sm shadow">
                          CB
                        </div>
                        <div>
                          <h4 className="text-base font-black tracking-tight text-slate-900 uppercase">
                            {formData.tradeName || 'Cuide Bem de Feridas'}
                          </h4>
                          <p className="text-[10px] text-slate-600 font-semibold tracking-wide">
                            {formData.companyName} | CNPJ: {formData.cnpj}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-slate-600 font-medium space-y-0.5">
                      <p className="font-bold text-slate-900">CNES: {formData.cnes || '7198234'}</p>
                      <p>{formData.street}, {formData.number} {formData.complement ? `- ${formData.complement}` : ''}</p>
                      <p>{formData.neighborhood} - {formData.city}/{formData.state} - CEP {formData.zipCode}</p>
                      <p>Tel: {formData.phone} | WhatsApp: {formData.whatsapp}</p>
                    </div>
                  </div>

                  {/* Document Body Sample */}
                  <div className="py-4 space-y-3">
                    <div className="text-center py-2 bg-slate-100 rounded-lg">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Laudo de Avaliação & Evolução Clínica em Estomaterapia
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
                      <div>
                        <p><strong className="text-slate-900">Responsável Técnico:</strong> {formData.technicalResponsible}</p>
                        <p><strong className="text-slate-900">Registro Profissional:</strong> {formData.technicalResponsibleCoren}</p>
                      </div>
                      <div className="text-right">
                        <p><strong className="text-slate-900">Certificado CRT:</strong> {formData.cofenCertificateNumber || 'CRT Homologado'}</p>
                        <p><strong className="text-slate-900">E-mail:</strong> {formData.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Letterhead Footer */}
                  <div className="border-t border-slate-300 pt-3 text-[9px] text-slate-500 text-center leading-relaxed">
                    <p className="font-semibold text-slate-700">{formData.legalNotes}</p>
                    <p className="mt-1">Chave PIX: {formData.pixKey} ({formData.pixKeyType.toUpperCase()}) | {formData.bankName} | Ag: {formData.bankAgency} | CC: {formData.bankAccount}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Action Bar */}
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 text-center sm:text-left">
                <span className="text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Sincronização em tempo real
                </span>
                As alterações refletirão imediatamente em todos os laudos, relatórios e portais.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetToCurrent}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Descartar
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Informações da Empresa</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
