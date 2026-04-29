import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';

import { getEvents } from '../services/api';

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setAllEvents(data);
      setResults(data);
    } catch (error) {
      console.error('Failed to fetch events on search screen', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setResults(allEvents);
    } else {
      const filtered = allEvents.filter(item => 
        item.title.toLowerCase().includes(text.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(text.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(text.toLowerCase()))
      );
      setResults(filtered);
    }
  };

  const renderItem = ({ item }: any) => {
    const now = new Date();
    const start = new Date(item.date);
    const end = item.endDate ? new Date(item.endDate) : null;
    let status = 'Upcoming';
    if (now >= start) {
      if (!end || now <= end) status = 'Live';
      else status = 'Past';
    }

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('EventDetails', { event: item })}
      >
        <View style={styles.cardContent}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category || 'TECH'}</Text>
            </View>
            {status !== 'Past' && (
              <View style={[styles.statusBadge, status === 'Live' ? styles.statusLive : styles.statusUpcoming]}>
                <Text style={[styles.statusText, { color: status === 'Live' ? '#ef4444' : '#38bdf8' }]}>
                  {status === 'Live' ? 'LIVE' : 'À VENIR'}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta}>
            {new Date(item.date).toLocaleDateString('fr-FR')} • {item.location || 'En Ligne'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header with Search Input */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher événements, organisateurs..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('Filter')}>
          <Ionicons name="options-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchQuery === '' ? 'Recherches Populaires' : `Résultats pour "${searchQuery}"`}
          </Text>
          <Text style={styles.resultsCount}>{results.length} trouvé{results.length > 1 ? 's' : ''}</Text>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Aucun événement trouvé pour votre recherche.</Text>
            </View>
          }
        />
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
  filterBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Spacing.md },
  resultsTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' },
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
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: Colors.tagBg },
  categoryText: { fontSize: 10, fontWeight: FontWeight.bold, color: Colors.primary },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusLive: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  statusUpcoming: { backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  statusText: { fontSize: 9, fontWeight: '800' },
  cardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardMeta: { fontSize: FontSize.xs, color: Colors.textMuted },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100, gap: 16 },
  emptyText: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.md, paddingHorizontal: Spacing.xl },
});
