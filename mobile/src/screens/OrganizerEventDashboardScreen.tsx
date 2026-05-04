import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import AppIcon from '../components/ui/AppIcon';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { useEventStatsQuery } from '../lib/queries';

const FALLBACK_AVATAR = require('../../assets/logo.jpeg');

export default function OrganizerEventDashboardScreen({ route, navigation }: any) {
  const { event } = route.params;
  const { data: stats, isLoading } = useEventStatsQuery(event?.id);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const keyExtractor = useCallback((item: any) => String(item.id), []);

  const renderParticipant = useCallback(({ item }: { item: any }) => {
    return (
      <View style={styles.userCard}>
        <Image
          source={item.profileImage ? { uri: item.profileImage } : FALLBACK_AVATAR}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name || 'Utilisateur'}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(item.registeredAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
        </Text>
      </View>
    );
  }, []);

  // ListHeader contient les cartes stats : tout ça scroll avec la liste, sans
  // imbrication ScrollView/FlatList (anti-pattern qui casse la virtualisation).
  const ListHeader = useMemo(
    () => (
      <View>
        <Text style={styles.sectionTitle}>Statistiques Rapides</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <AppIcon name="people" size={28} color="#0ea5e9" />
            <Text style={styles.statValue}>{stats?.registrations || 0}</Text>
            <Text style={styles.statLabel}>Inscriptions</Text>
          </View>
          <View style={styles.statCard}>
            <AppIcon name="heart" size={28} color="#ef4444" />
            <Text style={styles.statValue}>{stats?.favorites || 0}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statCard}>
            <AppIcon name="share-social" size={28} color="#10b981" />
            <Text style={styles.statValue}>{stats?.shares || 0}</Text>
            <Text style={styles.statLabel}>Partages</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
          Participants ({stats?.participants?.length || 0})
        </Text>
      </View>
    ),
    [stats]
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyBox}>
        <AppIcon name="person-outline" size={40} color={Colors.textMuted} />
        <Text style={styles.emptyText}>Aucun inscrit pour le moment.</Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <AppIcon name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Tableau de bord : {event.title}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={stats?.participants ?? []}
          keyExtractor={keyExtractor}
          renderItem={renderParticipant}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={9}
          removeClippedSubviews
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.white, flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 15 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: Colors.white,
    width: '30%',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...Shadows.card,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    ...Shadows.card,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 15 },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  userEmail: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  dateText: { fontSize: 12, color: Colors.textMuted },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  emptyText: { marginTop: 15, color: Colors.textMuted, fontSize: 15, textAlign: 'center' },
});
