import { View, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, Tabs } from 'expo-router';
import { auth } from "../../config/firebaseconfig"; 

export default function TabLayout() {
  const router = useRouter();
  
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router?.push('/login');
    }
  });

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      tabBarActiveTintColor: '#1666a8',
      tabBarInactiveTintColor: '#666666',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      tabBarPressColor: '#E3F2FD'
    }}>
      <Tabs.Screen 
        name="Home" 
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-sharp" size={24} color={color} />
          ),
          tabBarLabel: 'Home'
        }} 
      />
      
      <Tabs.Screen 
        name="Dashboard" 
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="video-library" size={24} color={color} />
          ),
          tabBarLabel: 'Resources'
        }}
      />
      
      <Tabs.Screen 
        name="Profile" 
        options={{
          tabBarIcon: ({color, size}) => (
            <Octicons name="person-fill" size={24} color={color} />
          ),
          tabBarLabel: 'Profile'
        }} 
      />
    </Tabs>
  );
}



