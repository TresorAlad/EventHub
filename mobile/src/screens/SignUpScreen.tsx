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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAppAlert } from '../contexts/AppAlertContext';

export default function SignUpScreen({ navigation }: any) {
  const { showAlert } = useAppAlert();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      showAlert({
        variant: 'warning',
        title: 'Champs requis',
        message: 'Merci de remplir le nom, email et mot de passe.',
      });
      return;
    }
    if (password !== confirmPassword) {
      showAlert({
        variant: 'warning',
        title: 'Mot de passe',
        message: 'Les mots de passe ne correspondent pas.',
      });
      return;
    }
    if (password.length < 6) {
      showAlert({
        variant: 'warning',
        title: 'Mot de passe faible',
        message: 'Le mot de passe doit contenir au moins 6 caractères.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Firebase displayName = nom de la personne. Le nom de l'organisation est stocké côté backend.
      await updateProfile(credential.user, { displayName: fullName.trim() });
    } catch (error: any) {
      console.error(error);
      showAlert({
        variant: 'error',
        title: 'Inscription impossible',
        message: error?.message || 'Veuillez réessayer.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.heroContainer}>
          <Image source={require('../../assets/onboarding_tech_2.png')} style={styles.hero} resizeMode="cover" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Détails de compte</Text>
          <Text style={styles.cardSubtitle}>Compte Utilisateur</Text>

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

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
              <TextInput 
                style={styles.inputText} 
                secureTextEntry={!showPassword}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
              <TextInput
                style={styles.inputText}
                secureTextEntry={!showConfirmPassword}
                placeholder="********"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
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
