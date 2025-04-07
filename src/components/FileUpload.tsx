import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    disabled,
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative p-8 border-2 border-dashed rounded-xl text-center transition-all duration-200
          ${isDragActive
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-200 hover:border-gray-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Upload className={`
            mx-auto h-12 w-12 transition-colors duration-200
            ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}
          `} />
          <div>
            <p className="text-lg text-gray-700">
              {isDragActive
                ? 'Drop your research paper here'
                : 'Drag & drop your research paper'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              or click to select a file
            </p>
          </div>
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <File className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600 truncate">
            {acceptedFiles[0].name}
          </span>
        </div>
      )}
    </div>
  );
}