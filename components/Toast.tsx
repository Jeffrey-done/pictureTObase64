
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        // Allow time for exit animation before clearing the message
        setTimeout(onDismiss, 300);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <AnimatePresence>
        {show && (
            <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center px-5 py-2 bg-slate-100 text-slate-900 rounded-full shadow-lg font-semibold"
            >
            {message}
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
};

export default Toast;
