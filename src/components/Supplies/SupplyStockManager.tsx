import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  MinusCircle, 
  DollarSign, 
  Calendar,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Building2,
  Info
} from 'lucide-react';
import { SupplyCategory, SupplyStockItem } from '../../types';
import { formatCurrency, formatDateBR } from '../../utils/formatters';

export const SupplyStockManager: React.FC = () => {
  const { 
    supplies, 
    userRole,
    addSupplyItem, 
    updateSupplyItem, 
    adjustStockQuantity, 
    deleteSupplyItem,
    addToast 
  } = useApp();

  const isAdmin = userRole === 'admin';

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isNewSupplyModalOpen, setIsNewSupplyModalOpen] = useState<boolean>(false);
  const [editingSupply, setEditingSupply] = useState<SupplyStockItem | null>(null);

  // New Supply State
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<SupplyCategory>('cobertura_primaria');
  const [description, setDescription] = useState<string>('');
  const [currentStock, setCurrentStock] = useState<number>(10);
  const [minStockAlert, setMinStockAlert] = useState<number>(4);
  const [unit, setUnit] = useState<string>('placa 10x10cm');
  const [costPrice, setCostPrice] = useState<number>(35);
  const [sellPrice, setSellPrice] = useState<number>(65);
  const [manufacturer, setManufacturer] = useState<string>('');
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('2028-06-30');

  // Filtered supplies
  const filteredSupplies = supplies.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = supplies.filter((s) => s.currentStock <= s.minStockAlert).length;
  const totalStockValue = supplies.reduce((acc, s) => acc + (s.currentStock * s.costPrice), 0);
  const totalPotentialRevenue = supplies.reduce((acc, s) => acc + (s.currentStock * s.sellPrice), 0);

  const handleOpenNewModal = () => {
    setEditingSupply(null);
    setName('');
    setDescription('');
    setCurrentStock(10);
    setMinStockAlert(4);
    setUnit('placa 10x10cm');
    setCostPrice(35);
    setSellPrice(65);
    setManufacturer('');
    setBatchNumber(`L2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    setExpirationDate('2028-12-31');
    setIsNewSupplyModalOpen(true);
  };

  const handleOpenEditModal = (supply: SupplyStockItem) => {
    setEditingSupply(supply);
    setName(supply.name);
    setCategory(supply.category);
    setDescription(supply.description);
    setCurrentStock(supply.currentStock);
    setMinStockAlert(supply.minStockAlert);
    setUnit(supply.unit);
    setCostPrice(supply.costPrice);
    setSellPrice(supply.sellPrice);
    setManufacturer(supply.manufacturer);
    setBatchNumber(supply.batchNumber);
    setExpirationDate(supply.expirationDate);
    setIsNewSupplyModalOpen(true);
  };

  const handleSaveSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingSupply) {
      updateSupplyItem({
        ...editingSupply,
        name,
        category,
        description,
        currentStock,
        minStockAlert,
        unit,
        costPrice,
        sellPrice,
        manufacturer,
        batchNumber,
        expirationDate,
      });
    } else {
      addSupplyItem({
        name,
        category,
        description,
        currentStock,
        minStockAlert,
        unit,
        costPrice,
        sellPrice,
        manufacturer,
        batchNumber,
        expirationDate,
      });
    }

    setIsNewSupplyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Role notice banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-4 sm:p-5 text-blue-200 flex items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Catálogo Clínico & Gestão de Estoque de Insumos
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Enfermagem & Gestão: consulte indicações, prescreva coberturas e <strong>edite ou corrija insumos</strong> (lotes, validade, quantidades e valores de repasse) em caso de erro de lançamento.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs shrink-0">
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Edição de Insumos Liberada</span>
        </div>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Variedade de Insumos
            </span>
            <span className="text-2xl font-black text-slate-100 mt-1 block">{supplies.length} itens</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Estoque Crítico / Reposição
            </span>
            <span className={`text-2xl font-black mt-1 block ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {lowStockCount} item(s)
            </span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${
            lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {isAdmin ? 'Valor em Estoque (Custo)' : 'Itens Prontos para Uso'}
            </span>
            <span className="text-2xl font-black text-slate-100 mt-1 block">
              {isAdmin ? formatCurrency(totalStockValue) : `${supplies.reduce((acc, s) => acc + s.currentStock, 0)} un`}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
            {isAdmin ? <DollarSign className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filter, and Add Button */}
      <div className="bg-[#0f172a] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar cobertura, insumo, fabricante ou lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="all">Todas as Categorias</option>
            <option value="cobertura_primaria">Coberturas Primárias (Prata, Alginato, etc.)</option>
            <option value="cobertura_secundaria">Coberturas Secundárias & Espumas</option>
            <option value="solucao_limpeza">Soluções de Limpeza / PHMB</option>
            <option value="desbridante">Géis & Desbridantes (Hidrogel)</option>
            <option value="terapia_compressiva">Terapia Compressiva (Bota de Unna)</option>
            <option value="estomia">Dispositivos de Estomia & Barreira</option>
            <option value="fixacao_protecao">Fixação & Protetores Cutâneos (Cavilon)</option>
            <option value="instrumental">Instrumentais Estéreis</option>
          </select>
        </div>

        <button
          id="btn-add-supply"
          onClick={handleOpenNewModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Insumo</span>
        </button>
      </div>

      {/* Supplies Table */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Insumo / Cobertura</th>
                <th className="p-4">Categoria & Fabricante</th>
                <th className="p-4 text-center">Estoque Atual</th>
                <th className="p-4">{isAdmin ? 'Custo x Preço Repasse' : 'Valor de Repasse'}</th>
                <th className="p-4">Lote / Validade</th>
                <th className="p-4 text-right">Ações & Correções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredSupplies.map((supply) => {
                const isLow = supply.currentStock <= supply.minStockAlert;
                const marginPercent = supply.costPrice > 0 
                  ? Math.round(((supply.sellPrice - supply.costPrice) / supply.costPrice) * 100)
                  : 0;

                return (
                  <tr key={supply.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Name & Desc */}
                    <td className="p-4">
                      <div className="font-bold text-slate-100">{supply.name}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{supply.description}</p>
                    </td>

                    {/* Category & Brand */}
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 block w-max">
                        {supply.category.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-[11px] mt-1 block">{supply.manufacturer || 'N/D'}</span>
                    </td>

                    {/* Current Stock */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => adjustStockQuantity(supply.id, -1)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          title="Decrementar estoque em 1"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>

                        <span className={`px-2.5 py-1 rounded-lg font-black text-xs border ${
                          isLow ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}>
                          {supply.currentStock} {supply.unit}
                        </span>

                        <button
                          onClick={() => adjustStockQuantity(supply.id, 1)}
                          className="text-slate-500 hover:text-blue-400 transition-colors p-1 cursor-pointer"
                          title="Incrementar estoque em 1"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>

                      {isLow && (
                        <span className="text-[10px] font-bold text-amber-400 block mt-1">
                          Mínimo: {supply.minStockAlert}
                        </span>
                      )}
                    </td>

                    {/* Cost & Sell */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">
                        {formatCurrency(supply.sellPrice)}
                      </div>
                      {isAdmin ? (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <span>Custo: {formatCurrency(supply.costPrice)}</span>
                          <span className="text-emerald-400 font-bold">(+{marginPercent}%)</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 block">por {supply.unit}</span>
                      )}
                    </td>

                    {/* Batch and Exp Date */}
                    <td className="p-4">
                      <span className="text-[11px] font-medium text-slate-300 block font-mono">
                        {supply.batchNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formatDateBR(supply.expirationDate)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`btn-edit-supply-${supply.id}`}
                          onClick={() => handleOpenEditModal(supply)}
                          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-blue-200 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Editar / Corrigir Insumo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        
                        <button
                          id={`btn-delete-supply-${supply.id}`}
                          onClick={() => {
                            if (window.confirm(`Deseja realmente remover o insumo "${supply.name}" do catálogo?`)) {
                              deleteSupplyItem(supply.id);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Insumo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New / Edit Supply Modal */}
      {isNewSupplyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    {editingSupply ? 'Editar Insumo Estomaterápico' : 'Cadastrar Novo Insumo'}
                  </h2>
                  <p className="text-xs text-slate-400">Controle de estoque, lote e margem de repasse</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewSupplyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupply} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nome do Insumo / Cobertura *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Espuma de Silicone com Prata 10x10"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupplyCategory)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="cobertura_primaria">Cobertura Primária</option>
                    <option value="cobertura_secundaria">Cobertura Secundária</option>
                    <option value="solucao_limpeza">Solução de Limpeza / PHMB</option>
                    <option value="desbridante">Gel Desbridante / Autolítico</option>
                    <option value="terapia_compressiva">Terapia Compressiva</option>
                    <option value="estomia">Dispositivo de Estomia</option>
                    <option value="fixacao_protecao">Fixação & Proteção</option>
                    <option value="instrumental">Instrumental Estéril</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Unidade de Apresentação</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Ex: placa 10x10, tubo 85g, frasco 350ml"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Descrição / Indicação Clínica</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Indicado para lesões infectadas ou com alto exsudato"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Alerta Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Preço Custo (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Preço Repasse (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-bold text-blue-300 rounded-lg border border-blue-500/40 bg-blue-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Fabricante</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="Ex: Mölnlycke, Convatec, Hartmann"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Lote</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Validade</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSupplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
                >
                  Salvar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

