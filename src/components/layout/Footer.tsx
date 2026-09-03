import { ActionIcon, Container, Group, Text, Tooltip } from '@mantine/core';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconMail,
} from '@tabler/icons-react';
import { site } from '@config';
import { meta } from '@data';
import { formatDay } from '@lib';
import classes from './Footer.module.css';

/**
 * The contact page is gone, and this is where it went.
 *
 * It was a name/email/message form posting to EmailJS, on a page whose other
 * half was the social links that already live here. It cost a third-party
 * dependency, Formik, and three build secrets to send a message `mailto:`
 * sends for free.
 */
const LINKS = [
  [site.github, 'GitHub', IconBrandGithub],
  [site.linkedin, 'LinkedIn', IconBrandLinkedin],
  [site.youtube, 'YouTube', IconBrandYoutube],
  [`mailto:${site.email}`, 'Email', IconMail],
] as const;

export const Footer = () => (
  <footer className={classes.footer}>
    <Container size="lg" className={classes.inner}>
      <div>
        <Text size="sm" fw={500}>
          {site.name}
        </Text>
        <Text size="xs" c="dimmed">
          {meta.generatedAt === null
            ? 'Project data not yet generated'
            : `Project data refreshed ${formatDay(meta.generatedAt) ?? ''}`}
        </Text>
      </div>

      <Group gap="xs">
        {LINKS.map(([href, label, Icon]) => (
          <Tooltip key={label} label={label} withArrow>
            <ActionIcon
              component="a"
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              variant="subtle"
              color="gray"
              size="lg"
              aria-label={label}
            >
              <Icon size={18} />
            </ActionIcon>
          </Tooltip>
        ))}
      </Group>
    </Container>
  </footer>
);
