import { Button, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Stack align="flex-start" gap="md" py="xl">
    <Title order={1}>Not found</Title>
    <Text c="dimmed" maw="50ch">
      That page does not exist. It may have been a project that has since been
      retired, or a link that never worked.
    </Text>
    <Button component={Link} to="/" variant="light">
      Back to the start
    </Button>
  </Stack>
);

export default NotFound;
