import { useState } from 'react';
import { ActionIcon, Popover, Tooltip } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { THEMES } from '../../theme/themes';
import { useTheme } from '../../theme/useTheme';
import classes from './ThemePicker.module.css';

/**
 * Picks a theme, from one button at every width.
 *
 * A popover rather than a row of swatches in the header: the row fitted two
 * themes and was already crowding a phone at four, and burying it in the nav
 * drawer hid the one control people go looking for. One button costs the same
 * space whatever the list grows to.
 *
 * Driven entirely by `THEMES`, so adding a palette is a block in `themes.css`
 * and an entry in `themes.ts` - nothing here changes.
 */
export const ThemePicker = () => {
  const { current, setTheme } = useTheme();
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      withArrow
      shadow="md"
      radius="md"
      trapFocus
    >
      <Popover.Target>
        <Tooltip label="Theme" withArrow disabled={opened}>
          <ActionIcon
            variant="default"
            size="lg"
            radius="md"
            aria-label="Theme"
            aria-haspopup="dialog"
            aria-expanded={opened}
            onClick={() => setOpened((o) => !o)}
          >
            <IconPalette size={17} />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown p={6}>
        <div className={classes.list}>
          {THEMES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={classes.option}
              // A stable hook for the browser suite; the accessible name is the
              // visible label, which is what a person reads.
              data-theme-option={entry.id}
              // `aria-pressed`, not a radio group: each takes effect on click
              // rather than being a choice submitted later.
              aria-pressed={entry.id === current.id}
              onClick={() => {
                setTheme(entry.id);
                setOpened(false);
              }}
            >
              <span
                aria-hidden
                className={classes.swatch}
                style={{
                  background: entry.swatch[0],
                  // Read by `.swatch::after`, so the wedge needs no rule here.
                  ['--accent' as string]: entry.swatch[1],
                }}
              />
              {entry.label}
            </button>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
