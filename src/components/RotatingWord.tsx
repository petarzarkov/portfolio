import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import classes from './RotatingWord.module.css';

/**
 * Cycles one word in a sentence.
 *
 * Used in the hero to say what actually gets built without listing it: a single
 * noun that changes is read, where a comma-separated list of six is skimmed.
 *
 * The slot is sized to the longest word so the line never reflows, and the two
 * words share a grid cell so the outgoing one does not push the incoming one.
 */
export const RotatingWord = ({
  words,
  interval = 2200,
}: {
  words: readonly string[];
  interval?: number;
}) => {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);

  useEffect(() => {
    if (reduced === true || words.length < 2) return;

    const timer = setInterval(() => {
      setIndex((current) => {
        setPrevious(current);
        return (current + 1) % words.length;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval, reduced]);

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), '');
  const current = words[index] ?? '';

  if (reduced === true) return <span className={classes.word}>{current}</span>;

  return (
    <span
      className={classes.slot}
      // The accessible name is the whole set, announced once, rather than a
      // live region that interrupts a screen reader every two seconds.
      aria-label={words.join(', ')}
    >
      {/* Sizes the slot and is never seen. */}
      <span
        className={classes.word}
        style={{ visibility: 'hidden' }}
        aria-hidden
      >
        {longest}
      </span>
      {previous !== null && (
        <span
          key={`out-${previous}`}
          className={`${classes.word} ${classes.out}`}
          aria-hidden
        >
          {words[previous]}
        </span>
      )}
      <span
        key={`in-${index}`}
        className={`${classes.word} ${classes.in}`}
        aria-hidden
      >
        {current}
      </span>
    </span>
  );
};
