import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Timestamp;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  createdAt: Timestamp;
}

// Create a new post
export const createPost = async (
  userId: string,
  userName: string,
  userPhoto: string | null,
  imageFile: File,
  caption: string
): Promise<string> => {
  // Upload image to Firebase Storage
  const imageRef = ref(storage, `posts/${userId}/${Date.now()}_${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);

  // Create post document
  const postData = {
    userId,
    userName,
    userPhoto,
    imageUrl,
    caption,
    likes: [],
    comments: [],
    createdAt: Timestamp.now()
  };

  const docRef = await addDoc(collection(db, 'posts'), postData);
  return docRef.id;
};

// Get all posts (for feed)
export const getPosts = async (): Promise<Post[]> => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
};

// Get a single post
export const getPost = async (postId: string): Promise<Post | null> => {
  const docRef = doc(db, 'posts', postId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Post;
  }
  return null;
};

// Get posts by user
export const getPostsByUser = async (userId: string): Promise<Post[]> => {
  const q = query(
    collection(db, 'posts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Post);
};

// Update a post
export const updatePost = async (postId: string, caption: string): Promise<void> => {
  const docRef = doc(db, 'posts', postId);
  await updateDoc(docRef, { caption });
};

// Delete a post
export const deletePost = async (postId: string, imageUrl: string): Promise<void> => {
  // Delete image from storage
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }

  // Delete post document
  await deleteDoc(doc(db, 'posts', postId));
};

// Like a post
export const likePost = async (postId: string, userId: string): Promise<void> => {
  const docRef = doc(db, 'posts', postId);
  await updateDoc(docRef, {
    likes: arrayUnion(userId)
  });
};

// Unlike a post
export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  const docRef = doc(db, 'posts', postId);
  await updateDoc(docRef, {
    likes: arrayRemove(userId)
  });
};

// Add a comment
export const addComment = async (
  postId: string,
  userId: string,
  userName: string,
  text: string
): Promise<void> => {
  const docRef = doc(db, 'posts', postId);
  const comment: Comment = {
    id: crypto.randomUUID(),
    userId,
    userName,
    text,
    createdAt: Timestamp.now()
  };
  await updateDoc(docRef, {
    comments: arrayUnion(comment)
  });
};

// Delete a comment
export const deleteComment = async (postId: string, comment: Comment): Promise<void> => {
  const docRef = doc(db, 'posts', postId);
  await updateDoc(docRef, {
    comments: arrayRemove(comment)
  });
};
