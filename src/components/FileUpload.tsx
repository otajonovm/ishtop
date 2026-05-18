import React, { useRef, useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onUploadComplete: (fileData: any) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  allowedTypes,
  maxSizeMB = 5,
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const formatUploadError = (err: any) => {
    const message = err?.message || 'Noma’lum xatolik';
    const code = err?.statusCode || err?.code || err?.error || '';

    if (typeof message === 'string' && message.toLowerCase().includes('bucket')) {
      return `Storage bucket topilmadi yoki sozlanmagan. Supabase'da \`documents\` bucket yarating. (${message})`;
    }

    if (typeof message === 'string' && (message.toLowerCase().includes('row level security') || message.toLowerCase().includes('unauthorized'))) {
      return `Storage policy ruxsat bermadi (RLS). Supabase storage policy'larni tekshiring. (${message})`;
    }

    return code ? `Fayl yuklashda xatolik: ${message} (code: ${code})` : `Fayl yuklashda xatolik: ${message}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(selectedFile.type)) {
      setError('Fayl turi ruxsat etilmagan (PDF, Word, JPG, PNG).');
      return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`Fayl hajmi ${maxSizeMB}MB dan oshmasligi kerak.`);
      return;
    }

    setFile(selectedFile);
    setError(null);
    handleUpload(selectedFile);
  };

  const handleUpload = async (selectedFile: File) => {
    if (!user) return;
    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // Supabase Storage (Bucket) muammosini chetlab ofish uchun faylni Base64 
        // ko'rinishida to'g'ridan-to'g'ri 'documents' jadvaliga saqlaymiz.
        onUploadComplete({
          file_name: selectedFile.name,
          file_path: `base64_${crypto.randomUUID()}`,
          file_url: base64String, // Fayl url o'rniga base64 matni beriladi
          file_type: selectedFile.type || 'application/octet-stream',
          file_size: selectedFile.size,
        });
        setUploading(false);
      };
      
      reader.onerror = () => {
        setError('Faylni o\'qishda xatolik yuz berdi');
        setUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(formatUploadError(err));
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-10 transition-all hover:border-blue-400 hover:bg-blue-50"
        >
          <div className="rounded-full bg-white p-3 shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-900">
            Hujjatni yuklang yoki tashlang
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Har qanday faylni yuklashingiz mumkin (maks. {maxSizeMB}MB)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={allowedTypes && allowedTypes.length > 0 ? allowedTypes.join(',') : undefined}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {uploading ? 'Yuklanmoqda...' : 'Yuklandi'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!uploading && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            <button
              onClick={removeFile}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-2 flex items-center space-x-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
