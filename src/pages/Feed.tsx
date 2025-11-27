import React, { useState, useEffect, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { PostCard } from '../components';
import { Post, getPosts } from '../services/postService';
import { useAuth } from '../context';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const history = useHistory();

  const fetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchPosts();
    event.detail.complete();
  };

  const handlePostDeleted = () => {
    fetchPosts();
  };

  const handlePostUpdated = () => {
    fetchPosts();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Feed</IonTitle>
          {user && (
            <IonButtons slot="end">
              <IonButton onClick={() => history.push('/create-post')}>
                <IonIcon icon={addOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <IonSpinner />
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Feed;
