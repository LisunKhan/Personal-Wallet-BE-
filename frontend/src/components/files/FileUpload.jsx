import React, { useState, useRef } from 'react';
import { useUploadFile } from '../../hooks/useVault';
import { toast } from 'react-hot-toast';

const FileUpload = ({ itemId, onUploadComplete, className = '' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const uploadFileMutation = useUploadFile();

  // Supported file types and their icons
  const supportedTypes = {
    'application/pdf': { icon: '📄', name: 'PDF' },
    'image/jpeg': { icon: '🖼️', name: 'JPEG' },
    'image/png': { icon: '🖼️', name: 'PNG' },
    'image/gif': { icon: '🖼️', name: 'GIF' },
    'text/plain': { icon: '📝', name: 'Text' },
    'application/msword': { icon: '📄', name: 'Word' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: '📄', name: 'Word' },
    'application/vnd.ms-excel': { icon: '📊', name: 'Excel' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: '📊', name: 'Excel' },
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    // Check file type
    if (!supportedTypes[file.type]) {
      toast.error(`File type ${file.type} is not supported`);
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      toast.error(`File size exceeds 10MB limit`);
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file) => {
    if (!validateFile(file)) return;

    try {
      setUploadProgress(0);
      
      const result = await uploadFileMutation.mutateAsync({
        itemId,
        file,
        onProgress: (progress) => setUploadProgress(progress)
      });

      setUploadProgress(0);
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (error) {
      setUploadProgress(0);
      // Error is handled by the hook
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={Object.keys(supportedTypes).join(',')}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploadFileMutation.isLoading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploadFileMutation.isLoading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Uploading file...</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                Drop files here or{' '}
                <button
                  onClick={openFileDialog}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: {formatFileSize(maxFileSize)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Supported File Types */}
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Supported file types:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(supportedTypes).map(([type, info]) => (
            <span
              key={type}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              <span>{info.icon}</span>
              <span>{info.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Security Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-xs font-medium text-blue-900">Secure Upload</p>
            <p className="text-xs text-blue-800">
              Files are encrypted before storage and can only be accessed by you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;