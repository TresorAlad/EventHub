import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, StatusBar, Image, Alert,
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

  const handlePublish = () => {
    if (!title || !date || !location) {
      Alert.alert('Champs manquants', "S'il vous plaît, remplissez au moins le titre, la date et le lieu.");
      return;
    }
    Alert.alert('Félicitations !', 'Votre événement a été créé avec succès et est en attente de validation.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  // New logic fields
  const [isExternal, setIsExternal] = useState(false);
  const [externalLink, setExternalLink] = useState('');
  const [participationMode, setParticipationMode] = useState<'online' | 'in-person'>('in-person');
  const [onlineLink, setOnlineLink] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EventHub</Text>
        <Image source={require('../../assets/logo.jpeg')} style={styles.avatar} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Créer un événement</Text>
        <Text style={styles.pageSubtitle}>Propulsez l'innovation au Togo en partageant votre événement.</Text>

        {/* External Platform Question */}
        <View style={styles.logicCard}>
          <View style={styles.logicRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.logicTitle}>Déjà publié ailleurs ?</Text>
              <Text style={styles.logicSub}>Si oui, le bouton redirigera vers votre site.</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setIsExternal(!isExternal)}
              style={[styles.toggle, isExternal && styles.toggleActive]}
            >
              <View style={[styles.toggleCircle, isExternal && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>
          
          {isExternal && (
            <View style={[styles.field, { marginTop: 15 }]}>
              <Text style={styles.label}>LIEN D'INSCRIPTION EXTERNE</Text>
              <View style={styles.inputBox}>
                <TextInput 
                  style={styles.input} 
                  value={externalLink} 
                  onChangeText={setExternalLink} 
                  placeholder="https://votre-site.com/inscription"
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}
        </View>

        {/* Mode Selector */}
        <View style={styles.modeContainer}>
          <TouchableOpacity 
            style={[styles.modeBtn, participationMode === 'in-person' && styles.modeBtnActive]} 
            onPress={() => setParticipationMode('in-person')}
          >
            <Ionicons name="location" size={20} color={participationMode === 'in-person' ? '#fff' : Colors.primary} />
            <Text style={[styles.modeBtnText, participationMode === 'in-person' && styles.modeBtnTextActive]}>Présentiel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeBtn, participationMode === 'online' && styles.modeBtnActive]} 
            onPress={() => setParticipationMode('online')}
          >
            <Ionicons name="videocam" size={20} color={participationMode === 'online' ? '#fff' : Colors.primary} />
            <Text style={[styles.modeBtnText, participationMode === 'online' && styles.modeBtnTextActive]}>En Ligne</Text>
          </TouchableOpacity>
        </View>

        {/* Event Title */}
        <View style={styles.field}>
          <Text style={styles.label}>TITRE DE L'ÉVÉNEMENT</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Lomé Tech Summit 2026"
            />
          </View>
        </View>

        {/* Location / Meeting Link */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {participationMode === 'in-person' ? 'LIEU OU LIEN MAPS' : 'LIEN DE RÉUNION (ZOOM, MEET, etc.)'}
          </Text>
          <View style={[styles.inputBox, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
            <Ionicons name={participationMode === 'in-person' ? 'map-outline' : 'link-outline'} size={18} color={Colors.primary} />
            <TextInput 
              style={[styles.input, { flex: 1 }]} 
              value={participationMode === 'in-person' ? location : onlineLink} 
              onChangeText={participationMode === 'in-person' ? setLocation : setOnlineLink} 
              placeholder={participationMode === 'in-person' ? "Venue or Google Maps Link" : "https://zoom.us/j/..."} 
              autoCapitalize="none"
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
        <TouchableOpacity style={styles.publishBtn} activeOpacity={0.88} onPress={handlePublish}>
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
  pageTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.primary, marginTop: Spacing.sm },
  pageSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 6, marginBottom: Spacing.lg, lineHeight: 20 },
  logicCard: { 
    backgroundColor: Colors.white, 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: Spacing.lg, 
    borderWidth: 1.5,
    borderColor: 'rgba(3,4,94,0.08)',
    ...Shadows.card 
  },
  logicRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logicTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  logicSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  toggle: { width: 56, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0', padding: 4 },
  toggleActive: { backgroundColor: '#22c55e' },
  toggleCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' },
  toggleCircleActive: { alignSelf: 'flex-end' },
  modeContainer: { flexDirection: 'row', gap: 14, marginBottom: Spacing.lg },
  modeBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    backgroundColor: Colors.white, 
    borderRadius: 20, 
    paddingVertical: 18, 
    borderWidth: 2, 
    borderColor: '#e2e8f0' 
  },
  modeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  modeBtnText: { fontSize: 15, fontWeight: '800', color: Colors.primary },
  modeBtnTextActive: { color: '#fff' },
  uploadBox: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(3,4,94,0.02)',
    marginBottom: Spacing.xl,
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
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12,
    backgroundColor: Colors.primary, 
    borderRadius: BorderRadius.full,
    paddingVertical: 20, 
    ...Shadows.button,
    marginBottom: 40,
  },
  publishText: { fontSize: 18, fontWeight: '800', color: Colors.white, letterSpacing: 0.5 },
});
