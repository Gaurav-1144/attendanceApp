// src/Register.tsx
import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel,IonAlert} from '@ionic/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure this path is correct
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false); // State for showing alert
  const history = useHistory();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Handle successful registration
      const user = userCredential.user;
      console.log('User registered:', user.uid);
      if(user.uid){
        setShowAlert(true);
        history.push('/home');
      } else {
        handleAlertDismiss();
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleAlertDismiss = () => {
    setShowAlert(false);
    // Redirect to login page after dismissing alert
   // history.push('/home');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
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
        <IonButton expand="full" onClick={handleRegister}>Register</IonButton>
        {/* Ionic Alert Component */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={handleAlertDismiss}
          header="Registration Successful!"
          message="You have successfully registered."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
