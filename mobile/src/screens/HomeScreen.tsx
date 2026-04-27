import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';
import CategoryChip from '../components/CategoryChip';
import TrendingCard from '../components/TrendingCard';
import EventCard from '../components/EventCard';

const CATEGORIES = ['Hackathon', 'Meetup', 'Workshop', 'Conférence', 'Pitch'];

const TRENDING = [
  {
    id: '1',
    category: 'HACKATHON',
    title: 'Togo AI Summit 2026',
    subtitle: 'LOME • SUMMIT',
    date: '12 Oct',
    time: '09:00',
    image: require('../../assets/onboarding1.png'),
  },
  {
    id: '2',
    category: 'STARTUP',
    title: 'Lomé Startup Weekend',
    subtitle: 'LOME',
    date: '18 Oct',
    time: '08:00',
    image: require('../../assets/onboarding1.png'),
  },
];

const UPCOMING = [
  {
    id: '1',
    category: 'WORKSHOP',
    title: 'Fullstack React Masterclass',
    time: 'Demain, 14:00',
    price: 'Gratuit',
    image: require('../../assets/onboarding1.png'),
  },
  {
    id: '2',
    category: 'MEETUP',
    title: 'Fintech Trends 2026',
    location: 'Hotel du 2 Février',
    time: 'Ven, 18:00',
    price: '5.000 FCFA',
    image: require('../../assets/onboarding1.png'),
  },
  {
    id: '3',
    category: 'CONFÉRENCE',
    title: 'Women in Tech Togo',
    time: 'Sam, 09:00',
    price: 'Gratuit',
    image: require('../../assets/onboarding1.png'),
  },
];

export default function HomeScreen({ navigation, route }: any) {
  const [activeCategory, setActiveCategory] = useState('Hackathon');
  const userType = route.params?.userType || 'User';
  const isOrganizer = userType === 'Organizer';

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
          <TouchableOpacity style={styles.searchIcon} onPress={() => Alert.alert('Search', 'Ouverture de la recherche...')}>
            <Ionicons name="search-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero greeting */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Bonjour, {isOrganizer ? 'Organisateur' : 'Kodjo'} 👋{'\n'}Découvrons les{'\n'}événements du jour</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des hackathons, pitchs..."
            placeholderTextColor={Colors.textMuted}
          />
          <TouchableOpacity style={styles.filterBtn} onPress={() => Alert.alert('Filtres', 'Ouverture des filtres...')}>
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

        {/* Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>En Tendance</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TRENDING.map((item) => (
              <TrendingCard
                key={item.id}
                category={item.category}
                title={item.title}
                subtitle={item.subtitle}
                date={item.date}
                time={item.time}
                image={item.image}
                onPress={() => navigation.navigate('EventDetails', { event: item })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Upcoming */}
        <View style={[styles.section, { paddingBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Événements à Venir</Text>
          {UPCOMING.map((item) => (
            <EventCard
              key={item.id}
              category={item.category}
              title={item.title}
              time={item.time}
              location={item.location}
              price={item.price}
              image={item.image}
              onPress={() => navigation.navigate('EventDetails', { event: item })}
            />
          ))}
        </View>
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
