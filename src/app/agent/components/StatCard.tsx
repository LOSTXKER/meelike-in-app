import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  };

  return (
    <div className="bg-surface dark:bg-dark-surface p-5 rounded-xl shadow-sm border border-default">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-secondary">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${variantStyles[variant]}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-tertiary mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.value >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-tertiary">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

