import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { Colors, FontSize, FontWeight, Fonts } from '../theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Decorative dots top-right */}
      <View style={styles.dotsContainer}>
        {[0,1,2].map(row => (
          <View key={row} style={styles.dotsRow}>
            {[0,1,2].map(col => (
              <View key={col} style={styles.dot} />
            ))}
          </View>
        ))}
      </View>

      {/* Logo */}
      <Animated.View style={[styles.center, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image 
          source={require('../../assets/logo.jpeg')} 
          style={styles.logoCircle} 
          resizeMode="contain"
        />
        <Animated.Text style={[styles.appName, { transform: [{ translateY: slideAnim }] }]}>
          EventHub
        </Animated.Text>
      </Animated.View>

      {/* Bottom */}
      <Animated.View style={[styles.bottom, { opacity: fadeAnim }]}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarActive} />
          <View style={styles.progressBarInactive} />
        </View>
        <Text style={styles.tagline}>Pioneering Togo's Tech Ecosystem</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  dotsContainer: {
    position: 'absolute',
    top: 48,
    right: 28,
    gap: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(202, 240, 248, 0.35)',
  },
  center: {
    alignItems: 'center',
    gap: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(3, 4, 94, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(202, 240, 248, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  logoE: {
    color: Colors.background,
  },
  appName: {
    fontSize: FontSize.xxxl,
    fontFamily: Fonts.headerExtraBold,
    color: Colors.white,
    letterSpacing: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 52,
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  progressBarContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '55%',
  },
  progressBarActive: {
    flex: 1,
    height: 3,
    backgroundColor: Colors.white,
    borderRadius: 99,
  },
  progressBarInactive: {
    flex: 2,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 99,
  },
  tagline: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.regular,
    color: 'rgba(202, 240, 248, 0.7)',
    letterSpacing: 0.3,
  },
});
