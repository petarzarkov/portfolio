import {
  Anchor,
  Badge,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowRight, IconBrandGithub, IconStar } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { site } from '@config';
import { activity, byTier, flagship, languages } from '@data';
import { ProjectCard } from '../components/ProjectCard';
import { Embed } from '../components/Embed';
import { Reveal } from '../components/Reveal';
import { TechChips } from '../components/TechChips';
import classes from './Landing.module.css';

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className={classes.stat}>
    <div className={classes.statValue}>{value}</div>
    <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1.4}>
      {label}
    </Text>
  </div>
);

/**
 * Three screens, no more: the thesis, then dunx given the whole width, then
 * proof of life.
 *
 * The old landing page was a tab strip over eight equally-weighted cards, so a
 * visitor with thirty seconds could not tell what mattered. One project shown
 * properly is worth eight shown as thumbnails.
 */
export const Landing = () => {
  const lead = flagship();
  const active = byTier('active').slice(0, 4);
  const top = languages.top[0];

  return (
    <Stack gap="xl">
      <section className={classes.hero}>
        <Text size="sm" fw={600} tt="uppercase" c="dimmed" mb="xs">
          {`${site.role} · ${site.location}`}
        </Text>
        <Title order={1} mb="md">
          {site.name}
        </Title>
        <p className={classes.thesis}>
          <span className={classes.accent}>Vibe Janitor</span> — I delete code
          that you don&rsquo;t need. Two decades of shipping backends, and the
          frameworks and tooling underneath them.
        </p>
        <Group mt="xl">
          <Button
            component={Link}
            to="/projects"
            color="brand"
            rightSection={<IconArrowRight size={16} />}
          >
            See the work
          </Button>
          <Button
            component="a"
            href={site.github}
            target="_blank"
            rel="noreferrer"
            variant="default"
            leftSection={<IconBrandGithub size={16} />}
          >
            GitHub
          </Button>
        </Group>
      </section>

      {lead && (
        <Reveal>
          <section className={classes.flagship}>
            <Stack gap="lg">
              <Group justify="space-between" align="flex-start" wrap="wrap">
                <div>
                  <Badge color="brand" variant="light" mb="xs">
                    Flagship
                  </Badge>
                  <Title order={2}>{lead.title}</Title>
                </div>
                {lead.stars > 0 && (
                  <Group gap={5} c="dimmed">
                    <IconStar size={16} aria-hidden />
                    <Text fw={600}>{lead.stars}</Text>
                  </Group>
                )}
              </Group>

              <Text size="lg" maw="52ch">
                {lead.headline ?? lead.description}
              </Text>
              {lead.headline !== null && lead.description !== null && (
                <Text c="dimmed" maw="60ch">
                  {lead.description}
                </Text>
              )}

              <TechChips topics={lead.topics} />

              <Embed project={lead} height={380} />

              <Group>
                <Button
                  component={Link}
                  to={`/projects/${lead.slug}`}
                  variant="light"
                >
                  About this project
                </Button>
                {lead.repo !== null && (
                  <Anchor
                    href={lead.repo}
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                  >
                    Source
                  </Anchor>
                )}
              </Group>
            </Stack>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section aria-labelledby="activity-heading">
          <Title order={2} id="activity-heading" mb="lg">
            Still shipping
          </Title>
          <div className={classes.stats}>
            <Stat
              value={activity.totalContributions.toLocaleString()}
              label="contributions, 12mo"
            />
            <Stat
              value={String(activity.longestStreak)}
              label="longest streak"
            />
            <Stat
              value={`${Math.round((languages.totalBytes / 1e6) * 10) / 10} MB`}
              label={`across ${languages.repoCount} repos`}
            />
            {top && (
              <Stat
                value={`${Math.round(top.share * 100)}%`}
                label={top.name}
              />
            )}
          </div>
        </section>
      </Reveal>

      {active.length > 0 && (
        <Reveal>
          <section aria-labelledby="active-heading">
            <Group justify="space-between" mb="lg">
              <Title order={2} id="active-heading">
                Active
              </Title>
              <Anchor component={Link} to="/projects" size="sm">
                All projects
              </Anchor>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {active.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </SimpleGrid>
          </section>
        </Reveal>
      )}
    </Stack>
  );
};
