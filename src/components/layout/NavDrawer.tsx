import type { ReactNode } from 'react';
import { Drawer, Stack } from '@mantine/core';

/**
 * The mobile navigation drawer, in its own chunk.
 *
 * `Drawer` drags in `ModalBase`, `Overlay`, `FocusTrap` and the scroll lock -
 * and it is `hiddenFrom="sm"`, so a desktop visitor downloaded all of that to
 * render nothing, on the one chunk every visitor waits for before first paint.
 * Header mounts this only after the burger has been tapped once.
 */
export const NavDrawer = ({
  opened,
  onClose,
  children,
}: {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
}) => (
  <Drawer
    opened={opened}
    onClose={onClose}
    size="xs"
    position="right"
    title="Navigate"
    hiddenFrom="sm"
  >
    <Stack gap={4}>{children}</Stack>
  </Drawer>
);
