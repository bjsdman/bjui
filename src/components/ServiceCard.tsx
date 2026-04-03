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
}: ServiceCardProps) {
  const isInteractive = Boolean(href || onClick);

  const cardContent = (
    <div className="flex flex-col h-full">
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {icon && (
          <span className="w-8 h-8 flex-shrink-0 text-primary-400 flex items-center justify-center">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-neutral-100 leading-tight">
              {name}
            </h3>
            {category && (
              <span className="text-xs font-medium bg-neutral-700 text-neutral-300 rounded px-2 py-0.5 flex-shrink-0">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
          {description}
        </p>
      )}
      {!description && <div className="flex-1" />}

      {/* Divider */}
      <div className="border-t border-neutral-700/50 pt-3">
        {/* Status row */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={status} size="sm" />
          {responseTime !== undefined && (
            <span className="text-xs font-mono text-accent-cyan flex-shrink-0">
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
      </div>
    </div>
  );

  const cardClasses = [
    'relative min-h-[140px] p-6 rounded-lg border transition-all duration-150',
    'bg-neutral-800 dark:bg-neutral-800',
    status === 'online'
      ? 'border-neutral-700 hover:border-primary-700 shadow-sm hover:shadow-md hover:-translate-y-px'
      : 'border-neutral-700 hover:border-primary-700 shadow-sm hover:shadow-md hover:-translate-y-px',
    isInteractive ? 'cursor-pointer active:scale-[0.99]' : '',
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
