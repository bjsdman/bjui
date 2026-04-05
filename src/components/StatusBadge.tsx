export type StatusValue = 'online' | 'offline' | 'degraded' | 'unknown';

export interface StatusBadgeProps {
  status: StatusValue;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDot?: boolean;
  label?: string;
  pulse?: boolean;
}

const statusConfig: Record<
  StatusValue,
  { dotClass: string; bgClass: string; textClass: string; defaultLabel: string }
> = {
  online: {
    dotClass: 'bg-success-400',
    bgClass: 'bg-success-900/30',
    textClass: 'text-success-400',
    defaultLabel: 'ONLINE',
  },
  offline: {
    dotClass: 'bg-error-400',
    bgClass: 'bg-error-900/30',
    textClass: 'text-error-400',
    defaultLabel: 'OFFLINE',
  },
  degraded: {
    dotClass: 'bg-warning-400',
    bgClass: 'bg-warning-900/30',
    textClass: 'text-warning-400',
    defaultLabel: 'DEGRADED',
  },
  unknown: {
    dotClass: 'bg-info-400',
    bgClass: 'bg-info-900/30',
    textClass: 'text-info-400',
    defaultLabel: 'UNKNOWN',
  },
};

const sizeConfig = {
  sm: {
    dotSize: 'w-1.5 h-1.5',
    font: 'text-[11px]',
    padding: 'px-1.5 py-0.5',
  },
  md: {
    dotSize: 'w-2 h-2',
    font: 'text-xs',
    padding: 'px-2 py-1',
  },
  lg: {
    dotSize: 'w-2.5 h-2.5',
    font: 'text-sm',
    padding: 'px-3 py-1.5',
  },
};

export function StatusBadge({
  status,
  size = 'md',
  showLabel = true,
  showDot = true,
  label,
  pulse,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeStyle = sizeConfig[size];
  const shouldPulse = pulse ?? status === 'online';
  const displayLabel = label ?? config.defaultLabel;

  return (
    <span
      role="status"
      aria-label={`Service status: ${displayLabel.toLowerCase()}`}
      className={[
        'inline-flex items-center gap-1.5 rounded font-mono font-medium uppercase',
        config.bgClass,
        config.textClass,
        sizeStyle.font,
        sizeStyle.padding,
      ].join(' ')}
    >
      {showDot && (
        <span className="relative inline-flex items-center justify-center">
          <span
            className={[
              'rounded-full',
              config.dotClass,
              sizeStyle.dotSize,
            ].join(' ')}
          />
          {shouldPulse && (
            <span
              className={[
                'absolute rounded-full animate-ping opacity-75',
                config.dotClass,
                sizeStyle.dotSize,
              ].join(' ')}
            />
          )}
        </span>
      )}
      {showLabel && <span>{displayLabel}</span>}
    </span>
  );
}
