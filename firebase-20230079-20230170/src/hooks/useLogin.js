import { signInWithEmailAndPassword } from 'firebase/auth';

// Custom hook que proporciona funcionalidad de login con email y contraseña
export function useLogin(auth) {
 // Función asíncrona que maneja el proceso de autenticación
 const login = async ({ email, password }) => {
   // Utiliza Firebase Auth para autenticar al usuario con sus credenciales
   const userCred = await signInWithEmailAndPassword(auth, email, password);
   return userCred; // Retorna las credenciales del usuario autenticado
 };
 
 // Retorna la función login para ser usada en componentes
 return login;
}