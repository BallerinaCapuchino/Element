import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Send, MessageCircle, X, Loader2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (method: string) => Promise<void>;
  isLoading: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  if (!isOpen) return null;

  const CONTACT_PHONE = '79268305974';

  const handleMethodClick = async (method: string) => {
      // 1. Submit Order to Firebase first
      await onSubmit(method);

      // 2. Redirect to app
      if (method === 'whatsapp') {
          window.open(`https://wa.me/${CONTACT_PHONE}`, '_blank');
      } else if (method === 'telegram') {
          window.open(`https://t.me/${CONTACT_PHONE}`, '_blank'); // Or specific username if configured
      } else if (method === 'phone') {
          window.location.href = `tel:+${CONTACT_PHONE}`;
      }
      
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-sm bg-stone-900 border border-amber-900/30 p-8 shadow-2xl overflow-hidden text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-amber-500 transition-colors">
          <X size={20} />
        </button>

        <h3 className="text-2xl font-serif text-amber-500 mb-4">Подтверждение</h3>
        <p className="text-stone-400 text-sm mb-8 font-light leading-relaxed">
            Ваш заказ сформирован. Выберите удобный способ связи для финального подтверждения деталей мастером.
        </p>

        {isLoading ? (
            <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-amber-600" />
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => handleMethodClick('whatsapp')}
                    className="flex items-center justify-center gap-3 p-4 border border-green-800/50 bg-green-900/20 hover:bg-green-900/40 text-green-500 hover:text-green-400 transition-all rounded-sm uppercase tracking-widest text-xs font-bold"
                >
                    <MessageCircle size={18} /> WhatsApp
                </button>
                
                <button
                    onClick={() => handleMethodClick('telegram')}
                    className="flex items-center justify-center gap-3 p-4 border border-blue-800/50 bg-blue-900/20 hover:bg-blue-900/40 text-blue-500 hover:text-blue-400 transition-all rounded-sm uppercase tracking-widest text-xs font-bold"
                >
                    <Send size={18} /> Telegram
                </button>

                <button
                    onClick={() => handleMethodClick('phone')}
                    className="flex items-center justify-center gap-3 p-4 border border-stone-700 bg-stone-800/50 hover:bg-stone-800 text-stone-300 hover:text-white transition-all rounded-sm uppercase tracking-widest text-xs font-bold"
                >
                    <Phone size={18} /> Позвонить
                </button>
            </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContactModal;
