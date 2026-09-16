import React from 'react';
import * as LucideIcons from 'lucide-react';

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

  // Lookup in Lucide icons
  const iconKey = (name in LucideIcons ? name : 'Globe') as keyof typeof LucideIcons;
  const IconComponent = (LucideIcons[iconKey] || LucideIcons.Globe) as React.ComponentType<{
    className?: string;
    size?: number;
  }>;

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
  'Smartphone',
  'Printer',
  'Search',
  'Link',
];
