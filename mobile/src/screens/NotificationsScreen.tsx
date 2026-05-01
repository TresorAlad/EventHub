import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';

export default function NotificationsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar} />
          <Text style={styles.appName}>EventHub</Text>
          <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>Notifications</Text>
        <Text style={styles.pageSub}>Stay updated with your tech journey in Togo.</Text>

        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Aucune notification</Text>
          <Text style={styles.emptyBody}>
            Les notifications apparaîtront ici quand vous recevrez des alertes liées à vos événements.
          </Text>
        </View>
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
  emptyState: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginTop: Spacing.md, ...Shadows.card, alignItems: 'center', gap: 10 },
  emptyIcon: { width: 44, height: 44, borderRadius: 99, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primary },
  emptyBody: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, textAlign: 'center' },
});
