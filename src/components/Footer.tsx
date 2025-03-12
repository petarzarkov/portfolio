import React from 'react';
import { Box, Center, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Socials } from '@components';
import { version } from '../../package.json';

export const Footer = () => (
  <Box
    style={{
      left: 0,
      bottom: 0,
      right: 0,
      position: 'inherit',
    }}
    bg={useColorModeValue('primary.200', 'primary.900')}
    color={useColorModeValue('primary.700', 'primary.200')}
  >
    <Container
      as={Stack}
      maxW={'6xl'}
      py={4}
      direction={{ base: 'column', md: 'row' }}
      spacing={4}
      justify={{ base: 'center', md: 'space-between' }}
      align={{ base: 'center', md: 'center' }}
    >
      <Text>{`©️ Petar Zarkov ${new Date().getFullYear()}`}</Text>
      <Center>{`v: ${version}`}</Center>
      <Stack direction={'row'} spacing={6}>
        <Socials.LinkedIn />
        <Socials.GitHub />
      </Stack>
    </Container>
  </Box>
);
