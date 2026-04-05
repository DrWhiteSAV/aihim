import { AlchemyElement, Rarity, ElementType, Essence } from "./types";

export const RARITY_COLORS: Record<Rarity, string> = {
  'Обычный': '[--card-bg:#F1F5F9] [--card-border:#CBD5E1] text-slate-700',
  'Редкий': '[--card-bg:#ECFDF5] [--card-border:#A7F3D0] text-emerald-800',
  'Эпический': '[--card-bg:#F0F9FF] [--card-border:#BAE6FD] text-sky-800',
  'Легендарный': '[--card-bg:#FFFBEB] [--card-border:#FDE68A] text-amber-800',
  'Мифический': '[--card-bg:#FEF2F2] [--card-border:#FECACA] text-rose-800',
  'Божественный': '[--card-bg:#FFF7ED] [--card-border:#FFEDD5] text-orange-800',
  'Вечный': '[--card-bg:#F5F3FF] [--card-border:#DDD6FE] text-violet-800',
  'Космический': '[--card-bg:#FDF2F9] [--card-border:#FBCFE8] text-pink-800',
  'Изначальный': '[--card-bg:#1E1B18] [--card-border:#4A453F] text-ash',
  'Трансцендентный': '[--card-bg:#000000] [--card-border:#C9A343] text-gold',
  'Запретный': '[--card-bg:#450a0a] [--card-border:#991b1b] text-red-200',
};

export const STABILITY_TAP_COST: Record<Rarity, number> = {
  'Обычный': 1,
  'Редкий': 2,
  'Эпический': 4,
  'Легендарный': 8,
  'Мифический': 16,
  'Божественный': 32,
  'Вечный': 64,
  'Космический': 128,
  'Изначальный': 256,
  'Трансцендентный': 512,
  'Запретный': 1024,
};

export const STABILITY_DECAY_INTERVAL: Record<Rarity, number> = {
  'Обычный': 60,
  'Редкий': 120,
  'Эпический': 240,
  'Легендарный': 480,
  'Мифический': 960,
  'Божественный': 1920,
  'Вечный': 3840,
  'Космический': 7680,
  'Изначальный': 15360,
  'Трансцендентный': 30720,
  'Запретный': 61440,
};

export const TEMPERATURE_DECAY_INTERVAL: Record<Rarity, number> = {
  'Обычный': 60,
  'Редкий': 120,
  'Эпический': 240,
  'Легендарный': 480,
  'Мифический': 960,
  'Божественный': 1920,
  'Вечный': 3840,
  'Космический': 7680,
  'Изначальный': 15360,
  'Трансцендентный': 30720,
  'Запретный': 61440,
};

export const INITIAL_ELEMENTS: AlchemyElement[] = [
  {
    id: 'water',
    name: 'Вода',
    description: 'Жидкость жизни, адаптируемая и настойчивая. Она течет по венам мира.',
    icon: '💧',
    rarity: 'Обычный',
    type: 'Материя',
    state: 'Жидкое',
    complexity: 1,
    discoveredAt: Date.now(),
    temperature: 20,
    targetTemperature: 22,
    stability: 90,
    essences: ['life', 'order'],
    realityLevel: 1,
  },
  {
    id: 'fire',
    name: 'Огонь',
    description: 'Танцующее тепло, которое поглощает и трансформирует. Искра божественного солнца.',
    icon: '🔥',
    rarity: 'Обычный',
    type: 'Энергия',
    state: 'Плазма',
    complexity: 1,
    discoveredAt: Date.now(),
    temperature: 800,
    targetTemperature: 850,
    stability: 40,
    essences: ['destruction', 'chaos'],
    realityLevel: 1,
  },
  {
    id: 'earth',
    name: 'Земля',
    description: 'Основа всего сущего. Тяжелая, безмолвная и выносливая.',
    icon: '🌍',
    rarity: 'Обычный',
    type: 'Материя',
    state: 'Твердое',
    complexity: 1,
    discoveredAt: Date.now(),
    temperature: 15,
    targetTemperature: 18,
    stability: 100,
    essences: ['order'],
    realityLevel: 1,
  },
  {
    id: 'air',
    name: 'Воздух',
    description: 'Невидимое дыхание мира. Свободное, мимолетное и необходимое.',
    icon: '💨',
    rarity: 'Обычный',
    type: 'Материя',
    state: 'Газ',
    complexity: 1,
    discoveredAt: Date.now(),
    temperature: 20,
    targetTemperature: 25,
    stability: 70,
    essences: ['void'],
    realityLevel: 1,
  },
  {
    id: 'metal',
    name: 'Металл',
    description: 'Кости земли, очищенные жаром. Прочный и резонирующий.',
    icon: '🛡️',
    rarity: 'Редкий',
    type: 'Материя',
    state: 'Твердое',
    complexity: 1,
    discoveredAt: Date.now(),
    temperature: 10,
    targetTemperature: 12,
    stability: 95,
    essences: ['order'],
    realityLevel: 1,
  },
  {
    id: 'energy',
    name: 'Энергия',
    description: 'Чистая сила, движущая материю. Ее нельзя создать или уничтожить, только изменить.',
    icon: '⚡',
    rarity: 'Редкий',
    type: 'Энергия',
    state: 'Эфир',
    complexity: 1,
    discoveredAt: Date.now(),
    temperature: 100,
    targetTemperature: 120,
    stability: 50,
    essences: ['creation', 'chaos'],
    realityLevel: 1,
  },
  {
    id: 'crystal',
    name: 'Кристалл',
    description: 'Порядок, застывший во времени. Он преломляет свет и хранит древние воспоминания.',
    icon: '💎',
    rarity: 'Обычный',
    type: 'Материя',
    state: 'Твердое',
    complexity: 1,
    discoveredAt: Date.now(),
    temperature: 5,
    targetTemperature: 8,
    stability: 98,
    essences: ['order', 'creation'],
    realityLevel: 1,
  },
  {
    id: 'darkness',
    name: 'Тьма',
    description: 'Пустота между звездами. Это отсутствие света и начало всех вещей.',
    icon: '🌑',
    rarity: 'Обычный',
    type: 'Материя',
    state: 'Газ',
    complexity: 1,
    discoveredAt: Date.now(),
    temperature: -50,
    targetTemperature: -60,
    stability: 85,
    essences: ['void', 'death'],
    realityLevel: 1,
  },
];

export const ELEMENT_TYPE_DETAILS: Record<ElementType, { desc: string, influence: string }> = {
  'Материя': {
    desc: 'Физическая основа мира. Твердая, жидкая или газообразная.',
    influence: 'Материя обеспечивает стабильность и предсказуемость. При синтезе с другой Материей шанс успеха выше, но редкость обычно ниже. Материя — это фундамент, на котором строятся более сложные структуры.'
  },
  'Энергия': {
    desc: 'Чистая сила, лишенная массы. Свет, тепло, электричество.',
    influence: 'Энергия повышает температуру и сложность. Синтез с Энергией часто приводит к появлению более редких, но менее стабильных элементов. Она является катализатором перемен.'
  },
  'Гибрид': {
    desc: 'Сложное переплетение материи и энергии.',
    influence: 'Гибриды — мост между мирами. Они позволяют объединять несовместимые сущности, создавая нечто большее, чем сумма их частей. Шанс мутации при использовании Гибридов выше.'
  },
  'Аномалия': {
    desc: 'Искажение реальности, не поддающееся обычным законам.',
    influence: 'Аномалии непредсказуемы. Они игнорируют температурные пределы и могут привести к созданию Запретных элементов. Использование Аномалии — это всегда риск, но и шанс на величайшее открытие.'
  }
};

export const ESSENCE_DETAILS: Record<Essence, { desc: string, influence: string }> = {
  'life': {
    desc: 'Стремление к росту и самовоспроизведению.',
    influence: 'Повышает стабильность биологических структур и шанс создания органических элементов.'
  },
  'death': {
    desc: 'Конечная точка любого пути, энтропия.',
    influence: 'Ускоряет распад, но позволяет извлекать чистую энергию из разрушенных связей.'
  },
  'chaos': {
    desc: 'Первозданная неопределенность и бесконечные возможности.',
    influence: 'Значительно повышает шанс мутации и получения непредсказуемых результатов.'
  },
  'order': {
    desc: 'Структура, закон и симметрия.',
    influence: 'Обеспечивает высокую точность синтеза и соответствие целевой температуре.'
  },
  'void': {
    desc: 'Пространство между вещами, отсутствие всего.',
    influence: 'Позволяет изолировать элементы друг от друга, предотвращая нежелательные реакции.'
  },
  'creation': {
    desc: 'Акт рождения нового из ничего или из старого.',
    influence: 'Повышает шанс открытия совершенно новых элементов, ранее не встречавшихся.'
  },
  'destruction': {
    desc: 'Сила, разрывающая узы и освобождающая энергию.',
    influence: 'Позволяет расщеплять сложные элементы на более простые с выделением AiHim.'
  }
};

export const REALITY_LAYERS = [
  { 
    level: 1, 
    name: "Физический", 
    desc: "Основы материи и энергии.",
    rules: "На этом слое действуют простейшие законы физики. Элементы стабильны, но ограничены в сложности.",
    unlock: "Доступен изначально.",
    reward: 1000,
    conditions: { elements: 0 }
  },
  { 
    level: 2, 
    name: "Эфирный", 
    desc: "Сложные реакции и превращения.",
    rules: "Реакции становятся более бурными. Температура и стабильность начинают играть ключевую роль.",
    unlock: "Откройте 20 новых элементов.",
    reward: 5000,
    conditions: { elements: 20 }
  },
  { 
    level: 3, 
    name: "Астральный", 
    desc: "Зарождение и эволюция жизни.",
    rules: "Материя начинает стремиться к самовоспроизведению. Сущность 'Жизнь' становится катализатором.",
    unlock: "Откройте 50 новых элементов и 1 Редкий.",
    reward: 25000,
    conditions: { elements: 50, rarity: { 'Редкий': 1 } }
  },
  { 
    level: 4, 
    name: "Ментальный", 
    desc: "Разум, время и нематериальное.",
    rules: "Границы между материей и мыслью стираются. Элементы могут существовать вне времени.",
    unlock: "Откройте 100 новых элементов и 1 Эпический.",
    reward: 100000,
    conditions: { elements: 100, rarity: { 'Эпический': 1 } }
  },
  { 
    level: 5, 
    name: "Каузальный", 
    desc: "Тайны звезд и сингулярностей.",
    rules: "Законы локальной реальности более не действуют. Возможно создание 'Запретных' элементов.",
    unlock: "Откройте 200 новых элементов и 1 Легендарный.",
    reward: 500000,
    conditions: { elements: 200, rarity: { 'Легендарный': 1 } }
  },
  { 
    level: 6, 
    name: "Квантовый", 
    desc: "Субатомные вероятности и неопределенность.",
    rules: "Элементы могут находиться в нескольких состояниях одновременно. Стабильность становится вероятностной величиной.",
    unlock: "Откройте 400 новых элементов и 1 Мифический.",
    reward: 2500000,
    conditions: { elements: 400, rarity: { 'Мифический': 1 } }
  },
  { 
    level: 7, 
    name: "Мерный", 
    desc: "Геометрия высших измерений.",
    rules: "Пространство искривляется под весом ваших творений. Появляются многомерные структуры.",
    unlock: "Откройте 700 новых элементов и 1 Божественный.",
    reward: 10000000,
    conditions: { elements: 700, rarity: { 'Божественный': 1 } }
  },
  { 
    level: 8, 
    name: "Темпоральный", 
    desc: "Потоки времени и причинно-следственные связи.",
    rules: "Время течет иначе. Реакции могут завершаться до своего начала.",
    unlock: "Откройте 1000 новых элементов и 1 Вечный.",
    reward: 50000000,
    conditions: { elements: 1000, rarity: { 'Вечный': 1 } }
  },
  { 
    level: 9, 
    name: "Духовный", 
    desc: "Эманации души и чистая воля.",
    rules: "Материя подчиняется духу. Ваши мысли напрямую влияют на результат трансмутации.",
    unlock: "Откройте 1500 новых элементов и 1 Космический.",
    reward: 250000000,
    conditions: { elements: 1500, rarity: { 'Космический': 1 } }
  },
  { 
    level: 10, 
    name: "Божественный", 
    desc: "Творение из ничего.",
    rules: "Вы приближаетесь к уровню демиурга. Энергия AiHim течет сквозь вас бесконечным потоком.",
    unlock: "Откройте 2000 новых элементов и 1 Изначальный.",
    reward: 1000000000,
    conditions: { elements: 2000, rarity: { 'Изначальный': 1 } }
  },
  { 
    level: 11, 
    name: "Вечный", 
    desc: "За пределами циклов рождения и смерти.",
    rules: "Ваши творения не подвластны энтропии. Стабильность больше не падает сама по себе.",
    unlock: "Откройте 3000 новых элементов и 1 Трансцендентный.",
    reward: 5000000000,
    conditions: { elements: 3000, rarity: { 'Трансцендентный': 1 } }
  },
  { 
    level: 12, 
    name: "Изначальный", 
    desc: "Ткань первозданного хаоса.",
    rules: "Вы работаете с материалом, из которого была соткана Вселенная.",
    unlock: "Откройте 5000 новых элементов и достигните уровня 50.",
    reward: 25000000000,
    conditions: { elements: 5000, level: 50 }
  },
  { 
    level: 13, 
    name: "Трансцендентный", 
    desc: "Выход за границы познаваемого.",
    rules: "Законы логики и физики окончательно отступают. Вы создаете концепции.",
    unlock: "Откройте 7500 новых элементов и достигните уровня 75.",
    reward: 100000000000,
    conditions: { elements: 7500, level: 75 }
  },
  { 
    level: 14, 
    name: "Универсальный", 
    desc: "Единство всего со всем.",
    rules: "Вы и есть Вселенная. Каждая ваша мысль — новый элемент.",
    unlock: "Откройте 10000 новых элементов and достигните уровня 100.",
    reward: 500000000000,
    conditions: { elements: 10000, level: 100 }
  },
  { 
    level: 15, 
    name: "Абсолютный", 
    desc: "Точка Омега.",
    rules: "Конец пути. Начало нового цикла. Вы познали всё, что можно было познать.",
    unlock: "Откройте 15000 новых элементов and достигните ранга 'Переход'.",
    reward: 2500000000000,
    conditions: { elements: 15000, rank: 'Переход' }
  },
];

export const RARITY_ORDER = [
  'Обычный',
  'Редкий',
  'Эпический',
  'Легендарный',
  'Мифический',
  'Божественный',
  'Вечный',
  'Космический',
  'Изначальный',
  'Трансцендентный',
  'Запретный'
];

export const calculateRarityChances = (rarityA: string, rarityB: string) => {
  const idxA = RARITY_ORDER.indexOf(rarityA);
  const idxB = RARITY_ORDER.indexOf(rarityB);
  
  if (idxA === -1 || idxB === -1) return { [rarityA]: 100 };

  const maxIdx = Math.max(idxA, idxB);
  const minIdx = Math.min(idxA, idxB);
  const diff = maxIdx - minIdx;
  
  const chances: Record<string, number> = {};

  if (idxA === idxB) {
    // Same rarity combination
    const sameChance = Math.max(40, 70 - (maxIdx * 3));
    const nextChance = Math.min(50, 20 + (maxIdx * 4));
    const prevChance = 10;

    chances[RARITY_ORDER[maxIdx]] = sameChance;
    if (maxIdx + 1 < RARITY_ORDER.length) {
      chances[RARITY_ORDER[maxIdx + 1]] = nextChance;
    } else {
      chances[RARITY_ORDER[maxIdx]] += nextChance;
    }
    if (maxIdx > 0) {
      chances[RARITY_ORDER[maxIdx - 1]] = prevChance;
    } else {
      chances[RARITY_ORDER[maxIdx]] += prevChance;
    }
  } else if (diff === 1) {
    // Close rarities
    chances[RARITY_ORDER[maxIdx]] = 50 + (maxIdx * 2);
    chances[RARITY_ORDER[minIdx]] = 30 - (maxIdx * 1);
    if (maxIdx + 1 < RARITY_ORDER.length) {
      chances[RARITY_ORDER[maxIdx + 1]] = 20 - (maxIdx * 1);
    } else {
      chances[RARITY_ORDER[maxIdx]] += 20 - (maxIdx * 1);
    }
  } else {
    // Distant rarities
    const midIdx = Math.floor((maxIdx + minIdx) / 2);
    chances[RARITY_ORDER[midIdx]] = 60;
    chances[RARITY_ORDER[maxIdx]] = 20;
    chances[RARITY_ORDER[minIdx]] = 20;
  }

  // Normalize to 100%
  const total = Object.values(chances).reduce((a, b) => a + b, 0);
  Object.keys(chances).forEach(key => {
    chances[key] = Math.round((chances[key] / total) * 100);
  });

  return chances;
};

export const RARITY_DETAILS: Record<string, { desc: string, rules: string }> = {
  'Обычный': {
    desc: 'Самые простые и распространенные элементы мироздания.',
    rules: 'Легко синтезируются, обладают высокой стабильностью. Скорость распада: 60с. Стоимость укрепления: 1 AiHim.\n\nШанс при синтезе (с таким же):\n- Обычный: 70%\n- Редкий: 25%\n- Эпический: 5%'
  },
  'Редкий': {
    desc: 'Элементы, требующие более точной настройки эфира.',
    rules: 'Обладают уникальными свойствами. Скорость распада: 120с. Стоимость укрепления: 2 AiHim.\n\nШанс при синтезе (с таким же):\n- Редкий: 65%\n- Эпический: 30%\n- Легендарный: 5%'
  },
  'Эпический': {
    desc: 'Мощные проявления магической энергии.',
    rules: 'Часто нестабильны, требуют постоянного контроля. Скорость распада: 300с. Стоимость укрепления: 5 AiHim.\n\nШанс при синтезе (с таким же):\n- Эпический: 60%\n- Легендарный: 35%\n- Мифический: 5%'
  },
  'Легендарный': {
    desc: 'Элементы, о которых слагают легенды.',
    rules: 'Сложны в получении и удержании. Скорость распада: 600с. Стоимость укрепления: 10 AiHim.\n\nШанс при синтезе (с таким же):\n- Легендарный: 55%\n- Мифический: 40%\n- Божественный: 5%'
  },
  'Мифический': {
    desc: 'Существуют на грани мифа и реальности.',
    rules: 'Обладают огромной силой. Скорость распада: 1200с. Стоимость укрепления: 25 AiHim.\n\nШанс при синтезе (с таким же):\n- Мифический: 50%\n- Божественный: 45%\n- Вечный: 5%'
  },
  'Божественный': {
    desc: 'Частицы божественного творения.',
    rules: 'Почти не поддаются распаду. Скорость распада: 3600с. Стоимость укрепления: 100 AiHim.\n\nШанс при синтезе (с таким же):\n- Божественный: 45%\n- Вечный: 50%\n- Космический: 5%'
  },
  'Вечный': {
    desc: 'Элементы, неподвластные времени.',
    rules: 'Абсолютно стабильны в правильных руках. Скорость распада: 24ч. Стоимость укрепления: 500 AiHim.\n\nШанс при синтезе (с таким же):\n- Вечный: 40%\n- Космический: 55%\n- Изначальный: 5%'
  },
  'Космический': {
    desc: 'Энергия звезд и пустоты.',
    rules: 'Требуют космического масштаба сознания. Скорость распада: 7 дней. Стоимость укрепления: 2500 AiHim.\n\nШанс при синтезе (с таким же):\n- Космический: 35%\n- Изначальный: 60%\n- Трансцендентный: 5%'
  },
  'Изначальный': {
    desc: 'То, что было до начала времен.',
    rules: 'Фундаментальные частицы бытия. Не распадаются. Стоимость укрепления: 10000 AiHim.\n\nШанс при синтезе (с таким же):\n- Изначальный: 30%\n- Трансцендентный: 65%\n- Запретный: 5%'
  },
  'Трансцендентный': {
    desc: 'Выход за пределы понимания.',
    rules: 'Существуют вне пространства и времени. Не распадаются. Стоимость укрепления: 50000 AiHim.\n\nШанс при синтезе (с таким же):\n- Трансцендентный: 25%\n- Запретный: 75%'
  },
  'Запретный': {
    desc: 'Знания, которые не должны были быть открыты.',
    rules: 'Опасны для самого существования Вселенной. Не распадаются. Стоимость укрепления: 250000 AiHim.\n\nШанс при синтезе: Зависит от катализаторов-аномалий.'
  }
};

export const ESSENCE_TRANSLATIONS: Record<string, string> = {
  order: 'Порядок',
  chaos: 'Хаос',
  life: 'Жизнь',
  death: 'Смерть',
  void: 'Пустота',
  creation: 'Созидание',
  destruction: 'Разрушение',
  light: 'Свет',
  darkness: 'Тьма',
  energy: 'Энергия',
  matter: 'Материя',
  time: 'Время',
  mind: 'Разум',
  spirit: 'Дух',
};

export const translateEssence = (essence: string) => {
  return ESSENCE_TRANSLATIONS[essence.toLowerCase()] || essence;
};

export const HIDDEN_LAWS = [
  { id: 'temp', icon: 'Thermometer', name: 'Закон Температуры', desc: 'Жар и холод меняют суть вещей.', detail: 'Синтез невозможен, если текущая температура элемента ниже его нормы более чем на 200°C. Поддерживайте тепло в Кузне.' },
  { id: 'stab', icon: 'Shield', name: 'Закон Стабильности', desc: 'Стабильность — залог существования.', detail: 'При стабильности ниже 80% элемент становится слишком опасным для трансмутации и не может быть помещен на стол. При падении до 0% — стремительное остывание до -273°C и распад.' },
  { id: 'time', icon: 'Hourglass', name: 'Закон Времени', desc: 'Время — безжалостный судья материи.', detail: 'Каждый цикл (60-30000с в зависимости от редкости) стабильность и температура элементов снижаются. Чем выше редкость, тем медленнее распад, но тем сложнее восстановление. Следите за счетчиками циклов в деталях элементов.' },
  { id: 'daynight', icon: 'Contrast', name: 'Закон Дня и Ночи', desc: 'Свет и тьма диктуют ритм творения.', detail: 'Днем (по таймеру мира) все элементы со стабильностью выше 0% получают бесплатный нагрев на 1°C в минуту. Ночью действуют стандартные правила энтропии.' },
  { id: 'forbidden', icon: 'X', name: 'Закон Запретов', desc: 'Некоторые вещи не должны существовать.', detail: 'Запретные элементы могут быть созданы только при использовании Аномалий в качестве катализаторов. Они обладают огромной силой, но их присутствие искажает окружающее пространство.' },
  { id: 'anomaly', icon: 'Zap', name: 'Закон Аномалий', desc: 'Хаос — это тоже порядок, который мы не понимаем.', detail: 'Элементы типа Аномалия игнорируют стандартные температурные ограничения при синтезе, но их результат всегда непредсказуем.' },
];

export const RANKS = [
  { 
    min: 0, 
    name: 'Закалка Тела', 
    levels: '1-10', 
    desc: 'Начальный этап очищения физической оболочки для восприятия эфира.', 
    detail: 'На этом этапе алхимик учится чувствовать тонкие вибрации материи. Тело становится более устойчивым к перепадам температур и магическим эманациям. Вы начинаете понимать простейшие связи между базовыми элементами.',
    icon: '🧪' 
  },
  { 
    min: 200, 
    name: 'Укрепление Основ', 
    levels: '11-20', 
    desc: 'Укрепление энергетических каналов и подготовка к формированию ядра.', 
    detail: 'Ваши энергетические меридианы расширяются, позволяя пропускать через себя больше AiHim. Вы начинаете видеть скрытые сущности внутри обычных предметов. Стабильность ваших трансмутаций заметно растет.',
    icon: '⚗️' 
  },
  { 
    min: 400, 
    name: 'Создание Ядра', 
    levels: '21-30', 
    desc: 'Концентрация внутренней энергии в единый центр силы.', 
    detail: 'В центре вашего существа формируется Алхимическое Ядро — неиссякаемый источник силы. Теперь вы можете удерживать в памяти сложные формулы и манипулировать редкими элементами без риска мгновенного коллапса.',
    icon: '🔮' 
  },
  { 
    min: 600, 
    name: 'Развитие Ядра', 
    levels: '31-40', 
    desc: 'Расширение возможностей ядра и увеличение плотности энергии.', 
    detail: 'Ядро начинает пульсировать в ритме Вселенной. Плотность вашей энергии достигает уровня, при котором вы можете изменять свойства материи одним лишь усилием воли. Открывается путь к эпическим открытиям.',
    icon: '✨' 
  },
  { 
    min: 800, 
    name: 'Укрепление Ядра', 
    levels: '41-50', 
    desc: 'Достижение стабильности ядра при высоких нагрузках.', 
    detail: 'Ваше ядро становится практически неразрушимым. Вы способны выдерживать колоссальное давление при создании легендарных элементов. Температурный контроль становится вашей второй натурой.',
    icon: '🛡️' 
  },
  { 
    min: 1000, 
    name: 'Разжигание Котла', 
    levels: '51-60', 
    desc: 'Пробуждение внутреннего алхимического пламени.', 
    detail: 'Внутри вас вспыхивает Изначальное Пламя. Теперь вы не просто смешиваете элементы, вы переплавляете саму реальность. Мифические элементы начинают откликаться на ваш зов.',
    icon: '🔥' 
  },
  { 
    min: 1200, 
    name: 'Круги Силы', 
    levels: '61-70', 
    desc: 'Формирование внешних орбит энергии вокруг ядра.', 
    detail: 'Вокруг ядра образуются защитные и усиливающие кольца. Это позволяет проводить несколько трансмутаций одновременно и стабилизировать даже самые капризные божественные субстанции.',
    icon: '🌀' 
  },
  { 
    min: 1400, 
    name: 'Цветущий Сад', 
    levels: '71-80', 
    desc: 'Гармонизация внутренних энергий и проявление их в мире.', 
    detail: 'Ваша энергия становится живой. Там, где вы проходите, расцветает жизнь. Вы понимаете язык растений и минералов, что открывает доступ к вечным элементам.',
    icon: '🌿' 
  },
  { 
    min: 1600, 
    name: 'Очищение Котла', 
    levels: '81-90', 
    desc: 'Удаление последних примесей из алхимического процесса.', 
    detail: 'Ваш алхимический процесс достигает абсолютной чистоты. Никаких побочных продуктов, только чистая эссенция творения. Космические элементы становятся достижимыми.',
    icon: '💎' 
  },
  { 
    min: 1800, 
    name: 'Постижение Сути', 
    levels: '91-100', 
    desc: 'Понимание истинной природы элементов.', 
    detail: 'Вы видите мир как сплетение информационных потоков. Имена вещей больше не имеют значения, вы знаете их истинную суть. Изначальные элементы открывают вам свои тайны.',
    icon: '👁️' 
  },
  { 
    min: 2000, 
    name: 'Жемчужина Души', 
    levels: '101-200', 
    desc: 'Трансформация ядра в духовную жемчужину.', 
    detail: 'Ваше ядро кристаллизуется в Жемчужину Души. Вы больше не зависите от физического тела. Ваши знания позволяют манипулировать трансцендентными энергиями.',
    icon: '⚪' 
  },
  { 
    min: 4000, 
    name: 'Жемчужина Стихий', 
    levels: '201-500', 
    desc: 'Овладение всеми стихиями на уровне души.', 
    detail: 'Все стихии мира находятся в полном вашем подчинении. Вы можете создавать целые миры в капле воды или гасить звезды одним взглядом.',
    icon: '🌈' 
  },
  { 
    min: 10000, 
    name: 'Духовный Путь', 
    levels: '501-1000', 
    desc: 'Выход за пределы материального мира.', 
    detail: 'Вы становитесь чистым духом, путешествующим по измерениям. Материальные ограничения больше не властны над вами. Вы — творец смыслов.',
    icon: '🌌' 
  },
  { 
    min: 20000, 
    name: 'Небесный Путь', 
    levels: '1001-5000', 
    desc: 'Слияние с волей небес.', 
    detail: 'Ваша воля становится волей самой Вселенной. Вы определяете законы, по которым существуют галактики. Вы — архитектор реальности.',
    icon: '☁️' 
  },
  { 
    min: 100000, 
    name: 'Переход', 
    levels: '5001-50000', 
    desc: 'Окончательная трансформация в высшее существо.', 
    detail: 'Вы покидаете этот цикл существования, переходя на уровень, недоступный пониманию смертных. Вы становитесь Изначальным Светом.',
    icon: '🚪' 
  },
];

export const calculateRank = (totalElements: number) => {
  const level = Math.floor(totalElements / 20) + 1;
  const currentRank = [...RANKS].reverse().find(r => totalElements >= r.min) || RANKS[0];
  const nextRank = RANKS[RANKS.indexOf(currentRank) + 1];
  
  // Progress to next level (every 20 elements)
  const elementsInCurrentLevel = totalElements % 20;
  const progressToNextLevel = (elementsInCurrentLevel / 20) * 100;
  const levelTarget = level * 20;
  
  // Progress to next rank
  const progressToNextRank = nextRank 
    ? ((totalElements - currentRank.min) / (nextRank.min - currentRank.min)) * 100 
    : 100;
  
  return { 
    currentRank, 
    nextRank, 
    progressToNextRank, 
    level, 
    levelTarget,
    progressToNextLevel,
    elementsToNextLevel: 20 - elementsInCurrentLevel
  };
};

export const calculateUnlockedReality = (elements: AlchemyElement[]) => {
  const validElements = elements.filter(e => e !== null);
  const totalElements = validElements.length;
  const { currentRank } = calculateRank(totalElements);
  const rarityCounts = validElements.reduce((acc, el) => {
    acc[el.rarity] = (acc[el.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find the highest layer where conditions are met
  const unlockedLayers = REALITY_LAYERS.filter(layer => {
    if (layer.level === 1) return true;
    
    const cond = layer.conditions;
    if (!cond) return false;

    // Check elements count
    if (cond.elements !== undefined && totalElements < cond.elements) return false;

    // Check rarity requirements
    if (cond.rarity) {
      for (const [rarity, count] of Object.entries(cond.rarity)) {
        if ((rarityCounts[rarity] || 0) < count) return false;
      }
    }

    // Check rank requirement
    if (cond.rank && RANKS.findIndex(r => r.name === currentRank.name) < RANKS.findIndex(r => r.name === cond.rank)) {
      return false;
    }

    // Check level requirement
    if (cond.level && Math.floor(totalElements / 20) + 1 < cond.level) return false;

    return true;
  });

  const maxConditionLevel = Math.max(1, ...unlockedLayers.map(l => l.level));
  const maxDiscoveredLevel = validElements.reduce((max, e) => {
    const level = Number(e.realityLevel);
    return isNaN(level) ? max : Math.max(max, level);
  }, 1);

  // The unlocked reality is the HIGHEST of either met conditions OR discovered elements
  return Math.max(maxConditionLevel, maxDiscoveredLevel);
};
