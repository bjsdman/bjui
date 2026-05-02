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
    <div className="flex flex-col min-h-screen bg-primary-950 text-neutral-100 font-sans antialiased">
      <Header {...header} />
      <main
        className={[
          'flex-1',
          maxWidthMap[maxWidth],
          'w-full mx-auto',
          padded ? 'px-[clamp(24px,6vw,100px)] pt-[100px] pb-[100px]' : '',
          texture ? 'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\' fill=\'%231c2e4a\' fill-opacity=\'0.08\'/%3E%3C/svg%3E")]' : '',
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
