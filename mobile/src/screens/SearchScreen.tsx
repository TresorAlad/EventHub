import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AppIcon from '../components/ui/AppIcon';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';
import { useEventsQuery } from '../lib/queries';

const computeStatus = (item: any): 'Upcoming' | 'Live' | 'Past' => {
  const now = new Date();
  const start = item?.date ? new Date(item.date) : now;
  const end = item?.endDate ? new Date(item.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
  if (now > end) return 'Past';
  if (now >= start && now <= end) return 'Live';
  return 'Upcoming';
};

export default function SearchScreen({ route, navigation }: any) {
  const organizerId = route?.params?.organizerId;
  const initialQuery = route?.params?.initialQuery ?? '';
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [debounced, setDebounced] = useState<string>(initialQuery);

  const { data: events = [], isLoading } = useEventsQuery();

  // Debounce 200ms : évite de re-filtrer 1500 items à chaque frappe.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery), 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const baseList = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return organizerId ? events.filter((e: any) => e.organizerId === organizerId) : events;
  }, [events, organizerId]);

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return baseList;
    return baseList.filter(
      (item: any) =>
        (item?.title || '').toLowerCase().includes(q) ||
        (item?.category || '').toLowerCase().includes(q) ||
        (item?.location || '').toLowerCase().includes(q)
    );
  }, [baseList, debounced]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const goToFilter = useCallback(() => navigation.navigate('Filter'), [navigation]);
  const openDetails = useCallback(
    (event: any) => navigation.navigate('EventDetails', { event }),
    [navigation]
  );

  const keyExtractor = useCallback((item: any) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const status = computeStatus(item);
      const start = new Date(item.date);
      return (
        <TouchableOpacity style={styles.card} onPress={() => openDetails(item)} activeOpacity={0.85}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category || 'TECH'}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  status === 'Live'
                    ? styles.statusLive
                    : status === 'Past'
                      ? styles.statusExpired
                      : styles.statusUpcoming,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        status === 'Live'
                          ? '#ef4444'
                          : status === 'Past'
                            ? '#64748b'
                            : '#38bdf8',
                    },
                  ]}
                >
                  {status === 'Live' ? 'LIVE' : status === 'Past' ? 'PASSÉ' : 'À VENIR'}
                </Text>
              </View>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardMeta}>
              {start.toLocaleDateString('fr-FR')} • {item.location || 'En Ligne'}
            </Text>
          </View>
          <AppIcon name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      );
    },
    [openDetails]
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <AppIcon name="search-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.emptyText}>
          {isLoading ? 'Chargement...' : 'Aucun événement trouvé pour votre recherche.'}
        </Text>
      </View>
    ),
    [isLoading]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <AppIcon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <AppIcon name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              organizerId ? 'Rechercher dans vos événements...' : 'Rechercher événements, organisateurs...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AppIcon name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={goToFilter}>
          <AppIcon name="options-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {debounced === ''
              ? organizerId
                ? 'Tous vos événements'
                : 'Recherches Populaires'
              : `Résultats pour "${debounced}"`}
          </Text>
          <Text style={styles.resultsCount}>
            {results.length} trouvé{results.length > 1 ? 's' : ''}
          </Text>
        </View>

        {isLoading && results.length === 0 ? (
          <View style={styles.loaderRoot}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmpty}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={9}
            removeClippedSubviews
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: 12,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: 8,
    ...Shadows.card,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontFamily: Fonts.regular },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  resultsTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  resultsCount: { fontSize: FontSize.xs, color: Colors.primaryLight, fontWeight: FontWeight.semibold },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  cardContent: { flex: 1, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: Colors.tagBg,
  },
  categoryText: { fontSize: 10, fontWeight: FontWeight.bold, color: Colors.primary },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusLive: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  statusUpcoming: { backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  statusExpired: { backgroundColor: 'rgba(100, 116, 139, 0.12)' },
  statusText: { fontSize: 9, fontWeight: '800' },
  cardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardMeta: { fontSize: FontSize.xs, color: Colors.textMuted },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100, gap: 16 },
  emptyText: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.md, paddingHorizontal: Spacing.xl },
  loaderRoot: { paddingVertical: 60, alignItems: 'center' },
});
