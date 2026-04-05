import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PageLayout } from '../components/PageLayout';
import { ServiceCard } from '../components/ServiceCard';
import { StatusBadge } from '../components/StatusBadge';

// ─── StatusBadge ─────────────────────────────────────────────────────────────

describe('StatusBadge', () => {
  it('renders without throwing', () => {
    render(<StatusBadge status="online" />);
  });

  it('shows the default label for online status', () => {
    render(<StatusBadge status="online" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('ONLINE')).toBeInTheDocument();
  });

  it('shows the default label for offline status', () => {
    render(<StatusBadge status="offline" />);
    expect(screen.getByText('OFFLINE')).toBeInTheDocument();
  });

  it('shows the default label for degraded status', () => {
    render(<StatusBadge status="degraded" />);
    expect(screen.getByText('DEGRADED')).toBeInTheDocument();
  });

  it('shows the default label for unknown status', () => {
    render(<StatusBadge status="unknown" />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('renders a custom label when provided', () => {
    render(<StatusBadge status="online" label="UP" />);
    expect(screen.getByText('UP')).toBeInTheDocument();
  });

  it('hides the label when showLabel is false', () => {
    render(<StatusBadge status="online" showLabel={false} />);
    expect(screen.queryByText('ONLINE')).not.toBeInTheDocument();
  });

  it('hides the dot when showDot is false', () => {
    const { container } = render(<StatusBadge status="online" showDot={false} />);
    // The dot wrapper span is only present when showDot is true
    const dotWrapper = container.querySelector('.relative.inline-flex');
    expect(dotWrapper).not.toBeInTheDocument();
  });

  it('renders all size variants without throwing', () => {
    render(
      <>
        <StatusBadge status="online" size="sm" />
        <StatusBadge status="online" size="md" />
        <StatusBadge status="online" size="lg" />
      </>
    );
  });
});

// ─── Header ──────────────────────────────────────────────────────────────────

describe('Header', () => {
  it('renders without throwing', () => {
    render(<Header siteName="TestSite" />);
  });

  it('displays the site name', () => {
    render(<Header siteName="MyLab" />);
    expect(screen.getByText('MyLab')).toBeInTheDocument();
  });

  it('renders nav items', () => {
    const navItems = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ];
    render(<Header siteName="TestSite" navItems={navItems} />);
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
  });

  it('marks an active nav item with aria-current="page"', () => {
    const navItems = [{ label: 'Home', href: '/', active: true }];
    render(<Header siteName="TestSite" navItems={navItems} />);
    // There are two navs (desktop + mobile) so we get multiple matches
    const activeLinks = screen.getAllByRole('link', { name: 'Home' });
    const hasAriaCurrent = activeLinks.some(
      (link) => link.getAttribute('aria-current') === 'page'
    );
    expect(hasAriaCurrent).toBe(true);
  });

  it('renders the mobile menu toggle button', () => {
    render(<Header siteName="TestSite" />);
    expect(
      screen.getByRole('button', { name: /toggle navigation menu/i })
    ).toBeInTheDocument();
  });

  it('renders with sticky=false without throwing', () => {
    render(<Header siteName="TestSite" sticky={false} />);
  });

  it('renders with transparent=true without throwing', () => {
    render(<Header siteName="TestSite" transparent={true} />);
  });

  it('renders a logoIcon slot', () => {
    render(<Header siteName="TestSite" logoIcon={<span data-testid="logo-icon" />} />);
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument();
  });

  it('renders a rightSlot', () => {
    render(<Header siteName="TestSite" rightSlot={<button>Login</button>} />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});

// ─── Footer ──────────────────────────────────────────────────────────────────

describe('Footer', () => {
  it('renders without throwing', () => {
    render(<Footer siteName="TestSite" />);
  });

  it('displays the site name in the copyright notice', () => {
    render(<Footer siteName="MyLab" year={2024} />);
    expect(screen.getByText(/MyLab/)).toBeInTheDocument();
  });

  it('renders footer links', () => {
    const links = [
      { label: 'GitHub', href: 'https://github.com', external: true },
      { label: 'Privacy', href: '/privacy' },
    ];
    render(<Footer siteName="TestSite" links={links} />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy' })).toBeInTheDocument();
  });

  it('adds rel="noopener noreferrer" on external links', () => {
    const links = [{ label: 'GitHub', href: 'https://github.com', external: true }];
    render(<Footer siteName="TestSite" links={links} />);
    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a cluster status badge when clusterStatus is provided', () => {
    render(<Footer siteName="TestSite" clusterStatus="online" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('does not render a status badge when clusterStatus is omitted', () => {
    render(<Footer siteName="TestSite" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

// ─── ServiceCard ─────────────────────────────────────────────────────────────

describe('ServiceCard', () => {
  it('renders without throwing', () => {
    render(<ServiceCard name="Mattermost" />);
  });

  it('displays the service name', () => {
    render(<ServiceCard name="Grafana" />);
    expect(screen.getByRole('heading', { name: 'Grafana' })).toBeInTheDocument();
  });

  it('displays the description when provided', () => {
    render(<ServiceCard name="Grafana" description="Metrics dashboards" />);
    expect(screen.getByText('Metrics dashboards')).toBeInTheDocument();
  });

  it('renders a status badge', () => {
    render(<ServiceCard name="Grafana" status="online" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(<ServiceCard name="Grafana" href="/grafana" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/grafana');
  });

  it('renders as a button when onClick is provided', () => {
    const onClick = vi.fn();
    render(<ServiceCard name="Grafana" onClick={onClick} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders as a plain div when neither href nor onClick is provided', () => {
    const { container } = render(<ServiceCard name="Grafana" />);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('shows response time when provided', () => {
    render(<ServiceCard name="Grafana" responseTime={42} />);
    expect(screen.getByText('42ms')).toBeInTheDocument();
  });

  it('shows the URL when provided', () => {
    render(<ServiceCard name="Grafana" url="grafana.brianmjones.com" />);
    expect(screen.getByText('grafana.brianmjones.com')).toBeInTheDocument();
  });

  it('shows uptime when provided', () => {
    render(<ServiceCard name="Grafana" uptime={99.9} />);
    expect(screen.getByText('99.9% uptime')).toBeInTheDocument();
  });

  it('renders a category badge when provided', () => {
    render(<ServiceCard name="Grafana" category="Monitoring" />);
    expect(screen.getByText('Monitoring')).toBeInTheDocument();
  });

  it('renders all status variants without throwing', () => {
    render(
      <>
        <ServiceCard name="A" status="online" />
        <ServiceCard name="B" status="offline" />
        <ServiceCard name="C" status="degraded" />
        <ServiceCard name="D" status="unknown" />
      </>
    );
  });
});

// ─── PageLayout ──────────────────────────────────────────────────────────────

describe('PageLayout', () => {
  const baseHeader = { siteName: 'TestSite' };

  it('renders without throwing', () => {
    render(
      <PageLayout header={baseHeader}>
        <p>Content</p>
      </PageLayout>
    );
  });

  it('renders children in the main element', () => {
    render(
      <PageLayout header={baseHeader}>
        <p>Hello world</p>
      </PageLayout>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders the header', () => {
    render(
      <PageLayout header={{ siteName: 'LabSite' }}>
        <p>Content</p>
      </PageLayout>
    );
    expect(screen.getByText('LabSite')).toBeInTheDocument();
  });

  it('renders the footer when footer prop is provided', () => {
    render(
      <PageLayout header={baseHeader} footer={{ siteName: 'TestSite', year: 2024 }}>
        <p>Content</p>
      </PageLayout>
    );
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('does not render a footer when footer prop is omitted', () => {
    render(
      <PageLayout header={baseHeader}>
        <p>Content</p>
      </PageLayout>
    );
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('renders all maxWidth variants without throwing', () => {
    const widths = ['sm', 'md', 'lg', 'xl', 'full'] as const;
    widths.forEach((w) => {
      render(
        <PageLayout header={baseHeader} maxWidth={w}>
          <p>Content</p>
        </PageLayout>
      );
    });
  });

  it('renders with padded=false without throwing', () => {
    render(
      <PageLayout header={baseHeader} padded={false}>
        <p>Content</p>
      </PageLayout>
    );
  });

  it('renders with texture=true without throwing', () => {
    render(
      <PageLayout header={baseHeader} texture={true}>
        <p>Content</p>
      </PageLayout>
    );
  });
});
