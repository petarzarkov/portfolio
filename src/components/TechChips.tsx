import { Badge, Group } from '@mantine/core';

/**
 * Repo topics as chips.
 *
 * These come straight from GitHub with the `portfolio*` control topics already
 * stripped by the generator, so the stack shown is the stack the repo declares.
 * Tagging a repo with `bun` on github.com puts a `bun` chip here - there is no
 * icon map to maintain, which is what the old 282-line `Icons/icons.tsx` was.
 */
export const TechChips = ({
  topics,
  limit,
}: {
  topics: readonly string[];
  limit?: number;
}) => {
  if (topics.length === 0) return null;

  const shown = limit === undefined ? topics : topics.slice(0, limit);
  const hidden = topics.length - shown.length;

  return (
    <Group gap={6}>
      {shown.map((topic) => (
        <Badge key={topic} variant="default" size="sm" radius="sm" fw={500}>
          {topic}
        </Badge>
      ))}
      {hidden > 0 && (
        <Badge variant="transparent" size="sm" c="dimmed" px={0}>
          {`+${hidden}`}
        </Badge>
      )}
    </Group>
  );
};
