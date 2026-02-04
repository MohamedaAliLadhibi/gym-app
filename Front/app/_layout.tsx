import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';

function RootStack() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }


  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? '(tabs)' : 'index'}
    >
      {/* Define ALL screens - Expo Router will handle which one to show based on initialRouteName */}
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </SafeAreaProvider>
  );
}