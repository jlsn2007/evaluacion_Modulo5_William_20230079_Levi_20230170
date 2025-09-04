import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);

  // Escucha cambios de login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Función para actualizar nombre del usuario
  const updateUser = async (data) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
      });
      // Actualizamos el estado local
      setUser((prev) => ({ ...prev, name: data.name }));
    }
  };

  return { user, logout, updateUser };
}
