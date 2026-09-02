import { useState } from 'react';
import { Button, Group, Paper, Progress, Stack, Text } from '@mantine/core';
import { IconHelpCircle, IconX } from '@tabler/icons-react';

export interface Step {
  readonly title: string;
  readonly body: string;
}

const SEEN_KEY = 'walkthrough.skills.seen';

const seen = (): boolean => {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    // Private windows and blocked site data both throw here. Not knowing
    // whether it was seen is not a reason to fail to render.
    return false;
  }
};

const remember = (): void => {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Nothing to do; the tour simply offers itself again next visit.
  }
};

/**
 * A guided read of the chart above it, **opt in**.
 *
 * Auto-playing this would make it the thing people close rather than the thing
 * they remember, so it starts as a single unobtrusive button. Once dismissed it
 * stays dismissed, per browser.
 */
export const Walkthrough = ({
  steps,
  onStep,
}: {
  steps: readonly Step[];
  /** Lets the host highlight whatever the current step is talking about. */
  onStep?: (index: number | null) => void;
}) => {
  const [index, setIndex] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(seen);

  const go = (next: number | null) => {
    setIndex(next);
    onStep?.(next);
  };

  const stop = () => {
    remember();
    setDismissed(true);
    go(null);
  };

  if (index === null) {
    return (
      <Button
        variant="subtle"
        color="gray"
        size="compact-sm"
        leftSection={<IconHelpCircle size={15} />}
        onClick={() => go(0)}
      >
        {dismissed
          ? 'Show me how to read this again'
          : 'Show me how to read this'}
      </Button>
    );
  }

  const step = steps[index];
  if (!step) return null;

  const last = index === steps.length - 1;

  return (
    <Paper withBorder p="md" radius="md" maw={560}>
      <Stack gap="sm">
        <Progress
          value={((index + 1) / steps.length) * 100}
          size="xs"
          color="brand"
          aria-label={`Step ${index + 1} of ${steps.length}`}
        />
        <Text fw={600}>{step.title}</Text>
        <Text size="sm" c="dimmed">
          {step.body}
        </Text>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {`${index + 1} / ${steps.length}`}
          </Text>
          <Group gap="xs">
            <Button
              variant="subtle"
              color="gray"
              size="compact-sm"
              leftSection={<IconX size={14} />}
              onClick={stop}
            >
              Skip
            </Button>
            {index > 0 && (
              <Button
                variant="default"
                size="compact-sm"
                onClick={() => go(index - 1)}
              >
                Back
              </Button>
            )}
            <Button
              color="brand"
              size="compact-sm"
              onClick={() => (last ? stop() : go(index + 1))}
            >
              {last ? 'Done' : 'Next'}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
};
