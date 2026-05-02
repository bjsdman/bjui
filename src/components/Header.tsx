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
  /** Override the text siteName with an image logo — pass an <img> element */
  logoImage?: React.ReactNode;
  /** Icon to show alongside siteName text (ignored when logoImage is set) */
  logoIcon?: React.ReactNode;
  navItems?: NavItem[];
  rightSlot?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
}

export function Header({
  siteName,
  logoImage,
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

  // Frosted-glass nav — rgba(8,15,26,0.88) + blur
  const baseClass = [
    'w-full z-30 transition-shadow duration-150',
    'border-b border-primary-700/50',
    sticky ? 'sticky top-0' : 'relative',
    transparent && !scrolled
      ? 'bg-transparent border-transparent'
      : 'bg-[rgba(8,15,26,0.88)] backdrop-blur-[16px]',
    scrolled ? 'shadow-card' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={baseClass} style={{ height: '68px' }}>
      <div className="h-full px-[clamp(24px,5vw,80px)] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {logoImage ? (
            logoImage
          ) : (
            <>
              {logoIcon && (
                <span className="text-accent-500 w-6 h-6 flex-shrink-0">
                  {logoIcon}
                </span>
              )}
              <span className="font-sans font-semibold text-lg text-neutral-100">
                {siteName}
              </span>
            </>
          )}
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
                'relative px-3 py-2 text-sm font-medium tracking-nav uppercase transition-colors duration-150',
                'focus:outline-none focus:[outline:2px_solid_#c45c14] focus:outline-offset-2',
                'after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-accent-500',
                'after:scale-x-0 after:origin-left after:transition-transform after:duration-[250ms] after:ease-out',
                'hover:after:scale-x-100',
                item.active
                  ? 'text-neutral-100 after:scale-x-100'
                  : 'text-neutral-400 hover:text-neutral-100',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right slot + mobile toggle */}
        <div className="flex items-center gap-3">
          {rightSlot && <div className="hidden md:flex items-center gap-2">{rightSlot}</div>}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded text-neutral-400 hover:text-neutral-100 focus:outline-none focus:[outline:2px_solid_#c45c14] focus:outline-offset-2"
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
          className="md:hidden border-t border-primary-700 bg-primary-900"
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
                  'px-3 py-2 text-sm font-medium tracking-nav uppercase rounded transition-colors duration-150',
                  item.active
                    ? 'text-accent-500 bg-primary-800'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-primary-800',
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
