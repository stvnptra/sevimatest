import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { CreatePostForm } from '../components';

const CreatePost: React.FC<RouteComponentProps> = ({ history }) => {
  const handlePostCreated = () => {
    history.push('/feed');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/feed" />
          </IonButtons>
          <IonTitle>New Post</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <CreatePostForm onPostCreated={handlePostCreated} />
      </IonContent>
    </IonPage>
  );
};

export default CreatePost;
