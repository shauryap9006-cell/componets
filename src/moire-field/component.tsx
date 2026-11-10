'use client';

import * as React from 'react';
import './styles.css';

export interface Props {
  initialAngle?: number;
  className?: string;
}
export default function MoireField({
  initialAngle = 3,
  className = '',
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [angle, setAngle] = React.useState(initialAngle);
  const id = React.useId();
  const move = (x: number, y: number) => {
    if (!ref.current) return;
    ref.current.style.setProperty('--moire-angle', x + 'deg');
    ref.current.style.setProperty('--moire-scale', String(1 + y * 0.03));
  };
  return (
    <div className={`hl-component moire-component ${className}`}>
      <div
        ref={ref}
        className="moire-pattern"
        style={{ '--moire-angle': angle + 'deg' } as React.CSSProperties}
        onPointerMove={(e) => {
          if (
            e.pointerType === 'touch' ||
            (typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) ||
            (typeof document !== 'undefined' && document.documentElement.dataset.reducedMotion === 'true')
          )
            return;
          const rect = e.currentTarget.getBoundingClientRect();
          move(
            ((e.clientX - rect.left) / rect.width) * 6,
            (e.clientY - rect.top) / rect.height,
          );
        }}
        onPointerLeave={() => move(angle, 0)}
        role="img"
        aria-label="Two overlapping parallel-line fields creating a moire interference pattern"
      >
        <div className="moire-layer first" />
        <div className="moire-layer second" />
        <span className="moire-cross" aria-hidden="true">
          +
        </span>
      </div>
      <div className="moire-control">
        <label htmlFor={id} className="hl-mono">
          INTERFERENCE
        </label>
        <input
          id={id}
          type="range"
          min="0"
          max="6"
          step="0.1"
          value={angle}
          aria-label="Angle of interference in degrees"
          onChange={(e) => {
            const next = Number(e.target.value);
            setAngle(next);
            move(next, 0);
          }}
        />
        <output className="hl-mono">{angle.toFixed(1)}°</output>
      </div>
    </div>
  );
}
