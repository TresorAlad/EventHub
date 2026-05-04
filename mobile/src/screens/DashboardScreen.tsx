import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import React, { useCallback, useMemo } from 'react';
import { useEventsQuery, useDeleteEvent } from '../lib/queries';
import { useAuth } from '../hooks/useAuth';
import { useAppAlert } from '../contexts/AppAlertContext';

const FALLBACK_IMG = require('../../assets/onboarding_tech_1.png');

const statusOf = (item: any): 'Upcoming' | 'Live' | 'Past' => {
  const now = new Date();
  const start = item?.date ? new Date(item.date) : now;
  const end = item?.endDate ? new Date(item.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
  if (now > end) return 'Past';
  if (now >= start && now <= end) return 'Live';
  return 'Upcoming';
};

export default function DashboardScreen({ navigation }: any) {
  const { dbUser } = useAuth();
  const { showAlert } = useAppAlert();
  const { data: events = [], isRefetching, refetch } = useEventsQuery();
  const deleteMutation = useDeleteEvent();

  const myEvents = useMemo(() => {
    if (!dbUser?.id || !Array.isArray(events)) return [];
    return events.filter((e: any) => e?.organizerId === dbUser.id);
  }, [events, dbUser?.id]);

  const expiredCount = useMemo(
    () => myEvents.filter((e: any) => statusOf(e) === 'Past').length,
    [myEvents]
  );

  const handleDelete = useCallback(
    (eventId: string) => {
      showAlert({
        variant: 'warning',
        title: 'Supprimer',
        message: 'Voulez-vous vraiment supprimer cet événement ?',
        primaryText: 'Supprimer',
        secondaryText: 'Annuler',
        onPrimary: async () => {
          try {
            await deleteMutation.mutateAsync(eventId);
          } catch {
            showAlert({ variant: 'error', title: 'Erreur', message: "Impossible de supprimer cet événement." });
          }
        },
      });
    },
    [deleteMutation]
  );

  const goToOrganizer = useCallback(
    (event: any) => navigation.navigate('OrganizerEventDashboard', { event }),
    [navigation]
  );
  const goToEdit = useCallback(
    (event: any) => navigation.navigate('CreateEvent', { event }),
    [navigation]
  );
  const goToCreate = useCallback(() => navigation.navigate('CreateEvent'), [navigation]);
  const goToSearch = useCallback(() => navigation.navigate('Search'), [navigation]);
  const goToOrganizerSearch = useCallback(
    () => navigation.navigate('Search', { organizerId: dbUser?.id }),
    [navigation, dbUser?.id]
  );

  const keyExtractor = useCallback((item: any) => String(item.id), []);

  const renderItem = useCallback(
    ({ item: ev }: { item: any }) => {
      const status = statusOf(ev);
      const badgeStyle =
        status === 'Live'
          ? { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
          : status === 'Past'
            ? { backgroundColor: 'rgba(100, 116, 139, 0.12)' }
            : { backgroundColor: 'rgba(56, 189, 248, 0.1)' };
      const textColor =
        status === 'Live' ? '#ef4444' : status === 'Past' ? '#64748b' : '#0ea5e9';
      return (
        <TouchableOpacity
          style={styles.eventRow}
          onPress={() => goToOrganizer(ev)}
          activeOpacity={0.85}
        >
          <Image source={ev.imageUrl ? { uri: ev.imageUrl } : FALLBACK_IMG} style={styles.eventThumb} />
          <View style={styles.eventInfo}>
            <View style={styles.eventMeta}>
              <View style={[styles.statusBadge, badgeStyle]}>
                <Text style={[styles.statusText, { color: textColor }]}>
                  {status === 'Live' ? 'LIVE' : status === 'Past' ? 'PASSÉ' : 'À VENIR'}
                </Text>
              </View>
            </View>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {ev.title}
            </Text>
          </View>

          <View style={styles.actionsCol}>
            <TouchableOpacity onPress={() => goToEdit(ev)} style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={20} color="#0ea5e9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(ev.id)} style={styles.delBtn}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [goToOrganizer, goToEdit, handleDelete]
  );

  const ListHeader = useMemo(
    () => (
      <View>
        <View style={styles.header}>
          <Image source={require('../../assets/logo.jpeg')} style={styles.avatar} />
          <Text style={styles.appName}>EventHub</Text>
          <TouchableOpacity style={styles.searchIcon} onPress={goToSearch}>
            <Ionicons name="search-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>
          Bonjour{dbUser?.organizationName ? `, ${dbUser.organizationName}` : ' 👋'}
        </Text>
        <Text style={styles.greetingSub}>
          Voici l'état actuel de vos événements technologiques aujourd'hui.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PUBLIÉS</Text>
            <Text style={styles.statValue}>{myEvents.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>EXPIRÉS</Text>
            <Text style={styles.statValue}>{expiredCount}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tous vos événements</Text>
          <TouchableOpacity onPress={goToOrganizerSearch}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [dbUser?.organizationName, expiredCount, goToOrganizerSearch, goToSearch, myEvents.length]
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyBox}>
        <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
        <Text style={styles.emptyText}>Aucun événement à afficher.</Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <FlatList
        data={myEvents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={goToCreate}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingBottom: Spacing.sm, gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: Colors.backgroundDark,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  appName: { flex: 1, fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primary },
  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  greeting: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
    marginTop: Spacing.sm,
  },
  greetingSub: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  seeAll: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  eventRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm + 4,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  eventThumb: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
  },
  eventInfo: { flex: 1, gap: 4 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  eventTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  actionsCol: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  editBtn: { padding: 6, backgroundColor: '#e0f2fe', borderRadius: 8 },
  delBtn: { padding: 6, backgroundColor: '#fee2e2', borderRadius: 8 },
  emptyBox: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  emptyText: { color: Colors.textSecondary, fontWeight: FontWeight.medium },
  fab: {
    position: 'absolute',
    bottom: 88,
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 99,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
});
