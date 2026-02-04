import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2, Send } from 'lucide-react';
import { mockApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const user = await mockApi.register(formData.email, formData.password, formData.name);
        login(user);
      } else {
        const user = await mockApi.login(formData.email, formData.password);
        login(user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramLogin = async () => {
      setLoading(true);
      setError('');
      try {
          // Emulate Telegram Login
          const user = await mockApi.socialLogin('telegram');
          login(user);
          onClose();
      } catch (err) {
          setError('Ошибка авторизации через Telegram');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-stone-900 border border-amber-900/30 shadow-2xl overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-amber-500 transition-colors z-10">
          <X size={20} />
        </button>

        <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-amber-500 mb-2">
              {mode === 'login' ? 'Вход' : 'Регистрация'}
            </h2>
            <p className="text-stone-500 text-sm font-light">
              {mode === 'login' ? 'Добро пожаловать обратно' : 'Станьте частью клуба Element'}
            </p>
          </div>

          <div className="space-y-3 mb-6">
              <button 
                onClick={handleTelegramLogin}
                disabled={loading}
                className="w-full py-3 bg-[#24A1DE] hover:bg-[#208bbf] text-white border border-transparent transition-all flex items-center justify-center gap-3 rounded-sm disabled:opacity-50"
              >
                  <Send className="w-5 h-5 fill-current" />
                  <span className="text-sm font-medium">Войти через Telegram</span>
              </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-stone-800 w-full absolute"></div>
              <span className="bg-stone-900 px-4 text-xs text-stone-500 uppercase z-10">Или email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="relative group">
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Имя"
                  className="w-full bg-stone-950 border border-stone-800 p-4 text-stone-200 focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            )}
            
            <div className="relative group">
              <input 
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="Email"
                className="w-full bg-stone-950 border border-stone-800 p-4 text-stone-200 focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>

            <div className="relative group">
              <input 
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="Пароль"
                className="w-full bg-stone-950 border border-stone-800 p-4 text-stone-200 focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-800 hover:bg-amber-700 text-stone-100 uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Войти' : 'Создать аккаунт')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-stone-500 hover:text-amber-500 text-xs uppercase tracking-wider transition-colors"
            >
              {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;