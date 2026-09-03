import { ActionIcon, Burger, Container, Group, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandGithub, IconSearch } from '@tabler/icons-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { site } from '@config';
import classes from './Header.module.css';

/**
 * Split out of the entry chunk: it is `hiddenFrom="sm"` and only ever opens
 * after a tap, so nobody should be waiting on `ModalBase` and a focus trap
 * before the page first paints.
 */
const NavDrawer = lazy(() =>
  import('./NavDrawer').then((m) => ({ default: m.NavDrawer })),
);

const ROUTES = [
  ['/projects', 'Projects'],
  ['/skills', 'Skills'],
  ['/about', 'About'],
] as const;

export const Header = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  // Latches on the first tap, so the drawer stays mounted afterwards and its
  // close animation has something to run on. Set from the event rather than an
  // effect watching `opened`: the tap is what causes it, and deriving it in an
  // effect is a second render for no reason.
  const [requested, setRequested] = useState(false);
  const { pathname } = useLocation();

  const openMenu = () => {
    setRequested(true);
    toggle();
  };

  // A drawer left open across a route change hides the page behind it.
  useEffect(close, [pathname, close]);

  const links = ROUTES.map(([to, label]) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        isActive ? `${classes.link} ${classes.active}` : classes.link
      }
    >
      {label}
    </NavLink>
  ));

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Link to="/" className={classes.wordmark}>
          {site.name}
        </Link>

        <nav className={classes.nav} aria-label="Primary">
          {links}
        </nav>

        <Group gap="xs">
          <Tooltip label="Search — press / or ⌘K" withArrow>
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              aria-label="Search projects and sections"
              onClick={() => {
                // Imported on demand so @mantine/spotlight stays out of the
                // initial chunk; a no-op if it has already loaded.
                void import('@mantine/spotlight').then((m) =>
                  m.spotlight.open(),
                );
              }}
            >
              <IconSearch size={17} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="GitHub" withArrow>
            <ActionIcon
              component="a"
              href={site.github}
              target="_blank"
              rel="noreferrer"
              variant="default"
              size="lg"
              radius="md"
              aria-label="GitHub profile"
            >
              <IconBrandGithub size={17} />
            </ActionIcon>
          </Tooltip>
          <Burger
            opened={opened}
            onClick={openMenu}
            size="sm"
            hiddenFrom="sm"
            aria-label="Toggle navigation"
          />
        </Group>
      </Container>

      {requested && (
        <Suspense fallback={null}>
          <NavDrawer opened={opened} onClose={close}>
            {links}
          </NavDrawer>
        </Suspense>
      )}
    </header>
  );
};
