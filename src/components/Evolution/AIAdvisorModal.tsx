import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Layers, 
  ShieldCheck, 
  Droplet, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface AIAdvisorModalProps {
  onClose: () => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'time' | 'laser' | 'products' | 'unhas'>('time');
  const [selectedTissue, setSelectedTissue] = useState<'granulacao' | 'esfacelo' | 'necrose' | 'misto'>('esfacelo');
  const [selectedExudate, setSelectedExudate] = useState<'baixo' | 'moderado' | 'alto'>('moderado');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl text-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0a0f1d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Assistente Clínico & Protocolos TIME
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  Diretrizes Estomaterapia
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Suporte à decisão clínica para preparo do leito e escolha de coberturas especiais
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol Nav Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-[#0f172a]">
          <button
            onClick={() => setActiveTab('time')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'time'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Estrutura T.I.M.E.</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Guia de Coberturas</span>
          </button>
          <button
            onClick={() => setActiveTab('laser')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'laser'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Laserterapia (ILIB / Local)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'time' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    T
                  </div>
                  <strong className="text-white block text-sm">Tecido Inválido</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Identificar necrose e esfacelo. Indicar desbridamento autolítico, enzimático ou instrumental.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    I
                  </div>
                  <strong className="text-white block text-sm">Infecção / Biofilme</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Controle de carga bacteriana com PHMB 0.1%, Prata Iônica (Ag), Cadexômero de Iodo e DACC.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    M
                  </div>
                  <strong className="text-white block text-sm">Moisture (Umidade)</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Equilíbrio térmico e hídrico. Evitar maceração perilesional e ressecamento celular.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    E
                  </div>
                  <strong className="text-white block text-sm">Edge (Bordas)</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Avanço epitelial, remoção de hiperqueratose e proteção contra enzimas proteolíticas.
                  </p>
                </div>
              </div>

              {/* Dynamic Interactive Helper */}
              <div className="bg-[#0a0f1d] p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Simulador de Recomendação Rápida
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Aspecto Predominante do Leito:</label>
                    <select
                      value={selectedTissue}
                      onChange={(e) => setSelectedTissue(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option value="granulacao">Granulação Limpa (Avermelhado)</option>
                      <option value="esfacelo">Esfacelo Amarelado / Fibrina</option>
                      <option value="necrose">Necrose Coagulativa / Escara Dura</option>
                      <option value="misto">Misto (Granulação + Esfacelo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Nível de Exsudato:</label>
                    <select
                      value={selectedExudate}
                      onChange={(e) => setSelectedExudate(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option value="baixo">Baixo / Escasso</option>
                      <option value="moderado">Moderado</option>
                      <option value="alto">Alto / Abundante</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-slate-200 mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Conduta Terapêutica Sugerida:</span>
                  </div>
                  {selectedTissue === 'esfacelo' && selectedExudate === 'alto' && (
                    <p className="text-slate-300">
                      • Limpeza mecânica suave com Solução PHMB + Alginato de Cálcio com Prata ou Fibra Hidroativa + Espuma absorvente secundária.
                    </p>
                  )}
                  {selectedTissue === 'esfacelo' && selectedExudate !== 'alto' && (
                    <p className="text-slate-300">
                      • Hidrogel amorfo com Alginato / Colagenase para desbridamento autolítico + Placa Hidrocoloide ou Filme Transparente.
                    </p>
                  )}
                  {selectedTissue === 'necrose' && (
                    <p className="text-slate-300">
                      • Incisões cruzadas na escara + Hidrogel amorfo estéril para amolecimento ou desbridamento instrumental conservador com lâmina 15.
                    </p>
                  )}
                  {selectedTissue === 'granulacao' && selectedExudate === 'baixo' && (
                    <p className="text-slate-300">
                      • Manter umidade fisiológica: Espuma com silicone suave não aderente ou Hidrogel com AGE, troca a cada 3 a 5 dias.
                    </p>
                  )}
                  {selectedTissue === 'granulacao' && selectedExudate !== 'baixo' && (
                    <p className="text-slate-300">
                      • Espuma de poliuretano com silicone (Mepilex) sem prata para absorção mantendo o meio úmido sem lesar novas células.
                    </p>
                  )}
                  {selectedTissue === 'misto' && (
                    <p className="text-slate-300">
                      • Limpeza com PHMB por 10 min, aplicação localizada de Hidrogel no esfacelo e proteção do tecido de granulação com AGE ou silicone.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Soluções de Limpeza</span>
                  <strong className="text-white text-xs block mt-1">PHMB 0.1% + Polihexanida</strong>
                  <p className="text-slate-400 mt-1">
                    Remove biofilme bacteriano sem citotoxicidade ao tecido de granulação. Tempo de contato mínimo: 10 a 15 minutos em compressa úmida.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Espumas com Silicone</span>
                  <strong className="text-white text-xs block mt-1">Mepilex / Allevyn Gentle</strong>
                  <p className="text-slate-400 mt-1">
                    Garante remoção atraumática e indolor das trocas. Não adere ao leito úmido e protege a pele perilesional contra maceração.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Bactericidas Avançados</span>
                  <strong className="text-white text-xs block mt-1">Espuma ou Alginato com Prata (Ag)</strong>
                  <p className="text-slate-400 mt-1">
                    Liberação contínua de íons de prata para lesões colonizadas criticamente ou infectadas com exsudato moderado a alto.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Terapia Compressiva</span>
                  <strong className="text-white text-xs block mt-1">Bota de Unna / Bandagem Inelástica</strong>
                  <p className="text-slate-400 mt-1">
                    Padrão ouro em Úlceras Venosas (quando ITB &gt; 0.8). Melhora o retorno venoso e a bomba muscular da panturrilha.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'laser' && (
            <div className="space-y-4 bg-[#0a0f1d] p-5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-white text-sm">Parâmetros de Fotobiomodulação (Laserterapia)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">Comprimento Vermelho (660nm)</span>
                  <p className="text-white font-bold mt-1">2 a 4 J/cm²</p>
                  <p className="text-slate-400 text-[11px] mt-1">Estimula síntese de colágeno, epitelização superficial e microcirculação.</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block">Infravermelho (808nm)</span>
                  <p className="text-white font-bold mt-1">4 a 6 J/cm²</p>
                  <p className="text-slate-400 text-[11px] mt-1">Ação anti-inflamatória profunda, analgesia potente e drenagem linfática.</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Técnica ILIB Modificada</span>
                  <p className="text-white font-bold mt-1">30 minutos (100mW)</p>
                  <p className="text-slate-400 text-[11px] mt-1">Combate estresse oxidativo sistêmico sobre a artéria radial.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0f1d] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Recomendações baseadas na SOBEST e National Pressure Injury Advisory Panel (NPIAP)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-600/20"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
