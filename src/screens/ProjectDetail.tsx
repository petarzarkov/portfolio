import {
  Anchor,
  Badge,
  Button,
  Divider,
  Group,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconBrandGithub,
  IconExternalLink,
} from '@tabler/icons-react';
import { Link, useParams } from 'react-router-dom';
import { bySlug } from '@data';
import { formatDay } from '@lib';
import { Embed } from '../components/Embed';
import { TechChips } from '../components/TechChips';
import NotFound from './NotFound';

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
      {label}
    </Text>
    <Text fw={500}>{value}</Text>
  </div>
);

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = slug === undefined ? undefined : bySlug(slug);

  if (!project) return <NotFound />;

  const bytes = project.languages.reduce((sum, l) => sum + l.bytes, 0);

  return (
    <Stack gap="xl">
      <Anchor component={Link} to="/projects" size="sm">
        <Group gap={4}>
          <IconArrowLeft size={14} />
          All projects
        </Group>
      </Anchor>

      <div>
        <Group gap="xs" mb="xs">
          <Badge
            variant={project.tier === 'archive' ? 'default' : 'light'}
            color={project.tier === 'archive' ? 'gray' : 'brand'}
          >
            {project.tier}
          </Badge>
          {project.license !== null && (
            <Badge variant="default">{project.license}</Badge>
          )}
          {project.npm !== null && (
            <Badge variant="default">{`npm ${project.npm.version}`}</Badge>
          )}
        </Group>

        <Title order={1} mb="sm">
          {project.title}
        </Title>

        {project.headline !== null && (
          <Text size="lg" maw="60ch" mb="xs">
            {project.headline}
          </Text>
        )}
        {project.description !== null && (
          <Text c="dimmed" maw="65ch">
            {project.description}
          </Text>
        )}
      </div>

      {project.retiredNote !== null && (
        <Text
          size="sm"
          c="dimmed"
          p="md"
          style={{
            borderLeft: '2px solid var(--mantine-color-sand-4)',
            background: 'var(--surface-sunken)',
          }}
        >
          {project.retiredAt !== null && (
            <strong>{`Retired ${project.retiredAt}. `}</strong>
          )}
          {project.retiredNote}
        </Text>
      )}

      <Group>
        {project.repo !== null && (
          <Button
            component="a"
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            variant="default"
            leftSection={<IconBrandGithub size={16} />}
          >
            Source
          </Button>
        )}
        {project.embed?.status === 'live' && (
          <Button
            component="a"
            href={project.embed.url}
            target="_blank"
            rel="noreferrer"
            color="brand"
            leftSection={<IconExternalLink size={16} />}
          >
            Open live
          </Button>
        )}
      </Group>

      <Embed project={project} height={520} />

      <Divider />

      <Group gap="xl" wrap="wrap">
        {project.stars > 0 && (
          <Meta label="Stars" value={String(project.stars)} />
        )}
        {project.forks > 0 && (
          <Meta label="Forks" value={String(project.forks)} />
        )}
        {project.createdAt !== null && (
          <Meta
            label="Started"
            value={new Date(project.createdAt).getFullYear().toString()}
          />
        )}
        {project.pushedAt !== null && (
          <Meta label="Last push" value={formatDay(project.pushedAt) ?? ''} />
        )}
        {project.release !== null && (
          <Meta label="Release" value={project.release.tag} />
        )}
        {project.npm !== null && project.npm.weeklyDownloads > 0 && (
          <Meta
            label="Downloads / week"
            value={project.npm.weeklyDownloads.toLocaleString()}
          />
        )}
      </Group>

      {project.topics.length > 0 && (
        <div>
          <Title order={2} fz="h3" mb="sm">
            Stack
          </Title>
          <TechChips topics={project.topics} />
        </div>
      )}

      {project.languages.length > 0 && (
        <div>
          <Title order={2} fz="h3" mb="sm">
            Languages
          </Title>
          <Progress.Root size="xl" radius="sm" mb="sm">
            {project.languages.slice(0, 6).map((lang) => (
              <Progress.Section
                key={lang.name}
                value={lang.share * 100}
                color={lang.color ?? 'gray'}
              />
            ))}
          </Progress.Root>
          <Group gap="lg">
            {project.languages.slice(0, 6).map((lang) => (
              <Group key={lang.name} gap={6}>
                <span
                  aria-hidden
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 9,
                    background: lang.color ?? 'var(--mantine-color-gray-5)',
                  }}
                />
                <Text size="sm">{lang.name}</Text>
                <Text size="sm" c="dimmed">
                  {`${(lang.share * 100).toFixed(1)}%`}
                </Text>
              </Group>
            ))}
          </Group>
          <Text size="xs" c="dimmed" mt="xs">
            {`${(bytes / 1024).toLocaleString(undefined, { maximumFractionDigits: 0 })} KB of source`}
          </Text>
        </div>
      )}
    </Stack>
  );
};

export default ProjectDetail;
