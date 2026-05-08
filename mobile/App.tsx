import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { asyncStoragePersister, queryClient } from './src/lib/queryClient';
import { warmupBackend } from './src/services/api';
import { AppAlertProvider, useAppAlert } from './src/contexts/AppAlertContext';
import * as Updates from 'expo-updates';

// Garde le splash natif visible tant que polices + bootstrap auth/cache ne sont pas prêts
SplashScreenExpo.preventAutoHideAsync().catch(() => {
  /* déjà préventé */
});

// Pré-chauffe la lambda Vercel dès le require initial : aucun coût UI,
// juste une requête fire-and-forget en parallèle du chargement React Native.
warmupBackend();

// NOTE: @react-native-firebase/messaging n'est PAS compatible Expo Go.
// Pour Expo Go on utilise expo-notifications (cf. useNotifications hook).
// En dev build, on pourra brancher FCM natif sans rework du reste.

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          maxAge: 24 * 60 * 60 * 1000, // 24h
          buster: 'v1',
        }}
      >
        <AppAlertProvider>
          <Bootstrap />
        </AppAlertProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}

function Bootstrap() {
  const { showAlert } = useAppAlert();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash natif dès que les polices sont prêtes (succès ou échec).
      // Évite l'écran blanc et garde une transition propre depuis le splash Expo.
      SplashScreenExpo.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const run = async () => {
      try {
        // Évite de checker des updates avant que le bootstrap UI soit prêt.
        if (!fontsLoaded && !fontError) return;
        // En dev (Expo Go), `expo-updates` ne sert pas. En build, on notifie.
        if (__DEV__) return;
        if (!Updates.isEnabled) return;
        const update = await Updates.checkForUpdateAsync();
        if (!update.isAvailable) return;
        showAlert({
          variant: 'update',
          title: 'Mise à jour disponible',
          message: "Une nouvelle version est prête. Téléchargez-la maintenant pour avoir les dernières améliorations.",
          primaryText: 'Mettre à jour',
          secondaryText: 'Plus tard',
          onPrimary: async () => {
            try {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            } catch {
              showAlert({
                variant: 'error',
                title: 'Mise à jour',
                message: 'Impossible de télécharger la mise à jour. Réessayez plus tard (connexion réseau).',
              });
            }
          },
        });
      } catch {
        // best-effort : pas de blocage au démarrage si EAS Update est indisponible
      }
    };
    run();
  }, [showAlert, fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
