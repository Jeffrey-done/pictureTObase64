import React from 'react';

interface ResultDisplayProps {
  title: string;
  children: React.ReactNode;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, children }) => {
  return (
    <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-lg min-h-[300px] flex flex-col w-full">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">{title}</h2>
        <div className="flex-grow flex items-center justify-center">
            {children}
        </div>
    </div>
  );
};

export default ResultDisplay;