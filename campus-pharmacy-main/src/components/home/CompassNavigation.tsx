import React, { useState, useEffect, useRef } from 'react';

interface CompassProps {
  mouseX: number;
  mouseY: number;
  isDark?: boolean;
}

export const CompassNavigation: React.FC<CompassProps> = ({ mouseX, mouseY, isDark = true }) => {
  const compassRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const tiltRef = useRef({ x: 0, y: 0 });
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const [, forceRender] = useState(0);
  const rafRef = useRef<number>(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      // Rotation — smooth, slows when hovered
      rotationRef.current += hovered ? 0.06 : 0.025;
      // Tilt — lerp to target
      tiltRef.current.x += (targetTiltRef.current.x - tiltRef.current.x) * 0.18;
      tiltRef.current.y += (targetTiltRef.current.y - tiltRef.current.y) * 0.18;
      forceRender(n => n + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [hovered]);

  // Mouse tilt
  useEffect(() => {
    if (!compassRef.current) return;
    const rect = compassRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-1, Math.min(1, (mouseX - cx) / (rect.width / 2)));
    const dy = Math.max(-1, Math.min(1, (mouseY - cy) / (rect.height / 2)));
    targetTiltRef.current = { x: -dy * 12, y: dx * 12 };
  }, [mouseX, mouseY]);

  const rot = rotationRef.current;
  const bearing = Math.round(((rot % 360) + 360) % 360);
  const tx = tiltRef.current.x;
  const ty = tiltRef.current.y;

  // SVG-based compass for pixel-perfect rendering
  const size = 100;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 46;
  const innerR = 32;
  const midR = 24;
  const coreR = 16;

  const cardinals = [
    { deg: 0, label: 'N', color: '#f43f5e', glow: '#f43f5e' },
    { deg: 90, label: 'E', color: isDark ? '#06b6d4' : '#2563eb', glow: isDark ? '#06b6d4' : '#2563eb' },
    { deg: 180, label: 'S', color: '#8b5cf6', glow: '#8b5cf6' },
    { deg: 270, label: 'W', color: isDark ? '#06b6d4' : '#2563eb', glow: isDark ? '#06b6d4' : '#2563eb' },
  ];

  // Accent colour RGB triplet — cyan in dark, blue in light
  const ac = isDark ? '6,182,212' : '37,99,235';
  const muted = isDark ? '148,163,184' : '71,85,105';
  const ordinals = [
    { deg: 45, label: 'NE' }, { deg: 135, label: 'SE' },
    { deg: 225, label: 'SW' }, { deg: 315, label: 'NW' },
  ];

  const toXY = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
  };

  return (
    <div
      ref={compassRef}
      className="compass-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: '1400px' }}
    >
      <div
        className="compass-body"
        style={{
          transform: `rotateX(${tx}deg) rotateY(${ty}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient glow behind compass */}
        <div className="compass-ambient-glow" />

        {/* Outer metallic bezel ring */}
        <div className="compass-bezel" />

        {/* SVG compass face */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="compass-svg"
          style={{ filter: `drop-shadow(0 0 2px rgba(${ac},0.15))` }}
        >
          <defs>
            <radialGradient id="compassBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`rgba(${ac},0.06)`} />
              <stop offset="60%" stopColor={`rgba(${ac},0.02)`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0891b2" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glowStrong">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background fill */}
          <circle cx={cx} cy={cy} r={outerR} fill="url(#compassBg)" />

          {/* ── Outer rotating group ─────────────────────────────── */}
          <g transform={`rotate(${rot} ${cx} ${cy})`}>
            {/* Outer ring */}
            <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={`rgba(${ac},0.18)`} strokeWidth="0.6" />
            <circle cx={cx} cy={cy} r={outerR - 1.2} fill="none" stroke={`rgba(${ac},0.06)`} strokeWidth="0.3" />

            {/* Degree ticks — 360 of them for density */}
            {Array.from({ length: 360 }, (_, i) => {
              const isMajor = i % 30 === 0;
              const isMedium = i % 10 === 0;
              const isMinor = i % 5 === 0;
              if (!isMinor) return null;
              const len = isMajor ? 4.5 : isMedium ? 2.8 : 1.4;
              const p1 = toXY(i, outerR - 0.8);
              const p2 = toXY(i, outerR - 0.8 - len);
              return (
                <line
                  key={i}
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={isMajor ? `rgba(${ac},0.85)` : isMedium ? `rgba(${ac},0.4)` : `rgba(${ac},0.15)`}
                  strokeWidth={isMajor ? 0.8 : 0.4}
                  filter={isMajor ? 'url(#glow)' : undefined}
                />
              );
            })}

            {/* Degree numbers at 30° intervals */}
            {Array.from({ length: 12 }, (_, i) => {
              const deg = i * 30;
              if (deg % 90 === 0) return null; // skip cardinals — they get letters
              const pos = toXY(deg, outerR - 7.5);
              return (
                <text
                  key={deg}
                  x={pos.x} y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={`rgba(${muted},0.45)`}
                  fontSize="3"
                  fontFamily="'Inter','SF Pro Display',system-ui,sans-serif"
                  fontWeight="500"
                  transform={`rotate(${-rot} ${pos.x} ${pos.y})`}
                >
                  {deg}
                </text>
              );
            })}

            {/* Cardinal labels */}
            {cardinals.map(({ deg, label, color }) => {
              const pos = toXY(deg, outerR - 7.5);
              return (
                <text
                  key={label}
                  x={pos.x} y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={color}
                  fontSize="5.5"
                  fontFamily="'Inter','SF Pro Display',system-ui,sans-serif"
                  fontWeight="800"
                  filter="url(#glow)"
                  transform={`rotate(${-rot} ${pos.x} ${pos.y})`}
                >
                  {label}
                </text>
              );
            })}

            {/* Ordinal labels */}
            {ordinals.map(({ deg, label }) => {
              const pos = toXY(deg, outerR - 7);
              return (
                <text
                  key={label}
                  x={pos.x} y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={`rgba(${muted},0.35)`}
                  fontSize="2.8"
                  fontFamily="'Inter','SF Pro Display',system-ui,sans-serif"
                  fontWeight="600"
                  letterSpacing="0.5"
                  transform={`rotate(${-rot} ${pos.x} ${pos.y})`}
                >
                  {label}
                </text>
              );
            })}
          </g>

          {/* ── Static inner elements ───────────────────────────── */}
          {/* Inner rings */}
          <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={`rgba(${ac},0.1)`} strokeWidth="0.4" />
          <circle cx={cx} cy={cy} r={midR} fill="none" stroke={`rgba(${ac},0.06)`} strokeWidth="0.3" strokeDasharray="1.2 2" />
          <circle cx={cx} cy={cy} r={coreR} fill="none" stroke={`rgba(${ac},0.04)`} strokeWidth="0.3" />

          {/* Crosshair lines */}
          <line x1={cx - innerR + 3} y1={cy} x2={cx + innerR - 3} y2={cy} stroke={`rgba(${ac},0.06)`} strokeWidth="0.3" />
          <line x1={cx} y1={cy - innerR + 3} x2={cx} y2={cy + innerR - 3} stroke={`rgba(${ac},0.06)`} strokeWidth="0.3" />

          {/* Diagonal crosshairs */}
          {[45, 135].map(deg => {
            const p1 = toXY(deg, innerR - 6);
            const p2 = toXY(deg + 180, innerR - 6);
            return (
              <line key={deg} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={`rgba(${ac},0.03)`} strokeWidth="0.2" strokeDasharray="0.8 1.5" />
            );
          })}

          {/* ── Needle (counter-rotates to stay north) ───────── */}
          <g transform={`rotate(${-rot} ${cx} ${cy})`}>
            {/* North needle */}
            <polygon
              points={`${cx},${cy - innerR + 5} ${cx - 2.2},${cy - 2} ${cx},${cy - 5} ${cx + 2.2},${cy - 2}`}
              fill="rgba(244,63,94,0.9)"
              filter="url(#glowStrong)"
            />
            {/* South needle */}
            <polygon
              points={`${cx},${cy + innerR - 5} ${cx - 1.8},${cy + 2} ${cx},${cy + 4} ${cx + 1.8},${cy + 2}`}
              fill={`rgba(${muted},0.25)`}
            />
            {/* Needle center cap */}
            <circle cx={cx} cy={cy} r="2.5" fill={isDark ? 'rgba(8,10,20,0.9)' : 'rgba(255,255,255,0.92)'} stroke={`rgba(${ac},0.3)`} strokeWidth="0.5" />
          </g>

          {/* Center glow dot */}
          <circle cx={cx} cy={cy} r="1.5" fill="url(#centerGlow)" filter="url(#glow)" />

          {/* Pulse rings */}
          <circle cx={cx} cy={cy} r="3" fill="none" stroke={`rgba(${ac},0.3)`} strokeWidth="0.3" className="compass-pulse-ring-1" />
          <circle cx={cx} cy={cy} r="5" fill="none" stroke={`rgba(${ac},0.15)`} strokeWidth="0.2" className="compass-pulse-ring-2" />
        </svg>

        {/* Bearing readout — inside compass, bottom center */}
        <div className="compass-bearing-inside">
          <span className="compass-bearing-label">HDG</span>
          <span className="compass-bearing-value-sm">{String(bearing).padStart(3, '0')}°</span>
        </div>
      </div>
    </div>
  );
};
