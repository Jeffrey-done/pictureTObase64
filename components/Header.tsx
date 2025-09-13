import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-500">
        图片 &lt;=&gt; Base64 互转工具
      </h1>
      <p className="mt-3 text-lg text-slate-400">
        一个简单、安全、可离线使用的图片编解码工具。
      </p>
    </header>
  );
};

export default Header;