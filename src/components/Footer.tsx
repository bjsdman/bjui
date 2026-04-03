import React from 'react';
import { StatusBadge, StatusValue } from './StatusBadge';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterProps {
  siteName: string;
  links?: FooterLink[];
  clusterStatus?: StatusValue;
  year?: number;
}

export function Footer({
  siteName,
  links = [],
  clusterStatus,
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className="w-full border-t border-neutral-800 dark:border-neutral-800 bg-neutral-950 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: copyright */}
        <p className="text-xs text-neutral-500">
          &copy; {year} {siteName}
        </p>

        {/* Center: links */}
        {links.length > 0 && (
          <nav aria-label="Footer navigation" className="flex items-center gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-xs text-neutral-400 hover:text-primary-400 transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right: cluster status */}
        {clusterStatus && (
          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs text-neutral-500">Cluster</span>
            <StatusBadge status={clusterStatus} size="sm" />
          </div>
        )}
      </div>
    </footer>
  );
}
