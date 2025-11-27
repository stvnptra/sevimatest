# InstaApp - PWA with Ionic React & Firebase

A Progressive Web App built with Ionic React and Firebase featuring social media functionality.

## Features

- 🔐 **Authentication**: Login and Register with Firebase Auth
- 📝 **Create Post**: Upload images with captions
- 📰 **Feed**: View all posts from users
- ❤️ **Like**: Like and unlike posts
- 💬 **Comment**: Add and delete comments on posts
- 👤 **Profile**: View and edit user profile

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── CreatePostForm.tsx
│   ├── PostCard.tsx
│   └── PrivateRoute.tsx
├── context/         # React Context for state management
│   └── AuthContext.tsx
├── firebase/        # Firebase configuration
│   └── config.ts
├── pages/           # App pages
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Feed.tsx
│   ├── CreatePost.tsx
│   └── Profile.tsx
├── services/        # Firebase CRUD services
│   ├── authService.ts
│   └── postService.ts
├── App.tsx          # Main app with routing
└── main.tsx         # Entry point
```

## Firebase Services Used

- **Firebase Auth**: User authentication
- **Firestore**: Database for users and posts
- **Firebase Storage**: Image storage

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
4. Enable Authentication (Email/Password), Firestore, and Storage
5. Copy `.env.example` to `.env` and fill in your Firebase config:
   ```bash
   cp .env.example .env
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## PWA Features

This app is configured as a Progressive Web App with:
- Service Worker for offline support
- Installable on mobile devices
- App manifest for home screen icon

## Technologies

- [Ionic React](https://ionicframework.com/docs/react)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)