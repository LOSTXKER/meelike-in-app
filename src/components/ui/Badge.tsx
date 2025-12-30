'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className = '',
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-brand-primary/10 text-brand-primary',
    success: 'bg-brand-success/10 text-brand-success',
    warning: 'bg-brand-warning/20 text-amber-700 dark:text-brand-warning',
    error: 'bg-brand-error/10 text-brand-error',
    info: 'bg-brand-info/20 text-brand-info',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Status Badge with icon
interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: { label: 'รอดำเนินการ', variant: 'warning' as const, icon: '⏳' },
    processing: { label: 'กำลังดำเนินการ', variant: 'info' as const, icon: '🔄' },
    completed: { label: 'สำเร็จ', variant: 'success' as const, icon: '✅' },
    cancelled: { label: 'ยกเลิก', variant: 'error' as const, icon: '❌' },
    failed: { label: 'ล้มเหลว', variant: 'error' as const, icon: '⚠️' },
  };
  
  const { label, variant, icon } = config[status];
  
  return (
    <Badge variant={variant}>
      <span className="mr-1">{icon}</span>
      {label}
    </Badge>
  );
}

// Level Badge for Workers
interface LevelBadgeProps {
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip';
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const config = {
    bronze: { label: 'Bronze', color: 'bg-amber-600/20 text-amber-700', icon: '🥉' },
    silver: { label: 'Silver', color: 'bg-gray-300/30 text-gray-600', icon: '🥈' },
    gold: { label: 'Gold', color: 'bg-yellow-400/20 text-yellow-700', icon: '🥇' },
    platinum: { label: 'Platinum', color: 'bg-cyan-400/20 text-cyan-700', icon: '💎' },
    vip: { label: 'VIP', color: 'bg-purple-400/20 text-purple-700', icon: '👑' },
  };
  
  const { label, color, icon } = config[level];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
}

// Platform Badge
interface PlatformBadgeProps {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter';
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const config = {
    facebook: { label: 'Facebook', color: 'bg-blue-500/10 text-blue-600', icon: '📘' },
    instagram: { label: 'Instagram', color: 'bg-pink-500/10 text-pink-600', icon: '📸' },
    tiktok: { label: 'TikTok', color: 'bg-gray-800/10 text-gray-800 dark:bg-gray-200/20 dark:text-gray-200', icon: '🎵' },
    youtube: { label: 'YouTube', color: 'bg-red-500/10 text-red-600', icon: '📺' },
    twitter: { label: 'Twitter', color: 'bg-sky-500/10 text-sky-600', icon: '🐦' },
  };
  
  const { label, color, icon } = config[platform];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
}

