import React from 'react';
import { StatusBadge, StatusValue } from './StatusBadge';

export interface ServiceCardProps {
  name: string;
  description?: string;
  url?: string;
  status?: StatusValue;
  icon?: React.ReactNode;
  category?: string;
  responseTime?: number;
  uptime?: number;
  lastChecked?: Date;
  onClick?: () => void;
  href?: string;
  /** Optional link label for the "Learn more" style link at the bottom */
  linkLabel?: string;
}

export function ServiceCard({
  name,
  description,
  url,
  status = 'unknown',
  icon,
  category,
  responseTime,
  uptime,
  lastChecked,
  onClick,
  href,
  linkLabel,
}: ServiceCardProps) {
  const isInteractive = Boolean(href || onClick);

  const cardContent = (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Top copper accent bar — slides in on hover (group-hover via parent) */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
        style={{ background: 'linear-gradient(90deg, #a84c10, #d97030)' }}
        aria-hidden="true"
      />

      {/* Header row */}
      <div className="flex items-start gap-3 mb-4 pt-1">
        {icon && (
          <span
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-[10px] text-accent-500"
            style={{ background: 'rgba(196,92,20,0.12)' }}
          >
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[1.1rem] font-semibold text-neutral-100 leading-tight">
              {name}
            </h3>
            {category && (
              <span className="text-xs font-medium bg-primary-700 text-neutral-300 rounded px-2 py-0.5 flex-shrink-0">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1" style={{ lineHeight: '1.65' }}>
          {description}
        </p>
      )}
      {!description && <div className="flex-1" />}

      {/* Bottom section */}
      <div className="border-t border-primary-700/50 pt-3 mt-2">
        {/* Status row */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={status} size="sm" />
          {responseTime !== undefined && (
            <span className="text-xs font-mono text-neutral-400 flex-shrink-0">
              {responseTime}ms
            </span>
          )}
        </div>

        {/* URL */}
        {url && (
          <p className="text-xs font-mono text-neutral-500 mt-1.5 truncate">
            {url}
          </p>
        )}

        {/* Uptime + last checked */}
        {(uptime !== undefined || lastChecked) && (
          <div className="flex items-center gap-3 mt-1.5">
            {uptime !== undefined && (
              <span className="text-xs font-mono text-neutral-500">
                {uptime.toFixed(1)}% uptime
              </span>
            )}
            {lastChecked && (
              <span className="text-xs font-mono text-neutral-500 ml-auto">
                {lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

        {/* Optional link label */}
        {linkLabel && (
          <div className="mt-3 flex items-center gap-[6px] group-hover:gap-[10px] transition-all duration-150">
            <span className="text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-accent-500">
              {linkLabel}
            </span>
            <span className="text-accent-500 text-sm" aria-hidden="true">→</span>
          </div>
        )}
      </div>
    </div>
  );

  const cardClasses = [
    'group relative min-h-[140px] p-[36px_32px] rounded-lg border transition-all duration-200',
    'bg-primary-900 border-primary-700 shadow-card',
    isInteractive
      ? 'cursor-pointer hover:bg-primary-800 hover:border-[rgba(196,92,20,0.35)] hover:-translate-y-[2px] hover:shadow-card-lg active:scale-[0.99]'
      : '',
    'focus:outline-none focus:[outline:2px_solid_#c45c14] focus:outline-offset-2',
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <a
        href={href}
        aria-label={`${name} — ${status}`}
        className={cardClasses}
      >
        {cardContent}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${name} — ${status}`}
        className={`w-full text-left ${cardClasses}`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div
      aria-label={description ? undefined : `${name} — ${status}`}
      className={cardClasses}
    >
      {cardContent}
    </div>
  );
}
