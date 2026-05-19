import React, { useEffect, useMemo, useRef, useState } from 'react';

export type TutorialPlacement = 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface TutorialStep {
  id: string;
  title: string;
  body: React.ReactNode;
  selector?: string; // CSS selector (can be comma-separated)
  placement?: TutorialPlacement;
}

interface HomeTutorialProps {
  open: boolean;
  isDark: boolean;
  runId: number;
  steps: TutorialStep[];
  onClose: (markSeen: boolean) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getViewportPadding() {
  return 12;
}

function getPopoverWidth() {
  return 360;
}

function resolveTarget(selector?: string): Element | null {
  if (!selector) return null;
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

function computePopoverPosition(params: {
  placement: TutorialPlacement;
  targetRect: DOMRect | null;
  popoverWidth: number;
}) {
  const padding = getViewportPadding();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const maxWidth = Math.max(240, Math.min(params.popoverWidth, vw - padding * 2));

  if (!params.targetRect || params.placement === 'center') {
    return {
      top: Math.round(vh / 2 - 140),
      left: Math.round(vw / 2 - maxWidth / 2),
      width: maxWidth,
      placementUsed: 'center' as const,
    };
  }

  const rect = params.targetRect;
  const offset = 14;

  const desiredPlacement: TutorialPlacement = params.placement === 'auto' ? 'bottom' : params.placement;

  let top = rect.bottom + offset;
  let left = rect.left + rect.width / 2 - maxWidth / 2;

  if (desiredPlacement === 'top') {
    top = rect.top - offset - 220;
  } else if (desiredPlacement === 'left') {
    top = rect.top + rect.height / 2 - 110;
    left = rect.left - offset - maxWidth;
  } else if (desiredPlacement === 'right') {
    top = rect.top + rect.height / 2 - 110;
    left = rect.right + offset;
  } else {
    // bottom
    top = rect.bottom + offset;
  }

  top = clamp(top, padding, vh - padding - 220);
  left = clamp(left, padding, vw - padding - maxWidth);

  return {
    top: Math.round(top),
    left: Math.round(left),
    width: Math.round(maxWidth),
    placementUsed: desiredPlacement,
  };
}

function computeArrow(params: {
  targetRect: DOMRect | null;
  popover: { top: number; left: number; width: number; placementUsed: TutorialPlacement };
}) {
  const rect = params.targetRect;
  if (!rect || params.popover.placementUsed === 'center') return { show: false as const };

  const pop = params.popover;
  const targetCenterX = rect.left + rect.width / 2;
  const targetCenterY = rect.top + rect.height / 2;

  // Determine which edge of the popover is closest to the target.
  const popCenterX = pop.left + pop.width / 2;
  const popCenterY = pop.top + 110;

  let side: 'top' | 'bottom' | 'left' | 'right' = 'top';
  const dx = targetCenterX - popCenterX;
  const dy = targetCenterY - popCenterY;
  if (Math.abs(dx) > Math.abs(dy)) {
    side = dx > 0 ? 'right' : 'left';
  } else {
    side = dy > 0 ? 'bottom' : 'top';
  }

  const arrowSize = 12;
  const inset = 18;

  if (side === 'top' || side === 'bottom') {
    const left = clamp(targetCenterX - pop.left - arrowSize / 2, inset, pop.width - inset);
    return { show: true as const, side, left };
  }

  const top = clamp(targetCenterY - pop.top - arrowSize / 2, 52, 220 - 52);
  return { show: true as const, side, top };
}

export const HomeTutorial: React.FC<HomeTutorialProps> = ({ open, isDark, runId, steps, onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [hasTarget, setHasTarget] = useState(false);
  const lastMeasuredStepIdRef = useRef<string | null>(null);

  const safeSteps = useMemo(() => steps.filter(Boolean), [steps]);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    lastMeasuredStepIdRef.current = null;
  }, [open, runId]);

  useEffect(() => {
    if (!open) return;

    const measure = () => {
      const step = safeSteps[stepIndex];
      if (!step) return;

      const target = resolveTarget(step.selector);
      if (!step.selector) {
        setTargetRect(null);
        setHasTarget(false);
        lastMeasuredStepIdRef.current = step.id;
        return;
      }

      if (!target) {
        setHasTarget(false);
        setTargetRect(null);
        lastMeasuredStepIdRef.current = step.id;
        return;
      }

      const rect = (target as HTMLElement).getBoundingClientRect();
      // If the element exists but is currently visually hidden/collapsed,
      // treat it as not targetable.
      if (rect.width < 2 || rect.height < 2) {
        setHasTarget(false);
        setTargetRect(null);
        lastMeasuredStepIdRef.current = step.id;
        return;
      }

      setTargetRect(rect);
      setHasTarget(true);
      lastMeasuredStepIdRef.current = step.id;
    };

    let rafId = 0;
    const requestMeasure = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        measure();
      });
    };

    requestMeasure();

    const onScrollOrResize = () => {
      if (!open) return;
      requestMeasure();
    };

    const observer = new MutationObserver(() => requestMeasure());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, safeSteps, stepIndex]);

  if (!open) return null;

  const step = safeSteps[stepIndex];
  if (!step) return null;

  const placement: TutorialPlacement = step.placement ?? 'auto';
  const popover = computePopoverPosition({
    placement,
    targetRect: hasTarget ? targetRect : null,
    popoverWidth: getPopoverWidth(),
  });

  const arrow = computeArrow({
    targetRect: hasTarget ? targetRect : null,
    popover,
  });

  const highlightStyle: React.CSSProperties | undefined = hasTarget && targetRect
    ? {
        top: Math.round(targetRect.top) - 6,
        left: Math.round(targetRect.left) - 6,
        width: Math.round(targetRect.width) + 12,
        height: Math.round(targetRect.height) + 12,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
      }
    : undefined;

  const total = safeSteps.length;
  const current = stepIndex + 1;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-modal={false} role="dialog">
      {/* Spotlight / overlay */}
      {hasTarget && highlightStyle ? (
        <div
          className="fixed rounded-2xl ring-2 ring-cyan-400/70 pointer-events-none"
          style={highlightStyle}
        />
      ) : (
        <div
          className="fixed inset-0 bg-black/60 pointer-events-none"
        />
      )}

      {/* Popover */}
      <div
        className={
          `fixed rounded-2xl border shadow-xl pointer-events-auto ` +
          (isDark
            ? 'bg-[#060c18]/95 border-white/10 text-white'
            : 'bg-white/95 border-gray-200 text-slate-900')
        }
        style={{
          top: popover.top,
          left: popover.left,
          width: popover.width,
          maxWidth: `calc(100vw - ${getViewportPadding() * 2}px)`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Bubble pointer */}
        {arrow.show && (
          <div
            className={
              `absolute w-3 h-3 rotate-45 ` +
              (isDark ? 'bg-[#060c18]/95 border-white/10' : 'bg-white/95 border-gray-200')
            }
            style={{
              borderWidth: 1,
              borderStyle: 'solid',
              ...(arrow.side === 'top'
                ? { top: -6, left: (arrow as any).left }
                : arrow.side === 'bottom'
                  ? { bottom: -6, left: (arrow as any).left }
                  : arrow.side === 'left'
                    ? { left: -6, top: (arrow as any).top }
                    : { right: -6, top: (arrow as any).top }),
            }}
          />
        )}

        {/* Header accent */}
        <div
          className={
            `h-[3px] w-full rounded-t-2xl ` +
            (isDark
              ? 'bg-gradient-to-r from-cyan-500/30 via-purple-500/20 to-pink-500/30'
              : 'bg-gradient-to-r from-blue-600/40 via-indigo-600/25 to-fuchsia-600/35')
          }
        />

        <div className="px-4 pt-4 pb-2 flex items-start gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.18em] opacity-70">Tutorial</div>
            <div className="text-base font-semibold leading-snug">{step.title}</div>
          </div>
          <button
            className={
              `ml-auto shrink-0 text-xs font-medium px-2 py-1 rounded-lg transition-colors ` +
              (isDark ? 'hover:bg-white/10' : 'hover:bg-black/5')
            }
            onClick={() => onClose(true)}
          >
            Skip
          </button>
        </div>

        <div className="px-4 pb-3 text-sm leading-relaxed opacity-90">
          {step.body}
        </div>

        <div className={
          `px-4 pb-4 flex items-center justify-between gap-3 ` +
          (isDark ? 'text-white/80' : 'text-slate-600')
        }>
          <div className="text-xs tabular-nums">
            {current} / {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              className={
                `text-xs font-semibold px-3 py-2 rounded-xl transition-colors ` +
                (isDark
                  ? 'bg-white/10 hover:bg-white/15'
                  : 'bg-slate-100 hover:bg-slate-200')
              }
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
            >
              Back
            </button>
            {stepIndex < total - 1 ? (
              <button
                className={
                  `text-xs font-semibold px-3 py-2 rounded-xl transition-colors ` +
                  (isDark
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white')
                }
                onClick={() => setStepIndex((i) => Math.min(total - 1, i + 1))}
              >
                Next
              </button>
            ) : (
              <button
                className={
                  `text-xs font-semibold px-3 py-2 rounded-xl transition-colors ` +
                  (isDark
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white')
                }
                onClick={() => onClose(true)}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
