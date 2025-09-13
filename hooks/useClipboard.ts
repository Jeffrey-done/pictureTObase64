import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  onSuccess?: () => void;
  timeout?: number;
}

export const useClipboard = ({ onSuccess, timeout = 2000 }: UseClipboardOptions = {}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback((text: string) => {
    if (!text || typeof text !== 'string' || isCopied) {
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => setIsCopied(false), timeout);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [onSuccess, timeout, isCopied]);

  return { copy, isCopied };
};
