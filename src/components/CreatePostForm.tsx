import React, { useState, useRef } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonTextarea,
  IonImg,
  IonIcon,
  IonSpinner
} from '@ionic/react';
import { imageOutline, closeCircle } from 'ionicons/icons';
import { createPost } from '../services/postService';
import { useAuth } from '../context';

interface CreatePostFormProps {
  onPostCreated?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const { user, userProfile } = useAuth();
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!user || !userProfile || !imageFile) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createPost(
        user.uid,
        userProfile.displayName,
        userProfile.photoURL,
        imageFile,
        caption
      );
      setCaption('');
      handleRemoveImage();
      onPostCreated?.();
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Create Post</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {error && (
          <p style={{ color: 'var(--ion-color-danger)', marginBottom: '10px' }}>{error}</p>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />

        {imagePreview ? (
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <IonImg src={imagePreview} alt="Preview" />
            <IonButton
              fill="clear"
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={handleRemoveImage}
            >
              <IonIcon icon={closeCircle} color="danger" />
            </IonButton>
          </div>
        ) : (
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => fileInputRef.current?.click()}
            style={{ marginBottom: '10px' }}
          >
            <IonIcon icon={imageOutline} slot="start" />
            Select Image
          </IonButton>
        )}

        <IonTextarea
          placeholder="Write a caption..."
          value={caption}
          onIonInput={(e) => setCaption(e.detail.value || '')}
          rows={3}
          style={{ marginBottom: '10px' }}
        />

        <IonButton
          expand="block"
          onClick={handleSubmit}
          disabled={loading || !imageFile}
        >
          {loading ? <IonSpinner /> : 'Share Post'}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default CreatePostForm;
