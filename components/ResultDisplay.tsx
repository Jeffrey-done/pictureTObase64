import React from 'react';

interface ResultDisplayProps {
  title: string;
  children: React.ReactNode;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, children }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 min-h-[300px] flex flex-col w-full">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">{title}</h2>
        <div className="flex-grow flex items-center justify-center">
            {children}
        </div>
    </div>
  );
};

export default ResultDisplay;