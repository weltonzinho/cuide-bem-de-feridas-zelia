import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, 
  Layers, 
  TrendingDown, 
  Calendar, 
  Plus, 
  Sparkles, 
  ArrowRight,
  Maximize2,
  Sliders,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { formatDateBR, formatCurrency } from '../../utils/formatters';
import { WoundPhoto } from '../../types';

export const WoundEvolutionGallery: React.FC = () => {
  const { patients, selectedPatient, setSelectedPatient, setIsEvolutionModalOpen } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    selectedPatient?.id || (patients.length > 0 ? patients[0].id : '')
  );
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const [selectedWoundId, setSelectedWoundId] = useState<string>(
    currentPatient?.wounds[0]?.id || ''
  );

  const currentWound = currentPatient?.wounds.find((w) => w.id === selectedWoundId) || currentPatient?.wounds[0];

  // Side-by-side comparison indices
  const photos = currentWound?.photos || [];
  const [beforePhotoIndex, setBeforePhotoIndex] = useState<number>(0);
  const [afterPhotoIndex, setAfterPhotoIndex] = useState<number>(Math.max(0, photos.length - 1));
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewStyle, setViewStyle] = useState<'side_by_side' | 'slider' | 'timeline'>('side_by_side');

  const beforePhoto: WoundPhoto | undefined = photos[beforePhotoIndex];
  const afterPhoto: WoundPhoto | undefined = photos[afterPhotoIndex];

  // Calculate Delta
  const initialArea = currentWound?.initialAreaCm2 || 24;
  const currentArea = currentWound?.currentAreaCm2 || 11.2;
  const areaReductionPercent = currentWound?.healingProgressPercent || 53.3;

  return (
    <div className="space-y-6">
      {/* Top Header & Selectors */}
      <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Galeria Comparativa de Cicatrização
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhamento fotográfico Antes / Durante / Depois e regressão de área milimétrica
          </p>
        </div>

        {/* Patient and Wound Picker */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              const p = patients.find((pat) => pat.id === e.target.value);
              if (p?.wounds && p.wounds.length > 0) {
                setSelectedWoundId(p.wounds[0].id);
              }
            }}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.wounds.length} lesões)
              </option>
            ))}
          </select>

          {currentPatient?.wounds && currentPatient.wounds.length > 0 && (
            <select
              value={selectedWoundId}
              onChange={(e) => setSelectedWoundId(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {currentPatient.wounds.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsEvolutionModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Foto / Evolução</span>
          </button>
        </div>
      </div>

      {/* Lesion Summary Card with Healing Reduction Badge */}
      {currentWound && (
        <div className="bg-linear-to-r from-slate-900 via-[#0f172a] to-blue-950/80 rounded-2xl text-white p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
              {currentWound.anatomicalLocation}
            </span>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">{currentWound.title}</h3>
            <p className="text-xs text-slate-400">
              Etiologia: <span className="text-slate-200 font-medium">{currentWound.etiology}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Área Inicial vs Atual</span>
              <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                <span className="text-red-400">{initialArea} cm²</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-emerald-400">{currentArea} cm²</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Regressão</span>
              <div className="flex items-center gap-1 text-base font-black text-emerald-400">
                <TrendingDown className="w-4 h-4" />
                <span>-{areaReductionPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center p-1 bg-[#0f172a] rounded-xl border border-slate-800 text-xs font-medium w-max">
          <button
            onClick={() => setViewStyle('side_by_side')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewStyle === 'side_by_side' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lado a Lado (Antes / Depois)
          </button>
          <button
            onClick={() => setViewStyle('slider')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewStyle === 'slider' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Slider Interativo
          </button>
          <button
            onClick={() => setViewStyle('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewStyle === 'timeline' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Linha Cronológica ({photos.length} fotos)
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:block">
          Registro em conformidade com o parecer COREN sobre documentação fotográfica de lesões
        </span>
      </div>

      {/* Main Photographic Display */}
      {photos.length === 0 ? (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Nenhum registro fotográfico cadastrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Adicione fotos da ferida durante a evolução clínica para comparar a cicatrização ao longo do tempo.
          </p>
          <button
            onClick={() => setIsEvolutionModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Foto na Evolução</span>
          </button>
        </div>
      ) : viewStyle === 'side_by_side' ? (
        /* SIDE-BY-SIDE BEFORE / AFTER */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BEFORE CARD */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-sm space-y-3 flex flex-col">
            <div className="p-3 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                Antes do Tratamento ({beforePhoto?.stageTag.toUpperCase() || 'AVALIAÇÃO INICIAL'})
              </span>
              <span className="text-xs font-semibold text-red-300">{formatDateBR(beforePhoto?.date || '2026-06-15')}</span>
            </div>

            <div className="relative aspect-4/3 bg-slate-950 overflow-hidden group">
              <img
                src={beforePhoto?.url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'}
                alt="Foto inicial da ferida"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold border border-slate-700">
                Área: {beforePhoto?.areaCm2 || 24.0} cm²
              </div>
            </div>

            <div className="p-4 pt-1 flex-1 flex flex-col justify-between space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{beforePhoto?.notes || 'Leito com presença de esfacelo aderido e bordas irregulares.'}"
              </p>

              {photos.length > 1 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <label className="text-[11px] font-medium text-slate-400">Selecionar foto:</label>
                  <select
                    value={beforePhotoIndex}
                    onChange={(e) => setBeforePhotoIndex(parseInt(e.target.value) || 0)}
                    className="text-xs px-2 py-1 rounded border border-slate-700 bg-slate-900 text-slate-200"
                  >
                    {photos.map((p, idx) => (
                      <option key={p.id} value={idx}>
                        {formatDateBR(p.date)} - {p.stageTag} ({p.areaCm2} cm²)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* AFTER / CURRENT CARD */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-sm space-y-3 flex flex-col">
            <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Evolução Atual / Depois ({afterPhoto?.stageTag.toUpperCase() || 'RESULTADO'})
              </span>
              <span className="text-xs font-semibold text-emerald-300">{formatDateBR(afterPhoto?.date || '2026-08-18')}</span>
            </div>

            <div className="relative aspect-4/3 bg-slate-950 overflow-hidden group">
              <img
                src={afterPhoto?.url || 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80'}
                alt="Foto atual da ferida"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 left-3 bg-emerald-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-emerald-200 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Área: {afterPhoto?.areaCm2 || 11.2} cm² ({afterPhoto?.tissueGranulationPercent || 85}% Granulação)
              </div>
            </div>

            <div className="p-4 pt-1 flex-1 flex flex-col justify-between space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{afterPhoto?.notes || 'Evolução favorável com formação de epitélio marginal e redução importante da área.'}"
              </p>

              {photos.length > 1 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <label className="text-[11px] font-medium text-slate-400">Selecionar foto:</label>
                  <select
                    value={afterPhotoIndex}
                    onChange={(e) => setAfterPhotoIndex(parseInt(e.target.value) || 0)}
                    className="text-xs px-2 py-1 rounded border border-slate-700 bg-slate-900 text-slate-200"
                  >
                    {photos.map((p, idx) => (
                      <option key={p.id} value={idx}>
                        {formatDateBR(p.date)} - {p.stageTag} ({p.areaCm2} cm²)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : viewStyle === 'slider' ? (
        /* INTERACTIVE DRAG COMPARISON SLIDER */
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-400" />
              Arraste o cursor para comparar o Antes e o Depois da cicatrização:
            </span>
            <span className="text-xs font-semibold text-blue-400">Divisão: {sliderPosition}%</span>
          </div>

          <div className="relative aspect-16/9 rounded-2xl overflow-hidden shadow-inner border border-slate-700 select-none">
            {/* Background After Image */}
            <img
              src={afterPhoto?.url || 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80'}
              alt="Depois"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-xs text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold">
              DEPOIS ({afterPhoto?.areaCm2 || 11.2} cm²)
            </div>

            {/* Foreground Before Image with Clip Path */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforePhoto?.url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'}
                alt="Antes"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100vw' }} // Maintain scale
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs text-red-300 border border-red-500/30 px-3 py-1 rounded-lg text-xs font-bold">
                ANTES ({beforePhoto?.areaCm2 || 24.0} cm²)
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-xl flex items-center justify-center cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#0f172a] text-blue-400 shadow-xl border-2 border-blue-500 flex items-center justify-center font-bold text-xs">
                ↔
              </div>
            </div>

            {/* Transparent Range Input for Interaction */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(parseInt(e.target.value) || 50)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>
        </div>
      ) : (
        /* CHRONOLOGICAL TIMELINE CARDS */
        <div className="space-y-4">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="w-full sm:w-48 aspect-4/3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shrink-0">
                <img
                  src={photo.url}
                  alt={photo.notes}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md uppercase">
                      {photo.stageTag}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{formatDateBR(photo.date)}</span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                    {photo.areaCm2} cm²
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Granulação: <strong className="text-red-400">{photo.tissueGranulationPercent}%</strong></span>
                  <span>•</span>
                  <span>Evolução nº {photos.length - idx}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {photo.notes || 'Registro fotográfico anexado à ficha de evolução clínica.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

