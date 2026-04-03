import { GoogleGenAI, Type } from "@google/genai";
import { AlchemyElement, Rarity, ElementType, ElementState, WorldPhase } from "../types";
import { ELEMENT_TYPE_DETAILS, ESSENCE_DETAILS } from "../constants";

const ELEMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    element: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Название нового элемента" },
        description: { type: Type.STRING, description: "Описание в стиле древнего манускрипта" },
        icon: { type: Type.STRING, description: "Один подходящий эмодзи" },
        rarity: { type: Type.STRING, enum: ["Обычный", "Редкий", "Эпический", "Легендарный", "Мифический", "Божественный", "Вечный", "Космический", "Изначальный", "Трансцендентный", "Запретный"] },
        type: { type: Type.STRING, enum: ["Материя", "Энергия", "Гибрид", "Аномалия"] },
        state: { type: Type.STRING, enum: ["Твердое", "Жидкое", "Газ", "Плазма", "Эфир"] },
        complexity: { type: Type.NUMBER },
        temperature: { type: Type.NUMBER, description: "Текущая температура при создании" },
        targetTemperature: { type: Type.NUMBER, description: "Идеальная температура для стабильности элемента (от -273 до 1000). Должна быть уникальной для каждого элемента." },
        stability: { type: Type.NUMBER },
        essences: { type: Type.ARRAY, items: { type: Type.STRING } },
        realityLevel: { type: Type.NUMBER },
      },
      required: ["name", "description", "icon", "rarity", "type", "state", "complexity", "temperature", "targetTemperature", "stability", "essences", "realityLevel"],
    },
    message: { type: Type.STRING, description: "Сообщение игроку (например, 'Реакция нестабильна...' если почти угадал)" },
    isMutation: { type: Type.BOOLEAN, description: "Является ли результат редкой мутацией" },
    isAlmostGuessed: { type: Type.BOOLEAN, description: "Игрок был близок к открытию, но не совсем" },
  },
  required: ["message", "isMutation", "isAlmostGuessed"],
};

export async function generateNewElement(
  elementA: AlchemyElement,
  elementB: AlchemyElement,
  existingElements: AlchemyElement[],
  worldPhase: WorldPhase,
  discoveredLaws: any[] = [],
  currentLayer: any = null,
  availableLayers: any[] = []
): Promise<{ element: AlchemyElement | null, message?: string, isMutation?: boolean, isAlmostGuessed?: boolean }> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  const prompt = `
    Ты — ИИ-Алхимик, управляющий Графом Вселенной. Твоя задача — создать результат трансмутации двух элементов.
    
    ТЕКУЩАЯ ФАЗА МИРА: ${worldPhase === 'day' ? 'ДЕНЬ (шанс на светлые элементы выше)' : 'НОЧЬ (шанс на тёмные элементы выше)'}.
    
    ТЕКУЩИЙ СЛОЙ РЕАЛЬНОСТИ (ВЫБРАН АЛХИМИКОМ): ${currentLayer ? `${currentLayer.level} - ${currentLayer.name}` : '1 - Физический'}.
    ПРАВИЛА СЛОЯ: ${currentLayer ? currentLayer.rules : 'Базовые законы материи.'}
    ВАЖНО: Выбранный слой определяет "контекст" синтеза. На разных слоях одни и те же ингредиенты могут давать разные результаты. 
    - Например, на Физическом слое (1) Огонь + Вода = Пар.
    - На Ментальном слое (4) Огонь + Вода = Туман Забытья или Иллюзия Тепла.
    
    ДОСТУПНЫЕ СЛОИ ДЛЯ ОТКРЫТИЯ (НОВЫЙ ЭЛЕМЕНТ ДОЛЖЕН БЫТЬ ИЗ ЭТОГО СПИСКА): ${availableLayers.map(l => `${l.level} - ${l.name}`).join(', ')}
    
    ОТКРЫТЫЕ ЗАКОНЫ МИРОЗДАНИЯ:
    ${discoveredLaws.length > 0 
      ? discoveredLaws.map(l => `- ${l.name}: ${l.detail}`).join('\n')
      : 'Законы еще не познаны. Действуй по базовой логике.'}
    
    ТИПЫ ЭЛЕМЕНТОВ (ВЛИЯНИЕ НА СИНТЕЗ):
    ${Object.entries(ELEMENT_TYPE_DETAILS).map(([type, details]) => `- ${type}: ${details.influence}`).join('\n')}
    
    ЭССЕНЦИИ (ВЛИЯНИЕ НА СИНТЕЗ):
    ${Object.entries(ESSENCE_DETAILS).map(([essence, details]) => `- ${essence}: ${details.influence}`).join('\n')}
    
    ЗАКОН ЗАПРЕТОВ: Запретные элементы (Rarity: Запретный) могут быть созданы только при использовании Аномалий (Type: Аномалия) в качестве катализаторов.
    ЗАКОН АНОМАЛИЙ: Элементы типа Аномалия игнорируют стандартные температурные ограничения при синтезе, но их результат всегда непредсказуем.
    
    ГРАФ ВСЕЛЕННОЙ:
    - Все элементы — узлы. Связи — рецепты.
    - Текущие открытые элементы: ${existingElements.map(e => `${e.name} (ID: ${e.id}, Слой: ${e.realityLevel})`).join(', ')}.
    
    ИСХОДНЫЕ ЭЛЕМЕНТЫ:
    1. ${elementA.name}: Редкость: ${elementA.rarity}, Тип: ${elementA.type}, Состояние: ${elementA.state}, Темп: ${elementA.temperature}, Стабильность: ${elementA.stability}, Сущности: ${elementA.essences.join(', ')}, Слой: ${elementA.realityLevel}.
    2. ${elementB.name}: Редкость: ${elementB.rarity}, Тип: ${elementB.type}, Состояние: ${elementB.state}, Темп: ${elementB.temperature}, Стабильность: ${elementB.stability}, Сущности: ${elementB.essences.join(', ')}, Слой: ${elementB.realityLevel}.
    
    ЭКОНОМИКА И ПРОГРЕССИЯ:
    - СЛОЙ 1 (0-10 элементов): Почти каждая комбинация даёт результат. Логично и быстро.
    - СЛОЙ 2 (10-30 элементов): Появляются "тупики". Давай намёки в 'message' (например: "Этот элемент жаждет тепла...").
    - СЛОЙ 3+ (30+ элементов): Редкость, мутации, нестабильность.
    
    ИЕРАРХИЯ РЕДКОСТИ: Обычный < Редкий < Эпический < Легендарный < Мифический < Божественный < Вечный < Космический < Изначальный < Трансцендентный < Запретный.
    
    СИСТЕМА РЕДКОСТИ (КАЛЬКУЛЯЦИЯ):
    - Редкость результата СТРОГО зависит от редкости исходных элементов.
    - ПРАВИЛО ОДИНАКОВЫХ: Если (Rarity A == Rarity B), шанс получить (Rarity + 1) составляет 25-45% (шанс растет с уровнем редкости), шанс сохранить ту же редкость — 50-65%, шанс понижения — 10%.
    - ПРАВИЛО РАЗНЫХ: Если редкости отличаются, результат обычно стремится к средней или высшей из двух, но шанс на (Max Rarity + 1) значительно ниже (5-10%).
    - ЗАПРЕТНЫЙ: Требует Аномалию и как минимум один Трансцендентный элемент для шанса > 1%.
    
    МУТАЦИИ (шанс 5-10%):
    - Вместо обычного результата (например, "Пар") создай что-то живое или аномальное (например, "Живой пар", "Эфирный туман").
    - Если мутация случилась, установи isMutation: true.
    
    МЕХАНИКА "ПОЧТИ УГАДАЛ" (isAlmostGuessed):
    - Если комбинация НЕ даёт нового элемента, но она "близка" по смыслу к чему-то существующему или логичному, установи isAlmostGuessed: true и напиши интригующее сообщение (например: "Реакция нестабильна...", "Не хватает искры жизни..."). В этом случае 'element' может быть null.
    
    ТВОЯ ЛОГИКА:
    1. Смешай параметры. Проверь законы (Температура, Противоположности, Жизнь, Время, Запреты, Аномалии).
    2. Если стабильность < 20 — создай Аномалию.
    3. Описание должно быть "рукописным", в стиле XVII века.
    4. Если игрок застрял (мало новых открытий), подтолкни его через 'message'.
    5. НОВЫЙ ЭЛЕМЕНТ должен иметь realityLevel из списка доступных слоев. Если условия позволяют, он может быть из следующего доступного слоя.
    
    Ответ строго на русском языке.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ELEMENT_SCHEMA,
    },
  });

  const data = JSON.parse(response.text);
  
  if (data.element && data.element.name) {
    return {
      element: {
        ...data.element,
        temperature: Math.round(data.element.temperature || 0),
        targetTemperature: Math.round(data.element.targetTemperature || 0),
        id: data.element.name.toLowerCase().replace(/\s+/g, '-'),
        parents: [elementA.id, elementB.id],
        discoveredAt: Date.now(),
        isMutation: !!data.isMutation,
      },
      message: data.message || null,
      isMutation: !!data.isMutation,
      isAlmostGuessed: !!data.isAlmostGuessed,
    };
  }

  return {
    element: null,
    message: data.message,
    isMutation: data.isMutation,
    isAlmostGuessed: data.isAlmostGuessed,
  };
}
