import React from 'react';
import { AlchemyElement, Rarity } from '../types';
import { RARITY_COLORS, translateEssence, STABILITY_DECAY_INTERVAL, TEMPERATURE_DECAY_INTERVAL, INITIAL_ELEMENTS } from '../constants';
import { motion } from 'motion/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Thermometer, Shield, Heart } from 'lucide-react';

import { cn } from '../lib/utils';

interface ElementCardProps {
  element: AlchemyElement;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
  compact?: boolean;
  isDraggable?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ElementCard: React.FC<ElementCardProps> = ({ 
  element, 
  onClick, 
  isSelected, 
  className, 
  compact,
  isDraggable,
  onToggleFavorite
}) => {
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      
      const sIntervalMs = (STABILITY_DECAY_INTERVAL[element.rarity] || 60) * 1000;
      const tIntervalMs = (TEMPERATURE_DECAY_INTERVAL[element.rarity] || 60) * 1000;
      
      const lastSDecay = element.lastDecayAt || element.discoveredAt;
      const lastTDecay = element.lastTempDecayAt || element.discoveredAt;
      
      const sRemaining = Math.max(0, Math.ceil((sIntervalMs - (now - lastSDecay)) / 1000));
      const tRemaining = Math.max(0, Math.ceil((tIntervalMs - (now - lastTDecay)) / 1000));
      
      if ((element.stability ?? 100) <= 0) {
        if ((element.temperature ?? 0) <= -273) {
          setTimeLeft(null);
        } else {
          setTimeLeft(tRemaining);
        }
      } else {
        setTimeLeft(Math.min(sRemaining, tRemaining));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [element?.id, element?.lastDecayAt, element?.lastTempDecayAt, element?.discoveredAt, element?.rarity, element?.stability, element?.temperature]);

  const isDarkRarity = (rarity: Rarity) => {
    return ['Изначальный', 'Трансцендентный', 'Запретный'].includes(rarity);
  };

  if (!element) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: element.id,
    disabled: !isDraggable 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const isDark = isDarkRarity(element.rarity || 'Обычный');

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        if (isDragging) return;
        onClick?.();
      }}
      className={cn(
        "parchment-card cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center",
        isSelected && "ring-2 ring-gold gold-glow scale-105 z-10",
        RARITY_COLORS[element.rarity || 'Обычный'],
        compact ? "p-2 aspect-square" : "p-4 min-h-[120px] aspect-[3/4]",
        isDraggable && "touch-pan-y",
        className
      )}
    >
      {compact && timeLeft !== null && (
        <div className="absolute top-0.5 left-0 right-0 flex flex-col items-center">
          <div className={cn(
            "text-[12px] font-mono font-bold leading-none",
            isDark ? "text-white/80" : "text-ink/60"
          )} title="Время до распада">
            {formatTime(timeLeft)}
          </div>
        </div>
      )}

      {!compact && timeLeft !== null && (
        <div className={cn(
          "absolute top-1 left-0 right-0 text-[8px] font-mono font-bold uppercase tracking-widest text-center",
          isDark ? "text-white/90" : "text-ink/60"
        )}>
          {formatTime(timeLeft)}
        </div>
      )}

      <div className="flex flex-col items-center justify-center flex-1 w-full py-4">
        <div className={cn(
          "mb-1 flex items-center justify-center rounded-full border border-sepia/20 bg-white/30 shadow-inner", 
          compact ? "w-8 h-8 text-lg" : "w-14 h-14 text-3xl"
        )}>
          <span className="drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]">{element.icon || '❓'}</span>
        </div>
        
        <h3 className={cn(
          "font-gothic tracking-widest leading-[0.9] px-1", 
          compact ? "text-[6px]" : "text-[7px] md:text-[8px]",
          isDark && "text-white/90"
        )}>
          {element.name || 'Неизвестно'}
        </h3>

        {!compact && (
          <div className={cn(
            "mt-1 text-[4px] uppercase tracking-[0.2em] font-bold opacity-40",
            isDark && "text-white/60"
          )}>
            {element.rarity || 'Обычный'}
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="absolute bottom-1 left-1 right-1">
          {/* Counters */}
          <div className={cn(
            "flex justify-between w-full px-1 text-[8px] font-mono font-black",
            isDark ? "text-white/90" : "text-ink"
          )}>
            <div className="flex flex-col items-start gap-0.5">
              <span className={cn(
                (element.temperature ?? 0) > 100 ? (isDark ? "text-red-400" : "text-red-600") : 
                (element.temperature ?? 0) < 0 ? (isDark ? "text-blue-400" : "text-blue-600") : ""
              )}>
                {Math.round(element.temperature ?? 0)}°C
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span>
                {element.stability ?? 100}%
              </span>
            </div>
          </div>

          {/* Stability Bar */}
          <div className="mt-0.5 w-full h-1 bg-sepia/10 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${element.stability ?? 100}%` }}
              className={cn(
                "h-full transition-colors duration-500",
                (element.stability ?? 100) < 30 ? "bg-red-500" : (element.stability ?? 100) < 70 ? "bg-orange-400" : "bg-gold"
              )}
            />
          </div>
        </div>
      )}

      {/* Favorite Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.(element.id);
        }}
        className="absolute top-1 right-1 z-30 p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <Heart 
          size={compact ? 10 : 14} 
          className={cn(
            "transition-all duration-300",
            element.isFavorite 
              ? "fill-red-500 text-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]" 
              : isDark ? "text-white/40" : "text-ink/20"
          )} 
        />
      </button>

      {/* Law Badges */}
      <div className="absolute top-1 left-1 flex flex-col gap-1">
        {(element.temperature ?? 0) < (element.targetTemperature ?? 0) - 200 && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            title="Закон Температуры: Слишком холодно!"
            className="p-0.5 bg-blue-500/20 rounded-full border border-blue-500/40"
          >
            <Thermometer size={10} className="text-blue-600" />
          </motion.div>
        )}
        {(element.stability ?? 100) < 80 && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            title="Закон Стабильности: Нестабильно!"
            className="p-0.5 bg-red-500/20 rounded-full border border-red-500/40"
          >
            <Shield size={10} className="text-red-600" />
          </motion.div>
        )}
      </div>

      {/* Essence Indicators */}
      {element.essences && element.essences.length > 0 && (
        <div className="absolute bottom-1 left-1 flex gap-1">
          {element.essences.slice(0, 3).map((ess, i) => (
            <div 
              key={i} 
              className={cn(
                "w-2 h-2 rounded-full flex items-center justify-center text-[5px] text-white font-bold",
                ess === 'life' && "bg-green-500",
                ess === 'death' && "bg-gray-800",
                ess === 'chaos' && "bg-purple-500",
                ess === 'order' && "bg-blue-500",
                ess === 'void' && "bg-black",
                ess === 'creation' && "bg-yellow-400",
                ess === 'destruction' && "bg-red-600"
              )} 
              title={translateEssence(ess)}
            >
              {ess[0].toUpperCase()}
            </div>
          ))}
        </div>
      )}
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-sepia/40" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-sepia/40" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-sepia/40" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-sepia/40" />

      {/* Frost Effect */}
      {(element.stability ?? 100) <= 0 && (element.temperature ?? 0) <= -273 && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-inherit">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-blue-200/30 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:4px_4px]" />
          <div className="absolute inset-0 border-2 border-blue-100/40 rounded-inherit" />
        </div>
      )}
    </motion.div>
  );
};
