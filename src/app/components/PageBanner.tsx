// src/app/components/PageBanner.tsx
import React from 'react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageBanner({ title, subtitle, breadcrumbs }: PageBannerProps) {
  return (
    <div>
      {breadcrumbs && (
        <nav className="mb-2 text-sm font-medium text-brand-text-light dark:text-dark-text-light">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:underline hover:text-brand-primary dark:hover:text-dark-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-brand-text-dark dark:text-dark-text-dark">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-md text-brand-text-light dark:text-dark-text-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}