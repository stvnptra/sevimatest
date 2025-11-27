import React, { useRef, useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonImg,
  IonProgressBar,
  IonText
} from '@ionic/react';
import { imageOutline, closeCircle, cloudUploadOutline } from 'ionicons/icons';
import { isValidImageFile } from '../utils/validators';

interface ImageUploaderProps {
  onImageSelected: (file: File, preview: string) => void;
  onImageRemoved?: () => void;
  maxSizeMB?: number;
  showPreview?: boolean;
  previewUrl?: string | null;
  uploading?: boolean;
  uploadProgress?: number;
  disabled?: boolean;
  buttonText?: string;
  acceptTypes?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onImageRemoved,
  maxSizeMB = 5,
  showPreview = true,
  previewUrl = null,
  uploading = false,
  uploadProgress = 0,
  disabled = false,
  buttonText = 'Select Image',
  acceptTypes = 'image/jpeg,image/png,image/gif,image/webp'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file
    const validation = isValidImageFile(file);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setLocalPreview(preview);
      onImageSelected(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setLocalPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemoved?.();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayPreview = previewUrl || localPreview;

  return (
    <div className="image-uploader">
      <input
        type="file"
        accept={acceptTypes}
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {error && (
        <IonText color="danger" style={{ display: 'block', marginBottom: '10px' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
        </IonText>
      )}

      {showPreview && displayPreview ? (
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <IonImg
            src={displayPreview}
            alt="Preview"
            style={{ 
              maxHeight: '300px', 
              objectFit: 'contain',
              borderRadius: '8px',
              border: '1px solid var(--ion-color-light)'
            }}
          />
          {!disabled && !uploading && (
            <IonButton
              fill="clear"
              style={{ 
                position: 'absolute', 
                top: '5px', 
                right: '5px',
                '--background': 'rgba(0,0,0,0.5)',
                '--border-radius': '50%'
              }}
              onClick={handleRemove}
            >
              <IonIcon icon={closeCircle} color="light" />
            </IonButton>
          )}
          {uploading && (
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0,
              background: 'rgba(0,0,0,0.5)',
              padding: '10px',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px'
            }}>
              <IonProgressBar value={uploadProgress / 100} />
              <IonText color="light">
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', textAlign: 'center' }}>
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </IonText>
            </div>
          )}
        </div>
      ) : (
        <IonButton
          expand="block"
          fill="outline"
          onClick={handleButtonClick}
          disabled={disabled || uploading}
          style={{ marginBottom: '10px' }}
        >
          <IonIcon icon={uploading ? cloudUploadOutline : imageOutline} slot="start" />
          {uploading ? 'Uploading...' : buttonText}
        </IonButton>
      )}
    </div>
  );
};

export default ImageUploader;
