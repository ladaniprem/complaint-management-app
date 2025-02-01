import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../config/firebaseconfig";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to home
        router.replace('/(tabs)/Home');
      } else {
        // No user is signed in, show login page
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
      }}
      initialRouteName="login"
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen 
        name="complaints" 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
    </Stack>
  );
}
