import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppIcon from './ui/AppIcon';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../theme';
import EventImage from './EventImage';

interface TrendingCardProps {
  category: string;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  image: any;
  status?: string;
  onPress?: () => void;
}

function TrendingCard({ category, title, subtitle, date, time, image, status, onPress }: TrendingCardProps) {
  const isExpired = status === 'Expired' || status === 'Past';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <EventImage source={image} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{category}</Text>
          </View>
          {status && (
            <View
              style={[
                styles.statusBadge,
                status === 'Live' ? styles.statusLive : isExpired ? styles.statusExpired : styles.statusUpcoming,
              ]}
            >
              <Text style={styles.statusText}>{status === 'Live' ? 'LIVE' : isExpired ? 'EXPIRÉ' : 'À VENIR'}</Text>
            </View>
          )}
        </View>
        <View style={styles.bottom}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.meta}>
            <AppIcon name="calendar-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>
              {date}
              {time ? ` • ${time}` : ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(TrendingCard);

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 320,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginRight: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  image: { ...StyleSheet.absoluteFillObject },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  tagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bottom: {
    gap: 4,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    lineHeight: 26,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  statusLive: {
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    borderColor: 'rgba(239, 68, 68, 0.6)',
  },
  statusUpcoming: {
    backgroundColor: 'rgba(56, 189, 248, 0.4)',
    borderColor: 'rgba(56, 189, 248, 0.6)',
  },
  statusExpired: {
    backgroundColor: 'rgba(100, 116, 139, 0.35)',
    borderColor: 'rgba(100, 116, 139, 0.55)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});
