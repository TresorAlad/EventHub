import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Switch,
} from 'react-native';
import AppIcon from '../components/ui/AppIcon';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows, Fonts } from '../theme';

export default function PrivacySecurityScreen({ navigation }: any) {
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppIcon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Private Profile</Text>
              <Text style={styles.rowDesc}>Only followers can see your activities.</Text>
            </View>
            <Switch 
              value={isPrivate} 
              onValueChange={setIsPrivate}
              trackColor={{ false: '#ddd', true: Colors.primaryLight }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Security Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Change Password</Text>
              <Text style={styles.rowDesc}>Last changed 3 months ago.</Text>
            </View>
            <AppIcon name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
          
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: Colors.border }]}>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Two-Factor Authentication</Text>
              <Text style={styles.rowDesc}>Secure your account with SMS codes.</Text>
            </View>
            <Switch 
              value={twoFactor} 
              onValueChange={setTwoFactor}
              trackColor={{ false: '#ddd', true: Colors.primaryLight }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.dangerCard}>
          <Text style={styles.dangerText}>Delete My Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 52, 
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontFamily: Fonts.headerBold, color: Colors.primary },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 40 },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.lg, textTransform: 'uppercase' },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadows.card },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  rowDesc: { fontSize: FontSize.xs, color: Colors.textMuted },
  dangerCard: { 
    marginTop: Spacing.xl, 
    backgroundColor: Colors.white, 
    borderRadius: BorderRadius.lg, 
    padding: Spacing.md, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerText: { color: Colors.danger, fontWeight: FontWeight.bold, fontSize: FontSize.md },
});
