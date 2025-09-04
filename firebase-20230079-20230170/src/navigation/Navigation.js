import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Import screens
import Home from '../screens/Home';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

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
          {user ? (
            <Stack.Screen 
              name="Home" 
              component={Home} 
              options={{ gestureEnabled: false }}
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
