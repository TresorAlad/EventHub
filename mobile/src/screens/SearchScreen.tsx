import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';

const MOCK_RESULTS = [
  { id: '1', title: 'Lomé Tech Summit 2026', date: 'Oct 12', location: 'Palais des Congrès', category: 'Tech' },
  { id: '2', title: 'Festival des Arts de Lomé', date: 'Nov 05', location: 'Institut Français', category: 'Culture' },
  { id: '3', title: 'Startup Weekend Togo', date: 'Sep 28', location: 'Bluezone Lomé', category: 'Business' },
];

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(MOCK_RESULTS);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setResults(MOCK_RESULTS);
    } else {
      const filtered = MOCK_RESULTS.filter(item => 
        item.title.toLowerCase().includes(text.toLowerCase()) ||
        item.category.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <View style={styles.cardContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>{item.date} • {item.location}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );

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
            placeholder="Search events, organizers..."
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
            {searchQuery === '' ? 'Popular Searches' : `Results for "${searchQuery}"`}
          </Text>
          <Text style={styles.resultsCount}>{results.length} found</Text>
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
              <Text style={styles.emptyText}>No events found matching your search.</Text>
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
  cardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardMeta: { fontSize: FontSize.xs, color: Colors.textMuted },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100, gap: 16 },
  emptyText: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.md, paddingHorizontal: Spacing.xl },
});
