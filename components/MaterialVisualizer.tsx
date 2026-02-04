import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit3, Palette, Layers, BoxSelect, Droplets } from 'lucide-react';
import { WOOD_OPTIONS, INTERIOR_OPTIONS } from '../constants';
import { WoodOption, InteriorOption, InteriorType, OrderConfiguration } from '../types';

interface MaterialVisualizerProps {
  selectedWood: WoodOption;
  setSelectedWood: (option: WoodOption) => void;
  selectedInterior: InteriorOption;
  setSelectedInterior: (option: InteriorOption) => void;
  configuration: OrderConfiguration;
  setConfiguration: React.Dispatch<React.SetStateAction<OrderConfiguration>>;
}

const MaterialVisualizer: React.FC<MaterialVisualizerProps> = ({
  selectedWood,
  setSelectedWood,
  selectedInterior,
  setSelectedInterior,
  configuration,
  setConfiguration
}) => {
  const [activeInteriorType, setActiveInteriorType] = useState<InteriorType>(selectedInterior.type);

  // Фильтрация опций по выбранному типу, исключая special types из списка swatches, если мы в них
  const filteredInteriors = useMemo(() => {
      if (activeInteriorType === 'none' || activeInteriorType === 'custom') return [];
      return INTERIOR_OPTIONS.filter(opt => opt.type === activeInteriorType);
  }, [activeInteriorType]);

  // Уникальные типы для табов
  const interiorTypes = useMemo(() => {
      // Группируем типы в нужном порядке
      const orderedTypes: InteriorType[] = ['velvet', 'leather', 'ecoleather', 'alcantara', 'none', 'custom'];
      return orderedTypes.map(t => {
          const opt = INTERIOR_OPTIONS.find(o => o.type === t);
          return {
              type: t,
              label: opt ? opt.typeName : t
          }
      });
  }, []);

  const handleTypeChange = (type: InteriorType) => {
      setActiveInteriorType(type);
      const firstOption = INTERIOR_OPTIONS.find(o => o.type === type);
      if (firstOption) {
          setSelectedInterior(firstOption);
      }
  };
  
  // Helpers for inputs
  const updateConfig = (key: keyof OrderConfiguration, value: any) => {
      setConfiguration(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="py-24 bg-stone-950 relative overflow-hidden border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif text-amber-500 mb-4">Конструктор материалов</h2>
          <p className="text-stone-400 font-light text-lg">
             Выберите породу дерева, отделку и дополнительные опции
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* VISUALIZATION BOX */}
          <div className="sticky top-24">
              <motion.div 
                className="relative aspect-square md:aspect-[4/3] w-full rounded-sm shadow-2xl shadow-black overflow-hidden border border-stone-800 bg-stone-900"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                 <div className="absolute inset-0 flex">
                    {/* External Material (Wood) */}
                    <div className="w-2/3 h-full relative overflow-hidden border-r border-stone-900/50">
                         <motion.div 
                           className="absolute inset-0 z-0 transition-colors duration-700"
                           style={{ backgroundColor: selectedWood.color } as any}
                         />
                         {!selectedWood.isCustom && (
                             <div 
                               className="absolute inset-0 z-10 mix-blend-multiply bg-cover bg-center transition-opacity duration-500"
                               style={{ 
                                 backgroundImage: "url('images/wood_texture.png')", // Placeholder texture
                                 opacity: selectedWood.textureOpacity 
                               }}
                             />
                         )}
                         <div className="absolute top-6 left-6 z-20">
                            <span className="text-[10px] uppercase tracking-widest text-stone-300 bg-black/50 px-2 py-1 backdrop-blur-sm border border-white/10">Exterior</span>
                         </div>
                    </div>

                    {/* Interior Material */}
                    <div className="w-1/3 h-full relative overflow-hidden">
                         {selectedInterior.type !== 'none' ? (
                             <>
                                 <motion.div 
                                    className="absolute inset-0 z-0 transition-colors duration-500"
                                    style={{ backgroundColor: selectedInterior.color } as any}
                                 />
                                 <div className={`absolute inset-0 z-10 opacity-30 ${
                                     selectedInterior.type === 'velvet' ? "bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" :
                                     selectedInterior.type === 'leather' || selectedInterior.type === 'ecoleather' ? "bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" :
                                     "bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" 
                                 }`}></div>
                             </>
                         ) : (
                             <div className="absolute inset-0 z-0 bg-stone-800 flex items-center justify-center">
                                 {configuration.varnish && (
                                     <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
                                 )}
                             </div>
                         )}
                         
                         <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/60 to-transparent"></div>
                         <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
                            <span className="text-[10px] uppercase tracking-widest text-stone-300 bg-black/50 px-2 py-1 backdrop-blur-sm border border-white/10">Interior</span>
                         </div>
                         
                         {/* Lodgement Indicator */}
                         {configuration.lodgement && (
                             <div className="absolute bottom-6 right-6 z-30">
                                 <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-amber-400 bg-black/70 px-2 py-1 backdrop-blur-sm border border-amber-900/50">
                                     <BoxSelect size={10} /> Ложемент
                                 </span>
                             </div>
                         )}
                         
                         {/* Varnish Indicator */}
                         {selectedInterior.type === 'none' && configuration.varnish && (
                             <div className="absolute bottom-16 right-6 z-30">
                                 <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-amber-200 bg-amber-900/40 px-2 py-1 backdrop-blur-sm border border-amber-500/30">
                                     <Droplets size={10} /> Лак
                                 </span>
                             </div>
                         )}
                    </div>
                 </div>

                 <div className="absolute bottom-6 left-6 z-40 pointer-events-none select-none drop-shadow-xl bg-gradient-to-t from-black/80 to-transparent p-4 -ml-4 -mb-6 w-full">
                    <motion.p 
                        key={selectedWood.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-stone-100 font-serif text-2xl md:text-3xl leading-none"
                    >
                        {selectedWood.isCustom && configuration.customWood ? configuration.customWood : selectedWood.name}
                    </motion.p>
                    <motion.p 
                        key={selectedInterior.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-amber-500 text-xs md:text-sm uppercase tracking-widest mt-1 font-medium"
                    >
                        + {selectedInterior.type === 'custom' ? 'Индивидуальная отделка' : selectedInterior.name}
                    </motion.p>
                 </div>
              </motion.div>
          </div>

          {/* CONTROLS */}
          <div className="space-y-12">
             
             {/* 1. WOOD SELECTION */}
             <div>
                <h3 className="text-stone-300 font-serif text-xl mb-6 flex items-center gap-2">
                    <span className="text-amber-600">01.</span> Порода дерева
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                   {WOOD_OPTIONS.map((wood) => (
                      <button
                        key={wood.id}
                        onClick={() => setSelectedWood(wood)}
                        className={`group p-4 border text-left transition-all relative overflow-hidden ${
                            selectedWood.id === wood.id ? 'border-amber-600 bg-stone-900' : 'border-stone-800 hover:border-stone-600'
                        }`}
                      >
                         <div className="flex items-center gap-3 relative z-10">
                            {wood.isCustom ? (
                                <div className="w-6 h-6 flex items-center justify-center text-stone-500"><Edit3 size={16} /></div>
                            ) : (
                                <div className="w-6 h-6 rounded-full border border-stone-700 shadow-inner" style={{ backgroundColor: wood.color }} />
                            )}
                            <span className="font-serif text-sm text-stone-200">{wood.name}</span>
                         </div>
                      </button>
                   ))}
                </div>
                {/* Custom Wood Input */}
                <AnimatePresence>
                    {selectedWood.isCustom && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="relative pt-4">
                                <label className="text-xs text-amber-600 uppercase tracking-widest mb-2 block">Какая порода вам нужна?</label>
                                <input 
                                    type="text" 
                                    value={configuration.customWood}
                                    onChange={(e) => updateConfig('customWood', e.target.value)}
                                    placeholder="Например: Американский орех, Эбеновое дерево..."
                                    className="w-full bg-stone-900/50 border border-stone-700 p-3 text-stone-200 focus:outline-none focus:border-amber-600 text-sm"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>

             {/* 2. INTERIOR SELECTION */}
             <div>
                <h3 className="text-stone-300 font-serif text-xl mb-4 flex items-center gap-2">
                    <span className="text-amber-600">02.</span> Отделка
                </h3>
                
                {/* Type Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {interiorTypes.map((t) => (
                        <button
                            key={t.type}
                            onClick={() => handleTypeChange(t.type as InteriorType)}
                            className={`px-3 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all ${
                                activeInteriorType === t.type 
                                ? 'bg-amber-900/20 border-amber-600 text-amber-500' 
                                : 'border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-600'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Sub-options based on Type */}
                <div className="bg-stone-900/30 border border-stone-800/50 p-6 rounded-sm">
                    
                    {/* CASE: STANDARD MATERIALS (Velvet, Leather, Eco, Alcantara) */}
                    {['velvet', 'leather', 'ecoleather', 'alcantara'].includes(activeInteriorType) && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                             {/* Color Swatches */}
                             <div>
                                 <label className="text-xs text-stone-500 uppercase tracking-widest mb-3 block">Выберите оттенок:</label>
                                 <div className="flex flex-wrap gap-3">
                                    {filteredInteriors.map((int) => (
                                        <button
                                            key={int.id}
                                            onClick={() => setSelectedInterior(int)}
                                            className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                                                selectedInterior.id === int.id ? 'border-amber-500 scale-110' : 'border-stone-700 hover:border-stone-500'
                                            }`}
                                            style={{ backgroundColor: int.color }}
                                            title={int.name}
                                        >
                                            {selectedInterior.id === int.id && <div className="absolute inset-0 rounded-full border border-white/20" />}
                                        </button>
                                    ))}
                                 </div>
                             </div>

                             {/* Custom Color Input */}
                             <div>
                                 <label className="text-xs text-stone-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                     <Palette size={12} /> Другой цвет?
                                 </label>
                                 <input 
                                     type="text" 
                                     value={configuration.customColor}
                                     onChange={(e) => updateConfig('customColor', e.target.value)}
                                     placeholder="Опишите желаемый цвет (например: Tiffany Blue)"
                                     className="w-full bg-stone-950 border border-stone-800 p-3 text-stone-300 focus:outline-none focus:border-amber-600 text-sm placeholder-stone-600"
                                 />
                             </div>

                             {/* Specific Leather Input */}
                             {activeInteriorType === 'leather' && (
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 border-t border-stone-800 mt-4">
                                     <label className="text-xs text-amber-600 uppercase tracking-widest mb-2 block">
                                         Вид кожи (Любое животное)
                                     </label>
                                     <input 
                                         type="text" 
                                         value={configuration.leatherAnimal}
                                         onChange={(e) => updateConfig('leatherAnimal', e.target.value)}
                                         placeholder="Например: Крокодил, Питон, Страус, Теленок..."
                                         className="w-full bg-stone-950 border border-stone-800 p-3 text-stone-300 focus:outline-none focus:border-amber-600 text-sm placeholder-stone-600"
                                     />
                                     <p className="text-[10px] text-stone-500 mt-2">
                                         Мы работаем с лучшими поставщиками экзотической и классической кожи.
                                     </p>
                                 </motion.div>
                             )}
                        </div>
                    )}

                    {/* CASE: NO FINISH (NONE) */}
                    {activeInteriorType === 'none' && (
                        <div className="animate-in fade-in duration-300">
                            <p className="text-stone-400 text-sm mb-6">
                                Изделие будет выполнено из чистого дерева внутри. Мы тщательно отшлифуем поверхность.
                            </p>
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-6 h-6 border flex items-center justify-center transition-colors ${configuration.varnish ? 'bg-amber-600 border-amber-600' : 'border-stone-600 group-hover:border-amber-500'}`}>
                                    {configuration.varnish && <Check size={16} className="text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={configuration.varnish}
                                    onChange={(e) => updateConfig('varnish', e.target.checked)}
                                    className="hidden"
                                />
                                <div>
                                    <span className="text-stone-200 text-sm block group-hover:text-amber-500 transition-colors">Нанести защитный лак</span>
                                    <span className="text-[10px] text-amber-600 uppercase tracking-widest">Бесплатно</span>
                                </div>
                            </label>
                        </div>
                    )}

                    {/* CASE: CUSTOM INTERIOR */}
                    {activeInteriorType === 'custom' && (
                        <div className="animate-in fade-in duration-300">
                             <label className="text-xs text-stone-500 uppercase tracking-widest mb-2 block">
                                 Опишите вашу идею
                             </label>
                             <textarea 
                                 value={configuration.customInteriorText}
                                 onChange={(e) => updateConfig('customInteriorText', e.target.value)}
                                 placeholder="Шелк, сукно, специальная ткань или сложная комбинация материалов..."
                                 rows={3}
                                 className="w-full bg-stone-950 border border-stone-800 p-3 text-stone-300 focus:outline-none focus:border-amber-600 text-sm placeholder-stone-600 resize-none"
                             />
                        </div>
                    )}
                </div>
             </div>

             {/* 3. ADDITIONAL OPTIONS (Lodgement) */}
             <div>
                <h3 className="text-stone-300 font-serif text-xl mb-6 flex items-center gap-2">
                    <span className="text-amber-600">03.</span> Опции
                </h3>
                <label className="flex items-start gap-4 cursor-pointer group p-4 border border-stone-800 bg-stone-900/50 hover:border-amber-700/50 transition-all">
                    <div className={`mt-1 w-5 h-5 border flex items-center justify-center transition-colors flex-shrink-0 ${configuration.lodgement ? 'bg-amber-600 border-amber-600' : 'border-stone-600 group-hover:border-amber-500'}`}>
                        {configuration.lodgement && <Check size={14} className="text-white" />}
                    </div>
                    <input 
                        type="checkbox" 
                        checked={configuration.lodgement}
                        onChange={(e) => updateConfig('lodgement', e.target.checked)}
                        className="hidden"
                    />
                    <div className="flex-1">
                        <span className="text-stone-200 font-medium block group-hover:text-amber-500 transition-colors">Добавить ложемент</span>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                            Индивидуальная вставка под форму вашего предмета (часы, украшение, бутылка) для надежной фиксации.
                        </p>
                    </div>
                    <BoxSelect className="text-stone-700 group-hover:text-amber-700 transition-colors" />
                </label>
             </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MaterialVisualizer;