import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  StatusBar,
} from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Découvre les meilleurs\névénements ',
    highlight: 'tech',
    titleEnd: ' du\nTogo',
    description: "Rejoignez la plus grande communauté d'innovation et accédez aux meetups, conférences et hackathons locaux.",
    image: require('../../assets/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Connecte-toi avec les\nmeilleurs ',
    highlight: 'innovateurs',
    titleEnd: '\ndu pays',
    description: 'Rencontre les entrepreneurs, développeurs et créateurs qui façonnent l\'écosystème tech togolais.',
    image: require('../../assets/onboarding1.png'),
  },
  {
    id: '3',
    title: 'Crée et partage tes\npropres ',
    highlight: 'événements',
    titleEnd: '\nfacilment',
    description: 'En quelques clics, publie ton meetup, workshop ou hackathon et touche toute la communauté tech.',
    image: require('../../assets/onboarding1.png'),
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      navigation.replace('SignIn');
    }
  };

  const handleSkip = () => navigation.replace('SignIn');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>EventHub</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skip}>SKIP</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
            </View>
          </View>
        )}
      />

      {/* Bottom card */}
      <View style={styles.bottomCard}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>

        <Text style={styles.title}>
          {slides[activeIndex].title}
          <Text style={styles.highlight}>{slides[activeIndex].highlight}</Text>
          {slides[activeIndex].titleEnd}
        </Text>
        <Text style={styles.description}>{slides[activeIndex].description}</Text>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.88}>
          <Text style={styles.nextBtnText}>
            {activeIndex === slides.length - 1 ? "C'est parti 🚀" : 'Suivant →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 52,
    paddingBottom: Spacing.sm,
  },
  logo: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
  },
  skip: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  slide: {
    width,
    paddingHorizontal: Spacing.md,
  },
  imageContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    height: height * 0.35,
    backgroundColor: '#1a1a2e',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 28,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    lineHeight: 34,
  },
  highlight: {
    color: Colors.primaryLight,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 4,
  },
  nextBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
