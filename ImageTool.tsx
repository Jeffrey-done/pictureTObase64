import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import ImageToBase64 from './components/ImageToBase64';
import Base64ToImage from './components/Base64ToImage';
import Tabs from './components/Tabs';
import Toast from './components/Toast';

type Tab = 'img2b64' | 'b642img';

const ImageTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('img2b64');
  const [toastMessage, setToastMessage] = useState('');
  
  const triggerToast = (message: string) => {
    setToastMessage(message);
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <Header />
        <main className="mt-8">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {activeTab === 'img2b64' && <ImageToBase64 showToast={triggerToast} />}
                {activeTab === 'b642img' && <Base64ToImage />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
    </div>
  );
};

export default ImageTool;