import { doc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { timeAgoShort } from '../utils/timeAgo';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string | null;
  text: string;
  createdAt: Timestamp;
}

// Add a comment to a post
export const addCommentToPost = async (
  postId: string,
  userId: string,
  userName: string,
  userPhoto: string | null,
  text: string
): Promise<Comment> => {
  const docRef = doc(db, 'posts', postId);
  const comment: Comment = {
    id: crypto.randomUUID(),
    userId,
    userName,
    userPhoto,
    text,
    createdAt: Timestamp.now()
  };
  
  await updateDoc(docRef, {
    comments: arrayUnion(comment)
  });
  
  return comment;
};

// Delete a comment from a post
export const deleteCommentFromPost = async (
  postId: string,
  comment: Comment
): Promise<void> => {
  const docRef = doc(db, 'posts', postId);
  await updateDoc(docRef, {
    comments: arrayRemove(comment)
  });
};

// Edit a comment (delete and re-add with new text)
export const editComment = async (
  postId: string,
  oldComment: Comment,
  newText: string
): Promise<Comment> => {
  const docRef = doc(db, 'posts', postId);
  
  // Remove old comment
  await updateDoc(docRef, {
    comments: arrayRemove(oldComment)
  });
  
  // Create updated comment
  const updatedComment: Comment = {
    ...oldComment,
    text: newText,
    createdAt: Timestamp.now() // Update timestamp when edited
  };
  
  // Add updated comment
  await updateDoc(docRef, {
    comments: arrayUnion(updatedComment)
  });
  
  return updatedComment;
};

// Get comments count for a post
export const getCommentsCount = (comments: Comment[]): number => {
  return comments.length;
};

// Sort comments by date (newest first)
export const sortCommentsByDate = (
  comments: Comment[],
  ascending: boolean = false
): Comment[] => {
  return [...comments].sort((a, b) => {
    const dateA = a.createdAt.toMillis();
    const dateB = b.createdAt.toMillis();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Check if user can delete comment (is owner)
export const canDeleteComment = (comment: Comment, userId: string): boolean => {
  return comment.userId === userId;
};

// Format comment for display
export const formatComment = (comment: Comment): {
  id: string;
  userName: string;
  text: string;
  timeAgo: string;
  isOwner: (userId: string) => boolean;
} => {
  return {
    id: comment.id,
    userName: comment.userName,
    text: comment.text,
    timeAgo: timeAgoShort(comment.createdAt),
    isOwner: (userId: string) => comment.userId === userId
  };
};
