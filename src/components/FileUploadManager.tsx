import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, FileText, FileSpreadsheet, FileImage, 
  FileArchive, X, CheckCircle, AlertTriangle, 
  Loader2, Trash2, Eye, Download, FolderOpen
} from 'lucide-react';
import { useFirebase } from '@/hooks/useFirebase';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error' | 'processing';
  progress: number;
  url?: string;
  uploadedAt: Date;
  tags: string[];
  category: 'financial' | 'contract' | 'proposal' | 'report' | 'other';
  storagePath?: string;
  downloadUrl?: string;
}

interface FileUploadManagerProps {
  onFileUploaded?: (file: UploadedFile) => void;
  allowedTypes?: string[];
  maxFileSize?: number; // in bytes
  multiple?: boolean;
}

export default function FileUploadManager({ 
  onFileUploaded,
  allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  maxFileSize = 20 * 1024 * 1024, // 20MB
  multiple = true
}: FileUploadManagerProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state } = useFirebase();

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-4 w-4 text-red-600" />;
    if (type.includes('csv') || type.includes('excel') || type.includes('spreadsheet')) return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    if (type.includes('image')) return <FileImage className="h-4 w-4 text-blue-600" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchive className="h-4 w-4 text-purple-600" />;
    return <FileText className="h-4 w-4 text-gray-600" />;
  };

  const getFileCategory = (fileName: string, type: string): UploadedFile['category'] => {
    const name = fileName.toLowerCase();
    if (name.includes('invoice') || name.includes('financial') || name.includes('payment')) return 'financial';
    if (name.includes('contract') || name.includes('agreement')) return 'contract';
    if (name.includes('proposal') || name.includes('quote')) return 'proposal';
    if (name.includes('report') || name.includes('analysis')) return 'report';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit`;
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }

    return null;
  };

  const generateStoragePath = (file: File): string => {
    if (!state.user) throw new Error('User not authenticated');
    
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    return `uploads/${state.user.uid}/${timestamp}_${randomString}_${sanitizedName}`;
  };

  const uploadFileToFirebase = async (file: File, uploadedFile: UploadedFile): Promise<UploadedFile> => {
    if (!state.user) throw new Error('User not authenticated');

    const storagePath = generateStoragePath(file);
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: {
          uploadedBy: state.user!.uid,
          uploadedAt: new Date().toISOString(),
          originalFileName: file.name,
          fileType: file.type,
          fileSize: file.size.toString()
        }
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadedFiles(prev => prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress: Math.round(progress) }
              : f
          ));
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadedFiles(prev => prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'error', progress: 0 }
              : f
          ));
          reject(error);
        },
        async () => {
          try {
            // Update status to processing
            setUploadedFiles(prev => prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: 'processing' }
                : f
            ));

            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Create file record in Firestore
            const fileRecord = {
              originalName: file.name,
              storagePath: storagePath,
              url: downloadUrl,
              mimeType: file.type,
              size: file.size,
              category: uploadedFile.category,
              uploadedBy: state.user!.uid,
              uploadedAt: serverTimestamp(),
              tags: uploadedFile.tags
            };

            const docRef = await addDoc(collection(db, 'files'), fileRecord);

            const completedFile: UploadedFile = {
              ...uploadedFile,
              status: 'completed',
              progress: 100,
              url: downloadUrl,
              storagePath: storagePath,
              downloadUrl: downloadUrl
            };

            setUploadedFiles(prev => prev.map(f => 
              f.id === uploadedFile.id 
                ? completedFile
                : f
            ));

            resolve(completedFile);
          } catch (error) {
            console.error('Firestore error:', error);
            setUploadedFiles(prev => prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: 'error', progress: 0 }
                : f
            ));
            reject(error);
          }
        }
      );
    });
  };

  const handleFileSelect = (files: FileList) => {
    setError(null);
    setSuccess(null);

    const newFiles: UploadedFile[] = [];
    let hasErrors = false;

    Array.from(files).forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        hasErrors = true;
        return;
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
        uploadedAt: new Date(),
        tags: [],
        category: getFileCategory(file.name, file.type)
      };

      newFiles.push(uploadedFile);
    });

    if (!hasErrors && newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      uploadFiles(newFiles);
    }
  };

  const uploadFiles = async (files: UploadedFile[]) => {
    setIsUploading(true);

    for (const file of files) {
      try {
        // Find the actual File object
        const fileInput = fileInputRef.current;
        if (!fileInput?.files) continue;
        
        const actualFile = Array.from(fileInput.files).find(f => f.name === file.name);
        if (!actualFile) continue;

        // Upload to Firebase Storage
        const uploadedFile = await uploadFileToFirebase(actualFile, file);
        
        setSuccess(`Successfully uploaded ${file.name}`);
        onFileUploaded?.(uploadedFile);

      } catch (error) {
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error', progress: 0 }
            : f
        ));
        setError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setIsUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload Manager
        </CardTitle>
        <CardDescription>
          Upload PDFs, CSVs, and other documents. Drag and drop or click to browse.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={allowedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {dragActive ? 'Drop files here' : 'Upload Files'}
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop files here, or{' '}
            <button
              type="button"
              onClick={handleBrowseClick}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              browse files
            </button>
          </p>
          <p className="text-sm text-gray-400">
            Supported: PDF, CSV, Excel files (max {formatFileSize(maxFileSize)})
          </p>
        </div>

        {/* Upload Progress */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Upload Progress</h4>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {file.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {file.status === 'error' && (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={file.progress} className="flex-1" />
                    <span className="text-xs text-gray-500">
                      {file.progress}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                    <Badge variant={file.status === 'completed' ? 'default' : 'secondary'}>
                      {file.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 