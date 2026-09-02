import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Counts up to `value` once, when it first scrolls into view.
 *
 * Once, and only on the way in: a number that re-animates every time it
 * scrolls past is a distraction rather than an accent. Under reduced motion it
 * simply renders the final value.
 */
export const CountUp = ({
  value,
  duration = 900,
  format = (n: number) => n.toLocaleString(),
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) => {
  const reduced = useReducedMotion();
  const [counted, setCounted] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  // Derived rather than pushed into state by an effect: under reduced motion
  // the final value is simply what renders, with no animation to short-circuit.
  const shown = reduced === true ? value : counted;

  useEffect(() => {
    if (reduced === true) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting !== true) return;
        observer.disconnect();

        const started = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - started) / duration, 1);
          // Ease-out cubic: fast first, settling rather than stopping dead.
          setCounted(Math.round(value * (1 - (1 - t) ** 3)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration, reduced]);

  return <span ref={ref}>{format(shown)}</span>;
};
