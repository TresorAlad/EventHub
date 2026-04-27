import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';

const SPEAKERS = [
  { name: 'Amivi Koffi', role: 'CTO, FinGo', image: require('../../assets/onboarding1.png') },
  { name: 'Koffi Mensah', role: 'VC Partner', image: require('../../assets/onboarding1.png') },
];

export default function EventDetailsScreen({ navigation, route }: any) {
  const event = route.params?.event || {};
  const isExternal = event.isExternal || false;
  const registrationLink = event.registrationLink || 'https://external-platform.com';
  const participationMode = event.mode || 'in-person'; // 'online' or 'in-person'

  const handleRegister = () => {
    if (isExternal) {
      Alert.alert(
        'Redirection',
        'Cet événement est géré sur une plateforme externe. Vous allez être redirigé vers le site partenaire.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Continuer', onPress: () => Alert.alert('Navigateur', `Redirection vers : ${registrationLink}`) }
        ]
      );
    } else {
      Alert.alert(
        'Confirmation',
        'Voulez-vous valider votre participation automatiquement avec les informations de votre profil ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Confirmer', onPress: () => Alert.alert('Succès', 'Votre inscription a été validée avec succès dans l\'application !') }
        ]
      );
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cover */}
        <View style={styles.coverContainer}>
          <Image source={require('../../assets/onboarding1.png')} style={styles.cover} resizeMode="cover" />
          <View style={styles.coverOverlay} />
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.topTitle}>EventHub</Text>
            <View style={styles.topRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Partager', 'Lien de l\'événement copié !')}>
                <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Search', 'Recherche...')}>
                <Ionicons name="search-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <Image 
                source={require('../../assets/logo.jpeg')} 
                style={styles.avatar} 
              />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>AI & INNOVATION</Text>
          </View>
          <Text style={styles.title}>Future of Fintech:{'\n'}Togo 2026 Summit</Text>

          <View style={styles.organizerRow}>
            <View style={styles.orgAvatar}>
              <Image 
                source={require('../../assets/logo.jpeg')} 
                style={{ width: '100%', height: '100%', borderRadius: 99 }} 
              />
            </View>
            <View>
              <Text style={styles.organizedBy}>ORGANIZED BY</Text>
              <Text style={styles.orgName}>TogoTech Alliance</Text>
            </View>
            <TouchableOpacity style={styles.followBtn} onPress={() => Alert.alert('Suivre', 'Vous suivez maintenant cet organisateur !')}>
              <Text style={styles.followText}>Suivre</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}><Ionicons name="calendar-outline" size={20} color={Colors.primary} /></View>
              <View>
                <Text style={styles.infoTitle}>October 24, 2026</Text>
                <Text style={styles.infoSub}>09:00 AM - 05:00 PM GMT</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons 
                  name={participationMode === 'online' ? "videocam-outline" : "location-outline"} 
                  size={20} 
                  color={Colors.primary} 
                />
              </View>
              <View>
                <Text style={styles.infoTitle}>
                  {participationMode === 'online' ? 'Événement en Ligne' : 'Palais des Congrès de Lomé'}
                </Text>
                <Text style={styles.infoSub}>
                  {participationMode === 'online' ? 'Zoom / Google Meet' : 'Lomé, Togo'}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.mapBox} 
              onPress={() => Alert.alert('Action', participationMode === 'online' ? 'Ouverture du lien de réunion...' : 'Ouverture de Google Maps...')}
            >
              <Ionicons 
                name={participationMode === 'online' ? "link-outline" : "map-outline"} 
                size={32} 
                color={Colors.textMuted} 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.description}>
            Join the most influential minds in West African technology for a day of deep-dive discussions on digital finance, blockchain integration, and the future of cross-border payments in Togo.
          </Text>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Speakers</Text>
            <TouchableOpacity><Text style={styles.seeAll}>SEE ALL</Text></TouchableOpacity>
          </View>
          <View style={styles.speakersRow}>
            {SPEAKERS.map((s, i) => (
              <View key={i} style={styles.speakerCard}>
                <Image source={s.image} style={styles.speakerImg} />
                <Text style={styles.speakerName}>{s.name}</Text>
                <Text style={styles.speakerRole}>{s.role}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Attendees</Text>
          <View style={styles.attendeesRow}>
            {[0,1,2,3,4].map((i) => (
              <View key={i} style={[styles.attendeeAvatar, { marginLeft: i === 0 ? 0 : -12 }]} />
            ))}
            <View style={styles.countBadge}>
              <Text style={styles.countText}>+140</Text>
            </View>
            <Text style={styles.attendeeText}>and 142 others are going</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookmarkBtn} onPress={() => Alert.alert('Favoris', 'Événement ajouté à vos favoris !')}>
          <Ionicons name="bookmark-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>
            {isExternal ? "S'inscrire (Externe)" : "S'inscrire Maintenant"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  coverContainer: { height: 240, position: 'relative' },
  cover: { width: '100%', height: '100%' },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  topBar: { position: 'absolute', top: 48, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md },
  backBtn: { width: 38, height: 38, borderRadius: 99, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  topTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.white },
  topRight: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 99, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 99, backgroundColor: Colors.backgroundDark, borderWidth: 2, borderColor: Colors.white },
  content: { padding: Spacing.md, gap: Spacing.md },
  tag: { alignSelf: 'flex-start', backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full },
  tagText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: Colors.primary, lineHeight: 34 },
  organizerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orgAvatar: { width: 44, height: 44, borderRadius: 99, backgroundColor: Colors.backgroundDark },
  organizedBy: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  orgName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
  followBtn: { marginLeft: 'auto', borderWidth: 1.5, borderColor: Colors.primary, borderRadius: BorderRadius.full, paddingHorizontal: 18, paddingVertical: 7 },
  followText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  infoCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.sm, ...Shadows.card },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  infoIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center' },
  infoTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  infoSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border },
  mapBox: { height: 100, borderRadius: BorderRadius.md, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  seeAll: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary, letterSpacing: 0.5 },
  description: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 23 },
  speakersRow: { flexDirection: 'row', gap: Spacing.md },
  speakerCard: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.sm, alignItems: 'center', gap: 6, ...Shadows.card },
  speakerImg: { width: '100%', height: 110, borderRadius: BorderRadius.md, backgroundColor: Colors.backgroundDark },
  speakerName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center' },
  speakerRole: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  attendeesRow: { flexDirection: 'row', alignItems: 'center' },
  attendeeAvatar: { width: 34, height: 34, borderRadius: 99, backgroundColor: Colors.backgroundDark, borderWidth: 2, borderColor: Colors.white },
  countBadge: { width: 34, height: 34, borderRadius: 99, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginLeft: -12, borderWidth: 2, borderColor: Colors.white },
  countText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  attendeeText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: 10 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: 16, paddingBottom: 32, borderTopWidth: 1, borderTopColor: Colors.border },
  bookmarkBtn: { width: 50, height: 50, borderRadius: 99, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  registerBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 16, alignItems: 'center', ...Shadows.button },
  registerText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
});
