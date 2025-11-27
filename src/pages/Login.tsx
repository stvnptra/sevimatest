import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonRouterLink
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      history.push('/feed');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '20px' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>InstaApp</h1>

          {error && (
            <IonText color="danger">
              <p style={{ textAlign: 'center' }}>{error}</p>
            </IonText>
          )}

          <form onSubmit={handleLogin}>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value || '')}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value || '')}
                required
              />
            </IonItem>

            <IonButton
              expand="block"
              type="submit"
              style={{ marginTop: '20px' }}
              disabled={loading}
            >
              {loading ? <IonSpinner /> : 'Login'}
            </IonButton>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Don't have an account?{' '}
            <IonRouterLink routerLink="/register">Register</IonRouterLink>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
