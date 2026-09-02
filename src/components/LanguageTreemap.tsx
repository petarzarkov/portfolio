import { useMemo } from 'react';
import type { LanguageTotal } from '@contracts';
import { squarify } from './treemap';
import classes from './LanguageTreemap.module.css';

const WIDTH = 900;
const HEIGHT = 420;

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
        {cells.map((cell) => {
          const lang = byName.get(cell.name);
          if (!lang) return null;

          const isSelected = selected === cell.name;
          const dimmed = selected !== null && !isSelected;
          // Below roughly this size a label collides with the cell border.
          const showLabel = cell.width > 64 && cell.height > 34;
          const showSub = cell.width > 90 && cell.height > 56;

          return (
            <g
              key={cell.name}
              className={`${classes.cell} ${dimmed ? classes.dimmed : ''}`}
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
                  fontSize={Math.min(20, Math.max(13, cell.width / 11))}
                >
                  {lang.name}
                </text>
              )}
              {showSub && (
                <text
                  className={classes.sub}
                  x={cell.x + 12}
                  y={cell.y + 46}
                  fontSize={12}
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
