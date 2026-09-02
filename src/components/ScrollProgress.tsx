import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

/**
 * A hairline at the top of the viewport tracking read position.
 *
 * Driven by `useScroll`, which reads from the scroll timeline rather than a
 * scroll listener, so it does not add work to the scroll handler. Hidden
 * entirely under reduced motion — it is decoration, and a bar that jumps in
 * discrete steps is worse than no bar.
 */
export const ScrollProgress = () => {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 34,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX: width,
        transformOrigin: '0%',
        position: 'fixed',
        insetInline: 0,
        top: 0,
        height: 2,
        zIndex: 200,
        background: 'var(--mantine-color-brand-5)',
      }}
    />
  );
};
