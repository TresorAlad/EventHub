import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, TextInput,
  Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import AppIcon from '../components/ui/AppIcon';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../config/firebase';
import { updateEmail } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile as updateProfileApi, uploadAvatar } from '../services/api';
import EventImage from '../components/EventImage';
import { useAppAlert } from '../contexts/AppAlertContext';

export default function EditProfileScreen({ navigation }: any) {
  const { dbUser, refreshUser } = useAuth();
  const { showAlert } = useAppAlert();
  const isOrganizer = dbUser?.role === 'ORGANIZER' || dbUser?.role === 'ADMIN';

  const [organizerName, setOrganizerName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dbUser) return;
    const n = typeof dbUser.name === 'string' ? dbUser.name : '';
    setOrganizerName(n);
    setUserName(n);
    setOrganizationName(typeof dbUser.organizationName === 'string' ? dbUser.organizationName : '');
    setBio(typeof dbUser.bio === 'string' ? dbUser.bio : '');
    setAvatarUri(typeof dbUser.avatar === 'string' ? dbUser.avatar : null);
    setEmail(auth.currentUser?.email || dbUser.email || '');
  }, [dbUser]);

  const avatarSource = useMemo(() => {
    if (avatarUri && (avatarUri.startsWith('http') || avatarUri.startsWith('file:'))) return { uri: avatarUri };
    return require('../../assets/logo.jpeg');
  }, [avatarUri]);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showAlert({
        variant: 'warning',
        title: 'Permission requise',
        message: "Autorise l’accès à tes photos pour changer ton avatar.",
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const nextEmail = email.trim();
      const currentEmail = auth.currentUser.email || '';
      if (nextEmail && nextEmail !== currentEmail) {
        await updateEmail(auth.currentUser, nextEmail);
      }

      let avatarUrlToSave: string | undefined;
      if (avatarUri && avatarUri.startsWith('file:')) {
        const filename = avatarUri.split('/').pop() || 'avatar.jpg';
        const ext = (filename.split('.').pop() || 'jpg').toLowerCase();
        const type = ext === 'png' ? 'image/png' : 'image/jpeg';
        const updated = await uploadAvatar({ uri: avatarUri, name: filename, type });
        if (updated?.avatar && typeof updated.avatar === 'string') {
          avatarUrlToSave = updated.avatar;
          setAvatarUri(updated.avatar);
        } else if (updated?.data?.avatar && typeof updated.data.avatar === 'string') {
          avatarUrlToSave = updated.data.avatar;
          setAvatarUri(updated.data.avatar);
        } else if (updated?.avatarUrl && typeof updated.avatarUrl === 'string') {
          avatarUrlToSave = updated.avatarUrl;
          setAvatarUri(updated.avatarUrl);
        }
      }

      const payload: any = {
        email: nextEmail || undefined,
        bio: bio || undefined,
        avatar: avatarUrlToSave || (avatarUri && avatarUri.startsWith('http') ? avatarUri : undefined),
      };
      if (isOrganizer) {
        payload.name = organizerName || undefined;
        payload.organizationName = organizationName || undefined;
      } else {
        payload.name = userName || undefined;
      }

      await updateProfileApi(payload);
      await refreshUser();
      showAlert({ variant: 'success', title: 'Succès', message: 'Profil mis à jour avec succès !' });
      navigation.goBack();
    } catch (e: any) {
      const msg =
        e?.code === 'auth/requires-recent-login'
          ? "Pour modifier l'email, reconnecte-toi puis réessaie."
          : e?.response?.data?.message || e?.message || 'Impossible de sauvegarder le profil.';
      showAlert({ variant: 'error', title: 'Erreur', message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppIcon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.9}>
          <Text style={styles.saveBtnText}>{saving ? '...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <EventImage source={avatarSource} style={styles.avatar} />
              <TouchableOpacity style={styles.editBadge} onPress={pickAvatar} activeOpacity={0.85}>
                <AppIcon name="camera" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Change Profile Picture</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{isOrganizer ? "NOM DE L'ORGANISATEUR" : 'NOM COMPLET'}</Text>
              <View style={styles.inputWrapper}>
                <AppIcon name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  value={isOrganizer ? organizerName : userName}
                  onChangeText={isOrganizer ? setOrganizerName : setUserName}
                  placeholder={isOrganizer ? "Ex: Kossi Jerico" : "Ex: Kodjo Mensah"}
                />
              </View>
            </View>

            {isOrganizer && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NOM DE L'ORGANISATION</Text>
                <View style={styles.inputWrapper}>
                  <AppIcon name="business-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={organizationName}
                    onChangeText={setOrganizationName}
                    placeholder="Ex: Lomé Tech Hub"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputWrapper}>
                <AppIcon name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>BIO</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput 
                  style={[styles.input, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 52, 
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontFamily: Fonts.headerBold, color: Colors.primary },
  saveBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, backgroundColor: Colors.primary, borderRadius: BorderRadius.full },
  saveBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginVertical: Spacing.xl },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: Colors.white },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.background,
  },
  avatarHint: { marginTop: Spacing.sm, color: Colors.primaryLight, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  form: { gap: Spacing.lg },
  inputGroup: { gap: Spacing.xs },
  label: { fontSize: 11, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 1.2 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 56,
    ...Shadows.card,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontFamily: Fonts.regular },
  textAreaWrapper: { height: 120, paddingVertical: Spacing.md, alignItems: 'flex-start' },
  textArea: { height: '100%' },
});
