export type StatusValue = 'online' | 'offline' | 'degraded' | 'unknown';

/** Generic semantic tone, decoupled from service status. */
export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusBadgeProps {
  /** Service status. Ignored for colour when `tone` is given. Defaults to 'unknown'. */
  status?: StatusValue;
  /**
   * Generic tone. When given it drives colours, the aria-label is `label`
   * itself (not "Service status: ..."), and the dot does not pulse unless
   * `pulse` is set. Pass `label`; it defaults to the tone in upper case.
   */
  tone?: StatusTone;
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

interface ColourConfig {
  dotClass: string;
  textClass: string;
  /** Legacy status badges set their tint inline; kept as-is for byte-identical output. */
  bgColor?: string;
  bgClass?: string;
}

// Coloured tones reuse the status palette (design-system §3.4 mapping):
// success = online, warning = degraded, error = offline, info = unknown.
const toneConfig: Record<StatusTone, ColourConfig> = {
  success: statusConfig.online,
  warning: statusConfig.degraded,
  error: statusConfig.offline,
  info: statusConfig.unknown,
  // design-system §5.5 "Neutral badge": primary-700 bg, neutral-400 text.
  neutral: {
    dotClass: 'bg-neutral-400',
    textClass: 'text-neutral-400',
    bgClass: 'bg-primary-700',
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
  status = 'unknown',
  tone,
  size = 'md',
  showLabel = true,
  showDot = true,
  label,
  pulse,
}: StatusBadgeProps) {
  const sizeStyle = sizeConfig[size];
  const config: ColourConfig = tone ? toneConfig[tone] : statusConfig[status];
  const shouldPulse = pulse ?? (!tone && status === 'online');
  const displayLabel = label ?? (tone ? tone.toUpperCase() : statusConfig[status].defaultLabel);
  const ariaLabel = tone ? displayLabel : `Service status: ${displayLabel.toLowerCase()}`;

  return (
    <span
      role="status"
      aria-label={ariaLabel}
      style={config.bgColor ? { backgroundColor: config.bgColor } : undefined}
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase',
        config.textClass,
        ...(config.bgClass ? [config.bgClass] : []),
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
