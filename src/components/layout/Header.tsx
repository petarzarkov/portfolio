import { ActionIcon, Burger, Container, Group, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandGithub, IconSearch } from '@tabler/icons-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { site } from '@config';
import { ROUTES } from './routes';
import { ThemePicker } from './ThemePicker';
import classes from './Header.module.css';

interface DrawerProps {
  opened: boolean;
  onClose: () => void;
}

/**
 * Split out of the entry chunk: the drawer is `hiddenFrom="sm"` and only ever
 * opens after a tap, so nobody should be waiting on `ModalBase` and a focus
 * trap before the page first paints.
 *
 * Resolved into state rather than through `React.lazy`, which is the same idea
 * with a cost that does not show up until you measure it. With the module
 * already fetched and parsed, opening through `lazy` took **312 ms**; the same
 * drawer imported statically took **11 ms**. The chunk was not the problem -
 * the number did not move across a 100 Mbps link, a 4G one and slow 3G -
 * Suspense simply schedules the retry after a resolved lazy at a low priority,
 * and that is a third of a second of nothing happening after a tap.
 *
 * Holding the component in ordinary state makes opening an ordinary render.
 */
const load = (): Promise<ComponentType<DrawerProps>> =>
  import('./NavDrawer').then((m) => {
    cached = m.NavDrawer;
    return m.NavDrawer;
  });

/** Module scope, so a remount does not refetch or flash an empty drawer. */
let cached: ComponentType<DrawerProps> | null = null;

/**
 * Below this the burger exists; at or above it the drawer is `hiddenFrom="sm"`
 * and never opens, so a desktop visitor should not fetch it at all.
 */
const HAS_BURGER = '(max-width: 47.99em)';

export const Header = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  // Latches on the first tap, so the drawer stays mounted afterwards and its
  // close animation has something to run on. Set from the event rather than an
  // effect watching `opened`: the tap is what causes it, and deriving it in an
  // effect is a second render for no reason.
  const [Drawer, setDrawer] = useState<ComponentType<DrawerProps> | null>(
    () => cached,
  );
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const { pathname } = useLocation();

  const warm = () => {
    if (cached) return;
    void load().then((component) => {
      if (alive.current) setDrawer(() => component);
    });
  };

  const openMenu = () => {
    warm();
    toggle();
  };

  /**
   * Fetches the drawer before anyone asks for it.
   *
   * Splitting it out kept 13 KB off first paint and moved the cost to the first
   * tap instead - measured at 315 ms of nothing happening on a fast connection
   * and 412 ms on slow 3G, because the chunk pulls a small waterfall of others
   * behind it. Warming it while the browser is idle keeps the saving and gives
   * the tap an already-parsed module: the split should cost first paint, not
   * the person using the menu.
   *
   * `import()` is memoised by the module runtime, so calling this more than
   * once is free.
   */
  useEffect(() => {
    if (!window.matchMedia(HAS_BURGER).matches) return;

    let cancelled = false;
    const prefetch = () => {
      if (cancelled || cached) return;
      void load().then((component) => {
        if (alive.current && !cancelled) setDrawer(() => component);
      });
    };

    // `requestIdleCallback` waits for a gap rather than competing with the
    // route's own work; Safari only grew it recently, and the DOM types declare
    // it unconditionally, so the guard has to be a `typeof` rather than a
    // truthiness check TypeScript will tell us is pointless.
    const idle = typeof window.requestIdleCallback === 'function';
    const handle = idle
      ? window.requestIdleCallback(prefetch, { timeout: 2500 })
      : window.setTimeout(prefetch, 1500);

    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  // A drawer left open across a route change hides the page behind it.
  useEffect(close, [pathname, close]);

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Link to="/" className={classes.wordmark}>
          {site.name}
        </Link>

        <nav className={classes.nav} aria-label="Primary">
          {ROUTES.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? `${classes.link} ${classes.active}` : classes.link
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Group gap="xs">
          <ThemePicker />
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
            // A touch lands here a beat before the click, and a mouse earlier
            // still - the last chance to start the fetch if idle never came.
            onPointerDown={warm}
            size="sm"
            hiddenFrom="sm"
            aria-label="Toggle navigation"
          />
        </Group>
      </Container>

      {Drawer !== null && <Drawer opened={opened} onClose={close} />}
    </header>
  );
};
