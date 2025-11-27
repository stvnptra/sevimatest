import React from 'react';
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { Comment } from '../services/commentService';
import { timeAgoShort } from '../utils/timeAgo';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onDelete?: (comment: Comment) => void;
  showDeleteButton?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onDelete,
  showDeleteButton = true
}) => {
  const isOwner = currentUserId === comment.userId;
  const canDelete = isOwner && showDeleteButton;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment);
    }
  };

  return (
    <IonItem lines="none" className="comment-item">
      <IonAvatar slot="start" style={{ width: '32px', height: '32px' }}>
        <img
          src={comment.userPhoto || 'https://ionicframework.com/docs/img/demos/avatar.svg'}
          alt={comment.userName}
        />
      </IonAvatar>
      <IonLabel>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ marginRight: '8px' }}>{comment.userName}</strong>
              {comment.text}
            </p>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '12px', 
              color: 'var(--ion-color-medium)' 
            }}>
              {comment.createdAt && typeof comment.createdAt.toDate === 'function' 
                ? timeAgoShort(comment.createdAt) 
                : ''}
            </p>
          </div>
        </div>
      </IonLabel>
      {canDelete && (
        <IonButton
          fill="clear"
          size="small"
          color="danger"
          onClick={handleDelete}
          slot="end"
        >
          <IonIcon icon={trashOutline} />
        </IonButton>
      )}
    </IonItem>
  );
};

export default CommentItem;
