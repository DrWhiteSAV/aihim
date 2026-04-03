export type Rarity = 
  | 'Обычный' 
  | 'Редкий' 
  | 'Эпический' 
  | 'Легендарный' 
  | 'Мифический' 
  | 'Божественный' 
  | 'Вечный' 
  | 'Космический' 
  | 'Изначальный' 
  | 'Трансцендентный'
  | 'Запретный';
export type ElementType = 'Материя' | 'Энергия' | 'Гибрид' | 'Аномалия';
export type ElementState = 'Твердое' | 'Жидкое' | 'Газ' | 'Плазма' | 'Эфир';
export type Essence = 'life' | 'death' | 'order' | 'chaos' | 'void' | 'creation' | 'destruction';

export type WorldPhase = 'day' | 'night';

export interface AlchemyElement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  type: ElementType;
  state: ElementState;
  complexity: number;
  parents?: [string, string];
  discoveredAt: number;
  isMutation?: boolean;
  
  // Hidden Logic Layer
  temperature: number; // -100 to 1000
  targetTemperature: number; // ideal temperature
  stability: number; // 0-100
  essences: Essence[];
  realityLevel: number; // 1-5 (Physical, Chemical, Biological, Abstract, Cosmic)
  lastDecayAt?: number; // timestamp
  lastTempDecayAt?: number; // timestamp
  isFavorite?: boolean;
}

export interface CombinationResult {
  element: AlchemyElement | null;
  isNew: boolean;
  message?: string;
  isMutation?: boolean;
  isAlmostGuessed?: boolean;
}
