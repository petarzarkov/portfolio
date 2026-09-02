import { Anchor, Group, Stack, Text, Title } from '@mantine/core';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconMail,
  IconWorld,
} from '@tabler/icons-react';
import { site } from '@config';
import { activity, meta } from '@data';
import { LightRig } from '../components/LightRig';
import classes from './About.module.css';

const LINKS = [
  [site.github, 'github.com/petarzarkov', IconBrandGithub],
  [site.linkedin, 'LinkedIn', IconBrandLinkedin],
  [site.profile, 'Auto-generated GitHub profile page', IconWorld],
  [site.youtube, 'YouTube — RustBeats', IconBrandYoutube],
  [`mailto:${site.email}`, site.email, IconMail],
] as const;

const About = () => (
  <Stack gap="xl" maw="72ch">
    <div className={classes.backdrop}>
      <LightRig />
    </div>

    <div>
      <Title order={1} mb="xs">
        About
      </Title>
      <Text c="dimmed">
        {`${site.role} · ${site.location} · ${site.experience}`}
      </Text>
    </div>

    <Text fz="lg" fw={500}>
      {site.tagline}
    </Text>

    <Text>
      I have spent over two decades in software engineering, evolving alongside
      the industry — from game development in Unity and early Android apps, to
      complex microservice architectures in .NET and Node.
    </Text>

    <Text>
      Most recently Software Engineering Manager at Pateplay, and before that
      Technical Team Lead at LimeChain and Lead Software Engineer at Pwrteams
      and DraftKings. The full history is on{' '}
      <Anchor href={site.linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </Anchor>
      .
    </Text>

    <Text>
      Today I focus on end-to-end project ownership: scalable, high-performance
      applications with a strong preference for the TypeScript ecosystem, and
      increasingly Go and Rust where efficiency matters most. I am comfortable
      across the whole stack, from designing database schemas to configuring
      Kubernetes clusters and CI/CD pipelines. I prefer a hands-on approach to
      infrastructure, and shipping reliable code that scales.
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
