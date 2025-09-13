import React, { useState } from 'react';
import Header from './components/Header';
import ImageToBase64 from './components/ImageToBase64';
import Base64ToImage from './components/Base64ToImage';
import Tabs from './components/Tabs';

type Tab = 'img2b64' | 'b642img';

const ImageTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('img2b64');

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <Header />
        <main className="mt-8">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {activeTab === 'img2b64' && <ImageToBase64 />}
            {activeTab === 'b642img' && <Base64ToImage />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImageTool;
