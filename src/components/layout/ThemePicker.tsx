import { useEffect, useRef, useState } from 'react';
import { ActionIcon } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { Hint } from '../Hint';
import { THEMES } from '../../theme/themes';
import { useTheme } from '../../theme/useTheme';
import classes from './ThemePicker.module.css';

/**
 * Picks a theme, from one button at every width.
 *
 * A plain absolutely-positioned panel rather than `@mantine/core`'s Popover.
 * Popover and Tooltip share `@floating-ui`, and between them they were 24 KB
 * gzipped of the entry chunk - about half a second of blank screen on slow 3G -
 * to position a panel under a button that is always in the same corner of a
 * sticky header. There is nothing here for a positioning engine to solve.
 *
 * What Popover did give us and is reimplemented below: close on Escape, close
 * on a click outside, and hand focus back to the button afterwards.
 */
export const ThemePicker = () => {
  const { current, setTheme } = useTheme();
  const [opened, setOpened] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!opened) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpened(false);
      // Escape should leave the keyboard where it started, not at the top of
      // the document.
      button.current?.focus();
    };

    const onPointer = (event: PointerEvent) => {
      const node = event.target;
      if (node instanceof Node && wrap.current?.contains(node) === true) return;
      setOpened(false);
    };

    document.addEventListener('keydown', onKey);
    // Capture, so a click that also opens something else still closes this.
    document.addEventListener('pointerdown', onPointer, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer, true);
    };
  }, [opened]);

  return (
    <div className={classes.wrap} ref={wrap}>
      <Hint label="Theme" align="end">
        <ActionIcon
          ref={button}
          variant="default"
          size="lg"
          radius="md"
          aria-label="Theme"
          aria-expanded={opened}
          onClick={() => setOpened((open) => !open)}
        >
          <IconPalette size={17} />
        </ActionIcon>
      </Hint>

      {opened && (
        <div className={classes.menu}>
          {THEMES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={classes.option}
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
      )}
    </div>
  );
};
