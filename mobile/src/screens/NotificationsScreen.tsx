import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';

const NOTIFS_TODAY = [
  {
    id: '1',
    icon: 'checkmark-circle',
    iconBg: '#dcfce7',
    iconColor: '#22c55e',
    title: 'Registration Confirmed',
    body: 'Your spot for "Lomé AI Summit 2026" is secured. We sent the ticket to your email.',
    time: '2h ago',
    tag: 'TECH SUMMIT',
  },
  {
    id: '2',
    icon: 'calendar',
    iconBg: '#fce7f3',
    iconColor: '#ec4899',
    title: 'Tomorrow Reminder',
    body: 'Don\'t forget: "Fintech Founders Meetup" starts tomorrow at 09:00 AM at BlueZone Togo.',
    time: '5h ago',
    link: 'VIEW DETAILS',
  },
];

const NOTIFS_NEW = [
  {
    id: '3',
    icon: 'location',
    iconBg: '#fce7f3',
    iconColor: '#ec4899',
    title: 'Cybersecurity Workshop',
    body: 'Happening 2km away from your current location this weekend.',
    meta: 'Saturday, 14:00 • Hotel 2 Février',
    image: require('../../assets/onboarding1.png'),
    isNearby: true,
  },
  {
    id: '4',
    icon: 'rocket',
    iconBg: '#dcfce7',
    iconColor: '#22c55e',
    title: 'Startup Pitch Night',
    body: '5 new startups are pitching their ideas. Join the local ecosystem tonight.',
    time: 'Yesterday',
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar} />
          <Text style={styles.appName}>EventHub</Text>
          <TouchableOpacity style={styles.searchIcon}>
            <Ionicons name="search-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>Notifications</Text>
        <Text style={styles.pageSub}>Stay updated with your tech journey in Togo.</Text>

        {/* Today */}
        <Text style={styles.groupLabel}>TODAY</Text>
        {NOTIFS_TODAY.map((n) => (
          <View key={n.id} style={styles.notifCard}>
            <View style={[styles.iconCircle, { backgroundColor: n.iconBg }]}>
              <Ionicons name={n.icon as any} size={20} color={n.iconColor} />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                {n.time && <Text style={styles.notifTime}>{n.time}</Text>}
              </View>
              <Text style={styles.notifBody}>{n.body}</Text>
              {n.tag && (
                <View style={styles.notifTag}>
                  <Text style={styles.notifTagText}>{n.tag}</Text>
                </View>
              )}
              {n.link && (
                <TouchableOpacity>
                  <Text style={styles.notifLink}>{n.link} ›</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* New for you */}
        <Text style={[styles.groupLabel, { marginTop: Spacing.md }]}>NEW FOR YOU</Text>

        {/* Nearby image card */}
        {NOTIFS_NEW.filter(n => n.image).map((n) => (
          <View key={n.id} style={styles.nearbyCard}>
            <Image source={n.image} style={styles.nearbyImg} resizeMode="cover" />
            <View style={styles.nearbyBadge}>
              <Text style={styles.nearbyBadgeText}>NEW NEARBY</Text>
            </View>
          </View>
        ))}

        {NOTIFS_NEW.map((n) => (
          <View key={n.id} style={styles.notifCard}>
            <View style={[styles.iconCircle, { backgroundColor: n.iconBg }]}>
              <Ionicons name={n.icon as any} size={20} color={n.iconColor} />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                {n.time && <Text style={styles.notifTime}>{n.time}</Text>}
              </View>
              <Text style={styles.notifBody}>{n.body}</Text>
              {n.meta && <Text style={styles.notifMeta}>{n.meta}</Text>}
            </View>
          </View>
        ))}
      </ScrollView>
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
  pageTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.primary, marginTop: Spacing.sm },
  pageSub: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.md },
  groupLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 1.5, marginBottom: Spacing.sm },
  notifCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, flexDirection: 'row', gap: 14, ...Shadows.card },
  iconCircle: { width: 48, height: 48, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  notifContent: { flex: 1, gap: 4 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  notifTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, flex: 1 },
  notifTime: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 8 },
  notifBody: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  notifTag: { alignSelf: 'flex-start', backgroundColor: Colors.inputBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, marginTop: 4 },
  notifTagText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textMuted, letterSpacing: 0.5 },
  notifLink: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary, marginTop: 4 },
  notifMeta: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold, marginTop: 2 },
  nearbyCard: { borderRadius: BorderRadius.lg, overflow: 'hidden', height: 140, marginBottom: Spacing.sm, position: 'relative' },
  nearbyImg: { width: '100%', height: '100%' },
  nearbyBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.full },
  nearbyBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1 },
});
