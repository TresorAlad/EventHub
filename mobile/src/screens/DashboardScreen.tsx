import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import React, { useEffect, useMemo, useState } from 'react';
import { getEvents, deleteEvent } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function DashboardScreen({ navigation }: any) {
  const { dbUser } = useAuth();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getEvents();
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        // non-blocking
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const myEvents = useMemo(() => {
    if (!dbUser?.id) return [];
    return events.filter((e) => e?.organizerId === dbUser.id);
  }, [events, dbUser?.id]);

  const statusOf = (item: any) => {
    const now = new Date();
    const start = item?.date ? new Date(item.date) : now;
    const end = item?.endDate ? new Date(item.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
    if (now > end) return 'Expired';
    if (now >= start && now <= end) return 'Live';
    return 'Upcoming';
  };

  const isOlderThan7Days = (item: any) => {
    const now = new Date();
    const start = item?.date ? new Date(item.date) : now;
    const end = item?.endDate ? new Date(item.endDate) : null;
    const endTime = end || start;
    return now.getTime() - endTime.getTime() > 7 * 24 * 60 * 60 * 1000;
  };

  // Dashboard organisateur: on garde même les expirés, mais on peut cacher ceux > 7 jours sur la vue "Accueil"
  const visibleMyEvents = myEvents.filter((e) => !(statusOf(e) === 'Expired' && isOlderThan7Days(e) && false));

  const handleDelete = (eventId: string) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous vraiment supprimer cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              setEvents((prev) => prev.filter((e) => e.id !== eventId));
            } catch (err: any) {
              Alert.alert('Erreur', 'Impossible de supprimer cet événement.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.jpeg')}
            style={styles.avatar}
          />
          <Text style={styles.appName}>EventHub</Text>
          <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>Bonjour{dbUser?.organizationName ? `, ${dbUser.organizationName}` : ' 👋'}</Text>
        <Text style={styles.greetingSub}>Voici l'état actuel de vos événements technologiques aujourd'hui.</Text>

        {/* Stats simples */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PUBLIÉS</Text>
            <Text style={styles.statValue}>{myEvents.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>EXPIRÉS</Text>
            <Text style={styles.statValue}>{myEvents.filter((e) => statusOf(e) === 'Expired').length}</Text>
          </View>
        </View>

        {/* Events list */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tous vos événements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search', { organizerId: dbUser?.id })}><Text style={styles.seeAll}>Voir tout</Text></TouchableOpacity>
        </View>

        {visibleMyEvents.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Aucun événement à afficher.</Text>
          </View>
        ) : (
          visibleMyEvents.map((ev) => (
            <TouchableOpacity
              key={ev.id}
              style={styles.eventRow}
              onPress={() => navigation.navigate('OrganizerEventDashboard', { event: ev })}
              activeOpacity={0.85}
            >
              <Image 
                source={ev.imageUrl ? { uri: ev.imageUrl } : require('../../assets/onboarding1.png')} 
                style={styles.eventThumb} 
              />
              <View style={styles.eventInfo}>
                <View style={styles.eventMeta}>
                  <View
                    style={[
                      styles.statusBadge,
                      statusOf(ev) === 'Live'
                        ? { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                        : statusOf(ev) === 'Expired'
                          ? { backgroundColor: 'rgba(100, 116, 139, 0.12)' }
                          : { backgroundColor: 'rgba(56, 189, 248, 0.1)' },
                    ]}
                  >
                    <Text style={[styles.statusText, statusOf(ev) === 'Live' ? { color: '#ef4444' } : statusOf(ev) === 'Expired' ? { color: '#64748b' } : { color: '#0ea5e9' }]}>
                      {statusOf(ev) === 'Live' ? 'LIVE' : statusOf(ev) === 'Expired' ? 'EXPIRÉ' : 'À VENIR'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.eventTitle} numberOfLines={2}>{ev.title}</Text>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center', gap: 10, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.navigate('CreateEvent', { event: ev })} style={{ padding: 6, backgroundColor: '#e0f2fe', borderRadius: 8 }}>
                  <Ionicons name="pencil-outline" size={20} color="#0ea5e9" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(ev.id)} style={{ padding: 6, backgroundColor: '#fee2e2', borderRadius: 8 }}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEvent')}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingBottom: Spacing.sm, gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 99, backgroundColor: Colors.backgroundDark, borderWidth: 2, borderColor: Colors.primary },
  appName: { flex: 1, fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primary },
  searchIcon: { width: 40, height: 40, borderRadius: 99, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  greeting: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.primary, marginTop: Spacing.sm },
  greetingSub: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.lg, lineHeight: 22 },
  mainStatCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.card },
  mainStatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  mainStatLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 1 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  mainStatValue: { fontSize: FontSize.display, fontWeight: FontWeight.extrabold, color: Colors.primary, marginBottom: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.card },
  statLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  seeAll: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  eventRow: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.sm + 4, marginBottom: Spacing.sm, gap: Spacing.sm, ...Shadows.card },
  eventThumb: { width: 72, height: 72, borderRadius: BorderRadius.md, backgroundColor: Colors.backgroundDark },
  eventInfo: { flex: 1, gap: 4 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  eventDate: { fontSize: FontSize.xs, color: Colors.textMuted },
  eventTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  eventFooter: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  eventFooterItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  eventFooterText: { fontSize: FontSize.xs, color: Colors.textMuted },
  emptyBox: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.card, flexDirection: 'row', gap: 10, alignItems: 'center' },
  emptyText: { color: Colors.textSecondary, fontWeight: FontWeight.medium },
  fab: { position: 'absolute', bottom: 88, right: Spacing.md, width: 56, height: 56, borderRadius: 99, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadows.button },
});
