import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, FontSize, FontWeight, Shadows, Spacing } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { getMyOrganizerRequest, submitOrganizerRequest } from '../services/api';
import { useAppAlert } from '../contexts/AppAlertContext';

export default function OrganizerRequestScreen({ navigation }: any) {
  const { dbUser, refreshUser } = useAuth();
  const { showAlert } = useAppAlert();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<any>(null);

  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  const role = dbUser?.role || 'USER';
  const alreadyOrganizer = role === 'ORGANIZER' || role === 'ADMIN';

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const req = await getMyOrganizerRequest();
        if (!mounted) return;
        setExisting(req);
        if (req?.communityName) setCommunityName(String(req.communityName));
        if (req?.description) setDescription(String(req.description));
        if (req?.phone) setPhone(String(req.phone));
        if (req?.website) setWebsite(String(req.website));
        if (req?.proofUrl) setProofUrl(String(req.proofUrl));
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const statusLabel = useMemo(() => {
    const s = (existing?.status || '').toString().toUpperCase();
    if (s === 'PENDING') return { text: 'En attente', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    if (s === 'APPROVED') return { text: 'Approuvée', color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    if (s === 'REJECTED') return { text: 'Refusée', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
    return null;
  }, [existing?.status]);

  const canSubmit = useMemo(() => {
    if (alreadyOrganizer) return false;
    if (existing?.status === 'PENDING') return false;
    return (
      communityName.trim().length >= 2 && description.trim().length >= 10 && phone.trim().length >= 6
    );
  }, [alreadyOrganizer, existing?.status, communityName, description, phone]);

  const onSubmit = async () => {
    if (!canSubmit) {
      showAlert({
        variant: 'warning',
        title: 'Champs requis',
        message: "Merci de remplir le nom de communauté, une description (min 10 caractères) et un téléphone.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const created = await submitOrganizerRequest({
        communityName: communityName.trim(),
        description: description.trim(),
        phone: phone.trim(),
        website: website.trim() || undefined,
        proofUrl: proofUrl.trim() || undefined,
      });
      setExisting(created);
      showAlert({
        variant: 'success',
        title: 'Demande envoyée',
        message: "Votre demande a été envoyée. Un administrateur va l'étudier avant validation.",
      });
      await refreshUser().catch(() => undefined);
    } catch (e: any) {
      showAlert({
        variant: 'error',
        title: 'Erreur',
        message: e?.response?.data?.message || e?.message || "Impossible d'envoyer la demande.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.9}>
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Demande Organisateur</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Devenir Organisateur</Text>
            <Text style={styles.subtitle}>
              Remplissez ces informations. L’administrateur pourra les consulter avant d’accepter votre demande.
            </Text>

            {alreadyOrganizer ? (
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
                  <Text style={[styles.badgeText, { color: '#10b981' }]}>Vous êtes déjà ORGANIZER</Text>
                </View>
              </View>
            ) : statusLabel ? (
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: statusLabel.bg }]}>
                  <Text style={[styles.badgeText, { color: statusLabel.color }]}>{statusLabel.text}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>Nom de la communauté</Text>
              <View style={styles.inputBox}>
                <Ionicons name="people-outline" size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={communityName}
                  onChangeText={setCommunityName}
                  placeholder="Ex: GDG Lomé"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.inputBox, { alignItems: 'flex-start' }]}>
                <Ionicons name="document-text-outline" size={18} color={Colors.textMuted} style={{ marginTop: 3 }} />
                <TextInput
                  style={[styles.input, { minHeight: 110 }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Présentez votre communauté, vos événements passés, etc."
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Téléphone</Text>
              <View style={styles.inputBox}>
                <Ionicons name="call-outline" size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Ex: +228 90 00 00 00"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Site web (optionnel)</Text>
              <View style={styles.inputBox}>
                <Ionicons name="globe-outline" size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="https://..."
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Document / lien preuve (optionnel)</Text>
              <View style={styles.inputBox}>
                <Ionicons name="link-outline" size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={proofUrl}
                  onChangeText={setProofUrl}
                  placeholder="Lien vers doc, page, Drive..."
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, (!canSubmit || submitting || loading) && { opacity: 0.55 }]}
              activeOpacity={0.9}
              disabled={!canSubmit || submitting || loading}
              onPress={onSubmit}
            >
              <Text style={styles.primaryText}>
                {submitting ? 'Envoi...' : existing?.status === 'REJECTED' ? 'Renvoyer la demande' : 'Envoyer la demande'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            {loading
              ? 'Chargement...'
              : 'Astuce: une seule demande peut être en attente à la fois.'}
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primary },
  scroll: { padding: Spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: 12,
    ...Shadows.card,
  },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  badgeRow: { alignItems: 'center', marginTop: 4, marginBottom: 4 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  field: { gap: 6 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  inputBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Colors.inputBg,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  primaryBtn: {
    marginTop: 6,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadows.button,
  },
  primaryText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
  hint: { textAlign: 'center', color: Colors.textMuted, marginTop: 12 },
});

