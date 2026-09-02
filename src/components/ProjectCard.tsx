import type { MouseEvent } from 'react';
import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconGitFork, IconStar } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Project } from '@contracts';
import { TechChips } from './TechChips';
import classes from './ProjectCard.module.css';

const TIER_LABEL: Record<Project['tier'], string> = {
  flagship: 'Flagship',
  active: 'Active',
  lab: 'Lab',
  archive: 'Archived',
};

const since = (iso: string | null): string | null => {
  if (iso === null) return null;
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

export const ProjectCard = ({ project }: { project: Project }) => {
  const pushed = since(project.pushedAt);

  // Written straight to the element rather than through state: this fires on
  // every pointermove, and a re-render per event would be the whole cost.
  const track = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--x',
      `${event.clientX - box.left}px`,
    );
    event.currentTarget.style.setProperty(
      '--y',
      `${event.clientY - box.top}px`,
    );
  };

  return (
    <Card
      className={classes.card}
      padding="lg"
      radius="md"
      pos="relative"
      onMouseMove={track}
    >
      <Stack gap="sm" className={classes.body}>
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Title order={3} fz="h4">
            <Link to={`/projects/${project.slug}`} className={classes.link}>
              {project.title}
            </Link>
          </Title>
          <Badge
            variant={project.tier === 'archive' ? 'default' : 'light'}
            color={project.tier === 'archive' ? 'gray' : 'brand'}
            size="sm"
          >
            {TIER_LABEL[project.tier]}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={3}>
          {project.headline ?? project.description ?? 'No description yet.'}
        </Text>

        <TechChips topics={project.topics} limit={5} />
      </Stack>

      <Group gap="lg" mt="md" c="dimmed" fz="xs">
        {project.stars > 0 && (
          <Group gap={4}>
            <IconStar size={14} aria-hidden />
            <span>{project.stars}</span>
          </Group>
        )}
        {project.forks > 0 && (
          <Group gap={4}>
            <IconGitFork size={14} aria-hidden />
            <span>{project.forks}</span>
          </Group>
        )}
        {project.languages[0] && <span>{project.languages[0].name}</span>}
        {project.tier === 'archive'
          ? project.retiredAt !== null && (
              <span>{`retired ${project.retiredAt}`}</span>
            )
          : pushed !== null && <span>{pushed}</span>}
      </Group>
    </Card>
  );
};
