'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
}

export interface HeaderProps {
  siteName: string;
  logoIcon?: React.ReactNode;
  navItems?: NavItem[];
  rightSlot?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
}

export function Header({
  siteName,
  logoIcon,
  navItems = [],
  rightSlot,
  sticky = true,
  transparent = false,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const baseClass = [
    'w-full z-30 border-b transition-shadow duration-150',
    sticky ? 'sticky top-0' : 'relative',
    transparent && !scrolled
      ? 'bg-transparent border-transparent'
      : 'bg-neutral-900 dark:bg-neutral-900 border-neutral-800 light:bg-neutral-0 light:border-neutral-200',
    scrolled ? 'shadow-sm' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={baseClass}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <div className="flex items-center gap-2">
          {logoIcon && (
            <span className="text-primary-400 w-6 h-6 flex-shrink-0">
              {logoIcon}
            </span>
          )}
          <span className="font-mono font-semibold text-lg text-primary-400">
            {siteName}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={[
                'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                'focus:outline-none focus:shadow-glow-primary',
                item.active
                  ? 'text-primary-400 border-b-2 border-primary-500'
                  : 'text-neutral-400 hover:text-neutral-200',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right slot + mobile toggle */}
        <div className="flex items-center gap-2">
          {rightSlot && <div className="hidden md:flex items-center gap-2">{rightSlot}</div>}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-neutral-400 hover:text-neutral-200 focus:outline-none focus:shadow-glow-primary"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main navigation"
          className="md:hidden border-t border-neutral-800 bg-neutral-900"
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileOpen(false)}
                className={[
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                  item.active
                    ? 'text-primary-400 bg-neutral-800'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800',
                ].join(' ')}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
