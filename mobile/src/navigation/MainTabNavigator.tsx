import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator({ route }: any) {
  // Get userType from route params (passed from Sign In or Sign Up)
  // Default to 'User' if not provided for safety
  const userType = route.params?.userType || 'User';
  const isOrganizer = userType === 'Organizer';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#aab',
        tabBarLabel: ({ focused, color }) => {
          if (focused) return null; // Mask label when active
          
          let label = route.name;
          if (route.name === 'Alerts') label = 'ALERTS';
          else if (route.name === 'Home') label = 'HOME';
          else if (route.name === 'Dashboard') label = 'DASHBOARD';
          else if (route.name === 'Profile') label = 'PROFILE';
          
          return (
            <View style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color }}>{label}</Text>
            </View>
          );
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'home-outline';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Alerts') iconName = focused ? 'notifications' : 'notifications-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          if (focused) {
            return (
              <View style={styles.activeIconWrapper}>
                <Ionicons name={iconName} size={22} color={Colors.white} />
              </View>
            );
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      
      {/* Conditionally render Dashboard only for Organizers */}
      {isOrganizer && (
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
      )}
      
      <Tab.Screen name="Alerts" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
});
