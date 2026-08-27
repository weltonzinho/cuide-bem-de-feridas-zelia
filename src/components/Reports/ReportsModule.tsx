import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Printer, 
  Download, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  User, 
  Layers, 
  Ruler, 
  HeartPulse, 
  Sparkles,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  QrCode,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDateBR } from '../../utils/formatters';
import { 
  generateClinicalVectorPdf, 
  generateFinancialVectorPdf, 
  printElementDirectly 
} from '../../utils/pdfExport';

export const ReportsModule: React.FC = () => {
  const { patients, profile, currentNurse, supplies, selectedPatient, selectedWound, appointments, addToast } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<'clinical' | 'financial'>('clinical');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const [reportPatientId, setReportPatientId] = useState<string>(
    selectedPatient?.id || (patients.length > 0 ? patients[0].id : '')
  );

  const currentPatient = patients.find((p) => p.id === reportPatientId) || patients[0];
  const [reportWoundId, setReportWoundId] = useState<string>(
    selectedWound?.id || currentPatient?.wounds[0]?.id || ''
  );
  const currentWound = currentPatient?.wounds.find((w) => w.id === reportWoundId) || currentPatient?.wounds[0];

  // Financial Metrics Calculation from all patients' wound evolutions
  const allEvolutions = patients.flatMap((p) =>
    p.wounds.flatMap((w) => w.evolutions.map((e) => ({ ...e, patientName: p.name, woundTitle: w.title })))
  );

  const totalConsultationFees = allEvolutions.reduce((acc, e) => acc + (e.consultationFee || 0), 0);
  const totalSuppliesFees = allEvolutions.reduce((acc, e) => acc + (e.suppliesTotalFee || 0), 0);
  const totalTravelFees = allEvolutions.reduce((acc, e) => acc + (e.travelFee || 0), 0);
  const grossRevenue = totalConsultationFees + totalSuppliesFees + totalTravelFees;
  const averageTicket = allEvolutions.length > 0 ? grossRevenue / allEvolutions.length : 0;

  const currentElementId = selectedReportType === 'clinical' ? 'clinical-report-content' : 'financial-report-content';

  const handlePrint = () => {
    setIsPrinting(true);
    const title = selectedReportType === 'clinical' 
      ? `Laudo Clínico - ${currentPatient?.name || 'Paciente'}` 
      : 'Extrato Financeiro e Faturamento';
    
    printElementDirectly(currentElementId, title);
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      if (selectedReportType === 'clinical') {
        if (!currentPatient || !currentWound) {
          addToast({
            type: 'error',
            title: 'Paciente não selecionado',
            message: 'Selecione um paciente e uma lesão para gerar o laudo.'
          });
          setIsGeneratingPdf(false);
          return;
        }

        const safePatientName = (currentPatient.name || 'paciente').toLowerCase().replace(/\s+/g, '_');
        const fileName = `laudo_estomaterapia_${safePatientName}.pdf`;

        const success = generateClinicalVectorPdf({
          patient: currentPatient,
          wound: currentWound,
          profile,
          nurse: currentNurse,
          fileName
        });

        if (success) {
          addToast({
            type: 'success',
            title: 'PDF Baixado com Sucesso',
            message: `O laudo clínico (${fileName}) foi gerado e baixado.`
          });
        } else {
          throw new Error('Falha ao compilar laudo em PDF.');
        }
      } else {
        const fileName = 'extrato_financeiro_faturamento.pdf';
        const success = generateFinancialVectorPdf({
          evolutions: allEvolutions,
          profile,
          nurse: currentNurse,
          fileName
        });

        if (success) {
          addToast({
            type: 'success',
            title: 'Extrato Baixado com Sucesso',
            message: 'O extrato financeiro foi gerado e baixado.'
          });
        } else {
          throw new Error('Falha ao compilar extrato financeiro em PDF.');
        }
      }
    } catch (err) {
      console.error('PDF export error:', err);
      addToast({
        type: 'error',
        title: 'Erro no Download',
        message: 'Não foi possível salvar o arquivo PDF. Tente a opção "Imprimir" ou verifique permissões de download.'
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 printable-container">
      {/* Tab Switcher & Print Action Bar (Hidden in Print) */}
      <div className="bg-[#0f172a] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-medium w-full sm:w-max">
          <button
            onClick={() => setSelectedReportType('clinical')}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all flex-1 sm:flex-initial ${
              selectedReportType === 'clinical'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Laudo Clínico (PDF)</span>
          </button>
          <button
            onClick={() => setSelectedReportType('financial')}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all flex-1 sm:flex-initial ${
              selectedReportType === 'financial'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Extrato Financeiro</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedReportType === 'clinical' && (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={reportPatientId}
                onChange={(e) => {
                  setReportPatientId(e.target.value);
                  const p = patients.find((pat) => pat.id === e.target.value);
                  if (p?.wounds && p.wounds.length > 0) {
                    setReportWoundId(p.wounds[0].id);
                  }
                }}
                className="text-xs px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {currentPatient?.wounds && currentPatient.wounds.length > 0 && (
                <select
                  value={reportWoundId}
                  onChange={(e) => setReportWoundId(e.target.value)}
                  className="text-xs px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {currentPatient.wounds.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Direct PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
            title="Baixar arquivo PDF com formatação médica e carimbo COFEN"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Baixar PDF</span>
              </>
            )}
          </button>

          {/* Clean Print Dialog Button */}
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] cursor-pointer"
            title="Abrir caixa de diálogo de impressão nativa ou salvar em impressora PDF"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Abrindo...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* REPORT 1: CLINICAL EVOLUTION PDF TEMPLATE (PRINT READY) */}
      {selectedReportType === 'clinical' && currentWound && currentPatient && (
        <div 
          id="clinical-report-content"
          className="printable-report bg-[#0f172a] rounded-2xl border border-slate-800 p-8 shadow-md space-y-6 text-slate-200 max-w-4xl mx-auto print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0 print:m-0 print:space-y-4"
        >
          
          {/* Clinic Header */}
          <div className="border-b-2 border-slate-700 print:border-slate-800 pb-4 flex items-start justify-between break-inside-avoid">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs print:border print:border-slate-700">
                  CB
                </div>
                <h1 className="text-xl font-black tracking-tight text-white print:text-slate-900">{profile.clinicName}</h1>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-700 font-medium">{profile.specialization}</p>
              <p className="text-xs text-slate-400 print:text-slate-600">{profile.clinicAddress} • Tel/WhatsApp: {profile.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 border border-blue-500/30 print:text-slate-900 print:bg-slate-100 print:border-slate-400 px-2.5 py-1 rounded-md inline-block">
                Laudo de Estomaterapia & Evolução
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-600 block mt-1">
                Data de Emissão: <strong>{formatDateBR(new Date().toISOString().split('T')[0])}</strong>
              </span>
              <span className="text-[10px] text-slate-500 print:text-slate-500 block font-mono">
                Autenticação: #{currentPatient.id.slice(0, 4).toUpperCase()}-{currentWound.id.slice(0, 4).toUpperCase()}-2026
              </span>
            </div>
          </div>

          {/* Patient Details Box */}
          <div className="patient-summary-box p-4 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3.5 break-inside-avoid">
            <div>
              <span className="text-slate-400 print:text-slate-600 font-medium block text-[11px]">Nome do Paciente:</span>
              <strong className="text-slate-100 print:text-slate-900 text-sm block font-bold">{currentPatient.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 font-medium block text-[11px]">CPF:</span>
              <strong className="text-slate-200 print:text-slate-800 block font-mono">{currentPatient.cpf}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 font-medium block text-[11px]">Data de Nascimento / Idade:</span>
              <span className="text-slate-200 print:text-slate-800 block font-medium">
                {formatDateBR(currentPatient.birthDate)} ({new Date().getFullYear() - new Date(currentPatient.birthDate).getFullYear()} anos)
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 font-medium block text-[11px]">Contato Telefônico:</span>
              <span className="text-slate-200 print:text-slate-800 block font-mono">{currentPatient.phone}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 print:text-slate-600 font-medium block text-[11px]">Comorbidades Diagnosticadas:</span>
              <span className="text-slate-200 print:text-slate-800 font-medium block">
                {currentPatient.comorbidities.length > 0 ? currentPatient.comorbidities.join(', ') : 'Nenhuma comorbidade prévia relatada'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-red-400 print:text-red-800 font-bold block text-[11px]">Alergias Documentadas:</span>
              <span className="text-red-300 print:text-red-900 font-bold block">
                {currentPatient.allergies.length > 0 ? currentPatient.allergies.join(', ') : 'Sem alergias conhecidas'}
              </span>
            </div>
          </div>

          {/* Lesion Identification & Progress */}
          <div className="print-section border border-slate-800 print:border-slate-300 rounded-xl p-4 space-y-2.5 bg-slate-900/30 print:bg-white break-inside-avoid">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 print:border-slate-200 pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 bg-blue-500/20 border border-blue-500/30 print:text-slate-900 print:bg-slate-100 print:border-slate-400 px-2 py-0.5 rounded">
                  {currentWound.lesionType.replace(/_/g, ' ').toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-slate-100 print:text-slate-900 mt-1">{currentWound.title}</h3>
                <p className="text-xs text-slate-400 print:text-slate-700">Topografia / Localização Anatômica: <strong>{currentWound.anatomicalLocation}</strong></p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 print:text-slate-600 block">Evolução de Área Lesionada</span>
                <span className="text-base font-black text-emerald-400 print:text-emerald-800">
                  -{currentWound.healingProgressPercent}% ({currentWound.initialAreaCm2} cm² → {currentWound.currentAreaCm2} cm²)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 print:text-slate-800">
              <strong className="text-slate-200 print:text-slate-900">Etiologia / Histórico:</strong> {currentWound.etiology}
            </p>
          </div>

          {/* Chronological Evolution Table */}
          <div className="space-y-2 break-inside-avoid">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-900">
              Registro Cronológico das Evoluções Clínicas & Condutas
            </h4>

            {currentWound.evolutions.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-900/60 print:bg-slate-50 rounded-lg border border-slate-800 print:border-slate-200">
                Nenhuma evolução detalhada registrada para esta lesão até o momento.
              </p>
            ) : (
              <div className="border border-slate-800 print:border-slate-300 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 print:bg-slate-100 text-slate-300 print:text-slate-900 font-bold border-b border-slate-800 print:border-slate-300">
                    <tr>
                      <th className="p-2.5">Data / Hora</th>
                      <th className="p-2.5">Dimensões & Área</th>
                      <th className="p-2.5">Tecidos no Leito</th>
                      <th className="p-2.5">Exsudato & Dor</th>
                      <th className="p-2.5">Coberturas & Procedimentos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                    {currentWound.evolutions.map((evo) => (
                      <tr key={evo.id} className="align-top hover:bg-slate-800/30 print:hover:bg-transparent break-inside-avoid">
                        <td className="p-2.5 font-semibold text-slate-200 print:text-slate-900 whitespace-nowrap">
                          {formatDateBR(evo.date)}<br/>
                          <span className="text-[10px] text-slate-400 print:text-slate-600 font-normal">às {evo.time}</span>
                        </td>
                        <td className="p-2.5">
                          <strong className="text-slate-100 print:text-slate-900">{evo.areaCm2} cm²</strong>
                          <span className="text-slate-400 print:text-slate-600 block text-[10px] font-mono">
                            {evo.lengthCm}x{evo.widthCm}x{evo.depthCm} cm
                          </span>
                          {evo.tunneling && (
                            <span className="text-amber-400 print:text-amber-800 text-[10px] block mt-0.5 font-medium">Túnel: {evo.tunneling}</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <div className="space-y-0.5 text-[10.5px]">
                            <span className="text-red-400 print:text-red-800 font-semibold block">Granulação: {evo.granulationPercent}%</span>
                            {evo.sloughPercent > 0 && <span className="text-amber-400 print:text-amber-800 block">Esfacelo: {evo.sloughPercent}%</span>}
                            {evo.necrosisPercent > 0 && <span className="text-slate-300 print:text-slate-900 font-bold block">Necrose: {evo.necrosisPercent}%</span>}
                            {evo.epithelializationPercent > 0 && <span className="text-pink-400 print:text-pink-800 block">Epitelização: {evo.epithelializationPercent}%</span>}
                          </div>
                        </td>
                        <td className="p-2.5">
                          <span className="capitalize block text-slate-200 print:text-slate-900 font-medium">{evo.exudateAmount} ({evo.exudateType})</span>
                          <span className="text-slate-400 print:text-slate-600 block text-[10.5px]">Dor EVA: <strong className="text-slate-200 print:text-slate-900">{evo.painScoreEVA}/10</strong></span>
                          {evo.pushToolScore !== undefined && (
                            <span className="text-blue-400 print:text-slate-900 font-bold block text-[10px] mt-0.5">PUSH: {evo.pushToolScore} pts</span>
                          )}
                        </td>
                        <td className="p-2.5 space-y-1">
                          <p className="font-semibold text-slate-200 print:text-slate-900">{evo.primaryDressing}</p>
                          <p className="text-slate-400 print:text-slate-700 text-[10.5px]">{evo.secondaryDressing}</p>
                          {evo.adjuvantTherapy && (
                            <span className="text-[9.5px] bg-slate-800 print:bg-slate-100 text-slate-300 print:text-slate-800 px-1.5 py-0.5 rounded font-medium inline-block border print:border-slate-300">
                              {evo.adjuvantTherapy}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Photographic Record Section */}
          {currentWound.photos.length > 0 && (
            <div className="space-y-2 break-inside-avoid">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-900">
                Registro Fotográfico Sequencial
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentWound.photos.map((p) => (
                  <div key={p.id} className="photo-card-item border border-slate-800 print:border-slate-300 rounded-lg overflow-hidden p-2 space-y-1 bg-slate-900/60 print:bg-slate-50 break-inside-avoid">
                    <img
                      src={p.url}
                      alt="Foto clínica"
                      referrerPolicy="no-referrer"
                      className="w-full h-28 object-cover rounded"
                    />
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="uppercase text-blue-300 print:text-slate-900">{p.stageTag}</span>
                      <span className="text-slate-400 print:text-slate-600">{formatDateBR(p.date)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 print:text-slate-600 block truncate">{p.notes || `Área: ${p.areaCm2} cm²`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Signature, COFEN Stamp & Verification Block */}
          <div className="signature-stamp-block pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t-2 border-slate-700 print:border-slate-800 break-inside-avoid">
            <div className="text-xs text-slate-400 print:text-slate-600 space-y-0.5 max-w-sm">
              <div className="flex items-center gap-1.5 text-blue-400 print:text-slate-800 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Documento com Assinatura Eletrônica Válida</span>
              </div>
              <p className="text-[10.5px]">Em conformidade com a Resolução COFEN nº 545/2017 e LGPD.</p>
              <p className="text-[9.5px] font-mono text-slate-500 print:text-slate-600">
                Hash: {currentNurse?.digitalSignatureHash || 'SHA256:7f8a9e2b1c3d4e5f60a1b2c3d4e5f6a7b8c9d0e1'}
              </p>
            </div>

            <div className="text-center w-72 p-3 rounded-xl border border-slate-700 print:border-slate-400 bg-slate-900/40 print:bg-slate-50">
              <div className="w-16 h-0.5 bg-slate-500 mx-auto mb-2"></div>
              <strong className="text-xs font-bold text-slate-100 print:text-slate-900 block">
                {currentNurse?.name || profile.name}
              </strong>
              <span className="text-xs text-blue-400 print:text-slate-900 font-semibold block font-mono">
                COREN-{currentNurse?.uf || profile.uf || 'SP'} {currentNurse?.coren || profile.coren}
              </span>
              <span className="text-[10px] text-slate-400 print:text-slate-700 block">
                {currentNurse?.title || 'Enfermeira Estomaterapeuta TiSOBEST'}
              </span>
              <span className="text-[9px] text-slate-500 print:text-slate-600 block mt-1">
                Assinado digitalmente em {formatDateBR(new Date().toISOString().split('T')[0])}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: FINANCIAL BILLING & SUPPLIES REPORT */}
      {selectedReportType === 'financial' && (
        <div 
          id="financial-report-content"
          className="printable-report space-y-6 print:space-y-4 max-w-5xl mx-auto"
        >
          {/* Print-only Clinic Header for Financial Statements */}
          <div className="print-only border-b-2 border-slate-800 pb-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-slate-900">{profile.clinicName}</h1>
                <p className="text-xs text-slate-600">Extrato Financeiro & Consumo de Coberturas</p>
              </div>
              <div className="text-right text-xs text-slate-600">
                <p>Emissão: {formatDateBR(new Date().toISOString().split('T')[0])}</p>
                <p>Responsável: {currentNurse?.name || profile.name}</p>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
            <div className="metric-card-item bg-[#0f172a] p-5 print:p-3 rounded-2xl border border-slate-800 print:border-slate-300 shadow-sm break-inside-avoid">
              <span className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
                Faturamento Total
              </span>
              <span className="text-2xl print:text-xl font-black text-blue-400 print:text-slate-900 mt-1 block">
                {formatCurrency(grossRevenue)}
              </span>
              <span className="text-[11px] text-blue-300/80 print:text-slate-600 font-medium mt-1 block">
                {allEvolutions.length} sessões realizadas
              </span>
            </div>

            <div className="metric-card-item bg-[#0f172a] p-5 print:p-3 rounded-2xl border border-slate-800 print:border-slate-300 shadow-sm break-inside-avoid">
              <span className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
                Honorários
              </span>
              <span className="text-2xl print:text-xl font-black text-slate-100 print:text-slate-900 mt-1 block">
                {formatCurrency(totalConsultationFees)}
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-1 block">Procedimentos e consultas</span>
            </div>

            <div className="metric-card-item bg-[#0f172a] p-5 print:p-3 rounded-2xl border border-slate-800 print:border-slate-300 shadow-sm break-inside-avoid">
              <span className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
                Insumos / Curativos
              </span>
              <span className="text-2xl print:text-xl font-black text-indigo-400 print:text-slate-900 mt-1 block">
                {formatCurrency(totalSuppliesFees)}
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-1 block">Coberturas especiais</span>
            </div>

            <div className="metric-card-item bg-[#0f172a] p-5 print:p-3 rounded-2xl border border-slate-800 print:border-slate-300 shadow-sm break-inside-avoid">
              <span className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
                Deslocamento
              </span>
              <span className="text-2xl print:text-xl font-black text-amber-400 print:text-slate-900 mt-1 block">
                {formatCurrency(totalTravelFees)}
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-1 block">Visitas domiciliares</span>
            </div>
          </div>

          {/* Detailed Financial Log */}
          <div className="bg-[#0f172a] print:bg-white rounded-2xl border border-slate-800 print:border-slate-300 shadow-sm overflow-hidden break-inside-avoid">
            <div className="p-4 bg-slate-900/80 print:bg-slate-100 border-b border-slate-800 print:border-slate-300 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 print:text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400 print:text-slate-900" />
                Extrato Detalhado por Sessão de Atendimento
              </h3>
              <span className="text-xs font-semibold text-slate-400 print:text-slate-700">
                Ticket Médio: <strong className="text-slate-100 print:text-slate-900">{formatCurrency(averageTicket)}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 print:bg-slate-100 text-slate-400 print:text-slate-900 font-bold uppercase tracking-wider border-b border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="p-3.5 print:p-2">Data</th>
                    <th className="p-3.5 print:p-2">Paciente & Lesão</th>
                    <th className="p-3.5 print:p-2">Honorário</th>
                    <th className="p-3.5 print:p-2">Insumos</th>
                    <th className="p-3.5 print:p-2">Deslocamento</th>
                    <th className="p-3.5 print:p-2">Total Sessão</th>
                    <th className="p-3.5 print:p-2">Pagamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {allEvolutions.map((evo) => (
                    <tr key={evo.id} className="hover:bg-slate-800/40 print:hover:bg-transparent transition-colors break-inside-avoid">
                      <td className="p-3.5 print:p-2 font-medium text-slate-300 print:text-slate-900 whitespace-nowrap">{formatDateBR(evo.date)}</td>
                      <td className="p-3.5 print:p-2">
                        <strong className="text-slate-100 print:text-slate-900 block">{evo.patientName}</strong>
                        <span className="text-slate-400 print:text-slate-600 text-[11px]">{evo.woundTitle}</span>
                      </td>
                      <td className="p-3.5 print:p-2 text-slate-300 print:text-slate-800">{formatCurrency(evo.consultationFee)}</td>
                      <td className="p-3.5 print:p-2 text-indigo-400 print:text-slate-800 font-medium">{formatCurrency(evo.suppliesTotalFee)}</td>
                      <td className="p-3.5 print:p-2 text-amber-400 print:text-slate-800">{formatCurrency(evo.travelFee)}</td>
                      <td className="p-3.5 print:p-2 font-extrabold text-blue-400 print:text-slate-900 text-sm">
                        {formatCurrency(evo.totalSessionFee)}
                      </td>
                      <td className="p-3.5 print:p-2">
                        <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:bg-slate-100 print:text-slate-900 print:border-slate-400">
                          {evo.paymentMethod.replace(/_/g, ' ')} ({evo.paymentStatus})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

