import React, { useMemo, useState } from 'react';
import { AlchemyElement } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, User, Zap, Trophy, BookOpen, History, X } from 'lucide-react';
import { calculateRank } from '../constants';
import { ElementDetailsModal } from '../components/ElementDetailsModal';

interface ProfileProps {
  elements: AlchemyElement[];
  history: Array<{
    elementA: AlchemyElement;
    elementB: AlchemyElement;
    result: AlchemyElement;
    timestamp: number;
    isNew: boolean;
  }>;
  aihim: number;
}

export const Profile: React.FC<ProfileProps> = ({ elements, history, aihim }) => {
  const [selectedHistoryElement, setSelectedHistoryElement] = useState<AlchemyElement | null>(null);
  const { currentRank, level, levelTarget, progressToNextRank, nextRank } = useMemo(() => {
    return calculateRank(elements.length);
  }, [elements.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8 pb-12"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-2xl bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-5xl shadow-xl relative group overflow-hidden">
          <User size={48} className="text-gold/40 absolute -bottom-2 -right-2 rotate-12 group-hover:scale-110 transition-transform" />
          <span className="relative z-10">{currentRank.icon}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[10px] uppercase font-bold text-gold tracking-[0.3em]">Мастер Алхимии</div>
          <h1 className="text-4xl font-gothic tracking-widest text-sepia">{currentRank.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sepia/60">
              <Trophy size={14} className="text-gold" />
              Уровень {level}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sepia/60">
              <Zap size={14} className="text-gold" />
              {aihim.toLocaleString()} AiHim
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="parchment-card p-6 bg-gold/5 border-gold/20 flex flex-col gap-2">
          <div className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest flex items-center gap-2">
            <BookOpen size={12} />
            Открыто Элементов
          </div>
          <div className="text-3xl font-gothic text-sepia">{elements.length} / {levelTarget}</div>
          <div className="w-full h-1.5 bg-sepia/10 rounded-full overflow-hidden mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(elements.length / levelTarget) * 100}%` }}
              className="h-full bg-gold"
            />
          </div>
        </div>

        <div className="parchment-card p-6 bg-gold/5 border-gold/20 flex flex-col gap-2">
          <div className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest flex items-center gap-2">
            <Sparkles size={12} />
            Прогресс Ранга
          </div>
          <div className="text-3xl font-gothic text-sepia">{Math.floor(progressToNextRank)}%</div>
          <div className="w-full h-1.5 bg-sepia/10 rounded-full overflow-hidden mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextRank}%` }}
              className="h-full bg-gold shadow-[0_0_10px_rgba(201,163,67,0.5)]"
            />
          </div>
          <div className="text-[9px] uppercase font-bold text-gold/60 mt-1">
            До {nextRank?.name || 'Предела'}: {nextRank ? nextRank.min - elements.length : 0} элементов
          </div>
        </div>

        <div className="parchment-card p-6 bg-gold/5 border-gold/20 flex flex-col gap-2">
          <div className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest flex items-center gap-2">
            <History size={12} />
            Всего Трансмутаций
          </div>
          <div className="text-3xl font-gothic text-sepia">{history.length}</div>
          <div className="text-[9px] uppercase font-bold text-sepia/40 mt-1 italic">
            Ваш путь записан в веках
          </div>
        </div>
      </div>

      {/* History Section (Chronicle) */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-sepia/10 pb-4">
          <h2 className="text-2xl font-gothic tracking-widest flex items-center gap-3">
            <History className="text-gold" />
            ХРОНИКА ТРАНСМУТАЦИЙ
          </h2>
          <div className="text-[10px] uppercase font-bold text-sepia/40 tracking-widest">
            Последние записи
          </div>
        </div>

        <div className="space-y-4">
          {history.map((entry, i) => (
            <motion.div
              key={entry.timestamp + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedHistoryElement(entry.result)}
              className="parchment-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gold/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-[10px] font-bold text-sepia/60 w-10 font-mono shrink-0">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <span className="text-xs font-bold group-hover:text-gold transition-colors truncate max-w-[80px] sm:max-w-none">{entry.elementA.name}</span>
                  <span className="text-sepia/30 text-[10px]">+</span>
                  <span className="text-xs font-bold group-hover:text-gold transition-colors truncate max-w-[80px] sm:max-w-none">{entry.elementB.name}</span>
                </div>
              </div>

              <div className="hidden sm:block">
                <ArrowRight size={14} className="text-sepia/30 group-hover:text-gold/50 transition-colors" />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-sepia/5">
                <div className="text-left sm:text-right flex-1">
                  <div className="text-sm font-gothic text-gold flex items-center gap-1 sm:justify-end">
                    {entry.isNew && <Sparkles size={10} className="animate-pulse" />}
                    {entry.result.name}
                  </div>
                  <div className="text-[9px] uppercase opacity-50 tracking-tighter">{entry.result.rarity}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform shrink-0">
                   {entry.result.icon}
                </div>
              </div>
            </motion.div>
          ))}

          {history.length === 0 && (
            <div className="parchment-card p-12 text-center opacity-40 italic border-dashed">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              Эксперименты еще не записаны. Начните свой путь в Ателье.
            </div>
          )}
        </div>
      </div>

      {/* Element Detail Modal */}
      <ElementDetailsModal 
        element={selectedHistoryElement} 
        onClose={() => setSelectedHistoryElement(null)} 
      />
    </motion.div>
  );
};
