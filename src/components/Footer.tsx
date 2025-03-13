import { Box, Center, Container, Icon, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Socials } from '@components';
import { version } from '../../package.json';
import { FaCopyright } from 'react-icons/fa';

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
      <Stack direction={'row'}>
        <Icon as={FaCopyright} w={5} h={5} color={useColorModeValue('primary.400', 'primary.500')} />
        <Text>{`Petar Zarkov ${new Date().getFullYear()}`}</Text>
      </Stack>

      <Center>{`v: ${version}`}</Center>
      <Stack direction={'row'} spacing={6}>
        <Socials.LinkedIn />
        <Socials.GitHub />
      </Stack>
    </Container>
  </Box>
);
