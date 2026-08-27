import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Ruler, 
  Layers, 
  Sparkles, 
  DollarSign, 
  Camera, 
  Plus, 
  Trash2, 
  FileText, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { 
  EdgeType, 
  PerilesionalSkin, 
  ExudateAmount, 
  ExudateType, 
  ExudateOdor, 
  EvolutionSupplyItem, 
  WoundPhoto 
} from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { calculatePushToolScore } from '../../utils/schedulerUtils';

export const EvolutionFormModal: React.FC = () => {
  const { 
    isEvolutionModalOpen, 
    setIsEvolutionModalOpen, 
    patients, 
    supplies, 
    profile, 
    selectedPatient,
    selectedWound,
    addClinicalEvolution,
    addToast
  } = useApp();

  const [patientId, setPatientId] = useState<string>('');
  const [woundId, setWoundId] = useState<string>('');
  
  // Date & Responsible
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
  const [nurseName, setNurseName] = useState<string>(profile.name);
  const [nurseCoren, setNurseCoren] = useState<string>(profile.coren);

  // Measurements
  const [lengthCm, setLengthCm] = useState<number>(3.5);
  const [widthCm, setWidthCm] = useState<number>(2.5);
  const [depthCm, setDepthCm] = useState<number>(0.2);
  const [tunneling, setTunneling] = useState<string>('');

  // Tissue Bed Percentages (Granulation, Slough, Necrosis, Epithelialization)
  const [granulationPercent, setGranulationPercent] = useState<number>(70);
  const [sloughPercent, setSloughPercent] = useState<number>(20);
  const [necrosisPercent, setNecrosisPercent] = useState<number>(0);
  const [epithelializationPercent, setEpithelializationPercent] = useState<number>(10);

  // Edges & Perilesional
  const [edges, setEdges] = useState<EdgeType[]>(['integra']);
  const [perilesional, setPerilesional] = useState<PerilesionalSkin[]>(['integra']);

  // Exudate, Odor, Pain & Infection
  const [exudateAmount, setExudateAmount] = useState<ExudateAmount>('escasso');
  const [exudateType, setExudateType] = useState<ExudateType>('seroso');
  const [exudateOdor, setExudateOdor] = useState<ExudateOdor>('inodoro');
  const [painScoreEVA, setPainScoreEVA] = useState<number>(2);
  const [infectionSigns, setInfectionSigns] = useState<string[]>([]);

  // Conduct & Dressings
  const [cleansingSolution, setCleansingSolution] = useState<string>('Solução de PHMB 0.1% e remoção de biofilme');
  const [debridementType, setDebridementType] = useState<'nenhum' | 'autolitico' | 'enzimatico' | 'instrumental_conservador' | 'mecanico'>('autolitico');
  const [adjuvantTherapy, setAdjuvantTherapy] = useState<string>('Terapia Compressiva (Bota de Unna)');
  const [laserDoseJoules, setLaserDoseJoules] = useState<number>(0);
  const [primaryDressing, setPrimaryDressing] = useState<string>('Espuma de Poliuretano com Silicone e Prata (Mepilex Ag)');
  const [secondaryDressing, setSecondaryDressing] = useState<string>('Bota de Unna e atadura elástica compressiva');

  // Supplies used list
  const [suppliesUsed, setSuppliesUsed] = useState<EvolutionSupplyItem[]>([]);
  const [selectedSupplyToAdd, setSelectedSupplyToAdd] = useState<string>('');
  const [supplyQtyToAdd, setSupplyQtyToAdd] = useState<number>(1);

  // Financial
  const [consultationFee, setConsultationFee] = useState<number>(profile.defaultConsultationFee);
  const [travelFee, setTravelFee] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'convenio_reembolso'>('pix');
  const [paymentStatus, setPaymentStatus] = useState<'pago' | 'pendente' | 'faturado'>('pago');

  // Photographic record
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoStage, setPhotoStage] = useState<'antes' | 'durante' | 'depois'>('durante');
  const [photoNotes, setPhotoNotes] = useState<string>('');
  const [attachedPhotos, setAttachedPhotos] = useState<WoundPhoto[]>([]);

  // Clinical Observations & Patient Guidelines
  const [clinicalObservations, setClinicalObservations] = useState<string>('Leito com evolução favorável e proliferação de tecido de granulação avermelhado brilhante. Bordas aderidas sem sinais de infecção ativa.');
  const [patientInstructions, setPatientInstructions] = useState<string>('Manter o curativo seco e protegido no banho. Elevar os membros inferiores ao repousar por 30 minutos 3x ao dia.');
  const [nextSessionRecommendedDate, setNextSessionRecommendedDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Active Tab inside Evolution Form
  const [formSection, setFormSection] = useState<'anamnese' | 'leito' | 'conduta' | 'insumos_financeiro' | 'fotos'>('anamnese');

  // Initialize from props/context
  useEffect(() => {
    if (selectedPatient) {
      setPatientId(selectedPatient.id);
      if (selectedPatient.wounds && selectedPatient.wounds.length > 0) {
        setWoundId(selectedPatient.wounds[0].id);
      }
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
      if (patients[0].wounds && patients[0].wounds.length > 0) {
        setWoundId(patients[0].wounds[0].id);
      }
    }
    if (selectedWound) {
      setWoundId(selectedWound.id);
    }
  }, [selectedPatient, selectedWound, patients, isEvolutionModalOpen]);

  if (!isEvolutionModalOpen) return null;

  // Selected Patient's wounds
  const currentPatient = patients.find((p) => p.id === patientId);
  const currentWounds = currentPatient?.wounds || [];
  const currentWound = currentWounds.find((w) => w.id === woundId);

  // Calculated area in cm2
  const areaCm2 = Math.round((lengthCm * widthCm) * 100) / 100;
  
  // Supplies Total
  const suppliesTotal = suppliesUsed.reduce((acc, item) => acc + item.subtotal, 0);
  const totalSessionFee = consultationFee + suppliesTotal + travelFee;

  // Tissue total sum
  const tissueTotal = granulationPercent + sloughPercent + necrosisPercent + epithelializationPercent;

  // Compute PUSH score live
  let predominantTissue: 'necrose' | 'esfacelo' | 'granulacao' | 'epitelizacao' | 'fechada' = 'granulacao';
  if (necrosisPercent > 0) predominantTissue = 'necrose';
  else if (sloughPercent > 20) predominantTissue = 'esfacelo';
  else if (granulationPercent >= 50) predominantTissue = 'granulacao';
  else if (epithelializationPercent >= 50) predominantTissue = 'epitelizacao';

  const livePushScore = calculatePushToolScore(areaCm2, exudateAmount, predominantTissue);

  // Add Supply Handler
  const handleAddSupply = () => {
    if (!selectedSupplyToAdd) return;
    const supply = supplies.find((s) => s.id === selectedSupplyToAdd);
    if (!supply) return;

    if (supply.currentStock < supplyQtyToAdd) {
      addToast({
        type: 'warning',
        title: 'Estoque Baixo',
        message: `Atenção: Estoque atual (${supply.currentStock} ${supply.unit}) é inferior à quantidade solicitada.`,
      });
    }

    const existingIndex = suppliesUsed.findIndex((s) => s.supplyId === supply.id);
    if (existingIndex >= 0) {
      const updated = [...suppliesUsed];
      updated[existingIndex].quantityUsed += supplyQtyToAdd;
      updated[existingIndex].subtotal = updated[existingIndex].quantityUsed * updated[existingIndex].unitPrice;
      setSuppliesUsed(updated);
    } else {
      const newItem: EvolutionSupplyItem = {
        supplyId: supply.id,
        name: supply.name,
        unit: supply.unit,
        quantityUsed: supplyQtyToAdd,
        unitPrice: supply.sellPrice,
        subtotal: supplyQtyToAdd * supply.sellPrice,
      };
      setSuppliesUsed([...suppliesUsed, newItem]);
    }
    setSelectedSupplyToAdd('');
    setSupplyQtyToAdd(1);
  };

  const handleRemoveSupply = (supplyId: string) => {
    setSuppliesUsed(suppliesUsed.filter((s) => s.supplyId !== supplyId));
  };

  // Add Photo Handler
  const handleAddPhoto = () => {
    if (!photoUrl) {
      // Mock fallback realistic photo if user doesn't paste a URL
      const samplePhotos = [
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80',
      ];
      const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
      const newP: WoundPhoto = {
        id: `pho-${Date.now()}`,
        url: randomPhoto,
        date,
        stageTag: photoStage,
        areaCm2,
        tissueGranulationPercent: granulationPercent,
        notes: photoNotes || `Registro fotográfico (${photoStage}) - Área: ${areaCm2} cm²`,
      };
      setAttachedPhotos([...attachedPhotos, newP]);
      setPhotoNotes('');
      return;
    }

    const newPhoto: WoundPhoto = {
      id: `pho-${Date.now()}`,
      url: photoUrl,
      date,
      stageTag: photoStage,
      areaCm2,
      tissueGranulationPercent: granulationPercent,
      notes: photoNotes,
    };
    setAttachedPhotos([...attachedPhotos, newPhoto]);
    setPhotoUrl('');
    setPhotoNotes('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        const newPhoto: WoundPhoto = {
          id: `pho-${Date.now()}`,
          url: resultUrl,
          date,
          stageTag: photoStage,
          areaCm2,
          tissueGranulationPercent: granulationPercent,
          notes: photoNotes || `Foto clínica carregada em ${date}`,
        };
        setAttachedPhotos([...attachedPhotos, newPhoto]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle multi-select tags
  const toggleEdge = (edge: EdgeType) => {
    if (edges.includes(edge)) {
      setEdges(edges.filter((e) => e !== edge));
    } else {
      setEdges([...edges, edge]);
    }
  };

  const togglePerilesional = (skin: PerilesionalSkin) => {
    if (perilesional.includes(skin)) {
      setPerilesional(perilesional.filter((s) => s !== skin));
    } else {
      setPerilesional([...perilesional, skin]);
    }
  };

  const toggleInfectionSign = (sign: string) => {
    if (infectionSigns.includes(sign)) {
      setInfectionSigns(infectionSigns.filter((s) => s !== sign));
    } else {
      setInfectionSigns([...infectionSigns, sign]);
    }
  };

  // Save Evolution Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!woundId) {
      addToast({
        type: 'error',
        title: 'Lesão Obrigatória',
        message: 'Selecione ou cadastre uma lesão para registrar a evolução.',
      });
      return;
    }

    addClinicalEvolution(woundId, {
      woundId,
      patientId,
      date,
      time,
      nurseName,
      nurseCoren,
      lengthCm,
      widthCm,
      depthCm,
      areaCm2,
      tunneling,
      granulationPercent,
      sloughPercent,
      necrosisPercent,
      epithelializationPercent,
      edges,
      perilesional,
      exudateAmount,
      exudateType,
      exudateOdor,
      painScoreEVA,
      infectionSigns,
      cleansingSolution,
      debridementType,
      adjuvantTherapy,
      laserDoseJoules: laserDoseJoules > 0 ? laserDoseJoules : undefined,
      primaryDressing,
      secondaryDressing,
      suppliesUsed,
      consultationFee,
      suppliesTotalFee: suppliesTotal,
      travelFee,
      totalSessionFee,
      paymentMethod,
      paymentStatus,
      photos: attachedPhotos,
      clinicalObservations,
      patientInstructions,
      nextSessionRecommendedDate,
      pushToolScore: livePushScore,
    });

    setIsEvolutionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0f172a] text-slate-100 rounded-2xl shadow-2xl border border-slate-800 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Ficha de Evolução Clínica de Feridas
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Estomaterapia
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Registro minucioso de dimensões, tecidos, exsudato, insumos e condutas
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEvolutionModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-900/80 border-b border-slate-800 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setFormSection('anamnese')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              formSection === 'anamnese' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>1. Paciente & Medidas</span>
          </button>
          <button
            type="button"
            onClick={() => setFormSection('leito')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              formSection === 'leito' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Leito, Tecidos & Exsudato</span>
          </button>
          <button
            type="button"
            onClick={() => setFormSection('conduta')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              formSection === 'conduta' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Condutas & Coberturas</span>
          </button>
          <button
            type="button"
            onClick={() => setFormSection('insumos_financeiro')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              formSection === 'insumos_financeiro' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>4. Insumos & Custos</span>
          </button>
          <button
            type="button"
            onClick={() => setFormSection('fotos')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              formSection === 'fotos' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>5. Fotos & Orientações</span>
            {attachedPhotos.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                {attachedPhotos.length}
              </span>
            )}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: PACIENTE & MEDIDAS */}
          {formSection === 'anamnese' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Patient and Wound selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Paciente *
                  </label>
                  <select
                    value={patientId}
                    onChange={(e) => {
                      setPatientId(e.target.value);
                      const p = patients.find((pat) => pat.id === e.target.value);
                      if (p?.wounds && p.wounds.length > 0) {
                        setWoundId(p.wounds[0].id);
                      } else {
                        setWoundId('');
                      }
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (CPF: {p.cpf})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Lesão / Ferida Ativa *
                  </label>
                  {currentWounds.length > 0 ? (
                    <select
                      value={woundId}
                      onChange={(e) => setWoundId(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    >
                      {currentWounds.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.title} ({w.anatomicalLocation})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2 text-xs text-amber-300 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      Nenhuma lesão cadastrada para este paciente. Cadastre uma lesão no prontuário primeiro.
                    </div>
                  )}
                </div>
              </div>

              {/* Date, Time & Nurse */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Data da Sessão</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Horário</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Enfermeiro(a) / COREN</label>
                  <input
                    type="text"
                    value={`${nurseName} - ${nurseCoren}`}
                    readOnly
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-800 bg-slate-950 text-slate-400"
                  />
                </div>
              </div>

              {/* Wound Metric Measurements */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-400" />
                    Mensuração Linear & Área da Ferida
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg">
                    Área Calculada: <strong className="text-white font-bold">{areaCm2} cm²</strong>
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Comprimento (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={lengthCm}
                      onChange={(e) => setLengthCm(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Largura (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={widthCm}
                      onChange={(e) => setWidthCm(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Profundidade (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={depthCm}
                      onChange={(e) => setDepthCm(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Volume Estimado (cm³)</label>
                    <div className="px-3 py-2 text-sm font-bold text-slate-200 bg-slate-900 rounded-lg border border-slate-800">
                      {Math.round(areaCm2 * depthCm * 100) / 100} cm³
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Descolamento / Túnel / Fístula (se houver)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Descolamento de 1.5 cm entre 12h e 3h do relógio"
                    value={tunneling}
                    onChange={(e) => setTunneling(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder-slate-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: LEITO, TECIDOS & EXSUDATO */}
          {formSection === 'leito' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Tissue Bed Distribution */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Distribuição Tecidual do Leito da Ferida
                  </h3>
                  <div className={`text-xs font-bold px-2 py-0.5 rounded ${
                    tissueTotal === 100 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    Total: {tissueTotal}% {tissueTotal !== 100 && '(Ajuste para somar 100%)'}
                  </div>
                </div>

                {/* Visual Stacked Progress Bar */}
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div style={{ width: `${granulationPercent}%` }} className="bg-red-500 transition-all duration-300" title={`Granulação: ${granulationPercent}%`} />
                  <div style={{ width: `${sloughPercent}%` }} className="bg-amber-400 transition-all duration-300" title={`Esfacelo: ${sloughPercent}%`} />
                  <div style={{ width: `${necrosisPercent}%` }} className="bg-slate-700 transition-all duration-300" title={`Necrose: ${necrosisPercent}%`} />
                  <div style={{ width: `${epithelializationPercent}%` }} className="bg-pink-400 transition-all duration-300" title={`Epitelização: ${epithelializationPercent}%`} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Granulação */}
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="flex justify-between items-center text-xs font-semibold text-red-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                        Granulação (%)
                      </span>
                      <span className="font-bold">{granulationPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={granulationPercent}
                      onChange={(e) => setGranulationPercent(parseInt(e.target.value) || 0)}
                      className="w-full accent-red-500"
                    />
                  </div>

                  {/* Esfacelo */}
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <div className="flex justify-between items-center text-xs font-semibold text-amber-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                        Esfacelo (%)
                      </span>
                      <span className="font-bold">{sloughPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={sloughPercent}
                      onChange={(e) => setSloughPercent(parseInt(e.target.value) || 0)}
                      className="w-full accent-amber-400"
                    />
                  </div>

                  {/* Necrose */}
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
                        Necrose (%)
                      </span>
                      <span className="font-bold">{necrosisPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={necrosisPercent}
                      onChange={(e) => setNecrosisPercent(parseInt(e.target.value) || 0)}
                      className="w-full accent-slate-400"
                    />
                  </div>

                  {/* Epitelização */}
                  <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                    <div className="flex justify-between items-center text-xs font-semibold text-pink-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block" />
                        Epitelização (%)
                      </span>
                      <span className="font-bold">{epithelializationPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={epithelializationPercent}
                      onChange={(e) => setEpithelializationPercent(parseInt(e.target.value) || 0)}
                      className="w-full accent-pink-400"
                    />
                  </div>
                </div>
              </div>

              {/* Bordas & Pele Perilesional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Características das Bordas
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'integra', label: 'Íntegras / Aderidas' },
                      { id: 'macerada', label: 'Maceradas' },
                      { id: 'hiperqueratotica', label: 'Hiperqueratóticas / Calosas' },
                      { id: 'solapada', label: 'Solapadas' },
                      { id: 'desvitalizada', label: 'Desvitalizadas / Irregulares' },
                    ].map((b) => (
                      <button
                        type="button"
                        key={b.id}
                        onClick={() => toggleEdge(b.id as EdgeType)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                          edges.includes(b.id as EdgeType)
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-semibold'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Pele Perilesional
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'integra', label: 'Íntegra / Hidratada' },
                      { id: 'eritematosa', label: 'Eritematosa / Inflamada' },
                      { id: 'edemaciada', label: 'Edemaciada' },
                      { id: 'descamativa', label: 'Descamativa / Ressecada' },
                      { id: 'hiperpigmentada', label: 'Hiperpigmentada (Dermatite Ocre)' },
                      { id: 'macerada', label: 'Macerada por Exsudato' },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => togglePerilesional(p.id as PerilesionalSkin)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                          perilesional.includes(p.id as PerilesionalSkin)
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-semibold'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exudate, Odor & EVA Pain */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Exsudato, Odor e Escala Visual de Dor (EVA)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Quantidade de Exsudato</label>
                    <select
                      value={exudateAmount}
                      onChange={(e) => setExudateAmount(e.target.value as ExudateAmount)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ausente">Ausente</option>
                      <option value="escasso">Escasso</option>
                      <option value="moderado">Moderado</option>
                      <option value="abundante">Abundante</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Aspecto / Tipo</label>
                    <select
                      value={exudateType}
                      onChange={(e) => setExudateType(e.target.value as ExudateType)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="seroso">Seroso (Claro/Amarelado)</option>
                      <option value="serohematico">Sero-hemático</option>
                      <option value="hematico">Hemático (Sanguíneo)</option>
                      <option value="purulento">Purulento (Espesso/Opaco)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Odor</label>
                    <select
                      value={exudateOdor}
                      onChange={(e) => setExudateOdor(e.target.value as ExudateOdor)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="inodoro">Inodoro</option>
                      <option value="caracteristico">Característico</option>
                      <option value="fetido">Fétido / Pútrido</option>
                    </select>
                  </div>
                </div>

                {/* Pain Slider EVA */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                    <span>Escala Visual Analógica de Dor (EVA 0 a 10):</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      painScoreEVA === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      painScoreEVA <= 3 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      painScoreEVA <= 7 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {painScoreEVA} - {painScoreEVA === 0 ? 'Sem Dor' : painScoreEVA <= 3 ? 'Dor Leve' : painScoreEVA <= 7 ? 'Dor Moderada' : 'Dor Intensa'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={painScoreEVA}
                    onChange={(e) => setPainScoreEVA(parseInt(e.target.value) || 0)}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* Infection & Biofilm Checklist */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    Sinais de Infecção Local / Biofilme Suspeito
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Calor local aumentado',
                      'Rubor perilesional > 2cm',
                      'Edema importante',
                      'Exsudato purulento / fétido',
                      'Dor acentuada recente',
                      'Biofilme brilhante e gelatinoso',
                      'Febre sistêmica',
                    ].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleInfectionSign(s)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                          infectionSigns.includes(s)
                            ? 'bg-red-500/20 border-red-500/50 text-red-300 font-semibold'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: CONDUTAS & COBERTURAS */}
          {formSection === 'conduta' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Solução de Limpeza e Antissepsia
                  </label>
                  <select
                    value={cleansingSolution}
                    onChange={(e) => setCleansingSolution(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Solução de PHMB 0.1% e remoção de biofilme">Solução com PHMB 0.1% + Betaína (Prontosan / Polihexanida)</option>
                    <option value="Soro Fisiológico 0.9% morno sob pressão de seringa 20ml">Soro Fisiológico 0.9% morno sob irrigação</option>
                    <option value="Água purificada estéril">Água purificada estéril</option>
                    <option value="Sabonete neutro medicinal + água corrente">Higienização com sabonete neutro (estomias)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Tipo de Desbridamento Realizado
                  </label>
                  <select
                    value={debridementType}
                    onChange={(e) => setDebridementType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="nenhum">Nenhum desbridamento necessário</option>
                    <option value="autolitico">Desbridamento Autolítico (Hidrogel / Cobertura)</option>
                    <option value="instrumental_conservador">Desbridamento Instrumental Conservador (Bisturi/Tesoura/Pinça)</option>
                    <option value="enzimatico">Desbridamento Enzimático (Colagenase / Papaína)</option>
                    <option value="mecanico">Desbridamento Mecânico suave com gaze</option>
                  </select>
                </div>
              </div>

              {/* Coberturas Primária e Secundária */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Cobertura Primária (Contato Direto c/ Leito) *
                  </label>
                  <input
                    type="text"
                    value={primaryDressing}
                    onChange={(e) => setPrimaryDressing(e.target.value)}
                    placeholder="Ex: Espuma com Silicone e Prata, Alginato de Cálcio, Hidrogel..."
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Cobertura Secundária & Fixação *
                  </label>
                  <input
                    type="text"
                    value={secondaryDressing}
                    onChange={(e) => setSecondaryDressing(e.target.value)}
                    placeholder="Ex: Gaze estéril, Bota de Unna, Filme Transparente, Atadura..."
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Terapias Adjuvantes (Laser, Bota de Unna, TPN) */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Terapias Avançadas & Adjuvantes
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Terapia Adjuvante</label>
                    <input
                      type="text"
                      value={adjuvantTherapy}
                      onChange={(e) => setAdjuvantTherapy(e.target.value)}
                      placeholder="Ex: Laserterapia, Terapia Compressiva Inelástica, TPN..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Dose de Laserterapia (se aplicada)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={laserDoseJoules}
                        onChange={(e) => setLaserDoseJoules(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-24 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                      />
                      <span className="text-xs text-slate-400">Joules / ponto (660nm Vermelho ou 808nm Infravermelho)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: INSUMOS & CUSTOS FINANCEIROS */}
          {formSection === 'insumos_financeiro' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Add Supplies Used from Inventory */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Insumos & Curativos Utilizados do Estoque</span>
                  <span className="text-[11px] text-blue-400 font-medium">Baixa automática no inventário</span>
                </h4>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedSupplyToAdd}
                    onChange={(e) => setSelectedSupplyToAdd(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um insumo do catálogo...</option>
                    {supplies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.unit}) - {formatCurrency(s.sellPrice)} [Disp: {s.currentStock}]
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={supplyQtyToAdd}
                      onChange={(e) => setSupplyQtyToAdd(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddSupply}
                      disabled={!selectedSupplyToAdd}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Table of items added */}
                {suppliesUsed.length > 0 ? (
                  <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden mt-3">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Item</th>
                          <th className="p-2.5">Qtd</th>
                          <th className="p-2.5">Preço Unit.</th>
                          <th className="p-2.5">Subtotal</th>
                          <th className="p-2.5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {suppliesUsed.map((item) => (
                          <tr key={item.supplyId} className="hover:bg-slate-800/40">
                            <td className="p-2.5 font-medium text-slate-200">{item.name}</td>
                            <td className="p-2.5 text-slate-400">{item.quantityUsed} {item.unit}</td>
                            <td className="p-2.5 text-slate-400">{formatCurrency(item.unitPrice)}</td>
                            <td className="p-2.5 font-semibold text-slate-100">{formatCurrency(item.subtotal)}</td>
                            <td className="p-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSupply(item.supplyId)}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Nenhum insumo extra adicionado à cobrança.</p>
                )}
              </div>

              {/* Billing Summary */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  Detalhamento Financeiro da Sessão
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Honorários da Consulta / Curativo</label>
                    <input
                      type="number"
                      step="5"
                      min="0"
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Total de Insumos Cobrados</label>
                    <div className="px-3 py-2 text-sm font-bold text-slate-200 bg-slate-900 rounded-lg border border-slate-800">
                      {formatCurrency(suppliesTotal)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Taxa de Deslocamento Domiciliar</label>
                    <input
                      type="number"
                      step="5"
                      min="0"
                      value={travelFee}
                      onChange={(e) => setTravelFee(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-800 gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Forma de Pagamento</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                      >
                        <option value="pix">PIX</option>
                        <option value="cartao_credito">Cartão de Crédito</option>
                        <option value="cartao_debito">Cartão de Débito</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="convenio_reembolso">Reembolso / Convênio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Status Pagamento</label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value as any)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 font-medium text-emerald-400"
                      >
                        <option value="pago">Pago</option>
                        <option value="pendente">Pendente</option>
                        <option value="faturado">Faturado</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Valor Total do Atendimento</span>
                    <span className="text-xl font-extrabold text-blue-400">{formatCurrency(totalSessionFee)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: FOTOS & ORIENTAÇÕES */}
          {formSection === 'fotos' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Photo Registration */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-400" />
                  Registro Fotográfico da Ferida (Antes / Durante / Depois)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">URL da Imagem ou Upload de Arquivo</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://... ou faça upload ao lado"
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500"
                      />
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1 border border-slate-700">
                        <span>Arquivo</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Etapa / Tag</label>
                    <select
                      value={photoStage}
                      onChange={(e) => setPhotoStage(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 font-medium"
                    >
                      <option value="antes">Antes do Curativo (Leito com Exsudato)</option>
                      <option value="durante">Durante / Após Limpeza</option>
                      <option value="depois">Depois / Cobertura Aplicada</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={photoNotes}
                    onChange={(e) => setPhotoNotes(e.target.value)}
                    placeholder="Observação da foto (ex: Leito limpo pós-PHMB, aspecto de granulação vivo)"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Anexar Foto
                  </button>
                </div>

                {/* Attached photos preview thumbnails */}
                {attachedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {attachedPhotos.map((photo) => (
                      <div key={photo.id} className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shadow-xs group">
                        <img
                          src={photo.url}
                          alt="Foto da lesão"
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-1.5 bg-slate-900 text-[10px]">
                          <span className="font-bold uppercase tracking-wider text-blue-400 block">{photo.stageTag}</span>
                          <span className="text-slate-400 truncate block">{photo.notes || `${photo.areaCm2} cm²`}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedPhotos(attachedPhotos.filter((p) => p.id !== photo.id))}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinical Observations and Patient Home Care Instructions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Parecer & Evolução de Enfermagem
                  </label>
                  <textarea
                    rows={3}
                    value={clinicalObservations}
                    onChange={(e) => setClinicalObservations(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Orientações e Cuidados Domiciliares para o Paciente / Cuidador
                  </label>
                  <textarea
                    rows={2}
                    value={patientInstructions}
                    onChange={(e) => setPatientInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Data Recomendada para o Próximo Curativo
                  </label>
                  <input
                    type="date"
                    value={nextSessionRecommendedDate}
                    onChange={(e) => setNextSessionRecommendedDate(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer with Actions and live Summary */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Área: {areaCm2} cm²</span>
              <span>•</span>
              <span className="font-semibold text-blue-400">Escore PUSH: {livePushScore} pts</span>
              <span>•</span>
              <span className="font-semibold text-emerald-400">{formatCurrency(totalSessionFee)}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsEvolutionModalOpen(false)}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={!woundId}
                className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                Salvar Evolução Clínica
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
