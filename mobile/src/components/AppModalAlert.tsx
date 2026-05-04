import React, { useMemo } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppIcon from './ui/AppIcon';
import { BorderRadius, Colors, FontSize, FontWeight, Shadows, Spacing } from '../theme';

export type AppAlertVariant = 'info' | 'success' | 'warning' | 'error' | 'update';
type IconName = React.ComponentProps<typeof AppIcon>['name'];

export type AppAlertPayload = {
  title: string;
  message?: string;
  variant?: AppAlertVariant;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void | Promise<void>;
  onSecondary?: () => void | Promise<void>;
  dismissible?: boolean;
};

type Props = {
  visible: boolean;
  payload: AppAlertPayload | null;
  onRequestClose: () => void;
};

const AppModalAlert: React.FC<Props> = ({ visible, payload, onRequestClose }) => {
  const cfg = useMemo(() => {
    const variant: AppAlertVariant = payload?.variant ?? 'info';
    const base = {
      icon: 'information-circle' as IconName,
      accent: Colors.primary,
      primaryText: payload?.primaryText ?? 'OK',
      secondaryText: payload?.secondaryText,
    };
    if (variant === 'success') return { ...base, icon: 'checkmark-circle' as IconName, accent: Colors.success };
    if (variant === 'warning') return { ...base, icon: 'warning' as IconName, accent: '#f59e0b' };
    if (variant === 'error') return { ...base, icon: 'close-circle' as IconName, accent: '#ef4444' };
    if (variant === 'update')
      return {
        ...base,
        icon: 'cloud-download' as IconName,
        accent: Colors.primary,
        primaryText: payload?.primaryText ?? 'Mettre à jour',
        secondaryText: payload?.secondaryText ?? 'Plus tard',
      };
    return base;
  }, [payload]);

  if (!payload) return null;

  const canClose = payload.dismissible !== false;

  const close = () => {
    if (!canClose) return;
    onRequestClose();
  };

  const onPrimary = async () => {
    try {
      await payload.onPrimary?.();
    } finally {
      onRequestClose();
    }
  };

  const onSecondary = async () => {
    try {
      await payload.onSecondary?.();
    } finally {
      onRequestClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={close} />
        <View style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: withAlpha(cfg.accent, 0.12) }]}>
            <AppIcon name={cfg.icon as any} size={28} color={cfg.accent} />
          </View>

          <Text style={styles.title}>{payload.title}</Text>
          {payload.message ? <Text style={styles.message}>{payload.message}</Text> : null}

          <View style={styles.actionsRow}>
            {cfg.secondaryText ? (
              <TouchableOpacity style={styles.secondaryBtn} onPress={onSecondary} activeOpacity={0.9}>
                <Text style={styles.secondaryText}>{cfg.secondaryText}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: cfg.accent }]}
              onPress={onPrimary}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryText}>{cfg.primaryText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(AppModalAlert);

function withAlpha(hex: string, alpha: number) {
  // hex -> rgba, minimal (supporte #rgb et #rrggbb)
  const h = hex.replace('#', '').trim();
  const full =
    h.length === 3 ? h.split('').map((c) => c + c).join('') : h.length === 6 ? h : '000000';
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r},${g},${b},${a})`;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: Spacing.lg,
    gap: 10,
    ...Shadows.card,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  secondaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
});

