import React from 'react';
import { Header, HeaderProps } from './Header';
import { Footer, FooterProps } from './Footer';

const maxWidthMap = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export interface PageLayoutProps {
  children: React.ReactNode;
  header: HeaderProps;
  footer?: FooterProps;
  maxWidth?: keyof typeof maxWidthMap;
  padded?: boolean;
  className?: string;
  texture?: boolean;
}

export function PageLayout({
  children,
  header,
  footer,
  maxWidth = 'xl',
  padded = true,
  className,
  texture = false,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 dark:bg-neutral-900">
      <Header {...header} />
      <main
        className={[
          'flex-1',
          maxWidthMap[maxWidth],
          'w-full mx-auto',
          padded ? 'px-6 md:px-8 pt-8 pb-6' : '',
          texture ? 'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\' fill=\'%23334155\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")]' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </main>
      {footer && <Footer {...footer} />}
    </div>
  );
}
