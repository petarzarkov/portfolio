import { Tooltip, VisuallyHidden } from '@mantine/core';
import { THEMES } from '../../theme/themes';
import { useTheme } from '../../theme/useTheme';
import classes from './ThemePicker.module.css';

/**
 * Picks a theme, one swatch each.
 *
 * Driven entirely by the `THEMES` list, so adding a palette is a block in
 * `themes.css` and an entry in `themes.ts` - nothing here changes.
 */
export const ThemePicker = ({ label = true }: { label?: boolean }) => {
  const { current, setTheme } = useTheme();

  return (
    /* A <fieldset>, not a div with role="group": these are related controls,
       which is the element's actual job, and it needs no ARIA to say so. */
    <fieldset className={classes.row}>
      {label && <VisuallyHidden component="legend">Theme</VisuallyHidden>}
      {THEMES.map((entry) => (
        <Tooltip key={entry.id} label={entry.label} withArrow>
          <button
            type="button"
            className={classes.swatch}
            // `aria-pressed` rather than a radio group: these take effect
            // immediately, they are not a choice submitted later.
            aria-pressed={entry.id === current.id}
            aria-label={entry.label}
            onClick={() => setTheme(entry.id)}
            style={{
              background: entry.swatch[0],
              // Read by `.swatch::after`, so the wedge needs no inline rule.
              ['--accent' as string]: entry.swatch[1],
            }}
          />
        </Tooltip>
      ))}
    </fieldset>
  );
};
