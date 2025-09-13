import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import { fileToBase64 } from '../utils/fileUtils';
import { useClipboard } from '../hooks/useClipboard';

interface ImageInfo {
  dimensions: string;
  size: string;
  base64Length: number;
}

interface ImageToBase64Props {
  showToast: (message: string) => void;
}

const ImageToBase64: React.FC<ImageToBase64Props> = ({ showToast }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  
  const handleImageSelect = useCallback(async (file: File) => {
    setImageFile(file);
    setError(null);
    setBase64String('');
    setImageInfo(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const sizeInKB = (file.size / 1024).toFixed(2);
        
        fileToBase64(file).then(({ base64Data, mimeType }) => {
          const fullBase64 = `data:${mimeType};base64,${base64Data}`;
          setBase64String(fullBase64);
          setImageInfo({
            dimensions: `${img.naturalWidth} x ${img.naturalHeight} px`,
            size: `${sizeInKB} KB`,
            base64Length: fullBase64.length,
          });
        }).catch(err => {
          setError('图片文件读取失败。');
          console.error(err);
        });
      };
      img.onerror = () => {
        setError('无法加载图片以获取尺寸。');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);

  }, []);

  const handleSave = useCallback(() => {
    if (!base64String || !imageFile) return;
    const blob = new Blob([base64String], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const originalFileName = imageFile.name.split('.').slice(0, -1).join('.');
    const newFileName = `${originalFileName || 'image'}-base64.txt`;
    link.href = url;
    link.download = newFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [base64String, imageFile]);
  
  const handleClear = () => {
    setImageFile(null);
    setBase64String('');
    setImageInfo(null);
    setError(null);
  };

  const createClipboard = (label: string) => {
    return useClipboard({
      onSuccess: () => showToast(`${label} 已复制到剪贴板!`),
    });
  };

  const dataUrlClipboard = createClipboard('Data URL');
  const rawClipboard = createClipboard('Raw Base64');
  const htmlClipboard = createClipboard('HTML <img>');
  const cssClipboard = createClipboard('CSS background');

  const getCopyButton = (
    label: string, 
    clipboard: { copy: (text: string) => void; isCopied: boolean; }, 
    textToCopy: string, 
    Icon: React.ElementType, 
    title: string
  ) => (
    <button
      onClick={() => clipboard.copy(textToCopy)}
      className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 bg-slate-700/80 hover:bg-sky-600 text-white backdrop-blur-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/80 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 focus-visible:ring-offset-slate-900"
      title={title}
      disabled={!textToCopy}
    >
      <Icon className="h-4 w-4" />
      {clipboard.isCopied ? '已复制!' : label}
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col space-y-4">
        <ImageUploader onImageSelect={handleImageSelect} existingFile={imageFile} />
        {imageFile && (
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-md font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>智能信息面板</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-slate-900/50 p-2 rounded-md"><strong className="font-medium text-slate-400 block">尺寸</strong> <span className="text-slate-200">{imageInfo?.dimensions || '...'}</span></div>
                    <div className="bg-slate-900/50 p-2 rounded-md"><strong className="font-medium text-slate-400 block">文件大小</strong> <span className="text-slate-200">{imageInfo?.size || '...'}</span></div>
                    <div className="bg-slate-900/50 p-2 rounded-md col-span-2 sm:col-span-1"><strong className="font-medium text-slate-400 block">Base64 长度</strong> <span className="text-slate-200">{imageInfo?.base64Length.toLocaleString() || '...'}</span></div>
                </div>
            </div>
        )}
        {imageFile && (
            <button onClick={handleClear} className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-red-400 font-semibold transition-colors py-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 focus-visible:ring-offset-slate-900 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                清空并开始新的转换
            </button>
        )}
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md text-center">{error}</div>}
      </div>
      <ResultDisplay title="Base64 输出结果">
        {base64String ? (
          <div className="relative w-full h-full flex flex-col">
            <textarea
              readOnly
              value={base64String}
              className="prose prose-invert prose-sm max-w-none flex-grow overflow-y-auto whitespace-pre-wrap p-3 rounded-md bg-slate-900/70 w-full h-full resize-none font-mono text-xs selection:bg-sky-500/30 outline-none focus:ring-2 focus:ring-sky-500 border border-transparent focus:border-sky-500"
              aria-label="Base64 output"
            />
            <div className="mt-3 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                    {getCopyButton("Data URL", dataUrlClipboard, base64String, (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>, "复制完整的 Data URL")}
                    {getCopyButton("Raw Base64", rawClipboard, base64String.split(',')[1] || '', (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>, "仅复制 Base64 数据")}
                    {getCopyButton("HTML <img>", htmlClipboard, `<img src="${base64String}" />`, (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, "复制为 HTML <img> 标签")}
                    {getCopyButton("CSS BG", cssClipboard, `background-image: url("${base64String}");`, (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>, "复制为 CSS background-image")}
                </div>
                 <button
                    onClick={handleSave}
                    disabled={!base64String}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 bg-slate-700/80 hover:bg-teal-600 text-white backdrop-blur-sm w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/80 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 focus-visible:ring-offset-slate-900"
                    title="另存为 .txt 文件"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>保存为 .txt</span>
                  </button>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 text-center">
            <p>上传图片后，将在此处显示其 Base64 编码。</p>
          </div>
        )}
      </ResultDisplay>
    </div>
  );
};

export default ImageToBase64;