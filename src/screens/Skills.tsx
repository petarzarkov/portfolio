import { useMemo, useState } from 'react';
import {
  Badge,
  Group,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { languages, projects } from '@data';
import { LanguageTreemap } from '../components/LanguageTreemap';
import { ProjectCard } from '../components/ProjectCard';
import { Walkthrough, type Step } from '../components/Walkthrough';
import { Reveal } from '../components/Reveal';

const STEPS: readonly Step[] = [
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
  },
  {
    title: 'Click a language',
    body: 'Selecting a rectangle filters the projects underneath to the ones that actually contain it — the link between a claim and its evidence.',
  },
];

const Skills = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [asTable, setAsTable] = useState(false);

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
        <Walkthrough steps={STEPS} />
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
              <Table.Th>Note</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {languages.top.map((lang) => (
              <Table.Tr key={lang.name}>
                <Table.Td fw={500}>{lang.name}</Table.Td>
                <Table.Td>{`${(lang.share * 100).toFixed(1)}%`}</Table.Td>
                <Table.Td>{`${(lang.bytes / 1e6).toFixed(2)} MB`}</Table.Td>
                <Table.Td>{lang.repos}</Table.Td>
                <Table.Td>{lang.proficiency ?? ''}</Table.Td>
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

      {languages.top.some((lang) => lang.proficiency !== null) && (
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Where volume misleads, I say so:
          </Text>
          {languages.top
            .filter((lang) => lang.proficiency !== null)
            .map((lang) => (
              <Badge key={lang.name} variant="default">
                {`${lang.name} · ${lang.proficiency ?? ''}`}
              </Badge>
            ))}
        </Group>
      )}

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
