import React from 'react';
import { Gift, Archive, Gem, ShieldCheck, Crown, Hammer, Clock } from 'lucide-react';
import { ServiceItem, PortfolioItem, FAQItem, WoodOption, InteriorOption } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: "Подарочные коробки",
    description: "Эксклюзивная упаковка для дорогих подарков, подчеркивающая статус дарителя.",
    icon: <Gift className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Ювелирные кейсы",
    description: "Бархатные ложементы, ценные породы дерева и надежные механизмы.",
    icon: <Gem className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Коллекционные кейсы",
    description: "Для часов, монет, вин и антиквариата. Идеальный микроклимат и защита.",
    icon: <Archive className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Корпоративные серии",
    description: "Брендированные решения для бизнеса. Малые и средние тиражи.",
    icon: <Crown className="w-6 h-6" />
  }
];

export const PROCESS_STEPS = [
  { step: "01", title: "Бриф", text: "Обсуждение задачи, размеров и материалов." },
  { step: "02", title: "Концепт", text: "Разработка дизайна и утверждение стилистики." },
  { step: "03", title: "Прототип", text: "Создание тестового образца (при необходимости)." },
  { step: "04", title: "Производство", text: "Ручная работа мастеров, распил, сборка." },
  { step: "05", title: "Контроль", text: "Двойная проверка качества и отделки." },
  { step: "06", title: "Доставка", text: "Бережная упаковка и отправка клиенту." },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: "Royal Oak Case",
    description: "Массив дуба, золотая фурнитура, бархат.",
    imageUrl: "images/lenta1.png",
    alt: "box1"
  },
  {
    id: 2,
    title: "Velvet Night",
    description: "Черное дерево, скрытые петли, матовый лак.",
    imageUrl: "images/lenta2.png",
    alt: "box2"
  },
  {
    id: 3,
    title: "Heritage Set",
    description: "Набор для фамильных украшений. Красное дерево.",
    imageUrl: "images/lenta3.png",
    alt: "box3"
  },
  {
    id: 4,
    title: "Whiskey Vault",
    description: "Кейс для коллекционного алкоголя. Гравировка.",
    imageUrl: "images/lenta4.png",
    alt: "box4"
  },
  {
    id: 5,
    title: "Minimalist Gift",
    description: "Светлый ясень, магнитный замок. Строгость линий.",
    imageUrl: "images/lenta5.png",
    alt: "box5"
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Какой минимальный тираж вы берете в работу?",
    answer: "Мы работаем с заказами от 1 штуки. Мы ценим эксклюзивность и индивидуальный подход к каждому изделию."
  },
  {
    question: "Подписываете ли вы NDA?",
    answer: "Да, абсолютная конфиденциальность — наш стандарт. Мы уважаем приватность наших клиентов и не публикуем работы без разрешения."
  },
  {
    question: "Какие породы дерева вы используете?",
    answer: "Мы работаем с дубом, сосной, ясенем и буком. Возможна тонировка под любой оттенок."
  },
  {
    question: "Сколько времени занимает изготовление?",
    answer: "В среднем от 14 до 30 дней, в зависимости от сложности проекта и текущей загрузки мастерской."
  }
];

export const ADVANTAGES = [
  { id: 1, text: "Только массив дерева", icon: <Hammer className="text-amber-600 mb-2" /> },
  { id: 2, text: "Luxury отделка", icon: <Crown className="text-amber-600 mb-2" /> },
  { id: 3, text: "Строгий NDA", icon: <ShieldCheck className="text-amber-600 mb-2" /> },
  { id: 4, text: "Контроль качества", icon: <Clock className="text-amber-600 mb-2" /> },
];

export const WOOD_OPTIONS: WoodOption[] = [
  {
    id: 'oak',
    name: 'Благородный Дуб',
    color: '#8B5A2B',
    description: 'Классика столярного дела. Твердый, долговечный, с красивой текстурой. Символ надежности.',
    textureOpacity: 0.6
  },
  {
    id: 'pine',
    name: 'Карельская Сосна',
    color: '#D4B483', // Светло-золотистый
    description: 'Теплый оттенок и выраженный природный рисунок. Аромат хвои и уютная текстура.',
    textureOpacity: 0.55
  },
  {
    id: 'ash',
    name: 'Дальневосточный Ясень',
    color: '#C0B3A0', // Серовато-бежевый
    description: 'По прочности не уступает дубу, но обладает более светлым и "воздушным" рисунком волокон.',
    textureOpacity: 0.7
  },
  {
    id: 'beech',
    name: 'Карпатский Бук',
    color: '#A67B5B', // Розовато-коричневый
    description: 'Однородная текстура без ярко выраженных колец. Гладкий, твердый, идеально шлифуется.',
    textureOpacity: 0.5
  },
  {
    id: 'custom',
    name: 'Своя порода',
    color: '#57534e', // Neutral stone
    description: 'Укажите желаемую породу дерева, и мы найдем её для вашего проекта.',
    textureOpacity: 0.2,
    isCustom: true
  }
];

export const INTERIOR_OPTIONS: InteriorOption[] = [
  // Velvet
  { id: 'v_red', name: 'Красный Бархат', type: 'velvet', typeName: 'Бархат', color: '#7f1d1d' },
  { id: 'v_blue', name: 'Синий Бархат', type: 'velvet', typeName: 'Бархат', color: '#1e3a8a' },
  { id: 'v_black', name: 'Черный Бархат', type: 'velvet', typeName: 'Бархат', color: '#1a1a1a' },
  
  // Leather (Genuine)
  { id: 'l_black', name: 'Черная Кожа', type: 'leather', typeName: 'Натур. Кожа', color: '#171717' },
  { id: 'l_brown', name: 'Коричневая Кожа', type: 'leather', typeName: 'Натур. Кожа', color: '#5D4037' },
  
  // Eco Leather
  { id: 'el_beige', name: 'Бежевая Эко', type: 'ecoleather', typeName: 'Эко-Кожа', color: '#d4c4a8' },
  { id: 'el_black', name: 'Черная Эко', type: 'ecoleather', typeName: 'Эко-Кожа', color: '#1c1917' },
  
  // Alcantara
  { id: 'a_grey', name: 'Серая Алькантара', type: 'alcantara', typeName: 'Алькантара', color: '#374151' },
  { id: 'a_black', name: 'Черная Алькантара', type: 'alcantara', typeName: 'Алькантара', color: '#0f172a' },

  // Special Options
  { id: 'none', name: 'Без отделки', type: 'none', typeName: 'Без отделки', color: '#292524' },
  { id: 'custom', name: 'Свой материал', type: 'custom', typeName: 'Свой вариант', color: '#44403c' },
];