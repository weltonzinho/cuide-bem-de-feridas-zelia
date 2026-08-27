import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Layers, 
  HeartPulse, 
  ChevronRight, 
  TrendingDown, 
  FileText, 
  X,
  Calendar,
  ShieldAlert,
  Activity,
  PlusCircle,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Patient, Wound, LesionType, WoundStatus } from '../../types';
import { LESION_TYPE_LABELS, formatDateBR } from '../../utils/formatters';

export const PatientList: React.FC = () => {
  const { 
    patients, 
    addPatient, 
    addWoundToPatient, 
    updateWound,
    deleteWound,
    setSelectedPatient, 
    setSelectedWound, 
    setIsEvolutionModalOpen,
    setActiveTab,
    addToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState<boolean>(false);
  const [isNewWoundModalOpen, setIsNewWoundModalOpen] = useState<boolean>(false);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<Patient | null>(patients[0] || null);

  // Edit Wound State
  const [isEditWoundModalOpen, setIsEditWoundModalOpen] = useState<boolean>(false);
  const [editingWound, setEditingWound] = useState<Wound | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editLesionType, setEditLesionType] = useState<LesionType>('ulcera_venosa');
  const [editAnatomicalLocation, setEditAnatomicalLocation] = useState<string>('');
  const [editEtiology, setEditEtiology] = useState<string>('');
  const [editStartDate, setEditStartDate] = useState<string>('');
  const [editStatus, setEditStatus] = useState<WoundStatus>('em_tratamento');
  const [editInitialAreaCm2, setEditInitialAreaCm2] = useState<number>(0);
  const [editCurrentAreaCm2, setEditCurrentAreaCm2] = useState<number>(0);

  // Delete Wound State
  const [isDeleteWoundModalOpen, setIsDeleteWoundModalOpen] = useState<boolean>(false);
  const [woundToDelete, setWoundToDelete] = useState<Wound | null>(null);

  // New Patient Form State
  const [name, setName] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('1965-05-15');
  const [gender, setGender] = useState<'M' | 'F' | 'Outro'>('F');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [city, setCity] = useState<string>('São Paulo');
  const [state, setState] = useState<string>('SP');
  const [cep, setCep] = useState<string>('');
  const [estimatedTravelMinutes, setEstimatedTravelMinutes] = useState<number>(20);
  const [comorbiditiesInput, setComorbiditiesInput] = useState<string>('Diabetes Mellitus, Hipertensão Arterial');
  const [allergiesInput, setAllergiesInput] = useState<string>('Sem alergias conhecidas');
  const [mobilityStatus, setMobilityStatus] = useState<'deambulante' | 'deambulante_com_apoio' | 'cadeirante' | 'acamado'>('deambulante');
  const [nutritionalStatus, setNutritionalStatus] = useState<'eutrofico' | 'desnutrido' | 'sobrepeso' | 'obeso'>('eutrofico');

  // New Wound Form State (for selected patient)
  const [woundTitle, setWoundTitle] = useState<string>('');
  const [lesionType, setLesionType] = useState<any>('ulcera_venosa');
  const [anatomicalLocation, setAnatomicalLocation] = useState<string>('');
  const [etiology, setEtiology] = useState<string>('');
  const [initialLength, setInitialLength] = useState<number>(4.0);
  const [initialWidth, setInitialWidth] = useState<number>(3.0);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Keep selected patient in sync with context
  const currentSelectedPatient = patients.find((p) => p.id === selectedPatientForDetail?.id) || patients[0] || null;

  const filteredPatients = patients.filter((p) => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.cpf.includes(searchTerm) ||
           p.phone.includes(searchTerm);
  });

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpf) return;

    const comorbidities = comorbiditiesInput.split(',').map((c) => c.trim()).filter(Boolean);
    const allergies = allergiesInput.split(',').map((a) => a.trim()).filter(Boolean);

    const newP = addPatient({
      name,
      cpf,
      birthDate,
      gender,
      phone,
      email,
      address: {
        street,
        number,
        neighborhood,
        city,
        state,
        cep,
        estimatedTravelMinutes,
      },
      comorbidities,
      allergies,
      mobilityStatus,
      nutritionalStatus,
    });

    setSelectedPatientForDetail(newP);
    setIsNewPatientModalOpen(false);
  };

  const handleSaveWound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedPatient || !woundTitle) return;

    const initialArea = Math.round((initialLength * initialWidth) * 100) / 100;

    addWoundToPatient(currentSelectedPatient.id, {
      patientId: currentSelectedPatient.id,
      patientName: currentSelectedPatient.name,
      title: woundTitle,
      lesionType,
      anatomicalLocation,
      etiology,
      startDate,
      status: 'em_tratamento',
      initialAreaCm2: initialArea,
    });

    setIsNewWoundModalOpen(false);
    setWoundTitle('');
    setAnatomicalLocation('');
  };

  const handleOpenEditWoundModal = (wound: Wound) => {
    setEditingWound(wound);
    setEditTitle(wound.title);
    setEditLesionType(wound.lesionType);
    setEditAnatomicalLocation(wound.anatomicalLocation);
    setEditEtiology(wound.etiology || '');
    setEditStartDate(wound.startDate || '');
    setEditStatus(wound.status);
    setEditInitialAreaCm2(wound.initialAreaCm2);
    setEditCurrentAreaCm2(wound.currentAreaCm2);
    setIsEditWoundModalOpen(true);
  };

  const handleSaveEditWound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedPatient || !editingWound || !editTitle) return;

    const updated: Wound = {
      ...editingWound,
      title: editTitle,
      lesionType: editLesionType,
      anatomicalLocation: editAnatomicalLocation,
      etiology: editEtiology,
      startDate: editStartDate,
      status: editStatus,
      initialAreaCm2: Number(editInitialAreaCm2) || editingWound.initialAreaCm2,
      currentAreaCm2: Number(editCurrentAreaCm2) >= 0 ? Number(editCurrentAreaCm2) : editingWound.currentAreaCm2,
    };

    updateWound(currentSelectedPatient.id, updated);
    setIsEditWoundModalOpen(false);
    setEditingWound(null);
  };

  const handleOpenDeleteWoundModal = (wound: Wound) => {
    setWoundToDelete(wound);
    setIsDeleteWoundModalOpen(true);
  };

  const handleConfirmDeleteWound = () => {
    if (!currentSelectedPatient || !woundToDelete) return;
    deleteWound(currentSelectedPatient.id, woundToDelete.id);
    setIsDeleteWoundModalOpen(false);
    setWoundToDelete(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: PATIENT DIRECTORY */}
      <div className="lg:col-span-5 space-y-4">
        {/* Header and Add button */}
        <div className="bg-[#0f172a] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Pacientes & Prontuários</h2>
            </div>

            <button
              onClick={() => setIsNewPatientModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Paciente</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Patient Cards List */}
        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {filteredPatients.map((patient) => {
            const isSelected = selectedPatientForDetail?.id === patient.id;
            const activeWoundsCount = patient.wounds.filter((w) => w.status === 'em_tratamento').length;

            return (
              <div
                key={patient.id}
                onClick={() => setSelectedPatientForDetail(patient)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xl ${
                  isSelected
                    ? 'bg-blue-950/30 border-blue-500/60 ring-1 ring-blue-500/20'
                    : 'bg-[#0f172a] border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{patient.name}</h3>
                    <span className="text-[11px] text-slate-400 block font-mono">CPF: {patient.cpf}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    activeWoundsCount > 0 ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {activeWoundsCount} lesão(ões)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2.5">
                  {patient.comorbidities.slice(0, 2).map((c, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-800">
                      {c}
                    </span>
                  ))}
                  {patient.comorbidities.length > 2 && (
                    <span className="text-[10px] text-slate-500 px-1 py-0.5">
                      +{patient.comorbidities.length - 2}
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {patient.phone}
                  </span>
                  <span className="capitalize font-medium text-slate-300">{patient.mobilityStatus}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: SELECTED PATIENT DOSSIER & WOUNDS */}
      <div className="lg:col-span-7 space-y-5">
        {currentSelectedPatient ? (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Patient Header Card */}
            <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{currentSelectedPatient.name}</h2>
                    <span className="text-xs font-semibold text-slate-400">
                      ({currentSelectedPatient.gender === 'F' ? 'Feminino' : 'Masculino'}, {formatDateBR(currentSelectedPatient.birthDate)})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {currentSelectedPatient.address.street}, {currentSelectedPatient.address.number} - {currentSelectedPatient.address.neighborhood}, {currentSelectedPatient.address.city}
                    </span>
                  </p>
                </div>

                <button
                  id="btn-add-wound"
                  onClick={() => setIsNewWoundModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-colors shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Cadastrar Lesão</span>
                </button>
              </div>

              {/* Comorbidities and Allergies Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-[#0a0f1d] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Comorbidades & Fatores Sistêmicos
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {currentSelectedPatient.comorbidities.map((c, idx) => (
                      <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-slate-200 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Alergias Documentadas
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {currentSelectedPatient.allergies.map((a, idx) => (
                      <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded border border-rose-500/30 text-rose-300 font-semibold">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Wounds List / History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Lesões Registradas no Prontuário ({currentSelectedPatient.wounds.length})
                </h3>
              </div>

              {currentSelectedPatient.wounds.length === 0 ? (
                <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-8 text-center space-y-2 shadow-xl">
                  <p className="text-xs text-slate-400">Nenhuma lesão ativa cadastrada para este paciente.</p>
                  <button
                    onClick={() => setIsNewWoundModalOpen(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20"
                  >
                    Cadastrar Primeira Lesão
                  </button>
                </div>
              ) : (
                currentSelectedPatient.wounds.map((wound) => (
                  <div
                    key={wound.id}
                    className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            LESION_TYPE_LABELS[wound.lesionType]?.bg || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {LESION_TYPE_LABELS[wound.lesionType]?.label || wound.lesionType}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            wound.status === 'cicatrizada'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : wound.status === 'estacionaria'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : wound.status === 'encaminhada'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}>
                            {wound.status === 'cicatrizada'
                              ? 'Cicatrizada'
                              : wound.status === 'estacionaria'
                              ? 'Estacionária'
                              : wound.status === 'encaminhada'
                              ? 'Encaminhada'
                              : 'Em Tratamento'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Início: {formatDateBR(wound.startDate)}</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1.5">{wound.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">{wound.anatomicalLocation}</p>
                        {wound.etiology && (
                          <p className="text-[11px] text-slate-500 mt-0.5 italic">Etiologia: {wound.etiology}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shrink-0">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 block">Regressão</span>
                          <span className="text-sm font-black text-emerald-300 flex items-center gap-1 font-mono">
                            <TrendingDown className="w-3.5 h-3.5" />
                            -{wound.healingProgressPercent}%
                          </span>
                        </div>
                        <div className="h-6 w-px bg-emerald-500/30 ml-1" />
                        <div className="text-[11px] text-emerald-300 font-bold ml-1 font-mono">
                          {wound.initialAreaCm2} cm² → {wound.currentAreaCm2} cm²
                        </div>
                      </div>
                    </div>

                    {/* Evolutions Summary List */}
                    <div className="p-3 bg-[#0a0f1d] rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300">Histórico de Sessões ({wound.evolutions.length} evoluções)</span>
                        <span className="text-blue-400 font-semibold font-mono">Última: {wound.evolutions[0]?.date ? formatDateBR(wound.evolutions[0].date) : 'N/D'}</span>
                      </div>

                      {wound.evolutions.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {wound.evolutions.slice(0, 3).map((evo) => (
                            <div key={evo.id} className="text-[11px] flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="font-semibold text-slate-200 font-mono">{formatDateBR(evo.date)} às {evo.time}</span>
                              <span className="text-slate-400 font-mono">Área: {evo.areaCm2} cm² | Granulação: {evo.granulationPercent}%</span>
                              <span className="font-bold text-blue-400 font-mono">EVA {evo.painScoreEVA}/10</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800">
                      {/* Left: Edit & Delete buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`btn-edit-wound-${wound.id}`}
                          onClick={() => handleOpenEditWoundModal(wound)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-blue-300 hover:text-blue-100 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
                          title="Editar / Corrigir dados da lesão no prontuário"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar Lesão</span>
                        </button>

                        <button
                          id={`btn-delete-wound-${wound.id}`}
                          onClick={() => handleOpenDeleteWoundModal(wound)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/30 flex items-center gap-1 transition-colors"
                          title="Apagar lesão do prontuário"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Apagar</span>
                        </button>
                      </div>

                      {/* Right: PDF and Evolution buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPatient(currentSelectedPatient);
                            setSelectedWound(wound);
                            setActiveTab('reports');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Gerar Relatório / PDF</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedPatient(currentSelectedPatient);
                            setSelectedWound(wound);
                            setIsEvolutionModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/20 transition-colors"
                        >
                          <HeartPulse className="w-3.5 h-3.5" />
                          <span>Registrar Nova Evolução</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-12 text-center text-slate-400 shadow-xl">
            Selecione um paciente na lista para ver o prontuário.
          </div>
        )}
      </div>

      {/* MODAL: NOVO PACIENTE */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white">Cadastrar Novo Paciente</h2>
                  <p className="text-xs text-slate-400">Dados cadastrais, comorbidades e endereço para visitas</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewPatientModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">CPF *</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Data Nascimento</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gênero</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  >
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="p-3 bg-[#0a0f1d] rounded-xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Endereço para Atendimento Domiciliar
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Rua / Avenida"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Número"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                  />
                  <input
                    type="number"
                    value={estimatedTravelMinutes}
                    onChange={(e) => setEstimatedTravelMinutes(parseInt(e.target.value) || 20)}
                    placeholder="Tempo trânsito (min)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Comorbidities */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Comorbidades (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={comorbiditiesInput}
                  onChange={(e) => setComorbiditiesInput(e.target.value)}
                  placeholder="Ex: Diabetes Mellitus tipo 2, HAS, Insuficiência Venosa"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Alergias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                  placeholder="Ex: Neomicina, Iodopovidona, Látex"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-colors"
                >
                  Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVA LESÃO */}
      {isNewWoundModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white">Cadastrar Nova Lesão</h2>
                  <p className="text-xs text-slate-400">Prontuário de {currentSelectedPatient?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewWoundModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWound} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título / Identificação da Lesão *</label>
                <input
                  type="text"
                  value={woundTitle}
                  onChange={(e) => setWoundTitle(e.target.value)}
                  placeholder="Ex: Úlcera Venosa em Maléolo Medial D"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Lesão *</label>
                  <select
                    value={lesionType}
                    onChange={(e) => setLesionType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  >
                    {Object.entries(LESION_TYPE_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Data de Início / Avaliação</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Localização Anatômica *</label>
                <input
                  type="text"
                  value={anatomicalLocation}
                  onChange={(e) => setAnatomicalLocation(e.target.value)}
                  placeholder="Ex: Região sacrococcígea central, Calcâneo E, Abdome FID"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Etiologia / Fisiopatologia</label>
                <input
                  type="text"
                  value={etiology}
                  onChange={(e) => setEtiology(e.target.value)}
                  placeholder="Ex: Hipertensão venosa crônica, cisalhamento por imobilidade..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Comprimento Inicial (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={initialLength}
                    onChange={(e) => setInitialLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Largura Inicial (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={initialWidth}
                    onChange={(e) => setInitialWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewWoundModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-colors"
                >
                  Cadastrar Lesão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR / CORRIGIR LESÃO */}
      {isEditWoundModalOpen && editingWound && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white">Editar / Corrigir Dados da Lesão</h2>
                  <p className="text-xs text-slate-400">Prontuário de {currentSelectedPatient?.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditWoundModalOpen(false);
                  setEditingWound(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditWound} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título / Identificação da Lesão *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Ex: Úlcera Venosa em Maléolo Medial D"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Lesão *</label>
                  <select
                    value={editLesionType}
                    onChange={(e) => setEditLesionType(e.target.value as LesionType)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  >
                    {Object.entries(LESION_TYPE_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status Clínico Atual *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as WoundStatus)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  >
                    <option value="em_tratamento">Em Tratamento Ativo</option>
                    <option value="cicatrizada">Cicatrizada / Epitelizada</option>
                    <option value="estacionaria">Estacionária</option>
                    <option value="encaminhada">Encaminhada a Especialista</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Localização Anatômica *</label>
                <input
                  type="text"
                  value={editAnatomicalLocation}
                  onChange={(e) => setEditAnatomicalLocation(e.target.value)}
                  placeholder="Ex: Região sacrococcígea central, Calcâneo E"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Etiologia / Fisiopatologia</label>
                <input
                  type="text"
                  value={editEtiology}
                  onChange={(e) => setEditEtiology(e.target.value)}
                  placeholder="Ex: Insuficiência venosa crônica CEAP C6"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Data de Início / Admissão</label>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#0a0f1d] rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Área Inicial (cm²)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editInitialAreaCm2}
                    onChange={(e) => setEditInitialAreaCm2(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Área Atual (cm²)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editCurrentAreaCm2}
                    onChange={(e) => setEditCurrentAreaCm2(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditWoundModalOpen(false);
                    setEditingWound(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR EXCLUSÃO DE LESÃO */}
      {isDeleteWoundModalOpen && woundToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-rose-500/30 max-w-md w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-rose-950/40 border-b border-rose-500/20 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-white">Excluir Lesão do Prontuário</h2>
                <p className="text-xs text-rose-300">Confirmação de exclusão permanente</p>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300">
              <p>
                Tem certeza que deseja apagar a lesão <strong className="text-white">"{woundToDelete.title}"</strong> ({woundToDelete.anatomicalLocation}) do prontuário de <strong className="text-white">{currentSelectedPatient?.name}</strong>?
              </p>

              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1 text-rose-200">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Atenção: Ação Irreversível</span>
                </p>
                <p className="text-[11px] text-rose-300/80">
                  Esta ação removerá o cadastro da lesão e todo o histórico de <strong>{woundToDelete.evolutions.length} evolução(ões) clínica(s)</strong> vinculadas a ela.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteWoundModalOpen(false);
                    setWoundToDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirm-delete-wound"
                  type="button"
                  onClick={handleConfirmDeleteWound}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sim, Apagar Lesão</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
