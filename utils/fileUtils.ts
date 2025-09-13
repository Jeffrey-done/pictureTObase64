
export const fileToBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:mime/type;base64,the_base_64_string"
      const base64Data = result.split(',')[1];
      resolve({ base64Data, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};