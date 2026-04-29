import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from '../services/api';
import { useEffect } from 'react';

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = (user: any) => {
  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          api.post('/auth/push-token', { pushToken: token }).catch(err => {
            console.warn('Could not register push token:', err?.message);
          });
        }
      });
    }
  }, [user]);
};

async function registerForPushNotificationsAsync() {
  let token: string | undefined;

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

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '17fffcd6-8217-4124-893d-770b12678adc',
      });
      token = tokenData.data;
      console.log('Expo Push Token:', token);
    } catch (err) {
      console.warn('Erreur lors de la récupération du push token:', err);
    }
  } else {
    console.log('Les notifications push nécessitent un appareil physique.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'EventHub Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#03045e',
    });
  }

  return token;
}
