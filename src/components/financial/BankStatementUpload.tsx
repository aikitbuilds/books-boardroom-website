import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
}

interface BankStatementUploadProps {
  onUploadComplete?: (files: { fileName: string; downloadUrl: string; fileType: string }[]) => void;
  maxFileSize?: number; // in MB
  maxFiles?: number;
}

export const BankStatementUpload: React.FC<BankStatementUploadProps> = ({
  onUploadComplete,
  maxFileSize = 10, // 10MB default
  maxFiles = 5
}) => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Accepted file types for bank statements
  const acceptedFileTypes = {
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/x-ofx': ['.ofx'],
    'application/x-qfx': ['.qfx'],
    'text/plain': ['.txt'] // Some banks export as .txt
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      alert('Please log in to upload bank statements');
      return;
    }

    if (acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    const newUploads: UploadProgress[] = acceptedFiles.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploads(newUploads);

    const uploadPromises = acceptedFiles.map(async (file, index) => {
      try {
        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds ${maxFileSize}MB limit`);
        }

        // Create unique file path with user ID and timestamp
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `financial/bank-statements/${user.uid}/${timestamp}_${sanitizedFileName}`;
        
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file, {
          customMetadata: {
            uploadedBy: user.uid,
            uploadedAt: new Date().toISOString(),
            originalFileName: file.name,
            fileType: file.type || 'unknown',
            fileSize: file.size.toString()
          }
        });

        return new Promise<{ fileName: string; downloadUrl: string; fileType: string }>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploads(prev => prev.map((upload, i) => 
                i === index 
                  ? { ...upload, progress: Math.round(progress) }
                  : upload
              ));
            },
            (error) => {
              console.error('Upload error:', error);
              setUploads(prev => prev.map((upload, i) => 
                i === index 
                  ? { ...upload, status: 'error', error: error.message }
                  : upload
              ));
              reject(error);
            },
            async () => {
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                setUploads(prev => prev.map((upload, i) => 
                  i === index 
                    ? { ...upload, status: 'completed', downloadUrl }
                    : upload
                ));
                resolve({
                  fileName: file.name,
                  downloadUrl,
                  fileType: file.type || 'unknown'
                });
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } catch (error) {
        setUploads(prev => prev.map((upload, i) => 
          i === index 
            ? { ...upload, status: 'error', error: (error as Error).message }
            : upload
        ));
        throw error;
      }
    });

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<{ fileName: string; downloadUrl: string; fileType: string }> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      if (successfulUploads.length > 0 && onUploadComplete) {
        onUploadComplete(successfulUploads);
      }
    } catch (error) {
      console.error('Upload batch error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [user, maxFileSize, maxFiles, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles,
    maxSize: maxFileSize * 1024 * 1024,
    disabled: isUploading
  });

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <FileText className="h-4 w-4" />;
  };

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Bank Statements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          
          {isDragActive ? (
            <p className="text-blue-600">Drop your bank statements here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag & drop bank statements here</p>
              <p className="text-sm text-gray-500 mb-4">
                or <span className="text-blue-600 underline">browse files</span>
              </p>
              <p className="text-xs text-gray-400">
                Accepted formats: CSV, OFX, QFX, XLS, XLSX
                <br />
                Max file size: {maxFileSize}MB | Max files: {maxFiles}
              </p>
            </div>
          )}
        </div>

        {/* File Rejections */}
        {fileRejections.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {fileRejections.map(({ file, errors }) => (
                  <div key={file.name}>
                    <strong>{file.name}:</strong> {errors.map(e => e.message).join(', ')}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Upload Progress</h4>
            {uploads.map((upload, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(upload.status)}
                    {getFileTypeIcon(upload.fileName)}
                    <span className="text-sm truncate max-w-xs">{upload.fileName}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {upload.status === 'completed' ? 'Complete' : 
                     upload.status === 'error' ? 'Failed' : 
                     `${upload.progress}%`}
                  </span>
                </div>
                
                {upload.status === 'uploading' && (
                  <Progress value={upload.progress} className="h-2" />
                )}
                
                {upload.status === 'error' && upload.error && (
                  <p className="text-xs text-red-500">{upload.error}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Supported Bank Statement Formats:</strong>
            <ul className="list-disc list-inside mt-2 text-sm space-y-1">
              <li><strong>CSV:</strong> Most common export format from online banking</li>
              <li><strong>OFX/QFX:</strong> Open Financial Exchange format (Quicken compatible)</li>
              <li><strong>XLS/XLSX:</strong> Excel spreadsheets with transaction data</li>
            </ul>
            <p className="mt-2 text-sm">
              Files are automatically processed and categorized using AI. 
              Manual review and adjustments can be made after upload.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}; 