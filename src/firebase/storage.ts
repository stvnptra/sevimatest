import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
  UploadTaskSnapshot,
  StorageReference
} from 'firebase/storage';
import { storage } from './config';

// Upload file and get download URL
export const uploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Upload file with progress tracking
export const uploadFileWithProgress = (
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
  onComplete?: (url: string) => void,
  onError?: (error: Error) => void
): UploadTask => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot: UploadTaskSnapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress?.(progress);
    },
    (error) => {
      onError?.(error);
    },
    async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      onComplete?.(url);
    }
  );

  return uploadTask;
};

// Delete file from storage
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// Delete file by URL
export const deleteFileByUrl = async (url: string): Promise<void> => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file by URL:', error);
    throw error;
  }
};

// Get download URL for a file
export const getFileUrl = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

// List all files in a folder
export const listFiles = async (
  folderPath: string
): Promise<StorageReference[]> => {
  const folderRef = ref(storage, folderPath);
  const result = await listAll(folderRef);
  return result.items;
};

// Generate unique file path
export const generateFilePath = (
  folder: string,
  userId: string,
  fileName: string
): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${folder}/${userId}/${timestamp}_${sanitizedFileName}`;
};

// Upload image with validation
export const uploadImage = async (
  folder: string,
  userId: string,
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024
): Promise<string> => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  // Validate file size
  if (file.size > maxSizeBytes) {
    throw new Error(`File size must be less than ${maxSizeBytes / (1024 * 1024)}MB.`);
  }

  const path = generateFilePath(folder, userId, file.name);
  return uploadFile(path, file);
};

export { storage };
