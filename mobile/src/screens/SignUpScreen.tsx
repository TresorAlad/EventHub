import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppIcon from '../components/ui/AppIcon';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAppAlert } from '../contexts/AppAlertContext';

export default function SignUpScreen({ navigation }: any) {
  const { showAlert } = useAppAlert();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      await updateProfile(credential.user, { displayName: fullName.trim() });
      
      showAlert({
        variant: 'success',
        title: 'Inscription terminée !',
        message: 'Bienvenue dans la communauté EventHub. Ton compte a été créé avec succès.',
      });
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#F8FAFC', '#E2E8F0', '#CBD5E0']}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
        >
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <AppIcon name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerArea}>
            <Text style={styles.title}>Rejoignez-nous</Text>
            <Text style={styles.subtitle}>Créez votre compte pour ne rien rater des événements tech au Togo.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Full Name */}
            <View style={styles.field}>
              <Text style={styles.label}>NOM COMPLET</Text>
              <View style={styles.inputContainer}>
                <AppIcon name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Ex: Kodjo Mensah"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>ADRESSE EMAIL</Text>
              <View style={styles.inputContainer}>
                <AppIcon name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="votre@email.tg"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>MOT DE PASSE</Text>
              <View style={styles.inputContainer}>
                <AppIcon name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.pwdToggle}>
                  <AppIcon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.field}>
              <Text style={styles.label}>CONFIRMER LE MOT DE PASSE</Text>
              <View style={styles.inputContainer}>
                <AppIcon name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.pwdToggle}>
                  <AppIcon name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.signUpBtn}
              onPress={handleSignUp}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary, '#1E293B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.signUpText}>{submitting ? 'Inscription...' : 'Créer mon compte'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: 40, paddingBottom: 40 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Shadows.card,
  },
  headerArea: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    ...Shadows.card,
  },
  field: { gap: 6 },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 52,
    alignItems: 'center',
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#000', height: '100%' },
  pwdToggle: { padding: 8 },
  signUpBtn: { borderRadius: 30, overflow: 'hidden', marginTop: 10 },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  signUpText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
});
