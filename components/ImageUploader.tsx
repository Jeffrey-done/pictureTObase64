
import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  existingFile: File | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, existingFile }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingFile) {
        const objectUrl = URL.createObjectURL(existingFile);
        setImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    } else {
        setImagePreview(null);
    }
  }, [existingFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEvent = useCallback((e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(e, false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
    }
  }, [onImageSelect, handleDragEvent]);


  return (
    <div
      onClick={handleClick}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      onDragEnter={(e) => handleDragEvent(e, true)}
      onDragLeave={(e) => handleDragEvent(e, false)}
      onDragOver={(e) => handleDragEvent(e, true)}
      onDrop={handleDrop}
      className={`group relative flex flex-col items-center justify-center w-full min-h-[256px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 focus-visible:ring-offset-slate-900
        ${isDragging ? 'border-sky-500 bg-slate-700/50 scale-105' : 'border-slate-700 bg-slate-800/60 hover:border-sky-600 hover:bg-slate-800'}`}
      tabIndex={0}
      role="button"
      aria-label="Image uploader, click or drag and drop an image"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {imagePreview ? (
        <>
            <img src={imagePreview} alt="图片预览" className="object-contain h-full w-full max-h-[400px] rounded-xl p-2" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                <span className="text-white font-semibold text-lg">更换图片</span>
            </div>
        </>
      ) : (
        <div className="text-center text-slate-500 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-600 group-hover:text-sky-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="mt-3 text-lg text-slate-400">
            <span className="font-semibold text-sky-400">点击上传</span> 或拖拽文件到这里
          </p>
          <p className="text-sm mt-1">支持 PNG, JPG, GIF, WEBP 等格式</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;