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
  { dotClass: string; bgColor: string; textClass: string; defaultLabel: string }
> = {
  online: {
    dotClass: 'bg-success-400',
    bgColor: 'rgba(91,168,111,0.12)',
    textClass: 'text-success-500',
    defaultLabel: 'ONLINE',
  },
  offline: {
    dotClass: 'bg-error-400',
    bgColor: 'rgba(201,85,74,0.12)',
    textClass: 'text-error-500',
    defaultLabel: 'OFFLINE',
  },
  degraded: {
    dotClass: 'bg-warning-400',
    bgColor: 'rgba(214,162,74,0.12)',
    textClass: 'text-warning-500',
    defaultLabel: 'DEGRADED',
  },
  unknown: {
    dotClass: 'bg-info-400',
    bgColor: 'rgba(83,120,168,0.12)',
    textClass: 'text-info-500',
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
      style={{ backgroundColor: config.bgColor }}
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase',
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
