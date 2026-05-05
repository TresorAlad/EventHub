import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EditEventScreen from '../screens/EditEventScreen';
import OrganizerEventDashboardScreen from '../screens/OrganizerEventDashboardScreen';
import MainTabNavigator from './MainTabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import FilterScreen from '../screens/FilterScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import OrganizerRequestScreen from '../screens/OrganizerRequestScreen';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Colors } from '../theme';

// Native stack : transitions natives 60+ fps (UINavigationController iOS / Fragment Android),
// `freezeOnBlur` libère le rendu CPU/GPU des écrans en arrière-plan = scaling RAM/CPU.
const Stack = createNativeStackNavigator();

const baseScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  animationDuration: 220,
  freezeOnBlur: true,
};

const cardScreenOptions = {
  presentation: 'card' as const,
  animation: 'slide_from_right' as const,
  animationDuration: 220,
};

const modalScreenOptions = {
  presentation: 'modal' as const,
  animation: 'slide_from_bottom' as const,
  animationDuration: 260,
  gestureEnabled: true,
};

function AuthLoadingScreen() {
  return (
    <View style={styles.loadingRoot}>
      <ActivityIndicator size="large" color={Colors.white} />
    </View>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();
  useNotifications(user);

  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const value = await AsyncStorage.getItem('eventhub:onboarding_seen:v1');
        if (!mounted) return;
        setOnboardingSeen(value === '1');
      } catch {
        if (!mounted) return;
        setOnboardingSeen(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const initialRouteName = useMemo(() => {
    // Si l'utilisateur est déjà connecté, on va directement à l'app.
    if (user) return 'Main';
    // Première installation: on affiche Splash -> Onboarding avant SignIn.
    if (onboardingSeen === false) return 'Splash';
    // Sinon on démarre sur l'app (les écrans auth restent accessibles via navigation).
    return 'Main';
  }, [user, onboardingSeen]);

  if (initializing || onboardingSeen === null) return <AuthLoadingScreen />;

  return (
    <Stack.Navigator screenOptions={baseScreenOptions} initialRouteName={initialRouteName}>
      {/* Écrans principaux accessibles à tous */}
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ animation: 'fade' }} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={cardScreenOptions} />
      <Stack.Screen name="Search" component={SearchScreen} options={cardScreenOptions} />
      <Stack.Screen name="Filter" component={FilterScreen} options={modalScreenOptions} />

      {/* Écrans d'authentification (accessibles si besoin) */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />

      {/* Écrans protégés ou spécifiques */}
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={modalScreenOptions} />
      <Stack.Screen name="EditEvent" component={EditEventScreen} options={modalScreenOptions} />
      <Stack.Screen
        name="OrganizerEventDashboard"
        component={OrganizerEventDashboardScreen}
        options={cardScreenOptions}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={cardScreenOptions} />
      <Stack.Screen name="OrganizerRequest" component={OrganizerRequestScreen} options={cardScreenOptions} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} options={cardScreenOptions} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
});
