import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';

// Custom hook para manejar la autenticación y datos del usuario
export function useAuth() {
 const [user, setUser] = useState(null);

 // Hook que escucha cambios en el estado de autenticación (login/logout)
 useEffect(() => {
   console.log('useAuth: Configurando listener de autenticación');
   
   // Firebase Auth listener que se ejecuta cada vez que cambia el estado del usuario
   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
     console.log('useAuth: Cambio detectado en autenticación', { 
       isAuthenticated: !!firebaseUser,
       email: firebaseUser?.email 
     });
     
     if (firebaseUser) {
       try {
         // Obtiene datos adicionales del usuario desde Firestore usando su UID
         console.log('useAuth: Obteniendo datos de Firestore para', firebaseUser.uid);
         const userDoc = await getDoc(doc(database, 'users', firebaseUser.uid));
         const userData = userDoc.data() || {};
         
         // Combina datos de Firebase Auth con datos de Firestore
         const userInfo = {
           uid: firebaseUser.uid,
           email: firebaseUser.email,
           name: firebaseUser.displayName || userData.nombre || '',
           titulo: userData.titulo || '',
           anioGraduacion: userData.anioGraduacion || '',
           ...userData // Incluye cualquier otro dato del documento de Firestore
         };
         
         console.log('useAuth: Usuario autenticado', userInfo);
         setUser(userInfo);
       } catch (error) {
         console.error('useAuth: Error al obtener datos de Firestore', error);
         // Si falla Firestore, usa solo los datos de Firebase Auth
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

   // Cleanup function: limpia el listener cuando el componente se desmonta
   return () => {
     console.log('useAuth: Limpiando listener de autenticación');
     unsubscribe();
   };
 }, []);

 // Función para cerrar sesión del usuario
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

 // Función para actualizar datos del usuario tanto en Auth como en Firestore
 const updateUser = async (data) => {
   if (auth.currentUser) {
     try {
       // Actualiza el displayName en Firebase Auth
       await updateProfile(auth.currentUser, {
         displayName: data.name,
       });

       // Actualiza datos adicionales en el documento de Firestore
       const userRef = doc(database, 'users', auth.currentUser.uid);
       await updateDoc(userRef, {
         nombre: data.name,
         titulo: data.titulo || '',
         anioGraduacion: data.anioGraduacion || '',
       });

       // Actualiza el estado local inmediatamente para reflejar los cambios en la UI
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

 // Retorna el estado del usuario y las funciones para manipularlo
 return { user, logout, updateUser };
}