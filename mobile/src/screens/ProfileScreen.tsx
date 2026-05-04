import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { useAuth } from '../hooks/useAuth';
import EventImage from '../components/EventImage';
import { useAppAlert } from '../contexts/AppAlertContext';
import { useState } from 'react';

const SETTINGS = [
  { id: 'edit', icon: 'create-outline', label: 'Modifier le profil' },
  { id: 'notif', icon: 'notifications-outline', label: 'Notifications' },
  { id: 'privacy', icon: 'shield-outline', label: 'Sécurité & Confidentialité' },
];

export default function ProfileScreen({ navigation, route }: any) {
  const { logout, dbUser, user, refreshUser } = useAuth();
  const { showAlert } = useAppAlert();
  const [requesting, setRequesting] = useState(false);

  if (!user || !dbUser) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <View style={styles.loginPrompt}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-circle-outline" size={80} color={Colors.primary} />
          </View>
          <Text style={styles.promptTitle}>Rejoignez EventHub</Text>
          <Text style={styles.promptSub}>Connectez-vous pour gérer votre profil, vos favoris et vos événements.</Text>
          
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.loginBtnText}>SE CONNECTER</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.signupBtn}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signupBtnText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isOrganizer = dbUser?.role === 'ORGANIZER' || dbUser?.role === 'ADMIN';
  const displayName =
    isOrganizer
      ? (dbUser?.organizationName && String(dbUser.organizationName).trim().length > 0 ? dbUser.organizationName : 'Organisation')
      : (dbUser?.name && String(dbUser.name).trim().length > 0 ? dbUser.name : 'Utilisateur');
  const avatarSource =
    dbUser?.avatar && typeof dbUser.avatar === 'string'
      ? { uri: dbUser.avatar }
      : require('../../assets/logo.jpeg');

  const handleSettingPress = (id: string, label: string) => {
    if (id === 'edit') {
      navigation.navigate('EditProfile');
    } else if (id === 'notif') {
      navigation.navigate('Alerts');
    } else if (id === 'privacy') {
      navigation.navigate('PrivacySecurity');
    } else {
      showAlert({
        variant: 'info',
        title: label,
        message: `Cette fonctionnalité "${label}" sera bientôt disponible.`,
      });
    }
  };

  const handleRequestOrganizer = async () => {
    navigation.navigate('OrganizerRequest');
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
            <EventImage source={avatarSource} style={styles.avatarLarge} />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={22} color="#8b5cf6" />
            </View>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.bio}>
            {isOrganizer
              ? "Organisateur officiel d'événements tech au Togo."
              : 'Passionné de tech et membre actif de la communauté EventHub.'}
          </Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          {isOrganizer ? (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dbUser?._count?.followers || 0}</Text>
                <Text style={styles.statLabel}>Abonnés</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dbUser?._count?.following || 0}</Text>
                <Text style={styles.statLabel}>Suivis</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dbUser?._count?.favorites || 0}</Text>
                <Text style={styles.statLabel}>Favoris</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dbUser?._count?.organizedEvents || 0}</Text>
                <Text style={styles.statLabel}>Événements</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dbUser?._count?.favorites || 0}</Text>
                <Text style={styles.statLabel}>Favoris</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dbUser?._count?.following || 0}</Text>
                <Text style={styles.statLabel}>Suivis</Text>
              </View>
            </>
          )}
        </View>

        {/* Organizer Promotion for simple users */}
        {!isOrganizer && (
          <TouchableOpacity 
            style={styles.organizerCard} 
            activeOpacity={0.9}
            onPress={handleRequestOrganizer}
            disabled={requesting}
          >
            <View style={styles.organizerContent}>
              <Ionicons name="rocket-outline" size={24} color={Colors.white} />
              <View>
                <Text style={styles.organizerTitle}>Devenir Organisateur</Text>
                <Text style={styles.organizerSub}>Proposez vos propres événements à la communauté.</Text>
              </View>
            </View>
            {requesting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={Colors.white} />
            )}
          </TouchableOpacity>
        )}

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
              showAlert({ variant: 'error', title: 'Erreur', message: 'Impossible de se déconnecter.' });
            }
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.textPrimary} />
          <Text style={styles.logoutText}>DÉCONNEXION</Text>
        </TouchableOpacity>
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
  sectionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 1.5, marginBottom: Spacing.sm },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingVertical: 18,
    marginBottom: Spacing.lg,
    ...Shadows.card,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primary, marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: 'bold', textTransform: 'uppercase' },
  statDivider: { width: 1, height: '70%', backgroundColor: Colors.border },
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
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  promptTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  promptSub: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  loginBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.button,
  },
  loginBtnText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  signupBtn: {
    paddingVertical: 12,
  },
  signupBtnText: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  organizerCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  organizerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  organizerTitle: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  organizerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.xs,
  },
});
