import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        {/* Top badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>JOIN THE COMMUNITY</Text>
        </View>

        {/* Hero image - reuse the same for consistency */}
        <View style={styles.heroContainer}>
          <Image source={require('../../assets/onboarding1.png')} style={styles.hero} resizeMode="cover" />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>
          <Text style={styles.cardSubtitle}>Be part of Togo's growing tech hub</Text>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color={Colors.textMuted} />
              <Text style={[styles.inputText, !fullName && styles.placeholder]}>
                {fullName || 'e.g. Kodjo Mensah'}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputBox}>
              <Ionicons name="at-outline" size={20} color={Colors.textMuted} />
              <Text style={[styles.inputText, !email && styles.placeholder]}>
                {email || 'name@company.tg'}
              </Text>
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.inputText}>{'•'.repeat(8)}</Text>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={() => navigation.replace('Main')}
            activeOpacity={0.88}
          >
            <Text style={styles.signUpText}>Join Now →</Text>
          </TouchableOpacity>

          {/* Already have an account */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already a member? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 32,
    gap: 16,
  },
  badge: {
    marginTop: 52,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    ...Shadows.card,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  heroContainer: {
    width: '90%',
    height: 140,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: '#0d1b4b',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  cardTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -8,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.inputBg,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  inputText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textMuted,
  },
  signUpBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 18,
    alignItems: 'center',
    ...Shadows.button,
    marginTop: 4,
  },
  signUpText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});
