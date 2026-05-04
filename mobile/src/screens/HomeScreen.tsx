import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';
import CategoryChip from '../components/CategoryChip';
import TrendingCard from '../components/TrendingCard';
import EventCard from '../components/EventCard';
import { useEventsQuery } from '../lib/queries';
import { useAuth } from '../hooks/useAuth';
import { Image as ExpoImage } from 'expo-image';

const CATEGORIES = ['Tous', 'Hackathon', 'Meetup', 'Workshop', 'Conférence', 'Pitch'];

const computeStatus = (item: any): 'Upcoming' | 'Live' | 'Past' => {
  const now = new Date();
  const start = item?.date ? new Date(item.date) : now;
  const end = item?.endDate ? new Date(item.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
  if (now > end) return 'Past';
  if (now >= start && now <= end) return 'Live';
  return 'Upcoming';
};

const pastAgeMs = (item: any) => {
  const start = item?.date ? new Date(item.date) : new Date();
  const end = item?.endDate ? new Date(item.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
  return Date.now() - end.getTime();
};
const isPast = (item: any) => computeStatus(item) === 'Past';
const isHiddenOnHome = (item: any) => isPast(item) && pastAgeMs(item) > 7 * 24 * 60 * 60 * 1000;

const FALLBACK_IMG = require('../../assets/onboarding_tech_1.png');

export default function HomeScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const { dbUser } = useAuth();
  const isOrganizer = dbUser?.role === 'ORGANIZER' || dbUser?.role === 'ADMIN';

  const { data: events = [], isLoading, isRefetching, refetch } = useEventsQuery();

  // Filtrage stable et mémoïsé : évite les recalculs à chaque scroll/render.
  const visibleEvents = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    return list.filter((e) => !isHiddenOnHome(e));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const byCategory =
      activeCategory === 'Tous'
        ? visibleEvents
        : visibleEvents.filter(
            (e: any) => (e?.category || '').toString().toLowerCase() === activeCategory.toLowerCase()
          );
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter(
      (e: any) =>
        (e?.title || '').toLowerCase().includes(q) ||
        (e?.location || '').toLowerCase().includes(q) ||
        (e?.category || '').toLowerCase().includes(q)
    );
  }, [visibleEvents, activeCategory, searchQuery]);

  const trendingEvents = useMemo(() => filteredEvents.slice(0, 6), [filteredEvents]);
  const upcomingEvents = useMemo(() => filteredEvents.slice(0, 30), [filteredEvents]);

  // Prefetch best-effort des images visibles : rend les retours navigation instantanés.
  useEffect(() => {
    const urls = [...trendingEvents, ...upcomingEvents]
      .slice(0, 20)
      .map((e: any) => e?.imageUrl)
      .filter((u: any) => typeof u === 'string' && u.length > 0);
    if (urls.length === 0) return;
    urls.forEach((u: string) => {
      ExpoImage.prefetch(u).catch(() => undefined);
    });
  }, [trendingEvents, upcomingEvents]);

  // Handlers stables : évitent les re-renders en cascade dans la FlatList.
  const goToDetails = useCallback(
    (event: any) => navigation.navigate('EventDetails', { event }),
    [navigation]
  );
  const goToSearch = useCallback(() => navigation.navigate('Search'), [navigation]);
  const goToFilter = useCallback(() => navigation.navigate('Filter'), [navigation]);
  const goToCreate = useCallback(() => navigation.navigate('CreateEvent'), [navigation]);

  // RenderItem mémoïsé : indispensable pour ne pas casser la virtualisation FlatList.
  const renderEvent = useCallback(
    ({ item }: { item: any }) => {
      const status = computeStatus(item);
      const start = new Date(item.date);
      return (
        <EventCard
          category={item.category || 'Tech'}
          title={item.title}
          location={item.location || 'Lomé'}
          time={start.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
          price={item.price > 0 ? `${item.price} FCFA` : 'Gratuit'}
          image={item.imageUrl ? { uri: item.imageUrl } : FALLBACK_IMG}
          status={status}
          onPress={() => goToDetails(item)}
        />
      );
    },
    [goToDetails]
  );

  const keyExtractor = useCallback((item: any) => String(item.id), []);

  const renderTrending = useCallback(
    ({ item }: { item: any }) => {
      const status = computeStatus(item);
      const start = new Date(item.date);
      return (
        <TrendingCard
          category={item.category || 'Tech'}
          title={item.title}
          subtitle={item.location || 'Lomé'}
          date={start.toLocaleDateString([], { day: '2-digit', month: 'short' })}
          time={start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          image={item.imageUrl ? { uri: item.imageUrl } : FALLBACK_IMG}
          status={status}
          onPress={() => goToDetails(item)}
        />
      );
    },
    [goToDetails]
  );

  // ListHeader mémoïsé : tout le haut (greeting, search, chips, trending)
  // ne se re-render que si ses inputs changent réellement.
  const ListHeader = useMemo(
    () => (
      <View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../../assets/logo.jpeg')} style={styles.avatar} />
            <Text style={styles.appName}>EventHub</Text>
          </View>
          <TouchableOpacity style={styles.searchIcon} onPress={goToSearch}>
            <Ionicons name="search-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Bonjour, {dbUser?.name || 'Explorateur'} 👋{'\n'}Découvrons les{'\n'}événements du jour
          </Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des hackathons, pitchs..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => navigation.navigate('Search', { initialQuery: searchQuery })}
          />
          <TouchableOpacity style={styles.filterBtn} onPress={goToFilter}>
            <Ionicons name="options-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explorer par Catégories</Text>
          <FlatList
            data={CATEGORIES}
            horizontal
            keyExtractor={(c) => c}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
            renderItem={({ item: cat }) => (
              <CategoryChip
                label={cat}
                active={activeCategory === cat}
                onPress={() => setActiveCategory(cat)}
              />
            )}
          />
        </View>

        {trendingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>En Tendance</Text>
              <TouchableOpacity onPress={goToSearch}>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={trendingEvents}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderTrending}
              initialNumToRender={3}
              maxToRenderPerBatch={4}
              windowSize={5}
              removeClippedSubviews
            />
          </View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: Spacing.sm }]}>Événements à Venir</Text>
      </View>
    ),
    [
      activeCategory,
      dbUser?.name,
      goToFilter,
      goToSearch,
      keyExtractor,
      navigation,
      renderTrending,
      searchQuery,
      trendingEvents,
    ]
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={{ color: Colors.textMuted }}>
          {searchQuery ? 'Aucun résultat pour cette recherche.' : "Pas d'événements à venir."}
        </Text>
      </View>
    ),
    [searchQuery]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {isLoading && upcomingEvents.length === 0 ? (
        <View style={styles.loaderRoot}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={upcomingEvents}
          keyExtractor={keyExtractor}
          renderItem={renderEvent}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          // Optims virtualisation : limite la fenêtre rendue, recycle les vues hors-écran.
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
      )}

      {isOrganizer && dbUser && (
        <TouchableOpacity style={styles.fab} onPress={goToCreate} activeOpacity={0.88}>
          <Ionicons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 110 },
  loaderRoot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { paddingVertical: Spacing.lg, alignItems: 'center' },
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.headerBold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  seeAll: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  chipsScroll: { paddingRight: Spacing.md },
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
