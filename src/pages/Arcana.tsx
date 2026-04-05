import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlchemyElement, Rarity } from '../types';
import { Sparkles, Zap, Shield, Eye, Globe, Thermometer, Contrast, Leaf, Hourglass, X, Info, ExternalLink, Youtube, Send, MessageSquare, AlertCircle } from 'lucide-react';
import { REALITY_LAYERS, HIDDEN_LAWS, calculateRank, INITIAL_ELEMENTS, RANKS, RARITY_DETAILS, RARITY_COLORS, ELEMENT_TYPE_DETAILS, ESSENCE_DETAILS, translateEssence, RARITY_ORDER, calculateRarityChances } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ArcanaProps {
  onReset: () => void;
  elements: AlchemyElement[];
  aihim: number;
  setAihim: React.Dispatch<React.SetStateAction<number>>;
}

const LAYER_ICONS: Record<number, any> = {
  1: Shield,
  2: Zap,
  3: Sparkles,
  4: Eye,
  5: Globe,
};

const LAW_ICONS: Record<string, any> = {
  Thermometer,
  Contrast,
  Leaf,
  Hourglass,
  Shield,
};

export const Arcana: React.FC<ArcanaProps> = ({ onReset, elements, aihim, setAihim }) => {
  const [selectedLaw, setSelectedLaw] = useState<any>(null);
  const [selectedLayer, setSelectedLayer] = useState<any>(null);
  const [selectedRank, setSelectedRank] = useState<any>(null);
  const [selectedRarity, setSelectedRarity] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedEssence, setSelectedEssence] = useState<any>(null);
  const [rarityA, setRarityA] = useState<string>(RARITY_ORDER[0]);
  const [rarityB, setRarityB] = useState<string>(RARITY_ORDER[0]);
  const validElements = elements.filter(e => e !== null);
  const maxReality = Math.max(1, ...validElements.map(e => e.realityLevel || 1));
  const totalElements = validElements.length;

  const { currentRank, nextRank, progressToNextRank } = calculateRank(totalElements);
  const [showRankTooltip, setShowRankTooltip] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFixConfirm, setShowFixConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-8"
    >
      {/* Alchemist Rank Section */}
      <div className="parchment-card p-6 border-gold/40 bg-gold/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">{currentRank.icon}</div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-gold/30 flex items-center justify-center bg-parchment shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gold/5" />
            <span className="text-5xl relative z-10 drop-shadow-[0_0_2px_rgba(0,0,0,0.3)]">{currentRank.icon}</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Ваш Текущий Ранг</div>
            <h2 className="font-gothic text-3xl tracking-widest text-sepia">{currentRank.name}</h2>
            <p className="text-sm italic text-sepia/70">{currentRank.desc}</p>
            
            <div className="mt-4 space-y-1 relative">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-sepia/50">
                <div className="flex items-center gap-1 cursor-help" onMouseEnter={() => setShowRankTooltip(true)} onMouseLeave={() => setShowRankTooltip(false)}>
                  <span>Прогресс Познания</span>
                  <Info size={10} />
                </div>
                <span>{totalElements} / {nextRank ? nextRank.min : '∞'}</span>
              </div>
              <div className="h-2 w-full bg-sepia/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextRank}%` }}
                  className="h-full bg-gold shadow-[0_0_10px_rgba(201,163,67,0.5)]"
                />
              </div>

              <AnimatePresence>
                {showRankTooltip && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-full left-0 mb-2 p-2 bg-ink text-[9px] text-white rounded shadow-xl z-50 w-48 border border-gold/20"
                  >
                    Ваш ранг алхимика растет по мере открытия новых элементов. Каждый новый ранг открывает доступ к более сложным трансмутациям.
                  </motion.div>
                )}
              </AnimatePresence>

              {nextRank && (
                <p className="text-[9px] text-sepia/40 italic mt-1">
                  До ранга "{nextRank.name}" осталось открыть {nextRank.min - totalElements} элементов
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Laws */}
      <div className="parchment-card p-6 space-y-6">
        <h3 className="font-gothic text-xl tracking-widest text-gold text-center uppercase">Законы Мироздания</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HIDDEN_LAWS.map((law) => {
            return (
              <div 
                key={law.id} 
                onClick={() => setSelectedLaw(law)}
                className="flex items-center gap-4 p-3 rounded border transition-all bg-gold/5 border-gold/20 cursor-pointer hover:bg-gold/10"
              >
                <div className="p-2 rounded-full bg-gold/10 text-gold">
                  {React.createElement(LAW_ICONS[law.icon] || Sparkles, { size: 20 })}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-sm block">{law.name}</span>
                  <p className="text-[10px] italic opacity-70">{law.desc}</p>
                </div>
                <Info size={14} className="text-gold/40" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Element Types & Essences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="parchment-card p-6 space-y-6">
          <h3 className="font-gothic text-xl tracking-widest text-gold text-center uppercase">Типы Элементов</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ELEMENT_TYPE_DETAILS).map(([type, details]) => {
              const count = validElements.filter(e => e.type === type).length;
              return (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedType({ name: type, ...details })}
                  className="p-3 rounded-lg border border-gold/20 bg-gold/5 cursor-pointer hover:bg-gold/10 transition-all flex flex-col items-center text-center gap-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold">{type}</span>
                  <div className="text-xs font-mono text-sepia/60">{count}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="parchment-card p-6 space-y-6">
          <h3 className="font-gothic text-xl tracking-widest text-gold text-center uppercase">Сущности (Эссенции)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-3">
            {Object.entries(ESSENCE_DETAILS).map(([essence, details]) => {
              const count = validElements.filter(e => e.essences?.includes(essence as any)).length;
              return (
                <motion.div
                  key={essence}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedEssence({ name: essence, ...details })}
                  className="p-3 rounded-lg border border-gold/20 bg-gold/5 cursor-pointer hover:bg-gold/10 transition-all flex flex-col items-center text-center gap-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold">{translateEssence(essence as any)}</span>
                  <div className="text-xs font-mono text-sepia/60">{count}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rarity Levels */}
      <div className="parchment-card p-6 space-y-6">
        <h3 className="font-gothic text-xl tracking-widest text-gold text-center uppercase">Иерархия Редкости</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.keys(RARITY_DETAILS).map((rarity) => {
            const count = elements.filter(e => e.rarity === rarity).length;
            return (
              <motion.div
                key={rarity}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => setSelectedRarity({ name: rarity, ...RARITY_DETAILS[rarity] })}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all flex flex-col items-center text-center gap-1 shadow-sm",
                  RARITY_COLORS[rarity as Rarity] || "bg-sepia/5 border-sepia/10"
                )}
              >
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-tighter truncate w-full">{rarity}</span>
                <div className="text-xs font-mono opacity-60">{count}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rarity Calculator */}
      <div className="parchment-card p-6 space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-gothic text-xl tracking-widest text-gold uppercase">Калькулятор Редкости</h3>
          <p className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest">Прогноз вероятности трансмутации</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center bg-gold/5 p-6 rounded-2xl border border-gold/10">
          <div className="flex flex-col gap-2 w-full md:w-48">
            <label className="text-[10px] uppercase font-bold text-gold tracking-widest text-center">Элемент A</label>
            <select 
              value={rarityA} 
              onChange={(e) => setRarityA(e.target.value)}
              className="bg-parchment border border-gold/20 rounded-lg p-3 text-xs font-bold text-sepia outline-none focus:border-gold shadow-inner appearance-none cursor-pointer text-center"
            >
              {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="text-gold font-gothic text-3xl animate-pulse">+</div>
          <div className="flex flex-col gap-2 w-full md:w-48">
            <label className="text-[10px] uppercase font-bold text-gold tracking-widest text-center">Элемент B</label>
            <select 
              value={rarityB} 
              onChange={(e) => setRarityB(e.target.value)}
              className="bg-parchment border border-gold/20 rounded-lg p-3 text-xs font-bold text-sepia outline-none focus:border-gold shadow-inner appearance-none cursor-pointer text-center"
            >
              {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-sepia/5 rounded-xl border border-sepia/10 overflow-hidden shadow-inner">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gold/10 border-b border-gold/20">
                <th className="p-4 text-[10px] uppercase font-bold text-gold tracking-widest">Редкость Результата</th>
                <th className="p-4 text-[10px] uppercase font-bold text-gold tracking-widest text-right">Вероятность</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(calculateRarityChances(rarityA, rarityB))
                .sort((a, b) => RARITY_ORDER.indexOf(b[0]) - RARITY_ORDER.indexOf(a[0]))
                .map(([rarity, chance]) => (
                <tr key={rarity} className="border-b border-sepia/5 last:border-0 hover:bg-gold/5 transition-colors">
                  <td className="p-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-3 py-1 rounded-full border shadow-sm",
                      RARITY_COLORS[rarity as Rarity] || "bg-sepia/5 border-sepia/10"
                    )}>
                      {rarity}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-24 h-1.5 bg-sepia/10 rounded-full overflow-hidden hidden sm:block">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${chance}%` }}
                          className="h-full bg-gold"
                        />
                      </div>
                      <span className="font-mono text-sm font-bold text-sepia w-12 text-right">{chance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
          <p className="text-[10px] text-sepia/60 italic text-center leading-relaxed">
            <Sparkles size={10} className="inline mr-1 text-gold" />
            Закон Редкости гласит: соединение двух элементов одинаковой высокой редкости дает максимальный шанс на прорыв к следующему уровню материи. Смешивание разных уровней обычно приводит к усреднению результата.
          </p>
        </div>
      </div>

      {/* Rank Hierarchy */}
      <div className="parchment-card p-6 space-y-6">
        <h3 className="font-gothic text-xl tracking-widest text-gold text-center uppercase">ИЕРАРХИЯ ПОЗНАНИЯ</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {RANKS.map((rank, idx) => {
            const isCurrent = currentRank.name === rank.name;
            const isUnlocked = totalElements >= rank.min;
            
            return (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setSelectedRank(rank)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center gap-3 relative overflow-hidden",
                  isCurrent 
                    ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_15px_rgba(201,163,67,0.2)]' 
                    : isUnlocked 
                      ? 'bg-parchment/40 border-sepia/20 text-sepia hover:bg-parchment/60 hover:border-gold/30' 
                      : 'bg-sepia/5 border-sepia/10 opacity-60 grayscale italic text-sepia/60'
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl border",
                  isCurrent ? "bg-gold/20 border-gold/30" : "bg-sepia/5 border-sepia/10"
                )}>
                  {rank.icon}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">Ранг {idx + 1}</div>
                  <div className="text-xs font-bold uppercase tracking-wider leading-tight">{rank.name}</div>
                </div>
                <div className="text-[10px] font-mono opacity-50 mt-auto">
                  {rank.levels} Ур.
                </div>
                {isCurrent && (
                  <div className="absolute top-2 right-2">
                    <Sparkles size={10} className="text-gold animate-pulse" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Reality Layers */}
      <div className="parchment-card p-6 space-y-6">
        <h3 className="font-gothic text-xl tracking-widest text-gold text-center uppercase">Слои Реальности</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {REALITY_LAYERS.map((layer) => {
            const layerElements = elements.filter(e => 
              e && e.realityLevel === layer.level && 
              !INITIAL_ELEMENTS.some(ie => ie && ie.id === e.id)
            ).length;
            const isUnlocked = maxReality >= layer.level;
            let isAvailable = isUnlocked;
            if (!isUnlocked && layer.level === maxReality + 1) {
              const prevLayerNewElements = elements.filter(e => 
                e && e.realityLevel === layer.level - 1 && 
                !INITIAL_ELEMENTS.some(ie => ie && ie.id === e.id)
              ).length;
              if (layer.level === 2) isAvailable = prevLayerNewElements >= 10;
              if (layer.level === 3) isAvailable = prevLayerNewElements >= 15 && elements.some(e => e && e.essences?.includes('life'));
              if (layer.level === 4) isAvailable = prevLayerNewElements >= 25;
              if (layer.level === 5) isAvailable = prevLayerNewElements >= 50;
            }
            const LayerIcon = LAYER_ICONS[layer.level] || Shield;
            return (
              <motion.div 
                key={layer.level} 
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedLayer(layer)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden",
                  isUnlocked 
                    ? 'bg-gold/5 border-gold/30 text-sepia' 
                    : isAvailable 
                      ? 'bg-parchment/40 border-gold/20 text-sepia/80' 
                      : 'bg-sepia/5 border-sepia/10 opacity-60 grayscale'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "p-2 rounded-lg border",
                    isUnlocked ? "bg-gold/20 border-gold/30 text-gold" : "bg-sepia/5 border-sepia/10 text-sepia/40"
                  )}>
                    <LayerIcon size={18} />
                  </div>
                  <span className="text-[10px] font-mono opacity-50">#{layer.level}</span>
                </div>
                <div>
                  <div className="font-bold text-[10px] sm:text-xs uppercase tracking-wider truncate">{layer.name}</div>
                  <p className="text-[9px] italic opacity-60 line-clamp-2 mt-1">
                    {isAvailable ? layer.desc : 'Слой заблокирован'}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-sepia/5">
                  <span className="text-[8px] uppercase font-bold tracking-tighter text-gold/60">{layerElements} новых</span>
                  <Info size={10} className="text-gold/40" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rank Modal */}
      <AnimatePresence>
        {selectedRank && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
            onClick={() => setSelectedRank(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="parchment-card max-w-md w-full p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedRank(null)} className="absolute top-4 right-4 text-sepia/40 hover:text-sepia"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-5xl border border-gold/20 shadow-xl">{selectedRank.icon}</div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">Ранг Алхимика</div>
                  <h2 className="font-gothic text-xl md:text-3xl tracking-widest text-sepia uppercase">{selectedRank.name}</h2>
                  <div className="text-xs font-mono text-gold mt-1">Уровни: {selectedRank.levels}</div>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <div className="space-y-4 text-left w-full">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">Суть Ранга</h4>
                    <p className="text-sm text-sepia italic">{selectedRank.desc}</p>
                  </div>
                  <div className="bg-sepia/5 p-4 rounded border border-sepia/10">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2 flex items-center gap-2"><Info size={12} /> Подробности</h4>
                    <p className="text-xs text-sepia/80 leading-relaxed">{selectedRank.detail}</p>
                  </div>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <p className="text-[9px] text-sepia/40 uppercase tracking-widest">Требуется элементов: {selectedRank.min}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Law Modal */}
      <AnimatePresence>
        {selectedLaw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
            onClick={() => setSelectedLaw(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="parchment-card max-w-md w-full p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedLaw(null)} className="absolute top-4 right-4 text-sepia/40 hover:text-sepia"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                  {React.createElement(LAW_ICONS[selectedLaw.icon] || Sparkles, { size: 40 })}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">Закон Мироздания</div>
                  <h2 className="font-gothic text-xl md:text-3xl tracking-widest text-sepia break-words leading-tight">{selectedLaw.name}</h2>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <p className="text-sepia italic leading-relaxed">"{selectedLaw.desc}"</p>
                <div className="bg-gold/5 p-4 rounded border border-gold/20 text-left">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2 flex items-center gap-2"><Sparkles size={12} /> Тайное Знание</h4>
                  <p className="text-xs text-sepia/80 leading-relaxed">{selectedLaw.detail}</p>
                </div>
                <p className="text-[9px] text-sepia/40 uppercase tracking-widest">Этот закон теперь влияет на ваши трансмутации</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reality Layer Modal */}
      <AnimatePresence>
        {selectedLayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
            onClick={() => setSelectedLayer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="parchment-card max-w-md w-full p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedLayer(null)} className="absolute top-4 right-4 text-sepia/40 hover:text-sepia"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-sepia/5 flex items-center justify-center text-gold border border-gold/20">
                  {React.createElement(LAYER_ICONS[selectedLayer.level] || Shield, { size: 40 })}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">Слой Реальности {selectedLayer.level}</div>
                  <h2 className="font-gothic text-xl md:text-3xl tracking-widest text-sepia uppercase">{selectedLayer.name}</h2>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <div className="space-y-4 text-left w-full">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">Суть Слоя</h4>
                    <p className="text-sm text-sepia italic">{selectedLayer.desc}</p>
                  </div>
                  <div className="bg-sepia/5 p-4 rounded border border-sepia/10">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2 flex items-center gap-2"><Sparkles size={12} /> Законы Слоя</h4>
                    <p className="text-xs text-sepia/80 leading-relaxed">{selectedLayer.rules}</p>
                  </div>
                  <div className="pt-2">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">Как открыть</h4>
                    <p className="text-xs text-sepia/60 font-bold uppercase tracking-widest">{selectedLayer.unlock}</p>
                  </div>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <p className="text-[9px] text-sepia/40 uppercase tracking-widest">Познание слоев открывает путь к высшей алхимии</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rarity Modal */}
      <AnimatePresence>
        {selectedRarity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
            onClick={() => setSelectedRarity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={cn(
                "parchment-card max-w-md w-full p-8 relative border-2",
                RARITY_COLORS[selectedRarity.name as Rarity] || "border-gold/40"
              )}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedRarity(null)} className="absolute top-4 right-4 text-sepia/40 hover:text-sepia"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-6">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center text-gold border shadow-xl",
                  RARITY_COLORS[selectedRarity.name as Rarity] || "bg-gold/10 border-gold/20"
                )}>
                  <Sparkles size={40} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">Уровень Редкости</div>
                  <h2 className="font-gothic text-xl md:text-3xl tracking-widest text-sepia uppercase">{selectedRarity.name}</h2>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <div className="space-y-4 text-left w-full">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">Описание</h4>
                    <p className="text-sm text-sepia italic">{selectedRarity.desc}</p>
                  </div>
                  <div className="bg-sepia/5 p-4 rounded border border-sepia/10">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2 flex items-center gap-2"><Info size={12} /> Правила и Свойства</h4>
                    <p className="text-xs text-sepia/80 leading-relaxed">{selectedRarity.rules}</p>
                  </div>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <p className="text-[9px] text-sepia/40 uppercase tracking-widest">Редкость определяет ценность и сложность элемента</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type Modal */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
            onClick={() => setSelectedType(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="parchment-card max-w-md w-full p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedType(null)} className="absolute top-4 right-4 text-sepia/40 hover:text-sepia"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-xl">
                  <Globe size={40} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">Тип Элемента</div>
                  <h2 className="font-gothic text-xl md:text-3xl tracking-widest text-sepia uppercase">{selectedType.name}</h2>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <div className="space-y-4 text-left w-full">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">Описание</h4>
                    <p className="text-sm text-sepia italic">{selectedType.desc}</p>
                  </div>
                  <div className="bg-sepia/5 p-4 rounded border border-sepia/10">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2 flex items-center gap-2"><Info size={12} /> Влияние на Игру</h4>
                    <p className="text-xs text-sepia/80 leading-relaxed">{selectedType.influence}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Essence Modal */}
      <AnimatePresence>
        {selectedEssence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
            onClick={() => setSelectedEssence(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="parchment-card max-w-md w-full p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedEssence(null)} className="absolute top-4 right-4 text-sepia/40 hover:text-sepia"><X size={20} /></button>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-xl">
                  <Zap size={40} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">Сущность (Эссенция)</div>
                  <h2 className="font-gothic text-xl md:text-3xl tracking-widest text-sepia uppercase">{translateEssence(selectedEssence.name)}</h2>
                </div>
                <div className="w-full h-px bg-sepia/10" />
                <div className="space-y-4 text-left w-full">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">Описание</h4>
                    <p className="text-sm text-sepia italic">{selectedEssence.desc}</p>
                  </div>
                  <div className="bg-sepia/5 p-4 rounded border border-sepia/10">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2 flex items-center gap-2"><Info size={12} /> Влияние на Синтез</h4>
                    <p className="text-xs text-sepia/80 leading-relaxed">{selectedEssence.influence}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dangerous Manipulations & Community Links */}
      <div className="parchment-card p-8 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="font-gothic text-xl tracking-widest text-gold uppercase">Ссылки и сообщество</h3>
          <p className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest">Присоединяйтесь к нашему пути</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="https://t.me/SAV_AI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gold/5 border border-gold/20 rounded-xl hover:bg-gold/10 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><Send size={20} /></div>
            <div>
              <div className="text-xs font-bold text-sepia flex items-center gap-1">🤖 SAV AI <ExternalLink size={10} /></div>
              <div className="text-[9px] text-sepia/60 uppercase tracking-tighter">Новости про нейросети и ИИ</div>
            </div>
          </a>
          <a href="https://t.me/shishkarnem" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gold/5 border border-gold/20 rounded-xl hover:bg-gold/10 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><MessageSquare size={20} /></div>
            <div>
              <div className="text-xs font-bold text-sepia flex items-center gap-1">👨‍💻 Doctor White <ExternalLink size={10} /></div>
              <div className="text-[9px] text-sepia/60 uppercase tracking-tighter">Разработчик приложения</div>
            </div>
          </a>
          <a href="https://t.me/SAV_AIbot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gold/5 border border-gold/20 rounded-xl hover:bg-gold/10 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><Zap size={20} /></div>
            <div>
              <div className="text-xs font-bold text-sepia flex items-center gap-1">🛒 Спаситель Продаж <ExternalLink size={10} /></div>
              <div className="text-[9px] text-sepia/60 uppercase tracking-tighter">Заказать разработку ИИ</div>
            </div>
          </a>
          <a href="https://t.me/SAVPartnerBot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gold/5 border border-gold/20 rounded-xl hover:bg-gold/10 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><Globe size={20} /></div>
            <div>
              <div className="text-xs font-bold text-sepia flex items-center gap-1">🤝 ИИ-Гренландия <ExternalLink size={10} /></div>
              <div className="text-[9px] text-sepia/60 uppercase tracking-tighter">Партнёрская программа</div>
            </div>
          </a>
          <a href="https://www.youtube.com/@SAVAILife" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gold/5 border border-gold/20 rounded-xl hover:bg-gold/10 transition-all group sm:col-span-2">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><Youtube size={20} /></div>
            <div>
              <div className="text-xs font-bold text-sepia flex items-center gap-1">🎬 Нейросети для бизнеса <ExternalLink size={10} /></div>
              <div className="text-[9px] text-sepia/60 uppercase tracking-tighter">YouTube канал с прямыми эфирами</div>
            </div>
          </a>
        </div>

        <div className="pt-8 border-t border-sepia/10">
          <h3 className="font-gothic text-xl tracking-widest text-red-900/60 uppercase text-center mb-6">Опасные Манипуляции</h3>
          <div className="max-w-xs mx-auto space-y-4">
            <div className="space-y-2">
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-3 border border-red-900/30 text-red-900 hover:bg-red-900/10 transition-all rounded font-bold uppercase tracking-widest text-xs"
              >
                Сбросить Вселенную
              </button>
              <p className="text-[9px] text-sepia/50 italic text-center leading-relaxed">
                ⚠️ Полное уничтожение всех открытых элементов, истории и прогресса. Вы начнёте игру с самого начала — с базовыми элементами и стартовым балансом AiHim. Используйте, если хотите начать с чистого листа.
              </p>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => setShowFixConfirm(true)}
                className="w-full py-3 border border-gold/30 text-gold hover:bg-gold/10 transition-all rounded font-bold uppercase tracking-widest text-xs"
              >
                Перезагрузить Эфир (Fix Stuck)
              </button>
              <p className="text-[9px] text-sepia/50 italic text-center leading-relaxed">
                🔧 Сбрасывает состояние «занято» трансмутации, если интерфейс завис во время синтеза. Ваши элементы, прогресс и баланс AiHim сохраняются. Используйте, если кнопка синтеза перестала работать.
              </p>
            </div>

            <p className="text-[10px] opacity-50 italic text-center">Путь алхимика бесконечен...</p>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
              onClick={() => setShowResetConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="parchment-card max-w-md w-full p-8 relative border-2 border-red-900/30"
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setShowResetConfirm(false)} className="absolute top-4 right-4 text-sepia/40 hover:text-sepia"><X size={20} /></button>
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-red-900/10 flex items-center justify-center text-red-900 border border-red-900/20 shadow-xl">
                    <AlertCircle size={40} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-red-900 font-bold mb-1">Внимание! Опасная операция</div>
                    <h2 className="font-gothic text-xl md:text-2xl tracking-widest text-sepia uppercase">Сбросить Вселенную</h2>
                  </div>
                  <div className="w-full h-px bg-sepia/10" />
                  <div className="space-y-3 text-left w-full">
                    <p className="text-sm text-sepia leading-relaxed">
                      Эта операция <strong className="text-red-900">полностью уничтожит</strong> весь ваш прогресс:
                    </p>
                    <ul className="text-xs text-sepia/80 space-y-1 list-disc list-inside">
                      <li>Все открытые элементы будут удалены</li>
                      <li>История трансмутаций будет очищена</li>
                      <li>Баланс AiHim сбросится до стартового</li>
                      <li>Ранг и уровень вернутся к начальным</li>
                    </ul>
                    <p className="text-xs text-sepia/60 italic">
                      Вы начнёте игру заново с базовыми элементами. Это действие невозможно отменить.
                    </p>
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-3 border border-sepia/20 text-sepia hover:bg-sepia/5 transition-all rounded font-bold uppercase tracking-widest text-xs"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => {
                        setShowResetConfirm(false);
                        onReset();
                        window.location.reload();
                      }}
                      className="flex-1 py-3 bg-red-900 text-white hover:bg-red-800 transition-all rounded font-bold uppercase tracking-widest text-xs"
                    >
                      Уничтожить
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fix Stuck Confirmation Modal */}
        <AnimatePresence>
          {showFixConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
              onClick={() => setShowFixConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="parchment-card max-w-md w-full p-8 relative border-2 border-gold/30"
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setShowFixConfirm(false)} className="absolute top-4 right-4 text-sepia/40 hover:text-sepia"><X size={20} /></button>
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-xl">
                    <Zap size={40} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">Техническая операция</div>
                    <h2 className="font-gothic text-xl md:text-2xl tracking-widest text-sepia uppercase">Перезагрузить Эфир</h2>
                  </div>
                  <div className="w-full h-px bg-sepia/10" />
                  <div className="space-y-3 text-left w-full">
                    <p className="text-sm text-sepia leading-relaxed">
                      Эта операция <strong className="text-gold">безопасно перезагружает</strong> процесс синтеза:
                    </p>
                    <ul className="text-xs text-sepia/80 space-y-1 list-disc list-inside">
                      <li>Сбрасывает зависшее состояние трансмутации</li>
                      <li>Все элементы и прогресс сохраняются</li>
                      <li>Баланс AiHim не изменяется</li>
                      <li>Страница будет перезагружена</li>
                    </ul>
                    <p className="text-xs text-sepia/60 italic">
                      Используйте, если кнопка «Трансмутировать» не реагирует или экран завис во время синтеза.
                    </p>
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowFixConfirm(false)}
                      className="flex-1 py-3 border border-sepia/20 text-sepia hover:bg-sepia/5 transition-all rounded font-bold uppercase tracking-widest text-xs"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => {
                        setShowFixConfirm(false);
                        localStorage.removeItem('aihim_is_combining');
                        window.location.reload();
                      }}
                      className="flex-1 py-3 bg-gold text-white hover:bg-gold/80 transition-all rounded font-bold uppercase tracking-widest text-xs"
                    >
                      Перезагрузить
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
