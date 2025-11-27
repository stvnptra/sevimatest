import React, { useState, useEffect, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
  IonItem,
  IonInput,
  IonList,
  IonText
} from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { heart, heartOutline, chatbubbleOutline, trashOutline, sendOutline } from 'ionicons/icons';
import { Post, getPost, deletePost } from '../services/postService';
import { likePost, unlikePost } from '../services/likeService';
import { addCommentToPost, deleteCommentFromPost, Comment } from '../services/commentService';
import { CommentItem } from '../components';
import { useAuth } from '../context';
import { timeAgo } from '../utils/timeAgo';

type PostDetailParams = { postId: string };

const PostDetail: React.FC<RouteComponentProps<PostDetailParams>> = ({ match, history }) => {
  const { postId } = match.params;
  const { user, userProfile } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const fetchPost = useCallback(async () => {
    try {
      const fetchedPost = await getPost(postId);
      setPost(fetchedPost);
      if (fetchedPost && user) {
        setIsLiked(fetchedPost.likes.includes(user.uid));
        setLikesCount(fetchedPost.likes.length);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [postId, user]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    if (!user || !post) return;

    try {
      if (isLiked) {
        await unlikePost(post.id, user.uid);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(post.id, user.uid);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user || !userProfile || !post || !commentText.trim()) return;

    setSubmitting(true);
    try {
      await addCommentToPost(
        post.id,
        user.uid,
        userProfile.displayName,
        userProfile.photoURL,
        commentText.trim()
      );
      setCommentText('');
      await fetchPost(); // Refresh to get updated comments
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    if (!user || !post || user.uid !== comment.userId) return;

    try {
      await deleteCommentFromPost(post.id, comment);
      await fetchPost(); // Refresh to get updated comments
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!user || !post || user.uid !== post.userId) return;

    try {
      await deletePost(post.id, post.imageUrl);
      history.goBack();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/feed" />
            </IonButtons>
            <IonTitle>Post</IonTitle>
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

  if (!post) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/feed" />
            </IonButtons>
            <IonTitle>Post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonText color="medium">
              <p>Post not found</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/feed" />
          </IonButtons>
          <IonTitle>Post</IonTitle>
          {user && user.uid === post.userId && (
            <IonButtons slot="end">
              <IonButton color="danger" onClick={handleDeletePost}>
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonItem lines="none">
              <IonAvatar slot="start">
                <img
                  src={post.userPhoto || 'https://ionicframework.com/docs/img/demos/avatar.svg'}
                  alt={post.userName}
                />
              </IonAvatar>
              <IonLabel>
                <h2>{post.userName}</h2>
                <p>{post.createdAt && typeof post.createdAt.toDate === 'function' 
                  ? timeAgo(post.createdAt) 
                  : ''}</p>
              </IonLabel>
            </IonItem>
          </IonCardHeader>

          <img src={post.imageUrl} alt="Post" style={{ width: '100%', objectFit: 'cover' }} />

          <IonCardContent>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <IonButton fill="clear" onClick={handleLike}>
                <IonIcon icon={isLiked ? heart : heartOutline} color={isLiked ? 'danger' : 'medium'} />
                <span style={{ marginLeft: '5px' }}>{likesCount}</span>
              </IonButton>
              <IonButton fill="clear">
                <IonIcon icon={chatbubbleOutline} />
                <span style={{ marginLeft: '5px' }}>{post.comments.length}</span>
              </IonButton>
            </div>

            <IonText>
              <p>
                <strong>{post.userName}</strong> {post.caption}
              </p>
            </IonText>

            {/* Comments Section */}
            <div style={{ marginTop: '20px' }}>
              <IonText>
                <h3 style={{ margin: '0 0 10px 0' }}>Comments</h3>
              </IonText>

              {post.comments.length === 0 ? (
                <IonText color="medium">
                  <p>No comments yet. Be the first to comment!</p>
                </IonText>
              ) : (
                <IonList>
                  {post.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={user?.uid}
                      onDelete={handleDeleteComment}
                    />
                  ))}
                </IonList>
              )}

              {/* Add Comment Input */}
              {user && (
                <IonItem style={{ marginTop: '10px' }}>
                  <IonInput
                    placeholder="Add a comment..."
                    value={commentText}
                    onIonInput={(e) => setCommentText(e.detail.value || '')}
                    disabled={submitting}
                  />
                  <IonButton
                    fill="clear"
                    onClick={handleAddComment}
                    disabled={submitting || !commentText.trim()}
                  >
                    <IonIcon icon={sendOutline} />
                  </IonButton>
                </IonItem>
              )}
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PostDetail;
