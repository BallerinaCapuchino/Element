import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, User as UserIcon, Phone, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { SERVICES, PROCESS_STEPS, PORTFOLIO_ITEMS, WOOD_OPTIONS, INTERIOR_OPTIONS } from '../constants';
import MaterialVisualizer from '../components/MaterialVisualizer';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';
import { mockApi } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { OrderConfiguration } from '../types';

interface LandingProps {
  hasConsented: boolean;
  requestConsent: () => void;
}

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
};

const FloatingInput = ({ label, value, onChange, type = "text", id }: any) => {
    const [focused, setFocused] = useState(false);
    const hasValue = value && value.length > 0;
    const isActive = focused || hasValue;
  
    return (
      <div className="relative pt-6 pb-2 border-b border-stone-700 transition-colors focus-within:border-amber-500">
          <input
              id={id}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent text-stone-200 text-xl focus:outline-none placeholder-transparent z-10 relative"
              placeholder={label} 
          />
          <label
              htmlFor={id}
              className={`absolute left-0 transition-all duration-300 pointer-events-none z-0
                  ${isActive ? 'top-0 text-xs text-amber-500' : 'top-6 text-xl text-stone-500'}
              `}
          >
              {label}
          </label>
      </div>
    )
};

const Landing: React.FC<LandingProps> = ({ hasConsented, requestConsent }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [formState, setFormState] = useState({ name: '', phone: '', comment: '' });
  
  // Material State
  const [selectedWood, setSelectedWood] = useState(WOOD_OPTIONS[0]);
  const [selectedInterior, setSelectedInterior] = useState(INTERIOR_OPTIONS[0]);

  // Detailed Configuration State
  const [configuration, setConfiguration] = useState<OrderConfiguration>({
      customWood: '',
      leatherAnimal: '',
      customColor: '',
      customInteriorText: '',
      lodgement: false,
      varnish: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Carousel Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % PORTFOLIO_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % PORTFOLIO_ITEMS.length);
  };

  const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length);
  };

  const openAuth = (mode: 'login' | 'register') => {
      setAuthMode(mode);
      setIsAuthOpen(true);
  }

  const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ visible: true, message, type });
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!hasConsented) {
      requestConsent();
      showToast("Необходимо принять соглашение о cookies", "error");
      return;
    }
    if (!formState.name || !formState.phone) {
        showToast("Заполните имя и телефон", "error");
        return;
    }
    if (!user) {
        showToast("Войдите в аккаунт для оформления заказа", "error");
        setTimeout(() => openAuth('register'), 1000);
        return;
    }

    setIsSubmitting(true);
    try {
        await mockApi.createOrder(user.id, {
            ...formState,
            contactMethod: 'request', 
            // Wood Details
            wood: selectedWood.id === 'custom' ? 'Индивидуальная порода' : selectedWood.name,
            customWood: selectedWood.id === 'custom' ? configuration.customWood : undefined,
            
            // Interior Details
            interior: selectedInterior.type === 'custom' ? 'Индивидуальная отделка' : selectedInterior.typeName,
            interiorColor: selectedInterior.name, // base color name
            customInterior: selectedInterior.type === 'custom' ? configuration.customInteriorText : undefined,
            
            // Specifics
            leatherAnimal: selectedInterior.type === 'leather' ? configuration.leatherAnimal : undefined,
            customColor: configuration.customColor || undefined,
            
            // Options
            lodgement: configuration.lodgement,
            varnish: selectedInterior.type === 'none' ? configuration.varnish : undefined
        });
        
        showToast("Заявка успешно отправлена!", "success");
        setFormState({ name: '', phone: '', comment: '' });
        // Reset configuration optional? keeping for now
    } catch (error) {
        showToast("Ошибка при создании заказа", 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-950 text-stone-200 overflow-x-hidden">
      <nav className="fixed top-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="font-logo text-2xl text-amber-500 font-bold tracking-wider cursor-default select-none">
            ELEMENT
        </div>
        <div className="flex items-center gap-6">
            <button onClick={scrollToContact} className="hidden md:block text-xs uppercase tracking-[0.2em] hover:text-amber-500 transition-colors">Связаться</button>
            {user ? (
                 <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-amber-500 text-xs uppercase tracking-widest hover:text-amber-400">
                    <UserIcon size={16} /> Профиль
                 </button>
            ) : (
                <button onClick={() => openAuth('login')} className="text-xs uppercase tracking-[0.2em] hover:text-amber-500 transition-colors">
                    Войти
                </button>
            )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />
      <Toast isVisible={toast.visible} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img src="images/preview.png" alt="Preview" className="w-full h-full object-cover grayscale brightness-50" />
        </motion.div>
        <div className="relative z-20 text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="font-logo text-6xl md:text-9xl text-amber-500/90 mb-6 drop-shadow-2xl">
            ELEMENT
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="text-stone-300 text-lg md:text-2xl font-light tracking-widest uppercase font-serif">
            Премиальные деревянные коробки на заказ
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl text-amber-500 mb-8 leading-tight">Искусство<br/>в деталях</h2>
            <div className="space-y-6 text-stone-400 font-light leading-relaxed text-lg">
              <p>Мы создаем не просто упаковку, а продолжение истории вашего бренда или подарка. Компания <span className="text-stone-200">Element</span> — это синергия вековых традиций и современного минимализма.</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.2}>
             <div className="relative aspect-[3/4] overflow-hidden border border-stone-800 p-2">
                <img src="images/about.png" alt="About" className="w-full h-full object-cover grayscale opacity-80" />
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* Gallery (Lenta) Section - CAROUSEL */}
      <section className="py-24 bg-stone-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <h2 className="text-center text-3xl md:text-4xl mb-16 font-serif uppercase tracking-widest text-amber-500">Наши работы</h2>
          </FadeInSection>
          
          <FadeInSection>
              <div className="relative max-w-5xl mx-auto aspect-[4/5] md:aspect-[2/1] bg-stone-950 border border-stone-800 shadow-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <img 
                            src={PORTFOLIO_ITEMS[currentSlide].imageUrl} 
                            alt={PORTFOLIO_ITEMS[currentSlide].alt} 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-stone-950/20 to-transparent opacity-90" />
                        
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-start justify-end">
                            <motion.h3 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-5xl font-serif text-amber-500 mb-4"
                            >
                                {PORTFOLIO_ITEMS[currentSlide].title}
                            </motion.h3>
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="h-[1px] w-24 bg-amber-700 mb-4"
                            />
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-stone-300 font-light text-lg md:text-xl max-w-xl"
                            >
                                {PORTFOLIO_ITEMS[currentSlide].description}
                            </motion.p>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 text-xs text-stone-500 uppercase tracking-widest"
                            >
                                Проект {currentSlide + 1} / {PORTFOLIO_ITEMS.length}
                            </motion.span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button 
                    onClick={prevSlide} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-amber-900/40 text-stone-400 hover:text-amber-500 border border-stone-800/50 hover:border-amber-700/50 transition-all rounded-full z-20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft size={32} />
                </button>
                <button 
                    onClick={nextSlide} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-amber-900/40 text-stone-400 hover:text-amber-500 border border-stone-800/50 hover:border-amber-700/50 transition-all rounded-full z-20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={32} />
                </button>
                
                {/* Progress Indicators */}
                <div className="absolute bottom-6 right-6 md:bottom-16 md:right-16 flex gap-3 z-20">
                    {PORTFOLIO_ITEMS.map((_, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-12 bg-amber-600' : 'w-3 bg-stone-700 hover:bg-stone-500'}`} 
                        />
                    ))}
                </div>
              </div>
          </FadeInSection>
        </div>
      </section>

      <MaterialVisualizer 
        selectedWood={selectedWood} 
        setSelectedWood={setSelectedWood} 
        selectedInterior={selectedInterior} 
        setSelectedInterior={setSelectedInterior} 
        configuration={configuration}
        setConfiguration={setConfiguration}
      />

      {/* Contact Form */}
      <section id="contact" className="py-24 bg-stone-900 border-t border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <FadeInSection>
                <h2 className="text-5xl font-serif text-amber-500 mb-6">Начать проект</h2>
                <div className="space-y-4 text-stone-400">
                    <p className="flex items-center gap-4"><Mail className="w-5 h-5 text-amber-600" /> info@element-box.ru</p>
                    <p className="mt-4 text-sm font-light leading-relaxed max-w-md">
                        Заполните форму, и мы свяжемся с вами для обсуждения деталей вашего эксклюзивного проекта.
                    </p>
                </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
                <div className="space-y-8">
                    <FloatingInput id="name" label="Ваше имя" value={formState.name} onChange={(e: any) => setFormState({...formState, name: e.target.value})} />
                    <FloatingInput id="phone" label="Телефон" type="tel" value={formState.phone} onChange={(e: any) => setFormState({...formState, phone: e.target.value})} />
                    
                    <div className="pt-6">
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting} 
                            className="w-full py-4 bg-amber-900/20 border border-amber-800 hover:bg-amber-900/40 text-amber-500 hover:text-amber-400 uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
                        >
                            {isSubmitting ? 'Отправка...' : 'Оставить заявку'}
                            {!isSubmitting && <Check size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </button>
                    </div>
                </div>
            </FadeInSection>
        </div>
      </section>

      <footer className="py-8 text-center border-t border-stone-900 text-stone-600 text-xs uppercase tracking-widest">
         <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
             <div className="font-logo text-lg text-stone-500">Element</div>
             <div>Element © Все права защищены</div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;