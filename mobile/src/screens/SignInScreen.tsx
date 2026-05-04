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
import { LinearGradient } from 'expo-linear-gradient';
import AppIcon from '../components/ui/AppIcon';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAppAlert } from '../contexts/AppAlertContext';

export default function SignInScreen({ navigation }: any) {
  const { showAlert } = useAppAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      showAlert({ variant: 'warning', title: 'Champs requis', message: 'Veuillez remplir tous les champs.' });
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      console.error(error);
      showAlert({
        variant: 'error',
        title: 'Erreur de connexion',
        message: error?.message || 'Connexion impossible avec ces identifiants.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={[Colors.background, '#F1F5F9', '#E2E8F0']}
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
          {/* Header Area */}
          <View style={styles.headerArea}>
            <View style={styles.logoCircle}>
              <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />
            </View>
            <Text style={styles.title}>Bon retour !</Text>
            <Text style={styles.subtitle}>Connectez-vous pour continuer sur EventHub Togo.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Email Field */}
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

            {/* Password Field */}
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
                  secureTextEntry={!showPwd}
                />
                <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={styles.pwdToggle}>
                  <AppIcon name={showPwd ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signInBtn}
              onPress={handleSignIn}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary, '#1E293B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.signInText}>{submitting ? 'Connexion...' : 'Se Connecter'}</Text>
                <AppIcon name="arrow-forward" size={20} color={Colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Nouveau ici ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: 40 },
  headerArea: { alignItems: 'center', marginBottom: 24 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    padding: 10,
    marginBottom: 16,
    ...Shadows.card,
  },
  logo: { width: '100%', height: '100%', borderRadius: 30 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    gap: 20,
    ...Shadows.card,
  },
  field: { gap: 8 },
  label: {
    fontSize: 11,
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
    height: 56,
    alignItems: 'center',
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#000', height: '100%' },
  pwdToggle: { padding: 8 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 4 },
  forgotText: { fontSize: 13, color: Colors.primaryLight, fontWeight: '600' },
  signInBtn: { borderRadius: 30, overflow: 'hidden', marginTop: 10 },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  signInText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
});
