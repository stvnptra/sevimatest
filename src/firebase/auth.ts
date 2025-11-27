import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  User,
  UserCredential,
  onAuthStateChanged,
  Unsubscribe
} from 'firebase/auth';
import { auth } from './config';

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};

// Update user display name
export const updateUserDisplayName = async (
  user: User,
  displayName: string
): Promise<void> => {
  return updateProfile(user, { displayName });
};

// Update user photo URL
export const updateUserPhotoURL = async (
  user: User,
  photoURL: string
): Promise<void> => {
  return updateProfile(user, { photoURL });
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// Update user email
export const updateUserEmail = async (
  user: User,
  newEmail: string
): Promise<void> => {
  return updateEmail(user, newEmail);
};

// Update user password
export const updateUserPassword = async (
  user: User,
  newPassword: string
): Promise<void> => {
  return updatePassword(user, newPassword);
};

// Subscribe to auth state changes
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export { auth };
