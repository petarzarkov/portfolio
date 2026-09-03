import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import type { ContributionDay } from '@contracts';
import classes from './ActivityHeatmap.module.css';

const CELL = 11;
const GAP = 3;
const TOP = 16;
const LEFT = 24;

/** Five buckets, brand-tinted, so the scale reads at a glance. */
const LEVELS = [
  'var(--heat-empty)',
  'var(--mantine-color-brand-2)',
  'var(--mantine-color-brand-4)',
  'var(--mantine-color-brand-6)',
  'var(--mantine-color-brand-8)',
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Quantiles over the *non-zero* days rather than a fixed count.
 *
 * A fixed scale (1-3-6-9) is wrong for any given person: on a busy account
 * almost every cell saturates to the darkest shade and the map stops carrying
 * information. Quantiles keep the contrast wherever the distribution sits.
 */
const thresholds = (days: readonly ContributionDay[]): number[] => {
  const active = days
    .map((day) => day.count)
    .filter((count) => count > 0)
    .sort((a, b) => a - b);

  if (active.length === 0) return [1, 2, 3, 4];

  const at = (q: number): number => active[Math.floor(active.length * q)] ?? 1;
  return [1, at(0.4), at(0.7), at(0.9)];
};

export const ActivityHeatmap = ({
  days,
}: {
  days: readonly ContributionDay[];
}) => {
  const reduced = useReducedMotion();

  const { weeks, cuts, months } = useMemo(() => {
    const cuts = thresholds(days);
    const weeks: ContributionDay[][] = [];

    // The calendar starts on a Sunday, so the first week is padded to keep the
    // weekday rows aligned.
    const first = days[0];
    let current: ContributionDay[] = [];
    if (first) {
      for (let i = 0; i < new Date(first.date).getUTCDay(); i++) {
        current.push({ date: '', count: -1 });
      }
    }

    for (const day of days) {
      current.push(day);
      if (current.length === 7) {
        weeks.push(current);
        current = [];
      }
    }
    if (current.length > 0) weeks.push(current);

    const months: { label: string; week: number }[] = [];
    let seen = -1;
    weeks.forEach((week, index) => {
      const day = week.find((d) => d.date !== '');
      if (!day) return;
      const month = new Date(day.date).getUTCMonth();
      if (month !== seen) {
        seen = month;
        months.push({ label: MONTHS[month] ?? '', week: index });
      }
    });

    return { weeks, cuts, months };
  }, [days]);

  const level = (count: number): string => {
    if (count <= 0) return LEVELS[0] ?? '';
    const index = cuts.filter((cut) => count >= cut).length;
    return LEVELS[Math.min(index, LEVELS.length - 1)] ?? '';
  };

  const width = LEFT + weeks.length * (CELL + GAP);
  const height = TOP + 7 * (CELL + GAP) + 4;

  return (
    <div className={classes.wrap}>
      {/* oxlint-disable jsx-a11y/prefer-tag-over-role -- an inline <svg> cannot
          be an <img>; `role="img"` plus aria-label is the standard way to give
          a generated graphic a single accessible name. */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className={classes.svg}
        role="img"
        aria-label={`Contribution activity over the last year: ${days.filter((d) => d.count > 0).length} active days`}
      >
        {months.map((month) => (
          <text
            key={`${month.label}-${month.week}`}
            className={classes.label}
            x={LEFT + month.week * (CELL + GAP)}
            y={10}
          >
            {month.label}
          </text>
        ))}

        {['Mon', 'Wed', 'Fri'].map((label, index) => (
          <text
            key={label}
            className={classes.label}
            x={0}
            y={TOP + (index * 2 + 1) * (CELL + GAP) + CELL - 1}
          >
            {label}
          </text>
        ))}

        {weeks.map((week, x) =>
          week.map((day, y) => {
            if (day.count < 0) return null;
            return (
              <rect
                key={day.date}
                className={`${classes.day} ${reduced ? '' : classes.animated}`}
                x={LEFT + x * (CELL + GAP)}
                y={TOP + y * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2.5}
                fill={level(day.count)}
                // Diagonal sweep rather than left-to-right: it reads as one
                // gesture instead of 368 separate ones. Capped so the last
                // cell is not still animating a second later.
                style={
                  reduced
                    ? undefined
                    : { animationDelay: `${Math.min((x + y) * 8, 900)}ms` }
                }
              >
                <title>{`${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}</title>
              </rect>
            );
          }),
        )}
      </svg>
    </div>
  );
};
