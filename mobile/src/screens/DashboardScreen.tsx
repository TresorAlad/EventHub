import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';

const BAR_DATA = [30, 55, 40, 80, 95, 60, 72];
const BAR_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const MY_EVENTS = [
  { status: 'LIVE', statusColor: '#22c55e', date: '24 Oct', title: 'Togo Tech Summit 2026', participants: '840/1000', revenue: '$42,000' },
  { status: 'DRAFT', statusColor: '#f59e0b', date: '12 Nov', title: 'AI & Ethics Workshop', participants: '0/50', countdown: 'In 21 days' },
  { status: 'ENDING SOON', statusColor: '#ef4444', date: '15 Oct', title: 'Lomé Hackathon 2025', participants: '200/200', note: 'Completed' },
];

export default function DashboardScreen({ navigation }: any) {
  const maxBar = Math.max(...BAR_DATA);

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

        <Text style={styles.greeting}>Bonjour, Organisateur 👋</Text>
        <Text style={styles.greetingSub}>Voici l'état actuel de vos événements technologiques aujourd'hui.</Text>

        {/* Main stat card */}
        <View style={styles.mainStatCard}>
          <View style={styles.mainStatHeader}>
            <Text style={styles.mainStatLabel}>PARTICIPANTS</Text>
            <View style={styles.trendBadge}>
              <Ionicons name="trending-up" size={12} color="#22c55e" />
              <Text style={styles.trendText}>12%</Text>
            </View>
          </View>
          <Text style={styles.mainStatValue}>1,284</Text>
          {/* Bar chart */}
          <View style={styles.barChart}>
            {BAR_DATA.map((val, i) => (
              <View key={i} style={styles.barGroup}>
                <View style={[
                  styles.bar,
                  { height: (val / maxBar) * 80 },
                  i === 4 && styles.barActive,
                ]} />
                <Text style={styles.barLabel}>{BAR_LABELS[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sub stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>VIEWS</Text>
            <Text style={styles.statValue}>12.5k</Text>
            <View style={styles.statTrendRow}>
              <Ionicons name="arrow-up" size={12} color={Colors.success} />
              <Text style={[styles.statTrend, { color: Colors.success }]}>+4%</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ACTIVE</Text>
            <Text style={styles.statValue}>342</Text>
            <View style={styles.statTrendRow}>
              <Ionicons name="arrow-down" size={12} color={Colors.danger} />
              <Text style={[styles.statTrend, { color: Colors.danger }]}>-2%</Text>
            </View>
          </View>
        </View>

        {/* Events list */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        {MY_EVENTS.map((ev, i) => (
          <View key={i} style={styles.eventRow}>
            <View style={styles.eventThumb} />
            <View style={styles.eventInfo}>
              <View style={styles.eventMeta}>
                <View style={[styles.statusBadge, { backgroundColor: ev.statusColor + '20' }]}>
                  <Text style={[styles.statusText, { color: ev.statusColor }]}>{ev.status}</Text>
                </View>
                <Text style={styles.eventDate}>{ev.date}</Text>
              </View>
              <Text style={styles.eventTitle}>{ev.title}</Text>
              <View style={styles.eventFooter}>
                <View style={styles.eventFooterItem}>
                  <Ionicons name="people-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.eventFooterText}>{ev.participants}</Text>
                </View>
                {ev.revenue && (
                  <View style={styles.eventFooterItem}>
                    <Ionicons name="card-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.eventFooterText}>{ev.revenue}</Text>
                  </View>
                )}
                {ev.countdown && (
                  <View style={styles.eventFooterItem}>
                    <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.eventFooterText}>{ev.countdown}</Text>
                  </View>
                )}
                {ev.note && (
                  <View style={styles.eventFooterItem}>
                    <Ionicons name="checkmark-circle-outline" size={13} color={Colors.success} />
                    <Text style={[styles.eventFooterText, { color: Colors.success }]}>{ev.note}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
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
  trendText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: '#22c55e' },
  mainStatValue: { fontSize: FontSize.display, fontWeight: FontWeight.extrabold, color: Colors.primary, marginBottom: Spacing.md },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, paddingTop: 10 },
  barGroup: { alignItems: 'center', gap: 4, flex: 1 },
  bar: { width: '60%', borderRadius: 6, backgroundColor: Colors.background, minHeight: 10 },
  barActive: { backgroundColor: Colors.primary },
  barLabel: { fontSize: 10, color: Colors.textMuted },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.card },
  statLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  statTrendRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  statTrend: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
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
  fab: { position: 'absolute', bottom: 88, right: Spacing.md, width: 56, height: 56, borderRadius: 99, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadows.button },
});
