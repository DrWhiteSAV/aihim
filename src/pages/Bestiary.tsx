import React, { useState, useMemo } from 'react';
import { AlchemyElement, Rarity, ElementType, Essence } from '../types';
import { ElementCard } from '../components/ElementCard';
import { ElementDetailsModal } from '../components/ElementDetailsModal';
import { Search, Trash2, X, Filter, BarChart3, Calendar, Sparkles, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_ELEMENTS, translateEssence } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BestiaryProps {
  elements: AlchemyElement[];
  onDelete: (id: string) => void;
  onSelectElement: (element: AlchemyElement) => void;
  onToggleFavorite: (id: string) => void;
}

export const Bestiary: React.FC<BestiaryProps> = ({ elements, onDelete, onSelectElement, onToggleFavorite }) => {
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<ElementType | 'All'>('All');
  const [essenceFilter, setEssenceFilter] = useState<Essence | 'All'>('All');
  const [favoriteFilter, setFavoriteFilter] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const [elementToDelete, setElementToDelete] = useState<string | null>(null);

  const filteredElements = useMemo(() => {
    return elements.filter(e => {
      if (!e) return false;
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchesRarity = rarityFilter === 'All' || e.rarity === rarityFilter;
      const matchesType = typeFilter === 'All' || e.type === typeFilter;
      const matchesEssence = essenceFilter === 'All' || (e.essences && e.essences.includes(essenceFilter as Essence));
      const matchesFavorite = !favoriteFilter || e.isFavorite;
      return matchesSearch && matchesRarity && matchesType && matchesEssence && matchesFavorite;
    }).sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.discoveredAt - a.discoveredAt;
    });
  }, [elements, search, rarityFilter, typeFilter, essenceFilter, favoriteFilter]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, rarityFilter, typeFilter, essenceFilter, favoriteFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredElements.length / itemsPerPage);
  const paginatedElements = filteredElements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const validElements = elements.filter(e => e !== null);
    const newElements = validElements.filter(e => (now - e.discoveredAt) < oneDay).length;
    
    const byDate: Record<string, number> = {};
    validElements.forEach(e => {
      const date = new Date(e.discoveredAt).toLocaleDateString();
      byDate[date] = (byDate[date] || 0) + 1;
    });

    const sortedDates = Object.entries(byDate)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5);

    return { newElements, sortedDates };
  }, [elements]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-6"
    >
      {/* Stats & Counters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="parchment-card p-4 bg-gold/5 border-gold/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/30">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-gold tracking-widest">Новые открытия</div>
            <div className="text-2xl font-gothic tracking-widest">{stats.newElements} <span className="text-xs font-serif italic text-sepia/60">за 24ч</span></div>
          </div>
        </div>
        
        <div className="parchment-card p-4 bg-sepia/5 border-sepia/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-sepia/40 tracking-widest mb-1">
            <Calendar size={12} />
            История открытий
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1 custom-scrollbar">
            {stats.sortedDates.map(([date, count]) => (
              <div key={date} className="flex flex-col items-center min-w-[60px]">
                <div className="text-[10px] font-bold text-gold">{count}</div>
                <div className="text-[8px] text-sepia/60 uppercase tracking-tighter">{date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 parchment-card p-6 bg-sepia/[0.02]">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sepia/40" size={18} />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-transparent border-b border-sepia/20 focus:border-gold outline-none text-base font-serif italic"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sepia/40 hover:text-sepia"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto justify-center lg:justify-end">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-sepia/40 font-bold ml-1">Узы</span>
              <button 
                onClick={() => setFavoriteFilter(!favoriteFilter)}
                className={cn(
                  "px-3 py-2 text-sm rounded border transition-all duration-300 flex items-center gap-2",
                  favoriteFilter 
                    ? "bg-red-500/10 border-red-500/40 text-red-600" 
                    : "bg-parchment border-sepia/20 text-sepia/60 hover:border-gold"
                )}
              >
                <Heart size={14} className={favoriteFilter ? "fill-red-500" : ""} />
                Эфирные Узы
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-sepia/40 font-bold ml-1">Показывать</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-parchment border border-sepia/20 rounded px-3 py-2 text-sm outline-none focus:border-gold min-w-[100px]"
              >
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-sepia/40 font-bold ml-1">Редкость</span>
              <select 
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value as any)}
                className="bg-parchment border border-sepia/20 rounded px-3 py-2 text-sm outline-none focus:border-gold min-w-[140px]"
              >
                <option value="All">Все редкости</option>
                <option value="Обычный">Обычный</option>
                <option value="Редкий">Редкий</option>
                <option value="Эпический">Эпический</option>
                <option value="Легендарный">Легендарный</option>
                <option value="Мифический">Мифический</option>
                <option value="Божественный">Божественный</option>
                <option value="Вечный">Вечный</option>
                <option value="Космический">Космический</option>
                <option value="Изначальный">Изначальный</option>
                <option value="Трансцендентный">Трансцендентный</option>
                <option value="Запретный">Запретный</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-sepia/40 font-bold ml-1">Тип</span>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-parchment border border-sepia/20 rounded px-3 py-2 text-sm outline-none focus:border-gold min-w-[140px]"
              >
                <option value="All">Все типы</option>
                <option value="Материя">Материя</option>
                <option value="Энергия">Энергия</option>
                <option value="Гибрид">Гибрид</option>
                <option value="Аномалия">Аномалия</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-sepia/40 font-bold ml-1">Эссенция</span>
              <select 
                value={essenceFilter}
                onChange={(e) => setEssenceFilter(e.target.value as any)}
                className="bg-parchment border border-sepia/20 rounded px-3 py-2 text-sm outline-none focus:border-gold min-w-[140px]"
              >
                <option value="All">Все эссенции</option>
                <option value="life">{translateEssence('life')}</option>
                <option value="death">{translateEssence('death')}</option>
                <option value="chaos">{translateEssence('chaos')}</option>
                <option value="order">{translateEssence('order')}</option>
                <option value="void">{translateEssence('void')}</option>
                <option value="creation">{translateEssence('creation')}</option>
                <option value="destruction">{translateEssence('destruction')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {paginatedElements.map((element) => (
          <div key={element.id} className="relative group">
            <ElementCard 
              element={element} 
              onClick={() => onSelectElement(element)}
              onToggleFavorite={onToggleFavorite}
              className="h-full"
            />
            {/* New Badge */}
            {(Date.now() - element.discoveredAt) < (24 * 60 * 60 * 1000) && (
              <div className="absolute -top-2 -left-2 bg-gold text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 animate-bounce">
                NEW
              </div>
            )}
            {!INITIAL_ELEMENTS.some(ie => ie.id === element.id) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setElementToDelete(element.id);
                }}
                className="absolute top-2 right-2 p-2 bg-red-900/10 text-red-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/20 z-20"
                title="Удалить элемент"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-2 border border-sepia/20 rounded disabled:opacity-20 hover:bg-sepia/5 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none custom-scrollbar pb-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all shrink-0",
                  currentPage === page 
                    ? "bg-gold text-white shadow-lg" 
                    : "border border-sepia/20 text-sepia hover:bg-sepia/5"
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-2 border border-sepia/20 rounded disabled:opacity-20 hover:bg-sepia/5 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {filteredElements.length === 0 && (
        <div className="text-center py-32 opacity-40 italic font-serif text-xl">
          Сущности не найдены в древних свитках...
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {elementToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
            onClick={() => setElementToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="parchment-card max-w-sm w-full p-8 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center text-red-900 mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="font-gothic text-xl text-sepia mb-2 uppercase tracking-widest">Удалить запись?</h3>
              <p className="text-sm text-sepia/60 mb-8 italic">
                Вы уверены, что хотите стереть знания об этом элементе из древних свитков?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setElementToDelete(null)}
                  className="flex-1 py-3 border border-sepia/20 text-sepia hover:bg-sepia/5 transition-all rounded font-bold uppercase tracking-widest text-[10px]"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    onDelete(elementToDelete);
                    setElementToDelete(null);
                  }}
                  className="flex-1 py-3 bg-red-900 text-white hover:bg-red-800 transition-all rounded font-bold uppercase tracking-widest text-[10px] shadow-lg"
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ElementDetailsModal is now handled globally in App.tsx */}
    </motion.div>
  );
};
