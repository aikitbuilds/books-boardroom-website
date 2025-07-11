import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { storage } from '../../lib/firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase-config';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Archive,
  AlertCircle, 
  CheckCircle2,
  X,
  Eye,
  Download,
  Share2
} from 'lucide-react';

interface FileUploadProps {
  organizationId: string;
  userId: string;
  path?: string;
  associations?: {
    contactIds?: string[];
    projectIds?: string[];
    opportunityIds?: string[];
    customerId?: string;
  };
  onUploadComplete?: (files: FileRecord[]) => void;
  onUploadProgress?: (fileIndex: number, progress: number) => void;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  acceptedFileTypes?: Record<string, string[]>;
  className?: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
  fileRecord?: FileRecord;
}

interface FileRecord {
  id: string;
  fileInfo: {
    originalName: string;
    storageName: string;
    storagePath: string;
    url: string;
    thumbnailUrl?: string;
    mimeType: string;
    size: number;
  };
  classification: {
    type: string;
    category: string;
    confidentiality: string;
    isSystemGenerated: boolean;
  };
  associations: {
    contactIds: string[];
    projectIds: string[];
    opportunityIds: string[];
    customerIds: string[];
  };
  metadata: {
    title?: string;
    description?: string;
    tags: string[];
  };
  createdBy: string;
  createdAt: any;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  organizationId,
  userId,
  path = 'uploads',
  associations = {},
  onUploadComplete,
  onUploadProgress,
  maxFileSize = 50, // 50MB default
  maxFiles = 10,
  acceptedFileTypes = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
    'text/csv': ['.csv'],
    'application/zip': ['.zip'],
    'application/x-rar-compressed': ['.rar']
  },
  className = ''
}) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (type.startsWith('audio/')) return <Music className="h-5 w-5" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const getFileType = (file: File): string => {
    const type = file.type;
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('document') || type.includes('word')) return 'document';
    if (type.includes('sheet') || type.includes('excel')) return 'spreadsheet';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'presentation';
    if (type.includes('zip') || type.includes('rar')) return 'archive';
    return 'other';
  };

  const generateStorageName = (file: File): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  };

  const uploadFile = async (file: File, index: number): Promise<FileRecord> => {
    const storageName = generateStorageName(file);
    const storagePath = `organizations/${organizationId}/files/${path}/${storageName}`;
    const storageRef = ref(storage, storagePath);

    // Upload file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file, {
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
        originalFileName: file.name,
        organizationId: organizationId
      }
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploads(prev => 
            prev.map((upload, i) => 
              i === index 
                ? { ...upload, progress: Math.round(progress) }
                : upload
            )
          );
          onUploadProgress?.(index, progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setUploads(prev => 
            prev.map((upload, i) => 
              i === index 
                ? { ...upload, status: 'error', error: error.message }
                : upload
            )
          );
          reject(error);
        },
        async () => {
          try {
            // Update status to processing
            setUploads(prev => 
              prev.map((upload, i) => 
                i === index 
                  ? { ...upload, status: 'processing' }
                  : upload
              )
            );

            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Create file record in Firestore
            const fileRecord: Omit<FileRecord, 'id'> = {
              fileInfo: {
                originalName: file.name,
                storageName: storageName,
                storagePath: storagePath,
                url: downloadUrl,
                mimeType: file.type,
                size: file.size
              },
              classification: {
                type: getFileType(file),
                category: 'user_upload',
                confidentiality: 'internal',
                isSystemGenerated: false
              },
              associations: {
                contactIds: associations.contactIds || [],
                projectIds: associations.projectIds || [],
                opportunityIds: associations.opportunityIds || [],
                customerIds: associations.customerId ? [associations.customerId] : []
              },
              metadata: {
                title: file.name,
                description: '',
                tags: []
              },
              createdBy: userId,
              createdAt: serverTimestamp()
            };

            const docRef = await addDoc(
              collection(db, `organizations/${organizationId}/files`),
              fileRecord
            );

            const completeFileRecord = {
              id: docRef.id,
              ...fileRecord
            } as FileRecord;

            setUploads(prev => 
              prev.map((upload, i) => 
                i === index 
                  ? { 
                      ...upload, 
                      status: 'completed', 
                      downloadUrl,
                      fileRecord: completeFileRecord
                    }
                  : upload
              )
            );

            resolve(completeFileRecord);
          } catch (error) {
            console.error('Firestore error:', error);
            setUploads(prev => 
              prev.map((upload, i) => 
                i === index 
                  ? { ...upload, status: 'error', error: (error as Error).message }
                  : upload
              )
            );
            reject(error);
          }
        }
      );
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Files exceed ${maxFileSize}MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setIsUploading(true);
    const newUploads: UploadProgress[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploads(newUploads);

    try {
      const uploadPromises = acceptedFiles.map((file, index) => uploadFile(file, index));
      const results = await Promise.allSettled(uploadPromises);
      
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<FileRecord> => 
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
  }, [organizationId, userId, path, associations, maxFileSize, maxFiles, onUploadComplete, onUploadProgress]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles,
    maxSize: maxFileSize * 1024 * 1024,
    disabled: isUploading
  });

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />;
      default:
        return <Upload className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' 
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          
          {isDragActive ? (
            <p className="text-blue-600 dark:text-blue-400">Drop files here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag & drop files here</p>
              <p className="text-sm text-gray-500 mb-4">
                or <span className="text-blue-600 underline">browse files</span>
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Accepted formats: PDF, DOC, DOCX, XLS, XLSX, Images, ZIP</p>
                <p>Max file size: {maxFileSize}MB | Max files: {maxFiles}</p>
              </div>
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
              <div key={index} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {getFileIcon(upload.file)}
                    {getStatusIcon(upload.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{upload.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(upload.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      upload.status === 'completed' ? 'default' :
                      upload.status === 'error' ? 'destructive' :
                      'secondary'
                    }>
                      {upload.status === 'completed' ? 'Complete' : 
                       upload.status === 'error' ? 'Failed' : 
                       upload.status === 'processing' ? 'Processing' :
                       `${upload.progress}%`}
                    </Badge>
                    
                    {upload.status === 'completed' && upload.fileRecord && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0"
                      onClick={() => removeUpload(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
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

        {/* Upload Summary */}
        {uploads.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {uploads.filter(u => u.status === 'completed').length} of {uploads.length} files uploaded
              </span>
              <span>
                Total size: {formatFileSize(uploads.reduce((acc, u) => acc + u.file.size, 0))}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};