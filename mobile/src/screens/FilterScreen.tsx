import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Platform,
} from 'react-native';
import AppIcon from '../components/ui/AppIcon';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';

const CATEGORIES = ['All', 'Tech', 'Music', 'Business', 'Arts', 'Sports', 'Food'];
const TIMES = ['Today', 'Tomorrow', 'This Week', 'This Month'];

export default function FilterScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTime, setSelectedTime] = useState('This Week');

  const handleApply = () => {
    navigation.goBack();
  };

  const handleReset = () => {
    setSelectedCategory('All');
    setSelectedTime('This Week');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <AppIcon name="close" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  selectedCategory === cat && styles.chipActive
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.chipText,
                  selectedCategory === cat && styles.chipTextActive
                ]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time & Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time & Date</Text>
          <View style={styles.chipContainer}>
            {TIMES.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.chip,
                  selectedTime === time && styles.chipActive
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.chipText,
                  selectedTime === time && styles.chipTextActive
                ]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Range (Simplified) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceContainer}>
            <TouchableOpacity style={[styles.priceBtn, styles.priceBtnActive]}>
              <Text style={styles.priceBtnTextActive}>Free</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.priceBtn}>
              <Text style={styles.priceBtnText}>Paid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer / Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 20, 
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontFamily: Fonts.headerBold, color: Colors.primary },
  resetText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.semibold },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 100 },
  section: { marginVertical: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: BorderRadius.full, 
    borderWidth: 1, 
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: { 
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  chipTextActive: { color: Colors.white, fontWeight: FontWeight.bold },
  priceContainer: { flexDirection: 'row', gap: 12 },
  priceBtn: { flex: 1, height: 48, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  priceBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  priceBtnText: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  priceBtnTextActive: { fontSize: FontSize.md, color: Colors.white, fontWeight: FontWeight.bold },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: Spacing.md, 
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  applyBtn: { 
    backgroundColor: Colors.primary, 
    height: 56, 
    borderRadius: BorderRadius.lg, 
    alignItems: 'center', 
    justifyContent: 'center',
    ...Shadows.button,
  },
  applyBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.bold, letterSpacing: 1 },
});
