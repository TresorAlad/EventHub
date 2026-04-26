import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';

const CATEGORIES = ['Innovation & Fintech', 'Hackathon', 'Meetup', 'Workshop', 'Conférence', 'Pitch Night'];

export default function CreateEventScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Innovation & Fintech');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showCatPicker, setShowCatPicker] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EventHub</Text>
        <View style={styles.avatar} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Create New Event</Text>
        <Text style={styles.pageSubtitle}>Host your next innovation hub and connect with Togo's tech ecosystem.</Text>

        {/* Upload Cover */}
        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
          <Ionicons name="image-outline" size={36} color={Colors.primary} />
          <Text style={styles.uploadTitle}>UPLOAD EVENT COVER</Text>
          <Text style={styles.uploadSub}>Recommended: 16:9 ratio</Text>
        </TouchableOpacity>

        {/* Event Title */}
        <View style={styles.field}>
          <Text style={styles.label}>EVENT TITLE</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Lomé Tech Summit 2026"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.label}>CATEGORY</Text>
          <TouchableOpacity style={[styles.inputBox, styles.selectBox]} onPress={() => setShowCatPicker(!showCatPicker)}>
            <Text style={styles.selectText}>{category}</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
          {showCatPicker && (
            <View style={styles.dropdown}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat} style={styles.dropdownItem} onPress={() => { setCategory(cat); setShowCatPicker(false); }}>
                  <Text style={[styles.dropdownText, cat === category && styles.dropdownTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date & Time */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>DATE</Text>
            <View style={styles.inputBox}>
              <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="mm/dd/yy" placeholderTextColor={Colors.textMuted} />
            </View>
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>TIME</Text>
            <View style={styles.inputBox}>
              <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="--:-- --" placeholderTextColor={Colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={styles.label}>LOCATION</Text>
          <View style={[styles.inputBox, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
            <TextInput style={[styles.input, { flex: 1 }]} value={location} onChangeText={setLocation} placeholder="Venue or Digital Link" placeholderTextColor={Colors.textMuted} />
          </View>
        </View>

        {/* Description */}
        <View style={[styles.field, { marginBottom: 32 }]}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <View style={[styles.inputBox, { borderRadius: BorderRadius.lg, paddingVertical: 16 }]}>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the mission of your event..."
              placeholderTextColor={Colors.textMuted}
              multiline
            />
          </View>
        </View>

        {/* Publish Button */}
        <TouchableOpacity style={styles.publishBtn} activeOpacity={0.88}>
          <Ionicons name="send" size={18} color={Colors.white} />
          <Text style={styles.publishText}>Publish Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  backBtn: { width: 38, height: 38, borderRadius: 99, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primary },
  avatar: { width: 38, height: 38, borderRadius: 99, backgroundColor: Colors.backgroundDark, borderWidth: 2, borderColor: Colors.primary },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 40 },
  pageTitle: { fontSize: FontSize.xxl + 4, fontWeight: FontWeight.extrabold, color: Colors.primary, marginTop: Spacing.sm },
  pageSubtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 6, marginBottom: Spacing.lg, lineHeight: 22 },
  uploadBox: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(3,4,94,0.03)',
    marginBottom: Spacing.lg,
  },
  uploadTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary, letterSpacing: 1 },
  uploadSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  field: { gap: 8, marginBottom: Spacing.md },
  label: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textPrimary, letterSpacing: 1 },
  inputBox: { backgroundColor: Colors.white, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 18 },
  input: { fontSize: FontSize.md, color: Colors.textPrimary, paddingVertical: 16 },
  selectBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  selectText: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  dropdown: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, marginTop: 4, overflow: 'hidden', ...Shadows.card },
  dropdownItem: { paddingVertical: 13, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: Colors.border },
  dropdownText: { fontSize: FontSize.md, color: Colors.textSecondary },
  dropdownTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  row: { flexDirection: 'row', gap: Spacing.sm },
  publishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingVertical: 18, ...Shadows.button, marginBottom: 20,
  },
  publishText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
});
