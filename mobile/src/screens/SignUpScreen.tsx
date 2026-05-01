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
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserType = 'User' | 'Organizer' | null;
const SIGNUP_ROLE_KEY = 'eventhub:signupDesiredRole';
const SIGNUP_ORG_NAME_KEY = 'eventhub:signupOrganizationName';

export default function SignUpScreen({ navigation }: any) {
  const [userType, setUserType] = useState<UserType>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Organizer specific
  const [orgName, setOrgName] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Champs requis', 'Merci de remplir le nom, email et mot de passe.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mot de passe', 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe faible', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Firebase displayName = nom de la personne. Le nom de l'organisation est stocké côté backend.
      await updateProfile(credential.user, { displayName: fullName.trim() });

      // Persist the desired role for the first backend sync after login.
      if (userType === 'Organizer') {
        await AsyncStorage.setItem(SIGNUP_ROLE_KEY, 'ORGANIZER');
        if (orgName.trim().length > 0) {
          await AsyncStorage.setItem(SIGNUP_ORG_NAME_KEY, orgName.trim());
        }
      } else {
        await AsyncStorage.removeItem(SIGNUP_ROLE_KEY);
        await AsyncStorage.removeItem(SIGNUP_ORG_NAME_KEY);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Inscription impossible', error?.message || 'Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!userType) {
    return (
      <View style={[styles.container, { backgroundColor: '#e0f2fe' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#e0f2fe" />
        
        <View style={styles.choiceHeader}>
          <Text style={styles.newChoiceTitle}>Join EventHub</Text>
          <Text style={styles.newChoiceSubtitle}>Choose how you want to use the platform</Text>
        </View>

        <View style={styles.choicesWrapper}>
          <TouchableOpacity 
            style={styles.horizontalCard} 
            onPress={() => setUserType('User')}
            activeOpacity={0.9}
          >
            <View style={[styles.hIconBox, { backgroundColor: '#cffafe' }]}>
              <Ionicons name="person-outline" size={30} color="#03045e" />
            </View>
            <View style={styles.hContent}>
              <Text style={styles.hTitle}>Simple User</Text>
              <Text style={styles.hDesc}>Discover events, book tickets, and follow your favorite tech communities.</Text>
            </View>
            <View style={[styles.hArrow, { backgroundColor: '#03045e' }]}>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.horizontalCard, { backgroundColor: '#03045e' }]} 
            onPress={() => setUserType('Organizer')}
            activeOpacity={0.9}
          >
            <View style={[styles.hIconBox, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Ionicons name="calendar-outline" size={30} color="#fff" />
            </View>
            <View style={styles.hContent}>
              <Text style={[styles.hTitle, { color: '#fff' }]}>Organizer</Text>
              <Text style={[styles.hDesc, { color: 'rgba(255,255,255,0.7)' }]}>Create events, manage participants, and track your success with powerful dashboards.</Text>
            </View>
            <View style={[styles.hArrow, { backgroundColor: '#fff' }]}>
              <Ionicons name="chevron-forward" size={18} color="#03045e" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomLinkContainer}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.bottomLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        <TouchableOpacity style={styles.backBtn} onPress={() => setUserType(null)}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.heroContainer}>
          <Image source={require('../../assets/onboarding1.png')} style={styles.hero} resizeMode="cover" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Détails de compte</Text>
          <Text style={styles.cardSubtitle}>
            {userType === 'User' ? 'Compte Utilisateur' : 'Compte Organisateur'}
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color={Colors.textMuted} />
              <TextInput 
                style={styles.inputText} 
                placeholder="Ex: Kodjo Mensah"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Adresse Email</Text>
            <View style={styles.inputBox}>
              <Ionicons name="at-outline" size={20} color={Colors.textMuted} />
              <TextInput 
                style={styles.inputText} 
                placeholder="name@email.tg"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {userType === 'Organizer' && (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nom de l'organisation</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="business-outline" size={20} color={Colors.textMuted} />
                  <TextInput 
                    style={styles.inputText} 
                    placeholder="Ex: Lomé Tech Hub"
                    value={orgName}
                    onChangeText={setOrgName}
                  />
                </View>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Site Web (Optionnel)</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="globe-outline" size={20} color={Colors.textMuted} />
                  <TextInput 
                    style={styles.inputText} 
                    placeholder="https://votre-site.tg"
                    value={orgWebsite}
                    onChangeText={setOrgWebsite}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
              <TextInput 
                style={styles.inputText} 
                secureTextEntry
                placeholder="********"
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
              <TextInput
                style={styles.inputText}
                secureTextEntry
                placeholder="********"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={handleSignUp}
            disabled={submitting}
            activeOpacity={0.88}
          >
            <Text style={styles.signUpText}>{submitting ? 'Inscription...' : "S'inscrire →"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { alignItems: 'center', paddingBottom: 32, gap: 16 },
  choiceHeader: { paddingTop: 100, paddingHorizontal: 30, alignItems: 'center', marginBottom: 60 },
  newChoiceTitle: { fontSize: 32, fontWeight: FontWeight.extrabold, color: Colors.primary, textAlign: 'center' },
  newChoiceSubtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginTop: 10 },
  choicesWrapper: { paddingHorizontal: 20, gap: 16 },
  horizontalCard: { 
    backgroundColor: Colors.white, 
    borderRadius: 24, 
    padding: 20, 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...Shadows.card,
    shadowOpacity: 0.1,
  },
  hIconBox: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  hContent: { flex: 1, gap: 4 },
  hTitle: { fontSize: 20, fontWeight: FontWeight.bold, color: Colors.primary },
  hDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  hArrow: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  bottomLinkContainer: { marginTop: 'auto', marginBottom: 60, flexDirection: 'row', justifyContent: 'center' },
  bottomText: { fontSize: 14, color: Colors.primary, opacity: 0.8 },
  bottomLink: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.primary },
  backBtn: { position: 'absolute', top: 52, left: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  heroContainer: { width: '90%', height: 120, borderRadius: BorderRadius.xl, overflow: 'hidden', backgroundColor: '#0d1b4b', marginTop: 110 },
  hero: { width: '100%', height: '100%' },
  card: { width: '90%', backgroundColor: Colors.white, borderRadius: 28, padding: Spacing.lg, gap: Spacing.md, ...Shadows.card },
  cardTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.primary, textAlign: 'center' },
  cardSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: -8 },
  fieldGroup: { gap: 6 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  inputBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.inputBg, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 18, paddingVertical: 12 },
  inputText: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  signUpBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 18, alignItems: 'center', ...Shadows.button, marginTop: 4 },
  signUpText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
  loginLink: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
});
