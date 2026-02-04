import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Allow exit animation to finish
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, letterSpacing: "1em" }}
            animate={{ scale: 1, opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="font-logo text-6xl md:text-9xl text-amber-500 uppercase tracking-widest relative">
              Element
              <motion.span 
                 className="absolute -bottom-4 left-0 w-full h-[1px] bg-amber-700"
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ delay: 1, duration: 1 }}
              />
            </h1>
            <motion.p 
              className="mt-6 text-stone-500 text-sm uppercase tracking-[0.3em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              Premium Custom Woodwork
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;