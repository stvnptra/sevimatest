import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  CollectionReference,
  QueryDocumentSnapshot,
  Timestamp,
  onSnapshot,
  Unsubscribe,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

// Collection references
export const getCollectionRef = (collectionName: string): CollectionReference => {
  return collection(db, collectionName);
};

// Document references
export const getDocRef = (
  collectionName: string,
  docId: string
): DocumentReference => {
  return doc(db, collectionName, docId);
};

// Create a document with auto-generated ID
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

// Create or update a document with a specific ID
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = true
): Promise<void> => {
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: Timestamp.now()
  }, { merge });
};

// Get a single document
export const getDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const docSnap = await getDoc(doc(db, collectionName, docId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

// Get all documents in a collection
export const getDocuments = async <T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...queryConstraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
};

// Update a document
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  await updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

// Delete a document
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docId));
};

// Subscribe to a document
export const subscribeToDocument = <T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
): Unsubscribe => {
  return onSnapshot(doc(db, collectionName, docId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
};

// Subscribe to a collection
export const subscribeToCollection = <T>(
  collectionName: string,
  callback: (data: T[]) => void,
  ...queryConstraints: QueryConstraint[]
): Unsubscribe => {
  const q = query(collection(db, collectionName), ...queryConstraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    callback(data);
  });
};

// Paginated query
export const getPaginatedDocuments = async <T>(
  collectionName: string,
  pageSize: number,
  lastDoc?: QueryDocumentSnapshot,
  ...queryConstraints: QueryConstraint[]
): Promise<{ data: T[]; lastDoc: QueryDocumentSnapshot | null }> => {
  let q = query(collection(db, collectionName), ...queryConstraints, limit(pageSize));
  
  if (lastDoc) {
    q = query(collection(db, collectionName), ...queryConstraints, startAfter(lastDoc), limit(pageSize));
  }
  
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
  
  return { data, lastDoc: newLastDoc };
};

// Export commonly used functions from firestore
export { where, orderBy, limit, Timestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
export { query, db };
