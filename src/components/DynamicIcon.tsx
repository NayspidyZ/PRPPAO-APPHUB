import React from 'react';
import {
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  Folder,
  FolderTree,
  Globe,
  Headphones,
  Heart,
  HelpCircle,
  Layers,
  Lightbulb,
  Link,
  Mail,
  Megaphone,
  MessageSquare,
  Mic,
  Monitor,
  Newspaper,
  Palette,
  Pin,
  Printer,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Tv,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  Folder,
  FolderTree,
  Globe,
  Headphones,
  Heart,
  HelpCircle,
  Layers,
  Lightbulb,
  Link,
  Mail,
  Megaphone,
  MessageSquare,
  Mic,
  Monitor,
  Newspaper,
  Palette,
  Pin,
  Printer,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Tv,
  Users,
  Video,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  // If the icon name looks like a URL or image path, render an image
  if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('/')) {
    return (
      <img
        src={name}
        alt="icon"
        className={`${className} object-contain rounded-md`}
        width={size || 24}
        height={size || 24}
      />
    );
  }

  // Lookup in tree-shaken ICON_MAP (falls back to Globe)
  const IconComponent = ICON_MAP[name] || Globe;

  return <IconComponent className={className} size={size} />;
};

export const POPULAR_ICONS = [
  'Megaphone',
  'Camera',
  'Video',
  'Palette',
  'Share2',
  'ClipboardList',
  'BarChart3',
  'FileText',
  'Headphones',
  'Mic',
  'Globe',
  'Folder',
  'Layers',
  'Calendar',
  'Mail',
  'Bell',
  'MessageSquare',
  'Tv',
  'Printer',
  'Search',
  'Link',
  'Database',
  'Monitor',
  'Send',
  'Sparkles',
  'ShieldCheck',
  'Heart',
  'Star',
  'Building2',
];

export const CATEGORY_POPULAR_ICONS = [
  'Folder',
  'FolderTree',
  'Megaphone',
  'Camera',
  'Video',
  'Palette',
  'Share2',
  'FileText',
  'BarChart3',
  'Headphones',
  'Globe',
  'Tag',
  'Layers',
  'Bookmark',
  'Newspaper',
  'Sparkles',
  'Tv',
  'Users',
  'Settings',
  'Pin',
  'Calendar',
  'HelpCircle',
  'Briefcase',
  'Lightbulb',
  'ShieldCheck',
  'Heart',
  'Star',
  'CheckCircle2',
];
