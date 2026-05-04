import React, { useMemo } from 'react';
import type { LucideProps } from 'lucide-react-native';
import {
  AlertTriangle,
  ArrowLeft,
  AtSign,
  BadgeCheck,
  Bell,
  Bookmark,
  Building2,
  Calendar,
  Camera,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Home,
  Heart,
  Info,
  Image as ImageIcon,
  LayoutGrid,
  Link as LinkIcon,
  Lock,
  LogOut,
  Mail,
  Map,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Rocket,
  Search,
  Share2,
  SlidersHorizontal,
  Trash2,
  User,
  Users,
  Video,
  X,
  XCircle,
} from 'lucide-react-native';

type IoniconName =
  | 'home'
  | 'home-outline'
  | 'grid'
  | 'grid-outline'
  | 'notifications'
  | 'notifications-outline'
  | 'person'
  | 'person-outline'
  | 'person-circle-outline'
  | 'search'
  | 'search-outline'
  | 'options-outline'
  | 'chevron-forward'
  | 'arrow-back'
  | 'people'
  | 'people-outline'
  | 'document-text-outline'
  | 'call-outline'
  | 'globe-outline'
  | 'link-outline'
  | 'at-outline'
  | 'lock-closed-outline'
  | 'eye-outline'
  | 'eye-off-outline'
  | 'logo-google'
  | 'close'
  | 'pencil-outline'
  | 'trash-outline'
  | 'calendar-outline'
  | 'add'
  | 'camera'
  | 'business-outline'
  | 'mail-outline'
  | 'share-social-outline'
  | 'share-social'
  | 'bookmark'
  | 'bookmark-outline'
  | 'rocket-outline'
  | 'log-out-outline'
  | 'time-outline'
  | 'location-outline'
  | 'image-outline'
  | 'checkmark-circle'
  | 'close-circle'
  | 'heart'
  | 'information-circle'
  | 'warning'
  | 'videocam-outline'
  | 'map-outline';

const ICONS: Record<IoniconName, React.ComponentType<LucideProps>> = {
  home: Home,
  'home-outline': Home,
  grid: LayoutGrid,
  'grid-outline': LayoutGrid,
  notifications: Bell,
  'notifications-outline': Bell,
  person: User,
  'person-outline': User,
  'person-circle-outline': User,
  search: Search,
  'search-outline': Search,
  'options-outline': SlidersHorizontal,
  'chevron-forward': ChevronRight,
  'arrow-back': ArrowLeft,
  people: Users,
  'people-outline': Users,
  'document-text-outline': FileText,
  'call-outline': Phone,
  'globe-outline': Globe,
  'link-outline': LinkIcon,
  'at-outline': AtSign,
  'lock-closed-outline': Lock,
  'eye-outline': Eye,
  'eye-off-outline': EyeOff,
  'logo-google': Globe,
  close: X,
  'pencil-outline': Pencil,
  'trash-outline': Trash2,
  'calendar-outline': Calendar,
  add: Plus,
  camera: Camera,
  'business-outline': Building2,
  'mail-outline': Mail,
  'share-social-outline': Share2,
  'share-social': Share2,
  bookmark: Bookmark,
  'bookmark-outline': Bookmark,
  'rocket-outline': Rocket,
  'log-out-outline': LogOut,
  'time-outline': Clock,
  'location-outline': MapPin,
  'image-outline': ImageIcon,
  'checkmark-circle': BadgeCheck,
  'close-circle': XCircle,
  heart: Heart,
  'information-circle': Info,
  warning: AlertTriangle,
  'videocam-outline': Video,
  'map-outline': Map,
};

export type AppIconName = IoniconName;

export default function AppIcon({
  name,
  size = 20,
  color = '#111',
  ...rest
}: {
  name: AppIconName | (string & {});
  size?: number;
  color?: string;
} & Omit<LucideProps, 'size' | 'color'>) {
  const Icon = useMemo(() => ICONS[name as IoniconName] ?? Search, [name]);
  return <Icon size={size} color={color} {...rest} />;
}

