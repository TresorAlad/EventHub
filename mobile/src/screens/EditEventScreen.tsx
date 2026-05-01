import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';
import { updateEvent } from '../services/api';

export default function EditEventScreen({ route, navigation }: any) {
  const event = route.params?.event;
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [location, setLocation] = useState(event?.location || '');

  const handleUpdate = async () => {
    if (!title || !description) {
      Alert.alert('Champs requis', 'Veuillez remplir le titre et la description.');
      return;
    }

    setLoading(true);
    try {
      await updateEvent(event.id, { title, description, location });
      Alert.alert('Succès', 'Événement modifié avec succès !');
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erreur', 'Échec de la modification de l\'événement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'événement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>Mettre à jour</Text>
          <Text style={styles.subtitle}>Modifiez les informations de base de votre événement.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom de l'événement</Text>
            <TextInput style={styles.input} placeholder="Ex: Lomé Tech Summit" value={title} onChangeText={setTitle} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse / Lieu</Text>
            <TextInput style={styles.input} placeholder="Lieu de l'événement" value={location} onChangeText={setLocation} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description complète</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Parlez-nous de cet événement..." value={description} onChangeText={setDescription} multiline />
          </View>

        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Enregistrer les modifications</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 15, backgroundColor: '#f8fafc' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  scroll: { padding: 24, paddingBottom: 120 },
  section: { flex: 1 },
  title: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.textPrimary },
  textArea: { height: 120, textAlignVertical: 'top' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
