import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type RevealType = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp';

export interface ScrollRevealOptions {
  /** Animation style. Default: 'fadeUp'. */
  type?: RevealType;
  /** Tween duration in seconds. Default: 0.8. */
  duration?: number;
  /** Delay before the tween fires (seconds). Default: 0. */
  delay?: number;
  /** Stagger between children when `animateChildren` is true. Default: 0.12. */
  stagger?: number;
  /** ScrollTrigger start position. Default: 'top 85%'. */
  start?: string;
  /** Animate direct children instead of the container element. Default: false. */
  animateChildren?: boolean;
}

function buildFromVars(type: RevealType): gsap.TweenVars {
  switch (type) {
    case 'fadeUp':    return { opacity: 0, y: 40 };
    case 'fadeIn':    return { opacity: 0 };
    case 'slideLeft': return { opacity: 0, x: -60 };
    case 'slideRight':return { opacity: 0, x: 60 };
    case 'scaleUp':   return { opacity: 0, scale: 0.88 };
    default:          return { opacity: 0, y: 40 };
  }
}

/**
 * Attaches a GSAP ScrollTrigger reveal animation to the returned ref.
 *
 * Usage:
 * ```tsx
 * const ref = useScrollReveal<HTMLDivElement>({ type: 'fadeUp' });
 * return <div ref={ref}>...</div>;
 * ```
 */
export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      type = 'fadeUp',
      duration = 0.8,
      delay = 0,
      stagger = 0.12,
      start = 'top 85%',
      animateChildren = false,
    } = options;

    const fromVars = buildFromVars(type);
    const target = animateChildren ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.from(target, {
        ...fromVars,
        duration,
        delay,
        stagger: animateChildren ? stagger : 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * Convenience wrapper – animates every direct child element of the container
 * with a staggered entrance when the container enters the viewport.
 *
 * Usage:
 * ```tsx
 * const ref = useStaggerReveal<HTMLDivElement>({ type: 'scaleUp' });
 * return <div ref={ref}><Card /><Card /><Card /></div>;
 * ```
 */
export function useStaggerReveal<T extends HTMLElement>(options: Omit<ScrollRevealOptions, 'animateChildren'> = {}) {
  return useScrollReveal<T>({ ...options, animateChildren: true });
}
