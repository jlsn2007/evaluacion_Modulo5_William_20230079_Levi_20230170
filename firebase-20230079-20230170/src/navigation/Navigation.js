import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Importa las pantallas de la aplicación
import Home from '../screens/Home';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

// Componente principal de navegación que maneja rutas autenticadas y no autenticadas
const Navigation = () => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true); // Muestra splash mientras verifica auth

 // Escucha cambios en el estado de autenticación
 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
     setUser(currentUser);
     setLoading(false); // Oculta splash cuando termina de verificar
   });

   return () => {
     console.log('Cleaning up auth listener');
     unsubscribe();
   };
 }, []);

 // Muestra splash screen mientras verifica el estado de autenticación
 if (loading) {
   return <SplashScreen />;
 }

 return (
   <SafeAreaProvider>
     <NavigationContainer>
       <Stack.Navigator 
         screenOptions={{ 
           headerShown: false,
           animation: 'fade',
           contentStyle: { backgroundColor: '#f5f7fa' }
         }}
       >
         {/* Renderizado condicional: Home si está autenticado, Login/Register si no */}
         {user ? (
           <Stack.Screen 
             name="Home" 
             component={Home} 
             options={{ gestureEnabled: false }} // Previene swipe back
           />
         ) : (
           <>
             <Stack.Screen 
               name="Login" 
               component={LoginScreen} 
               options={{ gestureEnabled: false }}
             />
             <Stack.Screen 
               name="Register" 
               component={RegisterScreen}
             />
           </>
         )}
       </Stack.Navigator>
     </NavigationContainer>
   </SafeAreaProvider>
 );
};

export default Navigation;