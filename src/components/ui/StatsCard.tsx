'use client';

import { ReactNode } from 'react';
import { Card } from './Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  const iconBgColors = {
    default: 'bg-brand-primary/10',
    primary: 'bg-brand-primary/10',
    success: 'bg-brand-success/10',
    warning: 'bg-brand-warning/20',
    error: 'bg-brand-error/10',
  };
  
  const iconTextColors = {
    default: 'text-brand-primary',
    primary: 'text-brand-primary',
    success: 'text-brand-success',
    warning: 'text-amber-600',
    error: 'text-brand-error',
  };
  
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-brand-text-light">{title}</p>
          <p className="text-2xl font-bold text-brand-text-dark mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-brand-text-light mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${
              trend.isPositive ? 'text-brand-success' : 'text-brand-error'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-brand-text-light">vs เดือนก่อน</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${iconBgColors[variant]}`}>
            <span className={`text-xl ${iconTextColors[variant]}`}>{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

