import type { ReactNode } from 'react';
import { Divider, Drawer, Group, Stack, Text } from '@mantine/core';
import { ThemePicker } from './ThemePicker';

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
    <Stack gap={4}>
      {children}
      <Divider my="sm" />
      <Group justify="space-between" px={10}>
        <Text size="sm" fw={500}>
          Theme
        </Text>
        <ThemePicker label={false} />
      </Group>
    </Stack>
  </Drawer>
);
