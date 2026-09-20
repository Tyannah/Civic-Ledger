import React from 'react';

/**
 * Concentric arc vector graphics mirroring the Civic education presentation theme
 */
export const ConcentricArcs: React.FC<{
  className?: string;
  color?: string;
  size?: number;
  orientation?: 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';
}> = ({ className = '', color = '#1E2522', size = 120, orientation = 'top-right' }) => {
  // Rotations for different corners
  const rotation =
    orientation === 'top-right'
      ? 'rotate-0'
      : orientation === 'bottom-left'
      ? 'rotate-180'
      : orientation === 'top-left'
      ? '-rotate-90'
      : 'rotate-90';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none transition-opacity ${rotation} ${className}`}
      aria-hidden="true"
    >
      <path d="M100 10 C 50 10, 10 50, 10 100" stroke={color} strokeWidth="2.5" fill="none" opacity="0.85" />
      <path d="M100 24 C 58 24, 24 58, 24 100" stroke={color} strokeWidth="2.5" fill="none" opacity="0.85" />
      <path d="M100 38 C 66 38, 38 66, 38 100" stroke={color} strokeWidth="2.5" fill="none" opacity="0.85" />
      <path d="M100 52 C 74 52, 52 74, 52 100" stroke={color} strokeWidth="2.5" fill="none" opacity="0.85" />
      <path d="M100 66 C 82 66, 66 82, 66 100" stroke={color} strokeWidth="2.5" fill="none" opacity="0.85" />
    </svg>
  );
};

/**
 * Grid of decorative dots matching the slide corners
 */
export const DotGrid: React.FC<{
  rows?: number;
  cols?: number;
  color?: string;
  className?: string;
}> = ({ rows = 3, cols = 6, color = '#3A543E', className = '' }) => {
  return (
    <div
      className={`grid gap-2 pointer-events-none select-none ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
