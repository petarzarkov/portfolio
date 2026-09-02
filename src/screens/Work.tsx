import { Alert, Stack, Text, Timeline, Title } from '@mantine/core';
import { IconBriefcase, IconInfoCircle } from '@tabler/icons-react';
import { roles } from '@data';
import { TechChips } from '../components/TechChips';

const range = (from: string, to: string | null): string =>
  `${from} — ${to ?? 'present'}`;

const Work = () => (
  <Stack gap="xl">
    <div>
      <Title order={1} mb="xs">
        Work
      </Title>
      <Text c="dimmed" maw="60ch">
        What I have owned, rather than what I have pushed.
      </Text>
    </div>

    {roles.length === 0 ? (
      // Deliberately empty rather than guessed. Employers, titles and dates are
      // the one part of this site that cannot be generated from the repos, and
      // inventing them would be worse than saying nothing.
      <Alert
        variant="light"
        color="sand"
        icon={<IconInfoCircle size={18} />}
        title="Not filled in yet"
      >
        Employment history lives in <code>src/data/overrides.ts</code>. It is
        the only part of this site that is not generated, because no repository
        knows who paid for the work.
      </Alert>
    ) : (
      <Timeline
        active={roles.length}
        bulletSize={22}
        lineWidth={2}
        color="brand"
      >
        {roles.map((role) => (
          <Timeline.Item
            key={`${role.employer}-${role.from}`}
            bullet={<IconBriefcase size={12} />}
            title={
              <Text fw={600}>
                {role.title}
                <Text span c="dimmed" fw={400}>
                  {` · ${role.employer}`}
                </Text>
              </Text>
            }
          >
            <Text size="xs" c="dimmed" mb="xs">
              {range(role.from, role.to)}
            </Text>
            <Text size="sm" mb="sm" maw="65ch">
              {role.summary}
            </Text>

            {role.shipped !== undefined && role.shipped.length > 0 && (
              <Stack gap={4} mb="sm">
                {role.shipped.map((item) => (
                  <Text key={item.name} size="sm">
                    <Text span fw={600}>
                      {item.name}
                    </Text>
                    {` — ${item.what}`}
                  </Text>
                ))}
              </Stack>
            )}

            <TechChips topics={role.stack} />
          </Timeline.Item>
        ))}
      </Timeline>
    )}
  </Stack>
);

export default Work;
