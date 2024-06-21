// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonAvatar, IonLoading ,IonButtons,IonMenuButton} from '@ionic/react';
import {updateProfile, updateEmail, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage,auth } from '../firebaseConfig';

const Profile: React.FC = () => {
//   const auth = getAuth();
  const [email, setEmail] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || '');
        setPhotoURL(user.photoURL || '');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleEmailChange = async () => {
    if (auth.currentUser) {
      try {
        await updateEmail(auth.currentUser, email);
        alert('Email updated successfully!');
      } catch (error) {
        alert((error as Error).message);
      }
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `profiles/${auth.currentUser?.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        () => {
          setLoading(true);
        },
        (error) => {
          setLoading(false);
          alert(error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (auth.currentUser) {
            await updateProfile(auth.currentUser, { photoURL: downloadURL });
            setPhotoURL(downloadURL);
            setLoading(false);
            alert('Profile picture updated successfully!');
          }
        }
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonAvatar slot="start">
            <img src={photoURL || 'https://via.placeholder.com/150'} alt="Profile" />
          </IonAvatar>
          <input type="file" onChange={handlePhotoChange} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput value={email} onIonChange={(e: CustomEvent) => setEmail((e.target as HTMLInputElement).value)} type="email" />
        </IonItem>
        <IonButton expand="full" onClick={handleEmailChange}>Update Email</IonButton>
        {loading && <IonLoading isOpen={loading} message={'Updating...'} />}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
