import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-[80] max-w-sm w-full"
        >
          <div className={`flex items-center gap-4 p-4 border shadow-2xl backdrop-blur-md ${
            type === 'success' 
            ? 'bg-stone-900/90 border-green-900/50 text-stone-200' 
            : 'bg-stone-900/90 border-red-900/50 text-stone-200'
          }`}>
             {type === 'success' ? <CheckCircle className="text-green-500 w-5 h-5" /> : <AlertCircle className="text-red-500 w-5 h-5" />}
             <p className="text-sm font-light flex-1">{message}</p>
             <button onClick={onClose} className="text-stone-500 hover:text-stone-300"><X size={16} /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;