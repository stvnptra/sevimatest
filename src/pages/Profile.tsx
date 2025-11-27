import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg
} from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { useAuth } from '../context';
import { updateUserProfile } from '../services/authService';
import { Post, getPostsByUser } from '../services/postService';

const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  const { user, userProfile, logout, refreshUserProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user) {
        try {
          const userPosts = await getPostsByUser(user.uid);
          setPosts(userPosts);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      }
      setLoading(false);
    };

    fetchUserPosts();
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName);
      setBio(userProfile.bio || '');
    }
  }, [userProfile]);

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, { displayName, bio });
      await refreshUserProfile();
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IonAvatar style={{ width: '100px', height: '100px', marginBottom: '20px' }}>
                <img
                  src={userProfile?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg'}
                  alt="Profile"
                />
              </IonAvatar>

              {editing ? (
                <>
                  <IonItem style={{ width: '100%' }}>
                    <IonLabel position="floating">Display Name</IonLabel>
                    <IonInput
                      value={displayName}
                      onIonInput={(e) => setDisplayName(e.detail.value || '')}
                    />
                  </IonItem>

                  <IonItem style={{ width: '100%' }}>
                    <IonLabel position="floating">Bio</IonLabel>
                    <IonTextarea
                      value={bio}
                      onIonInput={(e) => setBio(e.detail.value || '')}
                      rows={3}
                    />
                  </IonItem>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <IonButton onClick={handleSaveProfile} disabled={saving}>
                      {saving ? <IonSpinner /> : 'Save'}
                    </IonButton>
                    <IonButton fill="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </IonButton>
                  </div>
                </>
              ) : (
                <>
                  <h2>{userProfile?.displayName}</h2>
                  <p style={{ color: 'var(--ion-color-medium)' }}>{userProfile?.email}</p>
                  {userProfile?.bio && <p>{userProfile.bio}</p>}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <IonButton fill="outline" onClick={() => setEditing(true)}>
                      Edit Profile
                    </IonButton>
                    <IonButton color="danger" fill="outline" onClick={handleLogout}>
                      Logout
                    </IonButton>
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p>
                <strong>{posts.length}</strong> posts
              </p>
            </div>
          </IonCardContent>
        </IonCard>

        <h3 style={{ padding: '0 16px' }}>My Posts</h3>

        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>
            No posts yet
          </p>
        ) : (
          <IonGrid>
            <IonRow>
              {posts.map((post) => (
                <IonCol size="4" key={post.id}>
                  <IonImg
                    src={post.imageUrl}
                    style={{ aspectRatio: '1', objectFit: 'cover' }}
                  />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
