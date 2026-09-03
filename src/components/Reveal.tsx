import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Scroll entrance: a small rise and a fade, once.
 *
 * `once: true` is deliberate. Re-animating on scroll-back is the single most
 * common way a "tasteful" motion system becomes irritating - the reader has
 * already seen the content and is scrolling back to re-read it.
 *
 * Under `prefers-reduced-motion` this renders its children with no wrapper
 * animation at all, rather than a faster one.
 */
export const Reveal = ({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) => {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
