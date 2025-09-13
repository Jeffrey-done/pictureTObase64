import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import { fileToBase64 } from '../utils/fileUtils';

const ImageToBase64: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setImageFile(file);
    setError(null);
    setBase64String('');
    try {
      const { base64Data, mimeType } = await fileToBase64(file);
      setBase64String(`data:${mimeType};base64,${base64Data}`);
    } catch (err) {
      setError('图片文件读取失败。');
      console.error(err);
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (!base64String) return;
    navigator.clipboard.writeText(base64String).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [base64String]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col space-y-4">
        <ImageUploader onImageSelect={handleImageSelect} existingFile={imageFile} />
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md text-center">{error}</div>}
      </div>
      <ResultDisplay title="Base64 输出结果">
        {base64String ? (
          <div className="relative w-full h-full flex flex-col">
            <textarea
              readOnly
              value={base64String}
              className="prose prose-invert prose-sm max-w-none flex-grow overflow-y-auto whitespace-pre-wrap p-3 pr-28 rounded-md bg-slate-900/70 w-full h-full resize-none font-mono text-xs selection:bg-sky-500/30"
              aria-label="Base64 output"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 bg-slate-700/80 hover:bg-sky-600 text-white backdrop-blur-sm"
                title="复制到剪贴板"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={copied ? "M5 13l4 4L19 7" : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"} />
                </svg>
                {copied ? '已复制!' : '复制'}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 bg-slate-700/80 hover:bg-teal-600 text-white backdrop-blur-sm"
                title="另存为 .txt 文件"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>保存</span>
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