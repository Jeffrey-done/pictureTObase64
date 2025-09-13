import React, { useState, useCallback, useRef } from 'react';
import ResultDisplay from './ResultDisplay';

const Base64ToImage: React.FC = () => {
  const [base64Input, setBase64Input] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const txtInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    setImageUrl('');
    if (!base64Input.trim()) {
      setError('请先粘贴 Base64 字符串。');
      return;
    }
    
    if (!base64Input.startsWith('data:image/')) {
        setError('无效的 Base64 字符串，它应以 "data:image/..." 开头。');
        return;
    }

    try {
        setImageUrl(base64Input);
    } catch (err) {
        setError('无法解码该 Base64 字符串，请检查其是否有效。');
        console.error(err);
    }
  }, [base64Input]);

  const handleTxtFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        setBase64Input(text);
    };
    reader.onerror = (e) => {
        setError("读取 .txt 文件失败。");
        console.error("File reading error:", e);
    }
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleUploadClick = () => {
    txtInputRef.current?.click();
  };
  
  const handleDownload = () => {
    if(!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    
    // Extract file extension from mime type
    const mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));
    const extension = mimeType.split('/')[1] || 'png';
    
    link.download = `decoded-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col space-y-4">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="base64-input" className="block text-md font-medium text-slate-300">
                        在此处粘贴 Base64 字符串
                    </label>
                    <input
                        type="file"
                        ref={txtInputRef}
                        onChange={handleTxtFileChange}
                        accept=".txt,text/plain"
                        className="hidden"
                    />
                     <button
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                        title="上传包含 Base64 字符串的 .txt 文件"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>上传 .txt 文件</span>
                    </button>
                </div>
                <textarea
                    id="base64-input"
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    placeholder="data:image/png;base64,iVBORw0KGgo..."
                    className="w-full h-48 p-3 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 resize-y font-mono text-xs selection:bg-sky-500/30"
                    aria-label="Base64 input"
                />
            </div>
             <button
              onClick={handleConvert}
              disabled={!base64Input}
              className="w-full flex justify-center items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                转换为图片
            </button>
            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md text-center">{error}</div>}
        </div>
        <ResultDisplay title="图片输出结果">
            {imageUrl ? (
                <div className="relative group w-full h-full flex items-center justify-center">
                    <img src={imageUrl} alt="从 Base64 解码" className="object-contain max-h-full max-w-full rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100/90 text-slate-900 font-semibold rounded-lg hover:bg-white transition-all transform hover:scale-105"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            下载图片
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-slate-500 text-center">
                    <p>转换后的图片将在此处显示。</p>
                </div>
            )}
        </ResultDisplay>
    </div>
  );
};

export default Base64ToImage;