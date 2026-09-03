import { Drawer } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from './routes';
import classes from './NavDrawer.module.css';

/**
 * The mobile navigation drawer, in its own chunk.
 *
 * `Drawer` drags in `ModalBase`, `Overlay`, `FocusTrap` and the scroll lock -
 * and it is `hiddenFrom="sm"`, so a desktop visitor downloaded all of that to
 * render nothing, on the one chunk every visitor waits for before first paint.
 * Header mounts this only after the burger has been tapped once.
 *
 * No visible title. "Navigate" sat above three links that are self-evidently
 * navigation and cost a fifth of the panel to say so.
 *
 * Built from the compound parts rather than the shorthand purely so the label
 * lands in the right place: `aria-label` on `<Drawer>` is spread onto its root
 * `<div>`, while the element carrying `role="dialog"` is `Drawer.Content`.
 * Passed the short way, the dialog was left with no accessible name at all once
 * the title it had been borrowing one from was gone.
 */
export const NavDrawer = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => (
  <Drawer.Root
    opened={opened}
    onClose={onClose}
    size="xs"
    position="right"
    hiddenFrom="sm"
  >
    <Drawer.Overlay />
    <Drawer.Content aria-label="Navigation">
      <Drawer.Header>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <nav className={classes.list} aria-label="Primary">
          {ROUTES.map(([to, label]) => (
            <NavLink key={to} to={to} className={classes.link}>
              {label}
              <IconChevronRight
                size={17}
                className={classes.chevron}
                aria-hidden
              />
            </NavLink>
          ))}
        </nav>
      </Drawer.Body>
    </Drawer.Content>
  </Drawer.Root>
);
