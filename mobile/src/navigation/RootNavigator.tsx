import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

  // Pendant l'initialisation auth (cold start), on évite tout rendu de stack pour
  // ne pas provoquer un flash d'écran. Le splash natif Expo est déjà visible jusqu'à
  // l'hydration des polices ; cet écran prend le relais le temps de la sync backend.
  if (initializing) return <AuthLoadingScreen />;

  return (
    <Stack.Navigator screenOptions={baseScreenOptions}>
      {!user ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} options={{ animation: 'fade' }} />
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={cardScreenOptions} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={modalScreenOptions} />
          <Stack.Screen name="EditEvent" component={EditEventScreen} options={modalScreenOptions} />
          <Stack.Screen
            name="OrganizerEventDashboard"
            component={OrganizerEventDashboardScreen}
            options={cardScreenOptions}
          />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={cardScreenOptions} />
          <Stack.Screen name="Search" component={SearchScreen} options={cardScreenOptions} />
          <Stack.Screen name="Filter" component={FilterScreen} options={modalScreenOptions} />
          <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} options={cardScreenOptions} />
        </>
      )}
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
