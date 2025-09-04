import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);

  // Escucha cambios de login/logout
  useEffect(() => {
    console.log('useAuth: Configurando listener de autenticación');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('useAuth: Cambio detectado en autenticación', { 
        isAuthenticated: !!firebaseUser,
        email: firebaseUser?.email 
      });
      
      if (firebaseUser) {
        try {
          // Obtener datos adicionales de Firestore
          console.log('useAuth: Obteniendo datos de Firestore para', firebaseUser.uid);
          const userDoc = await getDoc(doc(database, 'users', firebaseUser.uid));
          const userData = userDoc.data() || {};
          
          const userInfo = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || userData.nombre || '',
            titulo: userData.titulo || '',
            anioGraduacion: userData.anioGraduacion || '',
            ...userData
          };
          
          console.log('useAuth: Usuario autenticado', userInfo);
          setUser(userInfo);
        } catch (error) {
          console.error('useAuth: Error al obtener datos de Firestore', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || '',
            titulo: '',
            anioGraduacion: ''
          });
        }
      } else {
        console.log('useAuth: No hay usuario autenticado');
        setUser(null);
      }
    }, (error) => {
      console.error('useAuth: Error en el listener de autenticación', error);
    });

    return () => {
      console.log('useAuth: Limpiando listener de autenticación');
      unsubscribe();
    };
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error };
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = async (data) => {
    if (auth.currentUser) {
      try {
        // Actualizar perfil en Firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: data.name,
        });

        // Actualizar datos adicionales en Firestore
        const userRef = doc(database, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          nombre: data.name,
          titulo: data.titulo || '',
          anioGraduacion: data.anioGraduacion || '',
        });

        // Actualizar estado local
        setUser(prev => ({
          ...prev,
          ...data
        }));

        return { success: true };
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return { success: false, error };
      }
    }
  };

  return { user, logout, updateUser };
}
