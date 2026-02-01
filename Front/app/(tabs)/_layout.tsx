// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth } from '../../context/AuthContext';

const COLORS = {
  primary: '#7C3AED',
  secondary: '#3B82F6',
  dark: '#0F172A',
  white: '#FFFFFF',
  gray: '#64748B',
} as const;

export default function TabsLayout() {
  // const { user } = useAuth();
  
  // Get safe area insets for devices with notches/gesture bars
  const insets = useSafeAreaInsets();
  
  // Calculate extra bottom padding for Android devices (especially Xiaomi/Redmi)
  const bottomPadding = Platform.OS === 'android' 
    ? Math.max(insets.bottom, 20) // At least 20px on Android
    : insets.bottom;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.dark,
          borderTopColor: 'rgba(124, 58, 237, 0.2)',
          borderTopWidth: 1,
          height: 70 + bottomPadding, // Add extra height for padding
          paddingBottom: 10 + bottomPadding, // Extra padding at bottom
          paddingTop: 10,
          paddingHorizontal: 5,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        // Additional safety for tab buttons
        tabBarItemStyle: {
          marginBottom: Platform.OS === 'android' ? 5 : 0,
        },
      }}
    >
      {/* Rest of your Tabs.Screen components remain the same */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'barbell' : 'barbell-outline'} 
                size={size} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="exercise"
        options={{
          title: 'Exercise',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'fitness' : 'fitness-outline'} 
                size={size} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'calendar' : 'calendar-outline'} 
                size={size} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={size} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}