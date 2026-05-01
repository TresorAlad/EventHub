import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { getEventStats } from '../services/api';

export default function OrganizerEventDashboardScreen({ route, navigation }: any) {
  const { event } = route.params;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getEventStats(event.id);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch event stats', error);
    } finally {
      setLoading(false);
    }
  };

  const renderParticipant = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <Image
        source={item.profileImage ? { uri: item.profileImage } : require('../../assets/logo.jpeg')}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Tableau de bord : {event.title}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Statistiques Rapides */}
          <Text style={styles.sectionTitle}>Statistiques Rapides</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={28} color="#0ea5e9" />
              <Text style={styles.statValue}>{stats?.registrations || 0}</Text>
              <Text style={styles.statLabel}>Inscriptions</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="heart" size={28} color="#ef4444" />
              <Text style={styles.statValue}>{stats?.favorites || 0}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="share-social" size={28} color="#10b981" />
              <Text style={styles.statValue}>{stats?.shares || 0}</Text>
              <Text style={styles.statLabel}>Partages</Text>
            </View>
          </View>

          {/* Liste des Participants */}
          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Participants ({stats?.participants?.length || 0})</Text>
          
          {stats?.participants?.length > 0 ? (
            <FlatList
              data={stats.participants}
              keyExtractor={(item) => item.id}
              renderItem={renderParticipant}
              scrollEnabled={false} // FlatList inside ScrollView
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="person-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Aucun inscrit pour le moment.</Text>
            </View>
          )}
        </ScrollView>
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
    paddingHorizontal: 20 
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.white, flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 15 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { 
    backgroundColor: Colors.white, 
    width: '30%', 
    paddingVertical: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    ...Shadows.card 
  },
  statValue: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginTop: 10, marginBottom: 5 },
  statLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.white, 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    ...Shadows.card 
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 15 },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  userEmail: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  dateText: { fontSize: 12, color: Colors.textMuted },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: Colors.white, borderRadius: 16 },
  emptyText: { marginTop: 15, color: Colors.textMuted, fontSize: 15, textAlign: 'center' }
});
