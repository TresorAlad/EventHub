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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppIcon from '../components/ui/AppIcon';
import { BorderRadius, Colors, FontSize, FontWeight, Shadows, Spacing, Fonts } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { getMyOrganizerRequest, submitOrganizerRequest } from '../services/api';
import { useAppAlert } from '../contexts/AppAlertContext';

const { width } = Dimensions.get('window');

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

  // Pour gérer l'état de focus des champs
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: string,
    id: string,
    props: any = {}
  ) => {
    const isFocused = focusedField === id;
    const isMultiline = props.multiline;

    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            isMultiline && styles.inputContainerMultiline,
          ]}
        >
          <View style={[styles.iconWrapper, isMultiline && { marginTop: 12 }]}>
            <AppIcon
              name={icon as any}
              size={20}
              color={isFocused ? Colors.primary : Colors.textMuted}
            />
          </View>
          <TextInput
            style={[styles.input, isMultiline && styles.inputMultiline]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#A0AEC0"
            onFocus={() => setFocusedField(id)}
            onBlur={() => setFocusedField(null)}
            {...props}
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient
        colors={[Colors.background, Colors.white]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
      >
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <AppIcon name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Devenir Organisateur</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.introSection}>
              <View style={styles.iconCircle}>
                <AppIcon name="briefcase" size={32} color={Colors.white} />
              </View>
              <Text style={styles.title}>Rejoignez la communauté</Text>
              <Text style={styles.subtitle}>
                Remplissez ces informations pour que l'administrateur puisse valider votre profil d'organisateur.
              </Text>
            </View>

            {alreadyOrganizer ? (
              <View style={styles.statusBox}>
                <LinearGradient
                  colors={['rgba(16,185,129,0.1)', 'rgba(16,185,129,0.05)']}
                  style={styles.statusGradient}
                >
                  <AppIcon name="checkmark-circle" size={20} color="#10b981" />
                  <Text style={[styles.statusText, { color: '#10b981' }]}>
                    Vous êtes déjà organisateur
                  </Text>
                </LinearGradient>
              </View>
            ) : statusLabel ? (
              <View style={styles.statusBox}>
                <LinearGradient
                  colors={[statusLabel.bg, 'rgba(255,255,255,0.05)']}
                  style={styles.statusGradient}
                >
                  <AppIcon
                    name={
                      existing?.status === 'APPROVED'
                        ? 'checkmark-circle'
                        : existing?.status === 'REJECTED'
                        ? 'close-circle'
                        : 'time'
                    }
                    size={20}
                    color={statusLabel.color}
                  />
                  <Text style={[styles.statusText, { color: statusLabel.color }]}>
                    Statut : {statusLabel.text}
                  </Text>
                </LinearGradient>
              </View>
            ) : null}

            <View style={styles.formCard}>
              {renderInput(
                'Nom de la communauté',
                communityName,
                setCommunityName,
                'Ex: GDG Lomé, Club Informatique...',
                'people-outline',
                'name'
              )}

              {renderInput(
                'Description',
                description,
                setDescription,
                'Présentez votre mission, vos objectifs et vos types d\'événements...',
                'document-text-outline',
                'description',
                { multiline: true, textAlignVertical: 'top' }
              )}
              <Text style={[styles.charCount, description.length < 10 && description.length > 0 && { color: Colors.danger }]}>
                {description.length} / 10 caractères minimum
              </Text>

              {renderInput(
                'Téléphone de contact',
                phone,
                setPhone,
                'Ex: +228 90 00 00 00',
                'call-outline',
                'phone',
                { keyboardType: 'phone-pad' }
              )}

              {renderInput(
                'Site web (optionnel)',
                website,
                setWebsite,
                'https://votre-site.com',
                'globe-outline',
                'website',
                { autoCapitalize: 'none', keyboardType: 'url' }
              )}

              {renderInput(
                'Lien de preuve (optionnel)',
                proofUrl,
                setProofUrl,
                'LinkedIn, Drive, Facebook...',
                'link-outline',
                'proof',
                { autoCapitalize: 'none', keyboardType: 'url' }
              )}

              <TouchableOpacity
                style={[styles.submitBtn, (!canSubmit || submitting || loading) && styles.submitBtnDisabled]}
                activeOpacity={0.8}
                disabled={!canSubmit || submitting || loading}
                onPress={onSubmit}
              >
                <LinearGradient
                  colors={canSubmit && !submitting ? ['#03045e', '#0077b6'] : ['#A0AEC0', '#CBD5E0']}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {submitting ? (
                    <Text style={styles.submitText}>Envoi en cours...</Text>
                  ) : (
                    <>
                      <Text style={styles.submitText}>
                        {existing?.status === 'REJECTED' ? 'Renvoyer ma demande' : 'Envoyer ma demande'}
                      </Text>
                      <AppIcon name="arrow-forward" size={18} color={Colors.white} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.footerHint}>
              <AppIcon name="information-circle-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.hintText}>
                {loading
                  ? 'Chargement des données...'
                  : 'Une seule demande peut être en attente à la fois.'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.headerBold,
    color: Colors.primary,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.button,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.headerExtraBold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  statusBox: {
    marginBottom: Spacing.lg,
  },
  statusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: 20,
    ...Shadows.card,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
    paddingHorizontal: 12,
    minHeight: 56,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  inputContainerMultiline: {
    minHeight: 120,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },
  inputMultiline: {
    paddingTop: 14,
  },
  submitBtn: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadows.button,
  },
  submitBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  submitText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontFamily: Fonts.bold,
  },
  footerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.xl,
  },
  hintText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  charCount: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: -16,
    marginRight: 4,
  },
});


