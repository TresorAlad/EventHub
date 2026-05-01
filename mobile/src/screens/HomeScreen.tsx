import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';
import CategoryChip from '../components/CategoryChip';
import TrendingCard from '../components/TrendingCard';
import EventCard from '../components/EventCard';
import { getEvents } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const CATEGORIES = ['Hackathon', 'Meetup', 'Workshop', 'Conférence', 'Pitch'];

// Real data is now fetched from the backend

export default function HomeScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState('Hackathon');
  const { dbUser } = useAuth();
  const isOrganizer = dbUser?.role === 'ORGANIZER' || dbUser?.role === 'ADMIN';

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (item: any) => {
    const now = new Date();
    const start = item?.date ? new Date(item.date) : now;
    const end = item?.endDate ? new Date(item.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
    return now > end;
  };

  // Accueil: on enlève les événements expirés
  const visibleEvents = events.filter((e) => !isExpired(e));
  const trendingEvents = visibleEvents.slice(0, 3);
  const upcomingEvents = visibleEvents.slice(3, 10);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/logo.jpeg')}
              style={styles.avatar}
            />
            <Text style={styles.appName}>EventHub</Text>
          </View>
          <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero greeting */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Bonjour, {dbUser?.name || 'Explorateur'} 👋{'\n'}Découvrons les{'\n'}événements du jour
          </Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des hackathons, pitchs..."
            placeholderTextColor={Colors.textMuted}
          />
          <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('Filter')}>
            <Ionicons name="options-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explorer par Catégories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onPress={() => setActiveCategory(cat)}
              />
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            {/* Trending */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>En Tendance</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                  <Text style={styles.seeAll}>Voir tout</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trendingEvents.length > 0 ? trendingEvents.map((item) => {
                  const now = new Date();
                  const start = new Date(item.date);
                  const end = item.endDate ? new Date(item.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
                  let status = 'Upcoming';
                  if (now > end) {
                    status = 'Expired';
                  } else if (now >= start && now <= end) {
                    status = 'Live';
                  }

                  return (
                    <TrendingCard
                      key={item.id}
                      category={item.category || 'Tech'}
                      title={item.title}
                      subtitle={item.location || 'Lomé'}
                      date={new Date(item.date).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                      time={new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      image={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/onboarding1.png')}
                      status={status}
                      onPress={() => navigation.navigate('EventDetails', { event: item })}
                    />
                  );
                }) : (
                  <Text style={{ color: Colors.textMuted }}>Aucun événement en tendance</Text>
                )}
              </ScrollView>
            </View>

            {/* Upcoming */}
            <View style={[styles.section, { paddingBottom: 100 }]}>
              <Text style={styles.sectionTitle}>Événements à Venir</Text>
              {upcomingEvents.length > 0 ? upcomingEvents.map((item) => {
                const now = new Date();
                const start = new Date(item.date);
                const end = item.endDate ? new Date(item.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
                let status = 'Upcoming';
                if (now > end) {
                  status = 'Expired';
                } else if (now >= start && now <= end) {
                  status = 'Live';
                }

                return (
                  <EventCard
                    key={item.id}
                    category={item.category || 'Tech'}
                    title={item.title}
                    location={item.location || 'Lomé'}
                    time={new Date(item.date).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                    price={item.price > 0 ? `${item.price} FCFA` : 'Gratuit'}
                    image={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/onboarding1.png')}
                    status={status}
                    onPress={() => navigation.navigate('EventDetails', { event: item })}
                  />
                )
              }) : (
                <Text style={{ color: Colors.textMuted }}>Pas d'événements à venir</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* FAB - Only for organizers */}
      {isOrganizer && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateEvent')}
          activeOpacity={0.88}
        >
          <Ionicons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: Spacing.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 99,
    backgroundColor: Colors.backgroundDark,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  appName: { fontSize: FontSize.lg, fontFamily: Fonts.headerExtraBold, color: Colors.primary },
  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  hero: { marginVertical: Spacing.md },
  heroTitle: {
    fontSize: FontSize.xxl + 2,
    fontFamily: Fonts.headerExtraBold,
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 10,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  searchInput: { flex: 1, fontSize: FontSize.sm, fontFamily: Fonts.regular, color: Colors.textPrimary },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.xl, fontFamily: Fonts.headerBold, color: Colors.primary, marginBottom: Spacing.sm },
  seeAll: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  chipsScroll: { marginHorizontal: -Spacing.md, paddingHorizontal: Spacing.md },
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
