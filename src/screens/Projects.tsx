import { useMemo, useState } from 'react';
import {
  Anchor,
  Chip,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { byTier, projects } from '@data';
import { ProjectCard } from '../components/ProjectCard';
import { Reveal } from '../components/Reveal';

/**
 * Grouped by tier rather than split across Work/Hobby tabs, so weight on the
 * page matches weight in reality. Archive is a list, not a grid: four retired
 * projects do not deserve the same real estate as four live ones.
 */
const Projects = () => {
  const [topic, setTopic] = useState<string | null>(null);

  // Filters derive from the data, so a newly tagged repo brings its own filter
  // with no code change here.
  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const t of project.topics) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12)
      .map(([name]) => name);
  }, []);

  const matches = (tier: 'flagship' | 'active' | 'lab') =>
    byTier(tier).filter(
      (project) => topic === null || project.topics.includes(topic),
    );

  const live = [...matches('flagship'), ...matches('active')];
  const lab = matches('lab');
  const archive = byTier('archive');

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Projects
        </Title>
        <Text c="dimmed" maw="60ch">
          Pulled from GitHub. Anything tagged <code>portfolio</code> appears
          here within a day, with its own description, topics and stats.
        </Text>
      </div>

      {topics.length > 0 && (
        <Chip.Group
          value={topic}
          onChange={(v) => setTopic(v as string | null)}
        >
          <Group gap={6}>
            {topics.map((name) => (
              <Chip key={name} value={name} size="sm" variant="outline">
                {name}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      )}

      {live.length > 0 && (
        <section aria-labelledby="live-heading">
          <Title order={2} id="live-heading" mb="lg">
            Active
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {live.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.04}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </SimpleGrid>
        </section>
      )}

      {lab.length > 0 && (
        <section aria-labelledby="lab-heading">
          <Title order={2} id="lab-heading" mb="xs">
            Lab
          </Title>
          <Text c="dimmed" mb="lg" maw="60ch">
            Experiments and one-offs. Some are finished, some were only ever
            about finding out whether the idea worked.
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {lab.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.04}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </SimpleGrid>
        </section>
      )}

      {live.length === 0 && lab.length === 0 && (
        <Text c="dimmed">Nothing matches that filter.</Text>
      )}

      {archive.length > 0 && (
        <section aria-labelledby="archive-heading">
          <Title order={2} id="archive-heading" mb="xs">
            Previously shipped
          </Title>
          <Text c="dimmed" mb="lg" maw="60ch">
            Built, shipped, and no longer running. Listed because they happened,
            not because they are live.
          </Text>
          <Stack gap="xs">
            {archive.map((project) => (
              <Group
                key={project.slug}
                justify="space-between"
                wrap="nowrap"
                align="baseline"
                gap="md"
              >
                <div>
                  <Anchor
                    component={Link}
                    to={`/projects/${project.slug}`}
                    fw={500}
                  >
                    {project.title}
                  </Anchor>
                  <Text size="sm" c="dimmed">
                    {project.retiredNote ?? project.description}
                  </Text>
                </div>
                {project.retiredAt !== null && (
                  <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                    {project.retiredAt}
                  </Text>
                )}
              </Group>
            ))}
          </Stack>
        </section>
      )}
    </Stack>
  );
};

export default Projects;
