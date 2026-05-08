import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Image, ActivityIndicator, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager, Switch
} from 'react-native';
import AppIcon from '../components/ui/AppIcon';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { createEvent, updateEvent } from '../services/api';
import EventImage from '../components/EventImage';
import { useAppAlert } from '../contexts/AppAlertContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATEGORIES = ['Innovation & Fintech', 'Hackathon', 'Meetup', 'Workshop', 'Conférence', 'Pitch Night', 'Web3 & Crypto'];

export default function CreateEventScreen({ route, navigation }: any) {
  const { showAlert } = useAppAlert();
  const eventToEdit = route?.params?.event;
  const isEditing = !!eventToEdit;

  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;
  const [loading, setLoading] = useState(false);

  const initialDate = eventToEdit?.date ? new Date(eventToEdit.date) : null;
  const initialEndDate = eventToEdit?.endDate ? new Date(eventToEdit.endDate) : null;

  // Step 1
  const [title, setTitle] = useState(eventToEdit?.title || '');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState(eventToEdit?.description || '');
  const [category, setCategory] = useState(eventToEdit?.category || CATEGORIES[0]);
  const [image, setImage] = useState<string | null>(eventToEdit?.imageUrl || null);

  // Step 2
  const [startDate, setStartDate] = useState(initialDate ? initialDate.toISOString().split('T')[0] : '');
  const [startTime, setStartTime] = useState(initialDate ? initialDate.toISOString().substring(11, 16) : '');
  const [endDate, setEndDate] = useState(initialEndDate ? initialEndDate.toISOString().split('T')[0] : '');
  const [endTime, setEndTime] = useState(initialEndDate ? initialEndDate.toISOString().substring(11, 16) : '');

  // Step 3
  const [eventType, setEventType] = useState<'in-person' | 'online' | 'hybrid'>(
    eventToEdit?.participationMode === 'Online' ? 'online' : eventToEdit?.participationMode === 'Hybrid' ? 'hybrid' : 'in-person'
  );
  const [location, setLocation] = useState(eventToEdit?.location || '');
  const [city, setCity] = useState('');
  const [meetingLink, setMeetingLink] = useState(eventToEdit?.participationMode === 'Online' ? eventToEdit?.location || '' : '');

  // Step 4
  const [isExternal, setIsExternal] = useState(eventToEdit?.registrationMode === 'External');
  const [externalLink, setExternalLink] = useState(eventToEdit?.externalLink || '');



  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [16, 9], quality: 0.8,
    });
    if (!result.canceled) {
      const fileSize = result.assets[0].fileSize;
      if (fileSize && fileSize > 5 * 1024 * 1024) {
        showAlert({
          variant: 'warning',
          title: 'Image trop lourde',
          message: "L'image dépasse 5 Mo. Veuillez choisir une image plus légère pour respecter les limites du serveur.",
        });
        return;
      }
      setImage(result.assets[0].uri);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!title || !organizer || !description)) {
      showAlert({
        variant: 'warning',
        title: 'Champs requis',
        message: 'Veuillez remplir le titre, la communauté et la description.',
      });
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const prevStep = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (step > 1) setStep(step - 1);
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      // Validations minimales côté client pour éviter un 422/403 opaque
      if (!title || !organizer || !description) {
        showAlert({
          variant: 'warning',
          title: 'Champs requis',
          message: 'Veuillez remplir le titre, la communauté et la description.',
        });
        return;
      }
      if (eventType === 'in-person' && !location) {
        showAlert({ variant: 'warning', title: 'Champs requis', message: "Veuillez saisir l'adresse de l'événement." });
        return;
      }
      if (eventType === 'online' && !meetingLink) {
        showAlert({ variant: 'warning', title: 'Champs requis', message: 'Veuillez saisir le lien du meeting.' });
        return;
      }
      if (eventType === 'hybrid' && (!location || !meetingLink)) {
        showAlert({
          variant: 'warning',
          title: 'Champs requis',
          message: "Pour un événement hybride, merci de renseigner l'adresse ET le lien du meeting.",
        });
        return;
      }
      if (isExternal && !externalLink) {
        showAlert({
          variant: 'warning',
          title: 'URL requise',
          message: "Veuillez renseigner l'URL d'inscription (site externe).",
        });
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('organizer', organizer);
      formData.append('category', category);
      
      const startDateTime = startDate && startTime ? `${startDate}T${startTime}:00` : new Date().toISOString();
      formData.append('date', startDateTime);

      if (endDate) {
        const endDateTime = `${endDate}T${endTime || '23:59'}:00`;
        formData.append('endDate', endDateTime);
      }

      // Backend supporte uniquement Online | InPlace (pas de Hybrid). On envoie InPlace par défaut,
      // et on conserve l'URL de meeting (si hybride) dans `externalLink` quand c'est possible.
      const resolvedLocation = eventType === 'online' ? meetingLink : location;
      formData.append('location', resolvedLocation);
      formData.append('description', description);
      formData.append('participationMode', eventType === 'online' ? 'Online' : 'InPlace');
      formData.append('registrationMode', isExternal ? 'External' : 'Internal');
      // Si "externe", on utilise le lien fourni. Si "hybride" interne, on stocke au moins le meeting link.
      if (isExternal) {
        formData.append('externalLink', externalLink);
      } else if (eventType === 'hybrid' && meetingLink) {
        formData.append('externalLink', meetingLink);
      }

      if (image && !image.startsWith('http')) {
        const filename = image.split('/').pop() || 'banner.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append('image', { uri: image, name: filename, type } as any);
      }

      if (isEditing) {
        await updateEvent(eventToEdit.id, formData);
        showAlert({ variant: 'success', title: 'Succès', message: 'Événement modifié avec succès !' });
      } else {
        await createEvent(formData);
        showAlert({
          variant: 'success',
          title: 'Succès',
          message: "Événement envoyé. Il sera visible après validation de l'administrateur.",
        });
      }
      navigation.goBack();
    } catch (error: any) {
      console.error(error?.response?.data || error);
      const status = error?.response?.status;
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error || error?.message;
      if (status === 403) {
        showAlert({
          variant: 'error',
          title: 'Accès refusé',
          message: "Votre compte n'est pas encore validé comme organisateur.",
        });
        return;
      }
      showAlert({
        variant: 'error',
        title: 'Erreur',
        message:
          (typeof apiMessage === 'string' && apiMessage.trim().length > 0
            ? apiMessage
            : isEditing
              ? 'Échec de la modification.'
              : "Échec de la publication de l'événement."),
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={step === 1 ? () => navigation.goBack() : prevStep} style={styles.backBtn}>
          <AppIcon name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Étape {step} sur {TOTAL_STEPS}</Text>
        <View style={{ width: 40 }} />
      </View>
      {renderProgressBar()}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.title}>Informations Générales</Text>
            <Text style={styles.subtitle}>Les éléments clés de votre événement.</Text>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <EventImage source={{ uri: image }} style={styles.coverImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <AppIcon name="image-outline" size={32} color={Colors.primary} />
                  <Text style={styles.imagePlaceholderText}>Ajouter une bannière (16:9)</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom de l'événement</Text>
              <TextInput style={styles.input} placeholder="Ex: Lomé Tech Summit" value={title} onChangeText={setTitle} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Communauté organisatrice</Text>
              <TextInput style={styles.input} placeholder="Ex: GDG Lomé" value={organizer} onChangeText={setOrganizer} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description complète</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Parlez-nous de cet événement..." value={description} onChangeText={setDescription} multiline />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Catégorie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity key={cat} style={[styles.pill, category === cat && styles.pillActive]} onPress={() => setCategory(cat)}>
                    <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.title}>Date & Horaire</Text>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Date de début</Text>
                <TextInput style={styles.input} placeholder="AAAA-MM-JJ" value={startDate} onChangeText={setStartDate} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Heure</Text>
                <TextInput style={styles.input} placeholder="09:00" value={startTime} onChangeText={setStartTime} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Date de fin</Text>
                <TextInput style={styles.input} placeholder="AAAA-MM-JJ" value={endDate} onChangeText={setEndDate} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Heure</Text>
                <TextInput style={styles.input} placeholder="18:00" value={endTime} onChangeText={setEndTime} />
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.section}>
            <Text style={styles.title}>Type d'événement</Text>

            <View style={styles.cardSelectorRow}>
              {[
                { id: 'in-person', title: 'Présentiel', icon: 'business' },
                { id: 'online', title: 'En ligne', icon: 'videocam' },
                { id: 'hybrid', title: 'Hybride', icon: 'planet' }
              ].map((type) => (
                <TouchableOpacity key={type.id} style={[styles.cardSelector, eventType === type.id && styles.cardSelectorActive]} onPress={() => setEventType(type.id as any)}>
                  <AppIcon name={type.icon as any} size={28} color={eventType === type.id ? Colors.primary : Colors.textMuted} />
                  <Text style={[styles.cardSelectorText, eventType === type.id && styles.cardSelectorTextActive]}>{type.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {(eventType === 'in-person' || eventType === 'hybrid') && (
              <View style={{ marginTop: 24 }}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Adresse Complète</Text>
                  <TextInput style={styles.input} placeholder="Nom du lieu, rue..." value={location} onChangeText={setLocation} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ville</Text>
                  <TextInput style={styles.input} placeholder="Ex: Lomé" value={city} onChangeText={setCity} />
                </View>
              </View>
            )}

            {(eventType === 'online' || eventType === 'hybrid') && (
              <View style={{ marginTop: 24 }}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Lien du meeting (Google Meet, Zoom...)</Text>
                  <TextInput style={styles.input} placeholder="https://..." value={meetingLink} onChangeText={setMeetingLink} />
                </View>
              </View>
            )}
          </View>
        )}

        {step === 4 && (
          <View style={styles.section}>
            <Text style={styles.title}>Inscriptions</Text>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Site Web Externe ?</Text>
                <Text style={styles.switchHint}>Cochez si les utilisateurs s'inscrivent sur une autre plateforme.</Text>
              </View>
              <Switch value={isExternal} onValueChange={setIsExternal} trackColor={{ true: Colors.primary, false: '#e2e8f0' }} />
            </View>

            {isExternal ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL d'inscription</Text>
                <TextInput style={styles.input} placeholder="https://eventbrite.com/..." value={externalLink} onChangeText={setExternalLink} />
              </View>
            ) : (
              <View style={styles.mockDashboard}>
                <AppIcon name="checkmark-circle" size={24} color={Colors.primary} />
                <Text style={styles.mockTitle}>Inscription Interne EventHub</Text>
                <Text style={styles.mockHint}>Les utilisateurs s'inscriront en un clic via notre plateforme.</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        {step < TOTAL_STEPS ? (
          <TouchableOpacity style={styles.primaryBtn} onPress={nextStep}>
            <Text style={styles.primaryBtnText}>Suivant</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{isEditing ? "Enregistrer les modifications" : "Publier l'événement"}</Text>}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 15, backgroundColor: '#f8fafc' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  progressContainer: { height: 4, backgroundColor: '#e2e8f0', marginHorizontal: 20, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  scroll: { padding: 24, paddingBottom: 120 },
  section: { flex: 1 },
  title: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 24 },
  imagePicker: { width: '100%', height: 180, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', marginBottom: 24 },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  imagePlaceholderText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.textPrimary },
  textArea: { height: 120, textAlignVertical: 'top' },
  pill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 10 },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  pillTextActive: { color: '#fff' },
  row: { flexDirection: 'row', gap: 12 },
  cardSelectorRow: { flexDirection: 'row', gap: 12 },
  cardSelector: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 4 },
  cardSelectorActive: { borderColor: Colors.primary, backgroundColor: '#f0f5ff' },
  cardSelectorText: { marginTop: 12, fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  cardSelectorTextActive: { color: Colors.primary },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20 },
  switchLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  switchHint: { fontSize: 13, color: '#64748b', marginTop: 4 },
  mockDashboard: { padding: 24, backgroundColor: '#f0fdf4', borderRadius: 16, borderWidth: 1, borderColor: '#bbf7d0', alignItems: 'center' },
  mockTitle: { fontSize: 16, fontWeight: '800', color: '#166534', marginTop: 12, marginBottom: 4 },
  mockHint: { fontSize: 13, color: '#15803d', textAlign: 'center' },
  visibilityOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 12 },
  visibilityOptionActive: { backgroundColor: '#f0f5ff', borderWidth: 1, borderColor: '#c7d2fe' },
  visibilityText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary, marginLeft: 12 },
  visibilityTextActive: { color: Colors.primary },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  publishBtn: { backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
