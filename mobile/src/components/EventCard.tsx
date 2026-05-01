import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing, Shadows } from '../theme';

interface EventCardProps {
  category: string;
  title: string;
  time: string;
  location?: string;
  price?: string;
  image: any;
  status?: string;
  onPress?: () => void;
}

export default function EventCard({ category, title, time, location, price, image, status, onPress }: EventCardProps) {
  const isExpired = status === 'Expired' || status === 'Past';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={image} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.category}>{category}</Text>
          {status && (
            <View
              style={[
                styles.statusBadge,
                status === 'Live' ? styles.statusLive : isExpired ? styles.statusExpired : styles.statusUpcoming,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: status === 'Live' ? '#ef4444' : isExpired ? '#64748b' : '#38bdf8' },
                ]}
              >
                {status === 'Live' ? 'LIVE' : isExpired ? 'EXPIRÉ' : 'À VENIR'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{time}</Text>
          </View>
          {location && (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>{location}</Text>
            </View>
          )}
        </View>
      </View>
      {price && (
        <Text style={[styles.price, price === 'Gratuit' && styles.free]}>{price}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm + 4,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.card,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  category: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  meta: {
    gap: 2,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  price: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    alignSelf: 'flex-start',
  },
  free: {
    color: Colors.success,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusLive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusUpcoming: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  statusExpired: {
    backgroundColor: 'rgba(100, 116, 139, 0.12)',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
