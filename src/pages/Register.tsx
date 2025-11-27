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

const Register: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, displayName);
      history.push('/feed');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
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

          <form onSubmit={handleRegister}>
            <IonItem>
              <IonLabel position="floating">Display Name</IonLabel>
              <IonInput
                type="text"
                value={displayName}
                onIonInput={(e) => setDisplayName(e.detail.value || '')}
                required
              />
            </IonItem>

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

            <IonItem>
              <IonLabel position="floating">Confirm Password</IonLabel>
              <IonInput
                type="password"
                value={confirmPassword}
                onIonInput={(e) => setConfirmPassword(e.detail.value || '')}
                required
              />
            </IonItem>

            <IonButton
              expand="block"
              type="submit"
              style={{ marginTop: '20px' }}
              disabled={loading}
            >
              {loading ? <IonSpinner /> : 'Create Account'}
            </IonButton>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Already have an account?{' '}
            <IonRouterLink routerLink="/login">Login</IonRouterLink>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
