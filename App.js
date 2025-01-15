import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';
import Splash from './components/Splash';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSplashVisible, setSplashVisible] = useState(true);

  const handleSplashAnimationComplete = () => {
    setSplashVisible(false);
  };

  // Check persisted user state on app launch
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error retrieving stored user:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
    });
    return unsubscribe;
  }, []);

  if (isLoading || isSplashVisible) {
    return <Splash onAnimationComplete={handleSplashAnimationComplete} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: 'Vorduku',
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
            }}
          />
        ) : (
          <Stack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{
              title: 'Vorduku',
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
