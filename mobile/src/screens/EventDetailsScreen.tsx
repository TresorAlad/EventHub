import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, StatusBar, Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { useAuth } from '../hooks/useAuth';

export default function EventDetailsScreen({ navigation, route }: any) {
  const { dbUser, user } = useAuth();
  const event = route.params?.event || {};
  
  const isExternal = event.registrationMode === 'External' || event.externalLink;
  const registrationLink = event.externalLink || 'https://external-platform.com';
  const participationMode = event.participationMode || 'InPlace'; 

  const isOrganizer = dbUser?.id === event.organizerId || event.organizer?.id === dbUser?.id || false;

  const bannerImage = event.imageUrl ? { uri: event.imageUrl } : require('../../assets/onboarding1.png');
  const orgName = event.organizer?.name || event.organizer || 'Communauté Tech';
  const orgAvatar = event.organizer?.avatar ? { uri: event.organizer.avatar } : require('../../assets/logo.jpeg');
  const eventDate = event.date ? new Date(event.date) : new Date();

  const handleRegister = () => {
    if (isExternal) {
      Alert.alert(
        'Redirection',
        'Cet événement est géré sur une plateforme externe. Vous allez être redirigé vers le site partenaire.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Continuer', onPress: () => Linking.openURL(registrationLink).catch(() => Alert.alert('Erreur', "Impossible d'ouvrir le lien.")) }
        ]
      );
    } else {
      Alert.alert(
        'Confirmation',
        'Voulez-vous valider votre participation automatiquement avec les informations de votre profil ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Confirmer', onPress: () => Alert.alert('Succès', "Votre inscription a été validée avec succès dans l'application !") }
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
          <Image source={bannerImage} style={styles.cover} resizeMode="cover" />
          <View style={styles.coverOverlay} />
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.topTitle}>EventHub</Text>
            <View style={styles.topRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Partager', "Lien de l'événement copié !")}>
                <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search')}>
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
            <Text style={styles.tagText}>{event.category ? event.category.toUpperCase() : 'TECH EVENT'}</Text>
          </View>
          <Text style={styles.title}>{event.title || 'Tech Event'}</Text>

          <View style={styles.organizerRow}>
            <View style={styles.orgAvatar}>
              <Image source={orgAvatar} style={{ width: '100%', height: '100%', borderRadius: 99 }} />
            </View>
            <View>
              <Text style={styles.organizedBy}>ORGANISÉ PAR</Text>
              <Text style={styles.orgName}>{orgName}</Text>
            </View>
            {!isOrganizer && (
              <TouchableOpacity style={styles.followBtn} onPress={() => Alert.alert('Suivre', 'Vous suivez maintenant cet organisateur !')}>
                <Text style={styles.followText}>Suivre</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}><Ionicons name="calendar-outline" size={20} color={Colors.primary} /></View>
              <View>
                <Text style={styles.infoTitle}>{eventDate.toLocaleDateString('fr-FR')}</Text>
                <Text style={styles.infoSub}>{eventDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})} GMT</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons 
                  name={participationMode === 'Online' || participationMode === 'online' ? "videocam-outline" : "location-outline"} 
                  size={20} 
                  color={Colors.primary} 
                />
              </View>
              <View>
                <Text style={styles.infoTitle}>
                  {participationMode === 'Online' || participationMode === 'online' ? 'Événement en Ligne' : 'Présentiel'}
                </Text>
                <Text style={styles.infoSub}>
                  {event.location || 'Lieu à venir'}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.mapBox} 
              onPress={() => {
                if (participationMode === 'Online' || participationMode === 'online') {
                  const link = event.location?.startsWith('http') ? event.location : 'https://meet.google.com';
                  Linking.openURL(link).catch(() => Alert.alert('Erreur', "Impossible d'ouvrir le lien de réunion."));
                } else {
                  const query = encodeURIComponent(event.location || 'Lomé, Togo');
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => Alert.alert('Erreur', "Impossible d'ouvrir Google Maps."));
                }
              }}
            >
              <Ionicons 
                name={participationMode === 'Online' || participationMode === 'online' ? "link-outline" : "map-outline"} 
                size={32} 
                color={Colors.textMuted} 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>À propos de l'événement</Text>
          <Text style={styles.description}>
             {event.description || "Rejoignez ce superbe événement pour découvrir et partager autour des technologies."}
          </Text>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Intervenants</Text>
            <TouchableOpacity><Text style={styles.seeAll}>VOIR TOUT</Text></TouchableOpacity>
          </View>
          <View style={styles.speakersRow}>
            {/* Speakers mapping would go here */}
          </View>

          <Text style={styles.sectionTitle}>Participants</Text>
          <View style={styles.attendeesRow}>
            {[0,1,2,3,4].map((i) => (
              <View key={i} style={[styles.attendeeAvatar, { marginLeft: i === 0 ? 0 : -12 }]} />
            ))}
            <View style={styles.countBadge}>
              <Text style={styles.countText}>+{event.attendees || 0}</Text>
            </View>
            <Text style={styles.attendeeText}>et {event.attendees || 0} autres y participent</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookmarkBtn} onPress={() => Alert.alert('Favoris', 'Événement ajouté à vos favoris !')}>
          <Ionicons name="bookmark-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        {isOrganizer ? (
          <TouchableOpacity 
            style={[styles.registerBtn, { backgroundColor: '#10b981', flexDirection: 'row', justifyContent: 'center', gap: 8 }]} 
            onPress={() => Alert.alert('Gestion des Inscrits', `🌟 Super ! Vous avez actuellement ${event.attendees || 0} participants inscrits.\n\nLe dashboard de tracking sera disponible dans la prochaine mise à jour pour exporter la liste.`, [{text:'Génial'}])}>
            <Ionicons name="people" size={20} color="#fff" />
            <Text style={styles.registerText}>Suivre les inscrits ({event.attendees || 0})</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerText}>
              {isExternal ? "S'inscrire (Externe)" : "S'inscrire Maintenant"}
            </Text>
          </TouchableOpacity>
        )}
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
