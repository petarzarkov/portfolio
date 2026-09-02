import { List, Stack, Text, Timeline, Title } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';
import type { Role } from '@data';
import { roles } from '@data';
import { TechChips } from '../components/TechChips';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** `2023-09` -> `Sep 2023`. */
const label = (value: string): string => {
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  return `${MONTHS[index] ?? month} ${year}`;
};

const range = (role: Role): string =>
  `${label(role.from)} — ${role.to === null ? 'Present' : label(role.to)}`;

/**
 * Consecutive roles at one employer become a single timeline entry, the way
 * LinkedIn shows them. Three separate "DraftKings" bullets read as three jobs
 * rather than as one tenure with three titles.
 */
const groupByEmployer = (all: readonly Role[]): Role[][] =>
  all.reduce<Role[][]>((groups, role) => {
    const last = groups.at(-1);
    if (last && last[0]?.employer === role.employer) last.push(role);
    else groups.push([role]);
    return groups;
  }, []);

const Position = ({ role, lead }: { role: Role; lead: boolean }) => (
  <div>
    <Text fw={600} size={lead ? 'md' : 'sm'}>
      {role.title}
    </Text>
    <Text size="xs" c="dimmed" mb={role.summary === undefined ? 0 : 'xs'}>
      {range(role)}
      {role.employment !== undefined && ` · ${role.employment}`}
      {role.location !== undefined && ` · ${role.location}`}
    </Text>

    {role.summary !== undefined && (
      <Text size="sm" mb="sm" maw="68ch">
        {role.summary}
      </Text>
    )}

    {role.achievements !== undefined && (
      <List size="sm" spacing={6} mb="sm" maw="68ch">
        {role.achievements.map((item) => (
          <List.Item key={item}>{item}</List.Item>
        ))}
      </List>
    )}

    {role.stack !== undefined && <TechChips topics={role.stack} />}
  </div>
);

const Work = () => {
  const groups = groupByEmployer(roles);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Work
        </Title>
        <Text c="dimmed" maw="62ch">
          What I have owned, rather than what I have pushed.
        </Text>
      </div>

      <Timeline
        active={groups.length}
        bulletSize={22}
        lineWidth={2}
        color="brand"
      >
        {groups.map((group) => {
          const first = group[0];
          if (!first) return null;
          const last = group.at(-1);

          return (
            <Timeline.Item
              key={`${first.employer}-${first.from}`}
              bullet={<IconBriefcase size={12} />}
              title={
                <Text fw={700} fz="lg">
                  {first.employer}
                  {group.length > 1 && last && (
                    <Text span c="dimmed" fw={400} fz="sm">
                      {`  ${label(last.from)} — ${first.to === null ? 'Present' : label(first.to)}`}
                    </Text>
                  )}
                </Text>
              }
            >
              <Stack gap="lg" mt="xs">
                {group.map((role, index) => (
                  <Position
                    key={`${role.title}-${role.from}`}
                    role={role}
                    lead={index === 0}
                  />
                ))}
              </Stack>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Stack>
  );
};

export default Work;
