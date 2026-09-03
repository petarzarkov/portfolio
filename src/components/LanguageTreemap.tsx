import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import type { LanguageTotal } from '@contracts';
import { squarify } from './treemap';
import classes from './LanguageTreemap.module.css';

const WIDTH = 900;
const HEIGHT = 420;

/**
 * The narrowest the map is ever painted, in real pixels.
 *
 * `width: 100%` on its own let a 900-unit viewBox scale down to whatever a
 * phone had - about 360px - so every label rendered at roughly a third of its
 * nominal size and the small cells became illegible smudges. The stylesheet
 * holds the svg to this width and lets `.wrap` scroll instead, which is what
 * ActivityHeatmap already does; the two must agree, so this is the number.
 *
 * Chosen against the treemap's own purpose rather than pushed as high as
 * legibility allows. Area *is* the message here, so a reader who can only see
 * half the map has lost the comparison the chart exists to make; at 520 most of
 * it is on a 390px screen at once, labels still land at 13px or better, and the
 * cells too small to letter drop their labels rather than shrinking them.
 */
const MIN_RENDERED_WIDTH = 520;

/**
 * Worst-case units-per-pixel. `cell.width` is in viewBox units, so comparing it
 * against a pixel threshold was measuring the wrong space entirely: a cell 64
 * units wide is 64px on a desktop and 45px on a phone, and the guard below is
 * about whether a *rendered* label fits.
 */
const SCALE = MIN_RENDERED_WIDTH / WIDTH;

/** Rendered pixels -> viewBox units, at the tightest layout the map is shown at. */
const px = (pixels: number): number => pixels / SCALE;

/**
 * Languages as area, with the selected one driving the rest of the page.
 *
 * Every cell is a real `<button>` inside a `<foreignObject>`-free SVG - a
 * `<g role="button" tabIndex={0}>` with key handling - so the whole map is
 * keyboard operable. A table equivalent lives next to it in Skills.tsx for
 * anyone who cannot use it at all.
 */
export const LanguageTreemap = ({
  languages,
  selected,
  onSelect,
}: {
  languages: readonly LanguageTotal[];
  selected: string | null;
  onSelect: (name: string | null) => void;
}) => {
  const reduced = useReducedMotion();

  const cells = useMemo(
    () =>
      squarify(
        languages.map((l) => ({ name: l.name, value: l.bytes })),
        WIDTH,
        HEIGHT,
      ),
    [languages],
  );

  const byName = useMemo(
    () => new Map(languages.map((l) => [l.name, l])),
    [languages],
  );

  return (
    <div className={classes.wrap}>
      {/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG has no <button>
          or <fieldset> element; inside an <svg>, an ARIA role on <g> is the
          only way to expose interactive structure to assistive technology. */}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={classes.svg}
        role="group"
        aria-label="Languages by volume of code written"
      >
        {cells.map((cell, index) => {
          const lang = byName.get(cell.name);
          if (!lang) return null;

          const isSelected = selected === cell.name;
          const dimmed = selected !== null && !isSelected;
          // Below roughly this size a label collides with the cell border.
          const showLabel = cell.width > px(46) && cell.height > px(24);
          // 90 was too tight: "2.1% · 121 repos" overflowed the Other cell.
          const showSub = cell.width > px(89) && cell.height > px(40);

          return (
            <g
              key={cell.name}
              className={[
                classes.cell,
                dimmed ? classes.dimmed : '',
                isSelected ? classes.selected : '',
                reduced ? '' : classes.enter,
              ]
                .filter(Boolean)
                .join(' ')}
              style={
                reduced ? undefined : { animationDelay: `${index * 28}ms` }
              }
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`${lang.name}, ${(lang.share * 100).toFixed(1)} percent, ${lang.repos} repositories`}
              onClick={() => onSelect(isSelected ? null : cell.name)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(isSelected ? null : cell.name);
                }
                if (event.key === 'Escape') onSelect(null);
              }}
            >
              <rect
                className={classes.rect}
                x={cell.x}
                y={cell.y}
                width={cell.width}
                height={cell.height}
                rx={6}
                fill={lang.color ?? '#64748b'}
              />
              {showLabel && (
                <text
                  className={classes.label}
                  x={cell.x + 12}
                  y={cell.y + 26}
                  fontSize={Math.min(22, Math.max(px(13), cell.width / 11))}
                >
                  {lang.name}
                </text>
              )}
              {showSub && (
                <text
                  className={classes.sub}
                  x={cell.x + 12}
                  y={cell.y + 46}
                  fontSize={px(11)}
                >
                  {`${(lang.share * 100).toFixed(1)}% · ${lang.repos} repos`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
