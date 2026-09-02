import { useReducedMotion } from 'motion/react';
import classes from './TextReveal.module.css';

/**
 * Words rise into place, staggered.
 *
 * Split on words rather than characters: per-character stagger on a heading
 * reads as a novelty effect and, more practically, screen readers announce a
 * pile of single letters. Each word keeps its own `overflow: hidden` mask so
 * the rise looks like type being set rather than text fading in.
 */
export const TextReveal = ({
  text,
  delay = 0,
  step = 0.055,
  className,
}: {
  text: string;
  delay?: number;
  step?: number;
  className?: string;
}) => {
  const reduced = useReducedMotion();

  if (reduced) return <span className={className}>{text}</span>;

  const words = text.split(' ');

  return (
    // One accessible string; the per-word spans are decorative.
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <span
          // Words repeat, so the index is part of the identity.
          key={`${word}-${index}`}
          className={classes.line}
          aria-hidden
        >
          <span
            className={classes.word}
            style={{ animationDelay: `${delay + index * step}s` }}
          >
            {/* The separator is inside a template literal on purpose. Written
                as a JSX text node, a formatter rewrites the space to a
                non-breaking one - which renders identically and then refuses to
                wrap, so a long heading overflows instead of breaking. */}
            {index === words.length - 1 ? word : `${word} `}
          </span>
        </span>
      ))}
    </span>
  );
};
