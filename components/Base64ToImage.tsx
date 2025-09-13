import React, { useState, useCallback, useRef } from 'react';
import ResultDisplay from './ResultDisplay';

interface DecodedImageInfo {
    dimensions: string;
    size: string;
}

const Base64ToImage: React.FC = () => {
  const [base64Input, setBase64Input] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [decodedInfo, setDecodedInfo] = useState<DecodedImageInfo | null>(null);
  const txtInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    setImageUrl('');
    setDecodedInfo(null);
    const trimmedInput = base64Input.trim();
    if (!trimmedInput) {
      setError('请先粘贴 Base64 字符串。');
      return;
    }
    
    // Allow for raw base64 strings by checking for the prefix and adding it if missing.
    // A simple heuristic: check if it starts with 'data:image'
    let fullBase64 = trimmedInput;
    if (!trimmedInput.startsWith('data:image')) {
        // A more robust check might be needed, but for common cases this works.
        // We can try to guess the mime type or default to png.
        fullBase64 = `data:image/png;base64,${trimmedInput}`;
    }


    try {
        const img = new Image();
        img.onload = () => {
            const base64Data = fullBase64.split(',')[1];
            // Estimate size: (length * 3/4) - padding. A good enough approximation.
            const sizeInBytes = (base64Data.length * 0.75);
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);

            setDecodedInfo({
                dimensions: `${img.naturalWidth} x ${img.naturalHeight} px`,
                size: `~ ${sizeInKB} KB`,
            });
            setImageUrl(fullBase64);
        };
        img.onerror = () => {
             setError('无法解码该 Base64 字符串，请检查其是否有效。');
        }
        img.src = fullBase64;
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
    
    const mimeTypeMatch = imageUrl.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
    const extension = mimeType.split('/')[1] || 'png';
    
    link.download = `decoded-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleClear = () => {
    setBase64Input('');
    setImageUrl('');
    setError(null);
    setDecodedInfo(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col space-y-4">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="base64-input" className="block text-md font-medium text-slate-700">
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
                        className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500 focus-visible:ring-offset-rose-100 rounded-md p-1"
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
                    className="w-full h-48 p-3 bg-white/50 border border-white/50 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-y font-mono text-xs selection:bg-rose-300/50"
                    aria-label="Base64 input"
                />
            </div>
             <div className="flex items-center gap-4">
                <button
                  onClick={handleConvert}
                  disabled={!base64Input}
                  className="w-full flex justify-center items-center gap-2 bg-indigo-400 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-200 transform hover:scale-105 disabled:scale-100 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-rose-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    转换为图片
                </button>
                <button onClick={handleClear} title="清空输入和结果" className="p-3 bg-rose-200 hover:bg-rose-300 text-rose-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500 focus-visible:ring-offset-rose-100" disabled={!base64Input && !imageUrl}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
             </div>
            {error && <div className="text-red-700 bg-red-200/60 p-4 rounded-md text-center">{error}</div>}
        </div>
        <ResultDisplay title="图片输出结果">
            {imageUrl ? (
                <div className="relative group w-full h-full flex items-center justify-center flex-col gap-4">
                    <div className="flex-grow flex items-center justify-center w-full h-full p-2">
                        <img src={imageUrl} alt="从 Base64 解码" className="object-contain max-h-full max-w-full rounded-lg shadow-md" />
                    </div>
                    <div className="absolute inset-0 bg-slate-800/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-slate-800 font-semibold rounded-lg hover:bg-white transition-all transform hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            下载图片
                        </button>
                    </div>
                    {decodedInfo && (
                         <div className="w-full bg-white/40 backdrop-blur-sm p-3 rounded-lg border border-white/50 text-sm">
                            <h3 className="text-md font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>解码信息</span>
                            </h3>
                            <div className="flex justify-around gap-3">
                                <div className="bg-white/60 p-2 rounded-md flex-1 text-center"><strong className="font-medium text-slate-500 block">尺寸</strong> <span className="text-slate-800">{decodedInfo.dimensions}</span></div>
                                <div className="bg-white/60 p-2 rounded-md flex-1 text-center"><strong className="font-medium text-slate-500 block">文件大小</strong> <span className="text-slate-800">{decodedInfo.size}</span></div>
                            </div>
                        </div>
                    )}
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