import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonItem, IonMenu, IonHeader, IonToolbar, IonTitle, IonAvatar, IonLabel, IonButton ,IonMenuToggle} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Menu: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<{ email: string | null; photoURL: string | null }>({ email: null, photoURL: null });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email, photoURL: user.photoURL });
      } else {
        setUser({ email: null, photoURL: null });
      }
    });

    return () => unsubscribe();
  }, []);

  const navigate = (path: string) => {
    history.push(path);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    history.push('/login');
  };

  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      
        <IonItem lines="none">
          <IonAvatar slot="start">
            <img src={user.photoURL || 'https://pixabay.com/get/g0f5b59016165c7e19999af55bb4184fc45fa22b688348dc8971aac89d145fc7f5df9b4a7d7511d4b7350c5089e65df36c916ee6467f7dbe5edbbd1da5ae299ca_1280.png'} alt="Profile" />
          </IonAvatar>
          <IonLabel>
            <h2>{user.email}</h2>
          </IonLabel>
        </IonItem>
        <IonList>
        <IonMenuToggle>
        <IonItem button onClick={() => navigate('/home')}>Home</IonItem>
        <IonItem button onClick={() => navigate('/profile')}>Profile</IonItem>
          </IonMenuToggle>
          
          {/* <IonItem button onClick={() => navigate('/settings')}>Settings</IonItem> */}
        </IonList>
        <IonButton expand="full" onClick={handleLogout}>Logout</IonButton>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
