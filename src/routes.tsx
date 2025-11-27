import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { useAuth } from './context';
import { PrivateRoute } from './components';
import { Login, Register, Feed, CreatePost, Profile, PostDetail } from './pages';

// Public routes configuration
export const publicRoutes = [
  { path: '/login', component: Login, exact: true },
  { path: '/register', component: Register, exact: true }
];

// Private routes configuration
export const privateRoutes = [
  { path: '/feed', component: Feed, exact: true },
  { path: '/create-post', component: CreatePost, exact: true },
  { path: '/profile', component: Profile, exact: true },
  { path: '/post/:postId', component: PostDetail, exact: true }
];

// Route names for navigation
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  CREATE_POST: '/create-post',
  PROFILE: '/profile',
  POST_DETAIL: (postId: string) => `/post/${postId}`,
  HOME: '/'
} as const;

// Public Routes Component
export const PublicRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      {publicRoutes.map(route => (
        <Route
          key={route.path}
          exact={route.exact}
          path={route.path}
          component={route.component}
        />
      ))}
      <Route exact path="/">
        <Redirect to={ROUTES.LOGIN} />
      </Route>
      <Route>
        <Redirect to={ROUTES.LOGIN} />
      </Route>
    </IonRouterOutlet>
  );
};

// Private Routes Component
export const PrivateRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      {privateRoutes.map(route => (
        <PrivateRoute
          key={route.path}
          exact={route.exact}
          path={route.path}
          component={route.component}
        />
      ))}
      <Route exact path="/">
        <Redirect to={ROUTES.FEED} />
      </Route>
      <Route exact path={ROUTES.LOGIN}>
        <Redirect to={ROUTES.FEED} />
      </Route>
      <Route exact path={ROUTES.REGISTER}>
        <Redirect to={ROUTES.FEED} />
      </Route>
    </IonRouterOutlet>
  );
};

// Combined Routes with Auth Check
export const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or return a loading spinner component
  }

  return user ? <PrivateRoutes /> : <PublicRoutes />;
};

// Navigation helpers
export const navigateTo = (history: { push: (path: string) => void }, route: string) => {
  history.push(route);
};

export const goBack = (history: { goBack: () => void }) => {
  history.goBack();
};

// Check if route is public
export const isPublicRoute = (path: string): boolean => {
  return publicRoutes.some(route => route.path === path);
};

// Check if route is private
export const isPrivateRoute = (path: string): boolean => {
  return privateRoutes.some(route => route.path === path);
};

export default AppRoutes;
