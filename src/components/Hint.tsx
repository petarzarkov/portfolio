import type { ReactNode } from 'react';
import classes from './Hint.module.css';

/**
 * The label a pointer user sees on an icon-only control.
 *
 * Replaces `@mantine/core`'s Tooltip - see the note in `Hint.module.css` for
 * why. Purely decorative: every control it wraps carries the same string in its
 * own `aria-label`, which is what assistive technology reads.
 */
export const Hint = ({
  label,
  align = 'center',
  children,
}: {
  label: string;
  /** `end` pins the hint to the right edge, for controls near it. */
  align?: 'center' | 'end';
  children: ReactNode;
}) => (
  <span
    className={
      align === 'end' ? `${classes.hint} ${classes.end}` : classes.hint
    }
    data-hint={label}
  >
    {children}
  </span>
);
