import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Like a post
export const likePost = async (
  postId: string,
  userId: string
): Promise<void> => {
  const docRef = doc(db, 'posts', postId);
  await updateDoc(docRef, {
    likes: arrayUnion(userId)
  });
};

// Unlike a post
export const unlikePost = async (
  postId: string,
  userId: string
): Promise<void> => {
  const docRef = doc(db, 'posts', postId);
  await updateDoc(docRef, {
    likes: arrayRemove(userId)
  });
};

// Toggle like on a post
export const toggleLike = async (
  postId: string,
  userId: string
): Promise<boolean> => {
  const docRef = doc(db, 'posts', postId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Post not found');
  }
  
  const likes: string[] = docSnap.data().likes || [];
  const isLiked = likes.includes(userId);
  
  if (isLiked) {
    await unlikePost(postId, userId);
    return false;
  } else {
    await likePost(postId, userId);
    return true;
  }
};

// Check if user has liked a post
export const hasUserLikedPost = (
  likes: string[],
  userId: string
): boolean => {
  return likes.includes(userId);
};

// Get likes count
export const getLikesCount = (likes: string[]): number => {
  return likes.length;
};

// Get users who liked a post (returns array of user IDs)
export const getLikedByUsers = async (
  postId: string
): Promise<string[]> => {
  const docRef = doc(db, 'posts', postId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return [];
  }
  
  return docSnap.data().likes || [];
};

// Format likes count for display
export const formatLikesCount = (count: number): string => {
  if (count === 0) {
    return 'No likes yet';
  } else if (count === 1) {
    return '1 like';
  } else if (count < 1000) {
    return `${count} likes`;
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K likes`;
  } else {
    return `${(count / 1000000).toFixed(1)}M likes`;
  }
};
