import { Anchor, Text, ThemeIcon } from '@mantine/core';
import { IconPlugConnectedX } from '@tabler/icons-react';
import type { Project } from '@contracts';
import { formatDay } from '@lib';
import classes from './Embed.module.css';

/**
 * A live preview, or an honest note that there is nothing to preview.
 *
 * This component is the reason `scripts/gen/embeds.ts` exists. The previous
 * version of this site rendered three iframes pointing at hosts that no longer
 * resolve - `derp.ai`, `wisdoms` and a Heroku-hosted trivia API - and shipped a
 * broken-image glyph in production for months.
 *
 * The rule here is one line: **an iframe is only rendered when a generator
 * confirmed the URL answered**. Anything else - never probed, 404, no DNS -
 * gets the offline card. There is no code path that renders an unverified URL.
 */
export const Embed = ({
  project,
  height = 420,
}: {
  project: Project;
  height?: number;
}) => {
  const { embed, homepage, title } = project;

  if (embed?.status === 'live') {
    return (
      <iframe
        src={embed.url}
        // Required: an untitled iframe is unreachable for a screen reader, and
        // jsx-a11y/iframe-has-title fails the build without it.
        title={`${title}, live preview`}
        height={height}
        className={classes.frame}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
        referrerPolicy="no-referrer"
      />
    );
  }

  const checked = embed?.checkedAt;

  return (
    <div className={classes.offline} style={{ minHeight: height / 2 }}>
      <ThemeIcon variant="light" color="sand" size="lg" radius="xl">
        <IconPlugConnectedX size={18} />
      </ThemeIcon>
      <Text fw={600}>No live preview</Text>
      <Text size="sm" c="dimmed" maw={380}>
        {project.retiredNote ??
          (embed
            ? 'The host did not answer when this page was last built.'
            : 'This project has no public deployment.')}
      </Text>
      {homepage !== null && (
        <Anchor href={homepage} size="sm" target="_blank" rel="noreferrer">
          {homepage}
        </Anchor>
      )}
      {checked !== undefined && (
        <Text size="xs" c="dimmed">
          {`Checked ${formatDay(checked) ?? ''}`}
        </Text>
      )}
    </div>
  );
};
