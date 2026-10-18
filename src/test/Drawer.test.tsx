/**
 * Drawer — characterization tests (bjsdman/bjui#7 housekeeping: Drawer had none).
 *
 * Pins the documented contract: dialog semantics, focus in on open and back to the
 * trigger on close, Escape / close button / overlay close, panel clicks don't, Tab
 * trap, body scroll lock. Known defects are listed as todos against their follow-up
 * issue rather than encoded as expected behaviour.
 */
import { useRef, useState } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Drawer } from '../components/Drawer';

function Harness({ initialOpen = false, onClose }: { initialOpen?: boolean; onClose?: () => void }) {
  const [open, setOpen] = useState(initialOpen);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={trigger} type="button" onClick={() => setOpen(true)}>
        Open queue
      </button>
      <Drawer
        open={open}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
        title="Queue"
        titleId="queue-title"
        triggerRef={trigger}
      >
        <a href="#one">First link</a>
        <button type="button">Last button</button>
      </Drawer>
    </>
  );
}

const dialog = () => screen.getByRole('dialog');
const overlay = (container: HTMLElement) => container.querySelector('[aria-hidden="true"].fixed') as HTMLElement;

afterEach(() => {
  vi.restoreAllMocks();
  document.body.style.overflow = '';
});

describe('Drawer — rendering and semantics', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('is a modal dialog labelled by its title', () => {
    render(<Harness initialOpen />);
    expect(dialog()).toHaveAttribute('aria-modal', 'true');
    expect(dialog()).toHaveAttribute('aria-labelledby', 'queue-title');
    expect(screen.getByRole('dialog', { name: 'Queue' })).toBeInTheDocument();
  });

  it('renders its children inside the panel', () => {
    render(<Harness initialOpen />);
    expect(dialog()).toContainElement(screen.getByRole('link', { name: 'First link' }));
  });
});

describe('Drawer — focus', () => {
  it('moves focus to the close button when opened', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Open queue' }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: /^close/i })));
  });

  it('returns focus to the trigger when closed', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Open queue' }));
    await user.click(screen.getByRole('button', { name: /^close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open queue' }));
  });

  describe('Tab trap', () => {
    // jsdom has no layout, so offsetParent is always null and the visibility filter
    // would drop every element. Give attached elements a parent for these tests.
    const stubLayout = () =>
      vi.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockImplementation(function (this: HTMLElement) {
        return this.isConnected ? document.body : null;
      });

    it('Tab on the last focusable element wraps to the first', () => {
      stubLayout();
      render(<Harness initialOpen />);
      const last = screen.getByRole('button', { name: 'Last button' });
      last.focus();
      const ev = fireEvent.keyDown(document, { key: 'Tab' });
      expect(ev).toBe(false); // default prevented
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /^close/i }));
    });

    it('Shift+Tab on the first focusable element wraps to the last', () => {
      stubLayout();
      render(<Harness initialOpen />);
      screen.getByRole('button', { name: /^close/i }).focus();
      const ev = fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(ev).toBe(false);
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Last button' }));
    });

    it('Tab in the middle of the panel is left to the browser', () => {
      stubLayout();
      render(<Harness initialOpen />);
      screen.getByRole('link', { name: 'First link' }).focus();
      expect(fireEvent.keyDown(document, { key: 'Tab' })).toBe(true);
      expect(fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })).toBe(true);
    });

    it('with nothing visible to focus, Tab is swallowed', () => {
      render(<Harness initialOpen />); // no layout stub: every element reads as hidden
      expect(fireEvent.keyDown(document, { key: 'Tab' })).toBe(false);
    });
  });
});

describe('Drawer — closing', () => {
  it('Escape closes it', () => {
    const onClose = vi.fn();
    render(<Harness initialOpen onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Escape while closed does nothing', () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('the close button closes it', async () => {
    const onClose = vi.fn();
    render(<Harness initialOpen onClose={onClose} />);
    await userEvent.setup().click(screen.getByRole('button', { name: /^close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the overlay closes it; clicking inside the panel does not', () => {
    const onClose = vi.fn();
    const { container } = render(<Harness initialOpen onClose={onClose} />);
    fireEvent.click(screen.getByRole('link', { name: 'First link' }));
    fireEvent.click(dialog());
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(overlay(container));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stops listening for keys once unmounted', () => {
    const onClose = vi.fn();
    const { unmount } = render(<Harness initialOpen onClose={onClose} />);
    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Drawer — body scroll lock', () => {
  it('locks body scroll while open and releases it on close', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(document.body.style.overflow).toBe('');
    await user.click(screen.getByRole('button', { name: 'Open queue' }));
    expect(document.body.style.overflow).toBe('hidden');
    await user.click(screen.getByRole('button', { name: /^close/i }));
    expect(document.body.style.overflow).toBe('');
  });

  it('releases the lock if unmounted while open', () => {
    const { unmount } = render(<Harness initialOpen />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('Drawer — known defects (tracked in a follow-up issue, not fixed in #7)', () => {
  it.todo('does not move focus to the trigger on mount while closed (currently steals focus on page load)');
  it.todo('close button accessible name is configurable (currently hard-coded "Close activity queue")');
  it.todo('focus ring uses the accent token, not the retired hex #c45c14');
});
