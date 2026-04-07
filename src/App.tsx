import React, { useState, useEffect } from 'react';
import { AlchemyElement, WorldPhase, CombinationResult } from './types';
import { INITIAL_ELEMENTS, calculateRank, HIDDEN_LAWS, REALITY_LAYERS, STABILITY_DECAY_INTERVAL, TEMPERATURE_DECAY_INTERVAL, calculateUnlockedReality } from './constants';
import { Atelier } from './pages/Atelier';
import { Bestiary } from './pages/Bestiary';
import { Profile } from './pages/Profile';
import { Arcana } from './pages/Arcana';
import { Maintenance } from './pages/Maintenance';
import { AdminPage } from './pages/Admin';
import { BrowserLoginPage } from './pages/BrowserLogin';
import { GoogleCallbackPage } from './pages/GoogleCallback';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ElementDetailsModal } from './components/ElementDetailsModal';
import { ElementCard } from './components/ElementCard';
import { VortexAnimation, MagicParticles, RareFlash } from './components/Animations';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { Book, FlaskConical, History, Settings as SettingsIcon, Sparkles, X, Hammer, Thermometer, AlertCircle, Zap, Coins, User } from 'lucide-react';
import { generateNewElement } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MaintenanceWrapper: React.FC<{
  discoveredElements: AlchemyElement[];
  setDiscoveredElements: React.Dispatch<React.SetStateAction<AlchemyElement[]>>;
  aihim: number;
  setAihim: React.Dispatch<React.SetStateAction<number>>;
  setIsShopOpen: (open: boolean) => void;
  toggleFavorite: (id: string) => void;
  regenTimer: number;
}> = ({ discoveredElements, setDiscoveredElements, aihim, setAihim, setIsShopOpen, toggleFavorite, regenTimer }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Maintenance 
        elements={discoveredElements}
        setElements={setDiscoveredElements}
        initialElementId={id}
        onClearInitial={() => navigate('/maintenance', { replace: true })}
        aihim={aihim}
        setAihim={setAihim}
        onOpenShop={() => setIsShopOpen(true)}
        onToggleFavorite={toggleFavorite}
        regenTimer={regenTimer}
      />
    </motion.div>
  );
};

export default function App() {
  const [discoveredElements, setDiscoveredElements] = useState<AlchemyElement[]>(() => {
    const saved = localStorage.getItem('aihim_elements');
    if (!saved) return INITIAL_ELEMENTS;
    
    try {
      const parsed = JSON.parse(saved);
      // Filter out any null/undefined elements that might have been saved
      const validElements = Array.isArray(parsed) ? parsed.filter((e): e is AlchemyElement => e !== null && typeof e === 'object' && !!e.id) : INITIAL_ELEMENTS;
      
      // Migration: If elements are in English (e.g., name is "Water"), reset to INITIAL_ELEMENTS
      const isEnglish = validElements.some((e: any) => e.id === 'water' && e.name === 'Water');
      if (isEnglish) {
        localStorage.removeItem('aihim_elements');
        localStorage.removeItem('aihim_history');
        return INITIAL_ELEMENTS;
      }
      
      // Migration: Ensure all elements have targetTemperature
      return validElements.map((e: any) => {
        if (e.targetTemperature === undefined || e.targetTemperature === 0) {
          const initial = INITIAL_ELEMENTS.find(ie => ie.id === e.id);
          if (initial) return { ...e, targetTemperature: initial.targetTemperature };
          return { ...e, targetTemperature: e.temperature || 0 };
        }
        return e;
      });
    } catch (e) {
      return INITIAL_ELEMENTS;
    }
  });

  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('aihim_history');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname === '/' ? 'atelier' : location.pathname.split('/')[1];

  const [aihim, setAihim] = useState<number>(() => {
    const saved = localStorage.getItem('aihim_energy');
    return saved ? parseInt(saved) : 100;
  });

  useEffect(() => {
    localStorage.setItem('aihim_energy', aihim.toString());
  }, [aihim]);

  const [stabilityWarning, setStabilityWarning] = useState<AlchemyElement | null>(null);
  const [temperatureWarning, setTemperatureWarning] = useState<AlchemyElement | null>(null);
  const [isCombining, setIsCombining] = useState(false);
  const [combinationResult, setCombinationResult] = useState<AlchemyElement | null>(null);
  const [worldPhase, setWorldPhase] = useState<WorldPhase>('day');
  const [lastCombinationTime, setLastCombinationTime] = useState(0);
  const [alchemyMessage, setAlchemyMessage] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<AlchemyElement | null>(null);
  const [slotA, setSlotA] = useState<AlchemyElement | null>(null);
  const [slotB, setSlotB] = useState<AlchemyElement | null>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [cancelTimer, setCancelTimer] = useState(25);
  const [phaseTimer, setPhaseTimer] = useState(300);
  const [regenTimer, setRegenTimer] = useState(60);
  
  // Stage Notification State
  const [stageNotification, setStageNotification] = useState<{
    type: 'rank' | 'layer' | 'level';
    title: string;
    value: string | number;
    icon: string | React.ReactNode;
    desc: string;
  } | null>(null);

  const [prevRankName, setPrevRankName] = useState<string>(() => {
    const saved = localStorage.getItem('aihim_prev_rank');
    return saved || 'Закалка Тела';
  });

  const [prevLayerLevel, setPrevLayerLevel] = useState<number>(() => {
    const saved = localStorage.getItem('aihim_prev_layer');
    return saved ? parseInt(saved) : 1;
  });

  const [prevAlchemyLevel, setPrevAlchemyLevel] = useState<number>(() => {
    const saved = localStorage.getItem('aihim_prev_level');
    return saved ? parseInt(saved) : 1;
  });

  const [selectedRealityLevel, setSelectedRealityLevel] = useState<number>(() => {
    const saved = localStorage.getItem('aihim_selected_layer');
    if (saved) return parseInt(saved);
    return calculateUnlockedReality(discoveredElements);
  });

  // Monitor Progress for Notifications
  useEffect(() => {
    const { currentRank, level } = calculateRank(discoveredElements.length);
    const maxReality = calculateUnlockedReality(discoveredElements);

    // Rank Notification
    if (currentRank.name !== prevRankName) {
      setStageNotification({
        type: 'rank',
        title: 'НОВЫЙ РАНГ ДОСТИГНУТ',
        value: currentRank.name,
        icon: currentRank.icon,
        desc: currentRank.desc
      });
      setPrevRankName(currentRank.name);
      localStorage.setItem('aihim_prev_rank', currentRank.name);
    }

    // Level Notification
    if (level > prevAlchemyLevel) {
      setStageNotification({
        type: 'level',
        title: 'НОВЫЙ УРОВЕНЬ АЛХИМИИ',
        value: level,
        icon: <Sparkles className="text-gold" size={32} />,
        desc: `Ваше мастерство растет. Теперь вы можете манипулировать более сложными структурами.`
      });
      setPrevAlchemyLevel(level);
      localStorage.setItem('aihim_prev_level', level.toString());
    }

    // Layer Notification
    if (maxReality > prevLayerLevel) {
      const layer = REALITY_LAYERS.find(l => l.level === maxReality);
      if (layer) {
        setStageNotification({
          type: 'layer',
          title: 'НОВЫЙ СЛОЙ РЕАЛЬНОСТИ',
          value: layer.name,
          icon: <FlaskConical className="text-gold" size={32} />,
          desc: layer.desc
        });
        setPrevLayerLevel(maxReality);
        localStorage.setItem('aihim_prev_layer', maxReality.toString());
        // Auto-switch to new layer if it's higher
        setSelectedRealityLevel(maxReality);
        localStorage.setItem('aihim_selected_layer', maxReality.toString());
      }
    }
  }, [discoveredElements.length, prevRankName, prevAlchemyLevel, prevLayerLevel]);

  const toggleFavorite = (elementId: string) => {
    setDiscoveredElements(current => {
      const updated = current.map(e => 
        e.id === elementId ? { ...e, isFavorite: !e.isFavorite } : e
      );
      localStorage.setItem('aihim_elements', JSON.stringify(updated));
      return updated;
    });
    
    // Update slots if they contain the element
    if (slotA?.id === elementId) {
      setSlotA(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
    if (slotB?.id === elementId) {
      setSlotB(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleTrySetSlot = (element: AlchemyElement | null, slot: 'A' | 'B') => {
    if (!element) {
      if (slot === 'A') setSlotA(null);
      else setSlotB(null);
      return;
    }

    // Stability Check: Minimum 80% required
    if ((element.stability ?? 100) < 80) {
      setStabilityWarning(element);
      return;
    }

    // Temperature Check: Synthesis impossible if current temp is > 200 degrees below target
    const tempDiff = (element.targetTemperature || 0) - (element.temperature || 0);
    if (tempDiff > 200) {
      setTemperatureWarning(element);
      return;
    }

    if (slot === 'A') {
      if (slotB?.id !== element.id) setSlotA(element);
    } else {
      if (slotA?.id !== element.id) setSlotB(element);
    }
  };

  // Timer for combination
  useEffect(() => {
    let interval: any;
    if (isCombining) {
      setCancelTimer(25);
      interval = setInterval(() => {
        setCancelTimer(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCombining]);

  // Stability & Temperature Update Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setDiscoveredElements(current => {
        let hasChanged = false;
        const nextElements = current.map(el => {
          let updatedEl = { ...el };
          
          // Stability Decay
          const sIntervalMs = (STABILITY_DECAY_INTERVAL[el.rarity] || 60) * 1000;
          const lastSDecay = el.lastDecayAt || el.discoveredAt;
          
          if (updatedEl.stability > 0 && now - lastSDecay >= sIntervalMs) {
            hasChanged = true;
            updatedEl = { 
              ...updatedEl, 
              stability: Math.max(0, (updatedEl.stability ?? 100) - 1),
              lastDecayAt: now 
            };
          }

          // Temperature Decay (Goes cold)
          const tIntervalMs = (TEMPERATURE_DECAY_INTERVAL[el.rarity] || 60) * 1000;
          const lastTDecay = el.lastTempDecayAt || el.discoveredAt;

          if (now - lastTDecay >= tIntervalMs) {
            hasChanged = true;
            
            // Day and Night Law: If day and stability > 0, free heating instead of cooling
            if (worldPhase === 'day' && updatedEl.stability > 0) {
              updatedEl = {
                ...updatedEl,
                temperature: (updatedEl.temperature ?? 0) + 1,
                lastTempDecayAt: now
              };
            } else {
              updatedEl = {
                ...updatedEl,
                temperature: Math.max(-273, (updatedEl.temperature ?? 0) - 1),
                lastTempDecayAt: now
              };
            }
          }
          
          return updatedEl;
        });
        return hasChanged ? nextElements : current;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [worldPhase]);

  // Phase Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseTimer(prev => {
        if (prev <= 1) {
          setWorldPhase(current => current === 'day' ? 'night' : 'day');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // AiHim Auto-Regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setRegenTimer(prev => {
        if (prev <= 1) {
          const { level } = calculateRank(discoveredElements.length);
          setAihim(a => a + (100 * level));
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [discoveredElements.length]);

  useEffect(() => {
    localStorage.setItem('aihim_elements', JSON.stringify(discoveredElements));
  }, [discoveredElements]);

  useEffect(() => {
    localStorage.setItem('aihim_history', JSON.stringify(history));
  }, [history]);

  const handleCombine = async (elementA: AlchemyElement, elementB: AlchemyElement) => {
    if (!elementA || !elementB) return;
    const now = Date.now();
    if (now - lastCombinationTime < 3000) {
      setAlchemyMessage("Тигель ещё не остыл... Подождите несколько секунд.");
      return;
    }

    // Temperature Check: Synthesis impossible if current temp is > 200 degrees below target
    const tempDiffA = (elementA.targetTemperature || 0) - (elementA.temperature || 0);
    const tempDiffB = (elementB.targetTemperature || 0) - (elementB.temperature || 0);

    if (tempDiffA > 200 || tempDiffB > 200) {
      setAlchemyMessage("Температура одного из элементов слишком низка для трансмутации! Разница с нормой превышает 200°C.");
      return;
    }

    // Stability Check: Minimum 80% required
    if ((elementA.stability ?? 100) < 80 || (elementB.stability ?? 100) < 80) {
      setAlchemyMessage("Один из элементов слишком нестабилен для трансмутации! Требуется минимум 80% стабильности.");
      return;
    }

    setIsCombining(true);
    setAlchemyMessage(null);
    setLastCombinationTime(now);

    try {
      const discoveredLaws = HIDDEN_LAWS.filter(law => {
        if (law.id === 'temp') return discoveredElements.some(e => (e.temperature ?? 0) < (e.targetTemperature ?? 0) - 200);
        if (law.id === 'stab') return discoveredElements.some(e => (e.stability ?? 100) <= 0);
        return false;
      });

      const existing = discoveredElements.find(e => 
        e && e.parents && (
          (e.parents[0] === elementA.id && e.parents[1] === elementB.id) ||
          (e.parents[0] === elementB.id && e.parents[1] === elementA.id)
        )
      );

      if (existing) {
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSelectedElement(existing);
        setHistory(prev => [{
          elementA,
          elementB,
          result: existing,
          timestamp: Date.now(),
          isNew: false
        }, ...prev.slice(0, 49)]);
        return;
      }

      const maxReality = calculateUnlockedReality(discoveredElements);
      const currentLayer = REALITY_LAYERS.find(l => l.level === selectedRealityLevel) || REALITY_LAYERS[0];
      
      // Calculate which layers are "available" for discovery
      const availableLayers = REALITY_LAYERS.filter(layer => {
        if (layer.level <= maxReality) return true;
        if (layer.level === maxReality + 1) {
          const prevLayerNewElements = discoveredElements.filter(e => 
            e && e.realityLevel === layer.level - 1 && 
            !INITIAL_ELEMENTS.some(ie => ie && ie.id === e.id)
          ).length;
          
          if (layer.level === 2) return prevLayerNewElements >= 10;
          if (layer.level === 3) return prevLayerNewElements >= 15 && discoveredElements.some(e => e.essences?.includes('life'));
          if (layer.level === 4) return prevLayerNewElements >= 25;
          if (layer.level === 5) return prevLayerNewElements >= 50;
          return false;
        }
        return false;
      });

      const result = await generateNewElement(
        elementA, 
        elementB, 
        discoveredElements, 
        worldPhase, 
        discoveredLaws, 
        currentLayer,
        availableLayers
      );
      
      if (result.element) {
        // Day/Night Impact on Stability
        let stabilityBonus = 0;
        if (worldPhase === 'day') {
          if (result.element.essences?.includes('creation') || result.element.type === 'Энергия') {
            stabilityBonus = 10;
          }
        } else {
          if (result.element.essences?.includes('void') || result.element.essences?.includes('destruction')) {
            stabilityBonus = 10;
          }
        }
        
        const finalElement = {
          ...result.element,
          stability: Math.min(100, (result.element.stability || 100) + stabilityBonus),
          lastDecayAt: Date.now()
        };

        setDiscoveredElements(prev => [...prev, finalElement]);
        
        // Reveal sequence
        setCombinationResult(finalElement);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setSelectedElement(finalElement);
        setHistory(prev => [{
          elementA,
          elementB,
          result: finalElement,
          timestamp: Date.now(),
          isNew: true
        }, ...prev.slice(0, 49)]);
        setCombinationResult(null);
      }

      if (result.message) {
        setAlchemyMessage(result.message);
      } else if (result.isAlmostGuessed) {
        setAlchemyMessage("Реакция была близка к успеху, но чего-то не хватило...");
      }

    } catch (error) {
      console.error("Alchemy failed:", error);
      setAlchemyMessage("Трансмутация прервана хаосом...");
    } finally {
      setIsCombining(false);
    }
  };

  const deleteElement = (id: string) => {
    if (INITIAL_ELEMENTS.some(e => e.id === id)) {
      alert("Первоначальные элементы нельзя удалить!");
      return;
    }
    setDiscoveredElements(prev => prev.filter(e => e && e.id !== id));
    setHistory(prev => prev.filter(h => h && h.result && h.result.id !== id));
  };

  const navItems = [
    { id: 'atelier', icon: FlaskConical, label: 'Стол' },
    { id: 'bestiary', icon: Book, label: 'Бестиарий' },
    { id: 'maintenance', icon: Hammer, label: 'Кузня' },
    { id: 'profile', icon: User, label: 'Алхимик' },
    { id: 'arcana', icon: SettingsIcon, label: 'Арканы' },
  ];

  const renderNav = (isMobile: boolean) => (
    <nav className={isMobile 
      ? "fixed bottom-0 left-0 right-0 bg-parchment border-t border-sepia/20 flex justify-around py-2 z-50 md:hidden" 
      : "hidden md:flex gap-6 items-center"
    }>
      {navItems.map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.id === 'atelier' ? '/' : `/${tab.id}`)}
          className={`flex flex-col items-center p-2 min-w-[60px] transition-all duration-300 ${
            activeTab === tab.id ? 'text-gold scale-110' : 'text-sepia/60 hover:text-sepia'
          }`}
        >
          <tab.icon size={isMobile ? 20 : 24} />
          <span className="text-[9px] uppercase font-bold mt-1 tracking-widest">{tab.label}</span>
          {!isMobile && activeTab === tab.id && (
            <motion.div layoutId="nav-underline" className="h-0.5 w-full bg-gold mt-1" />
          )}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-4 pb-24 md:pb-12 pt-6 overflow-y-auto">
      {/* Header Navigation - Always Visible on PC, Hidden on Mobile */}
      <header className="hidden md:flex flex-col md:flex-row items-center justify-between gap-4 relative z-[400] mb-8 pb-4 border-b border-sepia/10">
        <div 
          className="flex items-center gap-3 cursor-pointer group transition-all duration-300"
          onClick={() => navigate('/')}
        >
          <motion.img 
            whileHover={{ rotate: 10, scale: 1.1 }}
            src="https://i.ibb.co/5g4dfh7f/aihim.png" 
            alt="Logo" 
            className="h-10 object-contain" 
          />
          <div className="flex flex-col">
            <span className="font-gothic text-xl text-gold leading-none">AIhim</span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center">
          {renderNav(false)}
        </div>
      </header>

      {/* Main Content Area (Pages) */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname.split('/')[1] || 'atelier'}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Main Logo only on Atelier Page as requested */}
                <div className="flex flex-col items-center mb-12">
                  <motion.img 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src="https://i.ibb.co/5g4dfh7f/aihim.png" 
                    alt="AIhim Grand Logo" 
                    className="h-32 md:h-48 object-contain mb-4 drop-shadow-2xl"
                  />
                </div>

                <Atelier 
                  elements={discoveredElements} 
                  setElements={setDiscoveredElements}
                  onCombine={handleCombine}
                  isCombining={isCombining}
                  worldPhase={worldPhase}
                  phaseTimer={phaseTimer}
                  alchemyMessage={alchemyMessage}
                  onClearMessage={() => {
                    setAlchemyMessage(null);
                    setIsCombining(false);
                  }}
                  onSelectElement={setSelectedElement}
                  onToggleFavorite={toggleFavorite}
                  slotA={slotA}
                  setSlotA={(el) => el === null ? setSlotA(null) : handleTrySetSlot(el as AlchemyElement, 'A')}
                  slotB={slotB}
                  setSlotB={(el) => el === null ? setSlotB(null) : handleTrySetSlot(el as AlchemyElement, 'B')}
                  aihim={aihim}
                  onOpenShop={() => setIsShopOpen(true)}
                  selectedRealityLevel={selectedRealityLevel}
                  onSelectRealityLevel={(level) => {
                    setSelectedRealityLevel(level);
                    localStorage.setItem('aihim_selected_layer', level.toString());
                  }}
                />
              </motion.div>
            } />

            <Route path="/bestiary" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="font-gothic text-3xl text-sepia tracking-widest">БЕСТИАРИЙ</h1>
                  <p className="text-sepia italic text-sm opacity-70">Собрание всех известных сущностей</p>
                </div>
                <Bestiary 
                  elements={discoveredElements} 
                  onDelete={deleteElement}
                  onSelectElement={setSelectedElement}
                  onToggleFavorite={toggleFavorite}
                />
              </motion.div>
            } />

            <Route path="/maintenance" element={<MaintenanceWrapper discoveredElements={discoveredElements} setDiscoveredElements={setDiscoveredElements} aihim={aihim} setAihim={setAihim} setIsShopOpen={setIsShopOpen} toggleFavorite={toggleFavorite} regenTimer={regenTimer} />} />
            <Route path="/maintenance/:id" element={<MaintenanceWrapper discoveredElements={discoveredElements} setDiscoveredElements={setDiscoveredElements} aihim={aihim} setAihim={setAihim} setIsShopOpen={setIsShopOpen} toggleFavorite={toggleFavorite} regenTimer={regenTimer} />} />

            <Route path="/profile" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="font-gothic text-3xl text-sepia tracking-widest">АЛХИМИК</h1>
                  <p className="text-sepia italic text-sm opacity-70">Ваш путь к истинному знанию</p>
                </div>
                <Profile 
                  elements={discoveredElements}
                  history={history}
                  aihim={aihim}
                />
              </motion.div>
            } />
            
            <Route path="/arcana" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="font-gothic text-3xl text-sepia tracking-widest">АРКАНЫ</h1>
                  <p className="text-sepia italic text-sm opacity-70">Тайные настройки мироздания</p>
                </div>
                <Arcana 
                  elements={discoveredElements}
                  aihim={aihim}
                  setAihim={setAihim}
                  onReset={() => {
                    setDiscoveredElements(INITIAL_ELEMENTS);
                    setHistory([]);
                    setIsCombining(false);
                    setAlchemyMessage(null);
                    setAihim(1000000);
                    localStorage.clear();
                  }}
                />
              </motion.div>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Mobile Nav */}
      {renderNav(true)}

      {/* Global Modals */}
      <AnimatePresence>
        {alchemyMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-sm parchment-card p-8 shadow-2xl gold-glow border-gold/40"
            >
              <button 
                onClick={() => setAlchemyMessage(null)}
                className="absolute top-4 right-4 text-sepia/40 hover:text-sepia transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Sparkles size={32} />
                </div>
                <p className="text-lg font-serif italic text-sepia leading-relaxed">
                  {alchemyMessage}
                </p>
                <button
                  onClick={() => setAlchemyMessage(null)}
                  className="w-full bg-gold text-white py-3 rounded-full font-gothic tracking-widest shadow-lg"
                >
                  ПОНЯТНО
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isCombining && !alchemyMessage && (
          <motion.div 
            key="combining-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/80 backdrop-blur-xl p-4"
          >
            <div className="relative flex flex-col items-center w-full">
              {/* Enhanced Mixing Elements Animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                  {!combinationResult ? (
                    <div key="mixing-group" className="relative flex items-center justify-center">
                      <motion.div
                        key="mixing-a"
                        initial={{ x: -300, opacity: 0, scale: 0.8 }}
                        animate={{ 
                          x: [ -300, -150, 0 ],
                          scale: [ 0.8, 1.2, 0.5 ],
                          opacity: [ 0, 1, 0.5 ],
                          rotate: [ 0, 180, 360 ]
                        }}
                        transition={{ 
                          duration: 4, 
                          ease: "easeInOut",
                          repeat: Infinity
                        }}
                        className="absolute"
                      >
                        {slotA && <ElementCard element={slotA} className="w-40 h-40 gold-glow border-gold/50" />}
                      </motion.div>
                      
                      <motion.div
                        key="mixing-b"
                        initial={{ x: 300, opacity: 0, scale: 0.8 }}
                        animate={{ 
                          x: [ 300, 150, 0 ],
                          scale: [ 0.8, 1.2, 0.5 ],
                          opacity: [ 0, 1, 0.5 ],
                          rotate: [ 0, -180, -360 ]
                        }}
                        transition={{ 
                          duration: 4, 
                          ease: "easeInOut",
                          repeat: Infinity
                        }}
                        className="absolute"
                      >
                        {slotB && <ElementCard element={slotB} className="w-40 h-40 gold-glow border-gold/50" />}
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      key="reveal-glow"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      className={cn(
                        "absolute w-96 h-96 rounded-full blur-[100px] animate-pulse",
                        combinationResult.rarity === 'Обычный' && "bg-slate-400/50",
                        combinationResult.rarity === 'Редкий' && "bg-emerald-400/50",
                        combinationResult.rarity === 'Эпический' && "bg-sky-400/50",
                        combinationResult.rarity === 'Легендарный' && "bg-amber-400/50",
                        combinationResult.rarity === 'Мифический' && "bg-rose-400/50",
                        combinationResult.rarity === 'Божественный' && "bg-orange-400/50",
                        combinationResult.rarity === 'Вечный' && "bg-violet-400/50",
                        combinationResult.rarity === 'Космический' && "bg-pink-400/50",
                        combinationResult.rarity === 'Изначальный' && "bg-stone-600/50",
                        combinationResult.rarity === 'Трансцендентный' && "bg-gold/50"
                      )}
                    />
                  )}
                </AnimatePresence>
              </div>

              <VortexAnimation 
                className={cn(
                  "w-48 h-48 md:w-80 md:h-80 relative z-10 transition-colors duration-1000",
                  combinationResult?.rarity === 'Редкий' && "text-emerald-500",
                  combinationResult?.rarity === 'Эпический' && "text-sky-500",
                  combinationResult?.rarity === 'Легендарный' && "text-amber-500",
                  combinationResult?.rarity === 'Мифический' && "text-rose-500",
                  combinationResult?.rarity === 'Божественный' && "text-orange-500",
                  combinationResult?.rarity === 'Вечный' && "text-violet-500",
                  combinationResult?.rarity === 'Космический' && "text-pink-500",
                  combinationResult?.rarity === 'Изначальный' && "text-stone-500",
                  combinationResult?.rarity === 'Трансцендентный' && "text-gold"
                )} 
              />
              <MagicParticles />
              
              <div className="flex flex-col items-center gap-4 mt-12 relative z-10">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-gothic text-2xl md:text-5xl text-gold tracking-[0.4em] md:tracking-[0.8em] text-center w-full px-2 drop-shadow-glow"
                >
                  {combinationResult ? "СУЩНОСТЬ ПРОЯВЛЕНА" : "ТРАНСМУТАЦИЯ..."}
                </motion.p>

                {combinationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-1">Уровень редкости</span>
                    <span className={cn(
                      "text-xl md:text-3xl font-black uppercase tracking-[0.2em] drop-shadow-sm",
                      combinationResult.rarity === 'Обычный' && "text-slate-400",
                      combinationResult.rarity === 'Редкий' && "text-emerald-400",
                      combinationResult.rarity === 'Эпический' && "text-sky-400",
                      combinationResult.rarity === 'Легендарный' && "text-amber-400",
                      combinationResult.rarity === 'Мифический' && "text-rose-400",
                      combinationResult.rarity === 'Божественный' && "text-orange-400",
                      combinationResult.rarity === 'Вечный' && "text-violet-400",
                      combinationResult.rarity === 'Космический' && "text-pink-400",
                      combinationResult.rarity === 'Изначальный' && "text-stone-400",
                      combinationResult.rarity === 'Трансцендентный' && "text-gold"
                    )}>
                      {combinationResult.rarity}
                    </span>
                  </motion.div>
                )}
              </div>
              
              <div className="mt-8 text-gold/40 font-mono text-base tracking-widest relative z-10">
                ЭФИРНЫЙ СТАБИЛИЗАТОР: {cancelTimer}s
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={() => {
                  setIsCombining(false);
                  setAlchemyMessage(null);
                  setCombinationResult(null);
                }}
                className="mt-20 px-10 py-4 border-2 border-gold/20 text-gold/40 hover:text-gold hover:border-gold/60 transition-all rounded-full text-sm uppercase tracking-[0.3em] font-bold relative z-[1010] bg-ink/50"
              >
                Прервать Ритуал
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Removed newlyDiscovered popup as requested - opening DetailsModal directly */}
      </AnimatePresence>

      <ElementDetailsModal 
        element={selectedElement} 
        onClose={() => setSelectedElement(null)} 
        onMaintenance={(element) => {
          if (!element) return;
          navigate(`/maintenance/${element.id}`);
          setSelectedElement(null);
        }}
        onUse={(element) => {
          if (!element) return;
          if (activeTab !== 'atelier') {
            navigate('/');
          }
          
          if (!slotA) {
            handleTrySetSlot(element, 'A');
          } else if (!slotB && slotA && slotA.id !== element.id) {
            handleTrySetSlot(element, 'B');
          } else {
            // If both full or same as A, replace A
            handleTrySetSlot(element, 'A');
          }
          setSelectedElement(null);
        }}
      />

      {/* Footer / Stats */}
      <footer className="mt-8 pt-4 border-t border-sepia/10 flex justify-center items-center text-[10px] uppercase tracking-widest font-bold text-sepia/60">
        <div className="opacity-40 italic">Путь алхимика бесконечен...</div>
      </footer>

      {/* Shop Modal */}
      <AnimatePresence>
        {/* Stability Warning Modal */}
        {stabilityWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-sm parchment-card p-8 shadow-2xl border-red-900/40"
            >
              <button 
                onClick={() => setStabilityWarning(null)}
                className="absolute top-4 right-4 text-sepia/40 hover:text-sepia transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center text-red-900">
                  <AlertCircle size={32} />
                </div>
                <h3 className="font-gothic text-xl text-red-900 uppercase tracking-widest">Нестабильность!</h3>
                <p className="text-sm font-serif italic text-sepia leading-relaxed">
                  Сущность "{stabilityWarning.name}" слишком нестабильна ({stabilityWarning.stability}%). 
                  Для трансмутации требуется минимум 80% стабильности. 
                  Восстановите её в Кузне!
                </p>
                <button
                  onClick={() => {
                    navigate(`/maintenance/${stabilityWarning.id}`);
                    setStabilityWarning(null);
                  }}
                  className="w-full bg-red-900 text-white py-3 rounded-full font-gothic tracking-widest shadow-lg"
                >
                  В КУЗНЮ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Temperature Warning Modal */}
        {temperatureWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-sm parchment-card p-8 shadow-2xl border-blue-900/40"
            >
              <button 
                onClick={() => setTemperatureWarning(null)}
                className="absolute top-4 right-4 text-sepia/40 hover:text-sepia transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-900/10 flex items-center justify-center text-blue-900">
                  <Thermometer size={32} />
                </div>
                <h3 className="font-gothic text-xl text-blue-900 uppercase tracking-widest">Холодная Сущность!</h3>
                <p className="text-sm font-serif italic text-sepia leading-relaxed">
                  Температура "{temperatureWarning.name}" слишком низка ({temperatureWarning.temperature}°C). 
                  Разница с нормой ({temperatureWarning.targetTemperature}°C) превышает 200°C. 
                  Разогрейте её в Кузне!
                </p>
                <button
                  onClick={() => {
                    navigate(`/maintenance/${temperatureWarning.id}`);
                    setTemperatureWarning(null);
                  }}
                  className="w-full bg-blue-900 text-white py-3 rounded-full font-gothic tracking-widest shadow-lg"
                >
                  В КУЗНЮ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stage Notification Modal */}
        {stageNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-md parchment-card p-10 shadow-[0_0_50px_rgba(201,163,67,0.4)] gold-glow border-gold/60 text-center"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gold flex items-center justify-center text-5xl shadow-2xl border-4 border-parchment">
                {stageNotification.icon}
              </div>
              
              <div className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] uppercase font-bold text-gold tracking-[0.3em]">{stageNotification.title}</div>
                  <h2 className="font-gothic text-4xl text-sepia tracking-widest uppercase">{stageNotification.value}</h2>
                </div>
                
                <div className="h-px w-full bg-gold/20" />
                
                <p className="text-sm font-serif italic text-sepia/80 leading-relaxed">
                  {stageNotification.desc}
                </p>
                
                <button
                  onClick={() => setStageNotification(null)}
                  className="w-full bg-gold text-white py-4 rounded-xl font-gothic tracking-widest shadow-lg hover:bg-gold-light transition-all active:scale-95"
                >
                  ПРОДОЛЖИТЬ ПУТЬ
                </button>
              </div>
              
              <MagicParticles />
            </motion.div>
          </motion.div>
        )}

        {isShopOpen && (
          <div className="fixed inset-0 z-[1000] overflow-y-auto custom-scrollbar">
            <div className="min-h-screen flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsShopOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="parchment-card max-w-md w-full p-6 md:p-8 relative z-10 border-2 border-gold shadow-[0_0_50px_rgba(212,175,55,0.3)]"
              >
              <button 
                onClick={() => setIsShopOpen(false)}
                className="absolute top-4 right-4 text-sepia/40 hover:text-sepia transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
                  <Zap size={32} className="text-gold" />
                </div>
                <h2 className="font-gothic text-3xl text-gold mb-2">МАГАЗИН ЭНЕРГИИ</h2>
                <p className="font-serif italic text-sepia/60">AiHim — топливо для ваших великих свершений</p>
                {(() => {
                  const { level } = calculateRank(discoveredElements.length);
                  return (
                    <p className="text-[10px] text-gold mt-2 uppercase tracking-widest font-bold">
                      Ваш уровень ({level}) увеличивает объем пакетов в {level} раз!
                    </p>
                  );
                })()}
              </div>

              <div className="space-y-4">
                {[
                  { amount: 100, price: 1 },
                  { amount: 1000, price: 10 },
                  { amount: 10000, price: 100 },
                  { amount: 100000, price: 1000 },
                ].map((pack) => {
                  const { level } = calculateRank(discoveredElements.length);
                  const multipliedAmount = pack.amount * level;
                  return (
                    <button
                      key={pack.amount}
                      onClick={() => {
                        setAihim(prev => prev + multipliedAmount);
                        setAlchemyMessage(`Приобретено ${multipliedAmount.toLocaleString()} AiHim!`);
                        setIsShopOpen(false);
                      }}
                      className="w-full p-4 border border-sepia/20 rounded-lg flex items-center justify-between hover:border-gold hover:bg-gold/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={20} className="text-gold group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                          <div className="font-bold text-sepia">{multipliedAmount.toLocaleString()} AiHim</div>
                          <div className="text-[10px] text-sepia/40 uppercase tracking-widest">Энергетический пакет</div>
                        </div>
                      </div>
                      <div className="font-gothic text-xl text-gold">{pack.price} ₽</div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-8 text-[9px] text-center text-sepia/40 uppercase tracking-tighter leading-relaxed">
                * Внимание: Покупка за рубли является имитацией для игрового процесса. <br />
                Нажатие на кнопку мгновенно начисляет энергию.
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
    </div>
  );
}
