import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import messaging from '@react-native-firebase/messaging';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import RootNavigator from './src/navigation/RootNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreenExpo.preventAutoHideAsync();

// Background message handler for FCM
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function App() {
  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      }
    };

    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('Nouvelle Notification', remoteMessage.notification?.title || 'Vous avez reçu un message');
    });

    return unsubscribe;
  }, []);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenExpo.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}
