import { 
  User, 
  Home, 
  Building, 
  Building2, 
  Shield, 
  Sparkles, 
  Layout, 
  CheckCircle,
  Briefcase,
  Compass,
  Key,
  Map,
  LucideIcon
} from 'lucide-react';

export interface BuiltInAvatar {
  id: string;
  icon: LucideIcon;
  color: string;
}

export const BUILTIN_AVATARS: BuiltInAvatar[] = [
  { id: 'av-1', icon: User, color: '#2563EB' }, // Blue 600
  { id: 'av-2', icon: Home, color: '#4F46E5' }, // Indigo 600
  { id: 'av-3', icon: Building, color: '#475569' }, // Slate 600
  { id: 'av-4', icon: Building2, color: '#059669' }, // Emerald 600
  { id: 'av-5', icon: Shield, color: '#D97706' }, // Amber 600
  { id: 'av-6', icon: Sparkles, color: '#E11D48' }, // Rose 600
  { id: 'av-7', icon: Layout, color: '#7C3AED' }, // Violet 600
  { id: 'av-8', icon: CheckCircle, color: '#0D9488' }, // Teal 600
  { id: 'av-9', icon: Briefcase, color: '#0891B2' }, // Cyan 600
  { id: 'av-10', icon: Compass, color: '#EA580C' }, // Orange 600
  { id: 'av-11', icon: Key, color: '#525252' }, // Neutral 600
  { id: 'av-12', icon: Map, color: '#0284C7' }, // Sky 600
];
