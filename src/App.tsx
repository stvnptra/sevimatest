import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, addCircleOutline, personOutline } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import { AuthProvider, useAuth } from './context';
import { Login, Register, Feed, CreatePost, Profile, PostDetail } from './pages';
import { PrivateRoute } from './components';

setupIonicReact();

const AppTabs: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route>
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    );
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/feed" component={Feed} />
        <PrivateRoute exact path="/create-post" component={CreatePost} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/post/:postId" component={PostDetail} />
        <Route exact path="/">
          <Redirect to="/feed" />
        </Route>
        <Route exact path="/login">
          <Redirect to="/feed" />
        </Route>
        <Route exact path="/register">
          <Redirect to="/feed" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="feed" href="/feed">
          <IonIcon icon={homeOutline} />
          <IonLabel>Feed</IonLabel>
        </IonTabButton>

        <IonTabButton tab="create-post" href="/create-post">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Create</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <AppTabs />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
