import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookieConsentProps {
  isVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ isVisible, onAccept, onDecline }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 w-full z-50 bg-stone-900/95 backdrop-blur-md border-t border-amber-900/30 p-6 md:p-8"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-stone-300 text-sm md:text-base max-w-2xl text-center md:text-left">
              <p>
                Мы используем файлы cookie для улучшения работы сайта. Продолжая использование, вы даете согласие на обработку персональных данных.
                Без согласия оформление заказа невозможно.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onDecline}
                className="px-6 py-2 border border-stone-600 text-stone-400 hover:text-stone-200 hover:border-stone-400 transition-colors uppercase text-xs tracking-widest"
              >
                Отказаться
              </button>
              <button
                onClick={onAccept}
                className="px-6 py-2 bg-amber-800 text-stone-100 hover:bg-amber-700 transition-colors uppercase text-xs tracking-widest shadow-lg shadow-amber-900/20"
              >
                Согласиться
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;