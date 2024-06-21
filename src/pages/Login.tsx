// src/Login.tsx
import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonAlert } from '@ionic/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig'; 
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const history = useHistory();
  
  useEffect(() => {
    // Check if email and password are stored in local storage
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail && storedPassword) {
      // Attempt to login with stored credentials
      handleStoredLogin(storedEmail, storedPassword);
    }
  }, []);

  const handleStoredLogin = async (storedEmail: string, storedPassword: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, storedEmail, storedPassword);
      console.log('User logged in with stored credentials:', userCredential.user);
      history.push('/home'); // Redirect to home page
    } catch (error) {
      console.error('Stored login failed:', error);
      // Clear stored credentials if login fails
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login
      const user = userCredential.user;
      console.log('User logged in:', user);
      // Store email and password in local storage
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      history.push('/home'); // Redirect to home page
    } catch (error) {
      setError((error as Error).message);
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput value={email} onIonChange={(e: CustomEvent) => setEmail((e.target as HTMLInputElement).value)} type="email" />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput value={password} onIonChange={(e: CustomEvent) => setPassword((e.target as HTMLInputElement).value)} type="password" />
        </IonItem>
        {error && <p>{error}</p>}
        <IonButton expand="full" onClick={handleLogin}>Login</IonButton>

        {/* Ionic Alert Component for Error Handling */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Login Error"
          message={error}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
