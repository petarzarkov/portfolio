import { Anchor, Group, Stack, Text, Title } from '@mantine/core';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconMail,
} from '@tabler/icons-react';
import { site } from '@config';
import { activity, meta } from '@data';

const LINKS = [
  [site.github, 'github.com/petarzarkov', IconBrandGithub],
  [site.linkedin, 'LinkedIn', IconBrandLinkedin],
  [site.youtube, 'YouTube — RustBeats', IconBrandYoutube],
  [`mailto:${site.email}`, site.email, IconMail],
] as const;

const About = () => (
  <Stack gap="xl" maw="62ch">
    <div>
      <Title order={1} mb="xs">
        About
      </Title>
      <Text c="dimmed">{`${site.role} · ${site.location}`}</Text>
    </div>

    <Text>
      I work on backend frameworks and the tooling around them. Most of what I
      build is infrastructure other people write code against — dependency
      injection, logging, queues, test harnesses, release pipelines — and the
      applications that prove it works.
    </Text>

    <Text>
      Before that, five years of online casino platform work: game engines,
      provider integrations, and the services around them.
    </Text>

    <div>
      <Title order={3} mb="sm">
        Elsewhere
      </Title>
      <Stack gap="xs">
        {LINKS.map(([href, label, Icon]) => (
          <Group key={label} gap="xs">
            <Icon size={17} aria-hidden />
            <Anchor
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
            >
              {label}
            </Anchor>
          </Group>
        ))}
      </Stack>
    </div>

    <div>
      <Title order={3} mb="sm">
        This site
      </Title>
      <Text size="sm" c="dimmed">
        Almost everything here is generated. Tagging a repository{' '}
        <code>portfolio</code> on GitHub puts it on this site within a day, with
        its description, topics, language mix and stats read from the API — no
        commit to this repository required. The skills page is measured from
        real byte counts across{' '}
        {`${activity.commits.toLocaleString()} public and ${activity.restricted.toLocaleString()} private contributions`}
        , and every external preview is health-checked before it is rendered, so
        a dead link cannot quietly ship.
      </Text>
      {meta.generatedAt !== null && (
        <Text size="xs" c="dimmed" mt="xs">
          {`Last refreshed ${new Date(meta.generatedAt).toLocaleString()}`}
        </Text>
      )}
    </div>
  </Stack>
);

export default About;
