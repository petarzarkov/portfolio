import { useMemo, useRef, useState } from 'react';
import {
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { activity, languages, projects } from '@data';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { CountUp } from '../components/CountUp';
import { LanguageTreemap } from '../components/LanguageTreemap';
import { ProjectCard } from '../components/ProjectCard';
import { Walkthrough, type Step } from '../components/Walkthrough';
import { Reveal } from '../components/Reveal';

/**
 * `select` is what makes the tour more than a caption track: while that step is
 * showing, the page selects that language, so the reader watches the map do the
 * thing the step is describing. Walkthrough stays generic - it reports which
 * step it is on and nothing else - and this screen decides what that means.
 */
interface SkillStep extends Step {
  readonly select?: string;
}

const STEPS: readonly SkillStep[] = [
  {
    title: 'Area is volume, not skill',
    body: 'Each rectangle is sized by how many bytes of that language exist across every repository I own. It measures what gets written, not how well.',
  },
  {
    title: 'Private repositories are counted',
    body: 'The totals include private work. Public-only would show about a third of the real picture — most of what I write is not public.',
  },
  {
    title: 'Forks are not',
    body: 'A fork is somebody else’s code. Leaving them in put Zig second on this map, entirely from a fork of Bun, for a language I have never written.',
  },
  {
    title: 'The long tail is folded up',
    body: 'Everything below the top eight is grouped into Other. Without that, Dockerfile and Shell get the same row as TypeScript.',
    select: 'Other',
  },
  {
    title: 'Click a language',
    body: 'Selecting a rectangle filters the projects underneath to the ones that actually contain it — the link between a claim and its evidence.',
    select: 'TypeScript',
  },
];

const Stat = ({ value, label }: { value: number; label: string }) => (
  <div>
    <Text fz="clamp(1.4rem, 3vw, 1.9rem)" fw={680} lh={1.1} ff="monospace">
      <CountUp value={value} />
    </Text>
    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
      {label}
    </Text>
  </div>
);

const Skills = () => {
  const [selected, setSelected] = useState<string | null>(null);

  /**
   * The table is the better default on a phone, and the map is one tap away.
   *
   * Area is the whole message of a treemap, so a reader who can only see part
   * of it has lost the comparison it exists to make - and at 390px there is no
   * setting that shows all nine cells *and* letters them. The table already
   * existed for anyone who cannot use the map at all; a screen this narrow is
   * simply another case of that.
   *
   * A lazy initialiser, so this is a starting point rather than a rule: once
   * the reader has touched the switch it is theirs, and rotating the phone does
   * not overrule them.
   */
  const [asTable, setAsTable] = useState(
    () => !window.matchMedia('(min-width: 48em)').matches,
  );

  // The tour borrows the selection to demonstrate it, and hands back whatever
  // the reader had chosen before it started rather than clearing their state.
  const restore = useRef<string | null>(null);
  const touring = useRef(false);

  const onStep = (index: number | null) => {
    if (index === null) {
      touring.current = false;
      setSelected(restore.current);
      return;
    }
    if (!touring.current) {
      touring.current = true;
      restore.current = selected;
    }
    setSelected(STEPS[index]?.select ?? null);
  };

  const matching = useMemo(() => {
    if (selected === null) return [];
    return projects.filter((project) =>
      project.languages.some((lang) => lang.name === selected),
    );
  }, [selected]);

  const megabytes = (languages.totalBytes / 1e6).toFixed(1);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Skills
        </Title>
        <Text c="dimmed" maw="62ch">
          {`Measured, not declared. ${megabytes} MB of source across ${languages.repoCount} repositories I own, private ones included, read straight from the GitHub API.`}
        </Text>
      </div>

      <Group justify="space-between" align="center">
        <Walkthrough steps={STEPS} onStep={onStep} />
        <Switch
          checked={asTable}
          onChange={(event) => setAsTable(event.currentTarget.checked)}
          label="Table view"
          size="sm"
        />
      </Group>

      {asTable ? (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Language</Table.Th>
              <Table.Th>Share</Table.Th>
              <Table.Th>Size</Table.Th>
              <Table.Th>Repos</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {languages.top.map((lang) => (
              <Table.Tr key={lang.name}>
                <Table.Td fw={500}>{lang.name}</Table.Td>
                <Table.Td>{`${(lang.share * 100).toFixed(1)}%`}</Table.Td>
                <Table.Td>{`${(lang.bytes / 1e6).toFixed(2)} MB`}</Table.Td>
                <Table.Td>{lang.repos}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <LanguageTreemap
          languages={languages.top}
          selected={selected}
          onSelect={setSelected}
        />
      )}
      <Divider />

      <section aria-labelledby="activity-heading">
        <Title order={2} id="activity-heading" mb="xs">
          Activity
        </Title>
        <Text c="dimmed" mb="lg" maw="62ch">
          Every contribution over the last year, public and private. Darker is
          busier — the scale is quantiled over active days rather than fixed, so
          it keeps its contrast instead of saturating.
        </Text>

        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mb="xl">
          <Stat value={activity.totalContributions} label="contributions" />
          <Stat value={activity.commits} label="public commits" />
          <Stat value={activity.restricted} label="private commits" />
          <Stat value={activity.longestStreak} label="longest streak" />
        </SimpleGrid>

        <Paper withBorder p="md" radius="md">
          <ActivityHeatmap days={activity.days} />
        </Paper>
      </section>

      {selected !== null && (
        <Reveal>
          <section aria-live="polite">
            <Title order={2} mb="xs">
              {selected}
            </Title>
            <Text c="dimmed" mb="lg">
              {matching.length === 0
                ? 'No project on this site contains it — most of that volume is in repositories that are not featured here.'
                : `${matching.length} featured ${matching.length === 1 ? 'project uses' : 'projects use'} it.`}
            </Text>
            {matching.length > 0 && (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {matching.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </SimpleGrid>
            )}
          </section>
        </Reveal>
      )}
    </Stack>
  );
};

export default Skills;
