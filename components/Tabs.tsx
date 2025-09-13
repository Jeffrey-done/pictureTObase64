import React from 'react';

type Tab = 'img2b64' | 'b642img';

interface TabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'img2b64' as Tab, label: '图片 → Base64' },
    { id: 'b642img' as Tab, label: 'Base64 → 图片' },
  ];

  return (
    <div className="flex justify-center bg-white/40 backdrop-blur-md border border-white/50 shadow-sm p-1 rounded-full">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 text-md font-medium transition-all duration-300 rounded-full w-48 outline-none
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-rose-100
            ${activeTab === tab.id 
              ? 'bg-white text-indigo-600 shadow-lg' 
              : 'text-slate-600 hover:bg-white/70'
            }`}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;