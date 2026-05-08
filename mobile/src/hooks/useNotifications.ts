import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from '../services/api';
import { useEffect, useRef } from 'react';

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = (user: any) => {
  const lastRegisteredUid = useRef<string | null>(null);
  useEffect(() => {
    const uid = user?.uid ? String(user.uid) : null;
    if (!uid) {
      lastRegisteredUid.current = null;
      return;
    }
    if (lastRegisteredUid.current === uid) return;

    registerForPushNotificationsAsync().then((token) => {
      if (!token) return;
      api.post('/auth/push-token', { pushToken: token }).catch((err) => {
        console.warn('Could not register push token:', err?.message);
      });
      lastRegisteredUid.current = uid;
    });

    // Listen for incoming notifications when app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // Listen for user interaction with notification (tapping it)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Logic for navigation can be added here if needed, 
      // but usually requires access to a navigation reference.
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [user?.uid]);
};

async function registerForPushNotificationsAsync() {
  let token: string | undefined;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'EventHub Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#03045e',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permission push notification refusée.');
      return undefined;
    }

    // Depuis Expo Go (SDK 53+), les push notifications distantes via expo-notifications
    // ne sont plus supportées. Mais on peut quand même demander l'autorisation utilisateur.
    // Le token push (FCM/APNS) nécessite un dev build.
    if (Constants.appOwnership === 'expo') {
      console.warn(
        "Expo Go détecté: autorisation OK, mais pas de push token. Utilise un dev build (`npm run start:dev-client`) pour tester les push notifications."
      );
      return undefined;
    }

    try {
      // Expo Push Token: Works with expo-server-sdk
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;
      
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      token = tokenData.data;
      console.log('Expo Push Token:', token);
    } catch (err) {
      console.warn('Erreur lors de la récupération du push token:', err);
    }
  } else {
    console.log('Les notifications push nécessitent un appareil physique.');
  }

  return token;
}
