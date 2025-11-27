import React, { useState } from 'react';
import {
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
import { heart, heartOutline, chatbubbleOutline, trashOutline } from 'ionicons/icons';
import { Post, likePost, unlikePost, addComment, deletePost, deleteComment } from '../services/postService';
import { useAuth } from '../context';

interface PostCardProps {
  post: Post;
  onPostDeleted?: () => void;
  onPostUpdated?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostDeleted, onPostUpdated }) => {
  const { user, userProfile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user.uid) : false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await unlikePost(post.id, user.uid);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(post.id, user.uid);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      onPostUpdated?.();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user || !userProfile || !commentText.trim()) return;

    try {
      await addComment(post.id, user.uid, userProfile.displayName, commentText.trim());
      setCommentText('');
      onPostUpdated?.();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!user || user.uid !== post.userId) return;

    try {
      await deletePost(post.id, post.imageUrl);
      onPostDeleted?.();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (comment: typeof post.comments[0]) => {
    if (!user || user.uid !== comment.userId) return;

    try {
      await deleteComment(post.id, comment);
      onPostUpdated?.();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
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
            <p>{new Date(post.createdAt.toDate()).toLocaleDateString()}</p>
          </IonLabel>
          {user && user.uid === post.userId && (
            <IonButton fill="clear" color="danger" onClick={handleDeletePost}>
              <IonIcon icon={trashOutline} />
            </IonButton>
          )}
        </IonItem>
      </IonCardHeader>

      <img src={post.imageUrl} alt="Post" style={{ width: '100%', objectFit: 'cover' }} />

      <IonCardContent>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <IonButton fill="clear" onClick={handleLike}>
            <IonIcon icon={isLiked ? heart : heartOutline} color={isLiked ? 'danger' : 'medium'} />
            <span style={{ marginLeft: '5px' }}>{likesCount}</span>
          </IonButton>
          <IonButton fill="clear" onClick={() => setShowComments(!showComments)}>
            <IonIcon icon={chatbubbleOutline} />
            <span style={{ marginLeft: '5px' }}>{post.comments.length}</span>
          </IonButton>
        </div>

        <IonText>
          <p>
            <strong>{post.userName}</strong> {post.caption}
          </p>
        </IonText>

        {showComments && (
          <div style={{ marginTop: '10px' }}>
            <IonList>
              {post.comments.map((comment) => (
                <IonItem key={comment.id} lines="none">
                  <IonLabel>
                    <p>
                      <strong>{comment.userName}</strong> {comment.text}
                    </p>
                  </IonLabel>
                  {user && user.uid === comment.userId && (
                    <IonButton
                      fill="clear"
                      size="small"
                      color="danger"
                      onClick={() => handleDeleteComment(comment)}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  )}
                </IonItem>
              ))}
            </IonList>

            {user && (
              <IonItem>
                <IonInput
                  placeholder="Add a comment..."
                  value={commentText}
                  onIonInput={(e) => setCommentText(e.detail.value || '')}
                />
                <IonButton fill="clear" onClick={handleAddComment}>
                  Post
                </IonButton>
              </IonItem>
            )}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default PostCard;
