import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

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

const Stack = createStackNavigator();

function AuthLoadingScreen() {
  return (
    <View style={styles.loadingRoot}>
      <ActivityIndicator size="large" color={Colors.white} />
    </View>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  useNotifications(user);

  // Ne pas rendre SplashScreen ici : hors Stack, `navigation` est undefined et
  // SplashScreen appelle navigation.replace → crash Expo Go ("Something went wrong").
  if (loading) return <AuthLoadingScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="EventDetails"
            component={EventDetailsScreen}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="CreateEvent"
            component={CreateEventScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="EditEvent"
            component={EditEventScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="OrganizerEventDashboard"
            component={OrganizerEventDashboardScreen}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen
            name="Filter"
            component={FilterScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
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
