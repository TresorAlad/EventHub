import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { useAuth } from '../hooks/useAuth';

const SETTINGS = [
  { id: 'edit', icon: 'create-outline', label: 'Modifier le profil' },
  { id: 'notif', icon: 'notifications-outline', label: 'Notifications' },
  { id: 'privacy', icon: 'shield-outline', label: 'Sécurité & Confidentialité' },
];

export default function ProfileScreen({ navigation, route }: any) {
  const { logout } = useAuth();
  const userType = route.params?.userType || 'User';

  const handleSettingPress = (id: string, label: string) => {
    if (id === 'edit') {
      navigation.navigate('EditProfile');
    } else if (id === 'notif') {
      navigation.navigate('Alerts');
    } else if (id === 'privacy') {
      navigation.navigate('PrivacySecurity');
    } else {
      Alert.alert(label, `Cette fonctionnalité "${label}" sera bientôt disponible.`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>EventHub</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search')}>
              <Ionicons name="search-outline" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <Image 
              source={require('../../assets/logo.jpeg')} 
              style={styles.avatarSmall} 
            />
          </View>
        </View>

        {/* Profile section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={require('../../assets/logo.jpeg')} 
              style={styles.avatarLarge} 
            />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={22} color="#8b5cf6" />
            </View>
          </View>
          <Text style={styles.name}>{userType === 'Organizer' ? 'Organisateur EventHub' : 'Utilisateur'}</Text>
          <Text style={styles.bio}>
            {userType === 'Organizer' ? 'Organisateur officiel d\'événements tech au Togo.' : 'Passionné de tech et membre actif de la communauté EventHub.'}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[{ value: '24', label: 'INSCRIT' }, { value: '12', label: 'FAVORIS' }, { value: '3', label: 'ORGANISÉ' }].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={styles.sectionLabel}>PARAMÈTRES DU COMPTE</Text>
        <View style={styles.settingsCard}>
          {SETTINGS.map((s, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.settingRow, i < SETTINGS.length - 1 && styles.settingBorder]} 
              activeOpacity={0.7}
              onPress={() => handleSettingPress(s.id, s.label)}
            >
              <View style={styles.settingIcon}>
                <Ionicons name={s.icon as any} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.settingLabel}>{s.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.85}
          onPress={async () => {
            try {
              await logout();
            } catch (e) {
              Alert.alert('Erreur', 'Impossible de se déconnecter.');
            }
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.textPrimary} />
          <Text style={styles.logoutText}>DÉCONNEXION</Text>
        </TouchableOpacity>

        {/* Featured event card */}
        <View style={styles.featuredCard}>
          <Image source={require('../../assets/onboarding1.png')} style={styles.featuredImg} resizeMode="cover" />
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredContent}>
            <View style={styles.featuredTag}>
              <Text style={styles.featuredTagText}>À VENIR</Text>
            </View>
            <Text style={styles.featuredTitle}>Lomé Tech Summit 2026</Text>
            <Text style={styles.featuredMeta}>12 Oct • Palais des Congrès</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 52, paddingBottom: Spacing.sm },
  appName: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 99, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  avatarSmall: { width: 40, height: 40, borderRadius: 99, backgroundColor: Colors.backgroundDark, borderWidth: 2, borderColor: Colors.primary },
  profileSection: { alignItems: 'center', gap: 10, marginVertical: Spacing.md },
  avatarWrapper: { position: 'relative' },
  avatarLarge: {
    width: 110, height: 110, borderRadius: 99,
    backgroundColor: Colors.backgroundDark,
    borderWidth: 3, borderColor: '#8b5cf6',
  },
  verifiedBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 26, height: 26, borderRadius: 99,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  bio: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: Spacing.md },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.lg, ...Shadows.card },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 0.5 },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 1.5, marginBottom: Spacing.sm },
  settingsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, marginBottom: Spacing.md, overflow: 'hidden', ...Shadows.card },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: Spacing.md },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    paddingVertical: 16, marginBottom: Spacing.lg, ...Shadows.card,
  },
  logoutText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary, letterSpacing: 1 },
  featuredCard: { borderRadius: BorderRadius.xl, overflow: 'hidden', height: 160, position: 'relative' },
  featuredImg: { width: '100%', height: '100%' },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,4,94,0.55)' },
  featuredContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.md, gap: 4 },
  featuredTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  featuredTagText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 0.8 },
  featuredTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.white },
  featuredMeta: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
});
