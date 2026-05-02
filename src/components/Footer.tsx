import React from 'react';
import { StatusBadge, StatusValue } from './StatusBadge';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterProps {
  siteName: string;
  /** Optional logo image to show in footer (pass an <img> element) */
  logoImage?: React.ReactNode;
  links?: FooterLink[];
  clusterStatus?: StatusValue;
  year?: number;
}

export function Footer({
  siteName,
  logoImage,
  links = [],
  clusterStatus,
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className="w-full border-t border-primary-700 bg-primary-950">
      <div
        className="px-[clamp(24px,6vw,100px)] py-9 flex flex-wrap items-center justify-between gap-5"
      >
        {/* Left: logo or copyright */}
        <div className="flex items-center gap-3">
          {logoImage && (
            <span className="opacity-70 flex-shrink-0">{logoImage}</span>
          )}
          <p className="text-[0.8rem] text-neutral-500">
            &copy; {year} {siteName}
          </p>
        </div>

        {/* Center: links */}
        {links.length > 0 && (
          <nav aria-label="Footer navigation" className="flex items-center gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-[0.8rem] text-neutral-500 hover:text-accent-500 transition-colors duration-150 focus:outline-none focus:[outline:2px_solid_#c45c14] focus:outline-offset-2"
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
