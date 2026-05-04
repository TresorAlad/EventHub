import React, { useCallback, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../hooks/useAuth';

const Tab = createBottomTabNavigator();

type IconName = keyof typeof Ionicons.glyphMap;

const ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  Alerts: { active: 'notifications', inactive: 'notifications-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const LABELS: Record<string, string> = {
  Home: 'HOME',
  Dashboard: 'DASHBOARD',
  Alerts: 'ALERTS',
  Profile: 'PROFILE',
};

// Composants stables : évite les nouvelles closures à chaque render parent,
// précieux pour limiter les re-renders côté tab bar (qui re-render en cascade
// lors du focus change avec freezeOnBlur).
const TabIcon: React.FC<{ routeName: string; focused: boolean; color: string }> = React.memo(
  ({ routeName, focused, color }) => {
    const cfg = ICONS[routeName] ?? ICONS.Home;
    const iconName = focused ? cfg.active : cfg.inactive;
    if (focused) {
      return (
        <View style={styles.activeIconWrapper}>
          <Ionicons name={iconName} size={22} color={Colors.white} />
        </View>
      );
    }
    return <Ionicons name={iconName} size={22} color={color} />;
  }
);
TabIcon.displayName = 'TabIcon';

const TabLabel: React.FC<{ routeName: string; focused: boolean; color: string }> = React.memo(
  ({ routeName, focused, color }) => {
    if (focused) return null;
    const label = LABELS[routeName] ?? routeName.toUpperCase();
    return (
      <View style={styles.labelWrap}>
        <Text style={[styles.labelText, { color }]}>{label}</Text>
      </View>
    );
  }
);
TabLabel.displayName = 'TabLabel';

export default function MainTabNavigator() {
  const { dbUser } = useAuth();
  const isOrganizer = dbUser?.role === 'ORGANIZER' || dbUser?.role === 'ADMIN';

  const screenOptions = useCallback(
    ({ route }: any) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: '#aab',
      tabBarHideOnKeyboard: true,
      // freezeOnBlur : libère le CPU/GPU des écrans non visibles. Indispensable pour
      // garder ~60 fps sur Android moyenne gamme avec plusieurs onglets data-heavy.
      freezeOnBlur: true,
      lazy: true,
      tabBarLabel: ({ focused, color }: any) => (
        <TabLabel routeName={route.name} focused={focused} color={color} />
      ),
      tabBarIcon: ({ focused, color }: any) => (
        <TabIcon routeName={route.name} focused={focused} color={color} />
      ),
    }),
    []
  );

  // Liste de tabs déclarative pour éviter de re-créer les options inline.
  const tabs = useMemo(() => {
    const list: { name: string; component: React.ComponentType<any> }[] = [
      { name: 'Home', component: HomeScreen },
    ];
    // Seuls les organisateurs voient le dashboard de gestion
    if (isOrganizer) {
      list.push({ name: 'Dashboard', component: DashboardScreen });
    }
    list.push({ name: 'Alerts', component: NotificationsScreen });
    list.push({ name: 'Profile', component: ProfileScreen });
    return list;
  }, [isOrganizer]);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {tabs.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderTopWidth: 0,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Shadows.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  activeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 99,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  labelWrap: {
    marginBottom: 4,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
