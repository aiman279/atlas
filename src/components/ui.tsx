import type { ReactNode } from 'react';
import './ui.css';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`card ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}

export function StatPill({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="stat-pill">
      <span className="stat-icon" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

export function ProgressRing({
  progress,
  size = 120,
  stroke = 8,
  label,
  sublabel,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, progress)) / 100) * c;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--stone-soft)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--sage)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="progress-ring-label">
        {label && <span className="progress-ring-pct">{label}</span>}
        {sublabel && <span className="progress-ring-sub">{sublabel}</span>}
      </div>
    </div>
  );
}

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={progress}>
      <span style={{ width: `${Math.min(100, progress)}%` }} />
    </div>
  );
}

export function BackButton({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className="back-btn" onClick={onClick}>
      ← {label}
    </button>
  );
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return <p className="empty-hint">{children}</p>;
}
