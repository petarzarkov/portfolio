import React, { FC } from 'react';
import { portfolio } from '@config';
import { BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { IconLink as IconLinkBase } from '@components';
import { Flex, Icon as IconBase, Image as ImageBase, useColorModeValue } from '@chakra-ui/react';
import {
  SiBamboo,
  SiBitbucket,
  SiConfluence,
  SiCplusplus,
  SiSharp,
  SiCss3,
  SiCucumber,
  SiDatadog,
  SiDocker,
  SiDotnet,
  SiEslint,
  SiExpress,
  SiFastify,
  SiHtml5,
  SiJavascript,
  SiJira,
  SiKubernetes,
  SiNestjs,
  SiNextdotjs,
  SiOctopusdeploy,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiSequelize,
  SiSocketdotio,
  SiSwagger,
  SiTypescript,
} from 'react-icons/si';
import { IoLogoNodejs } from 'react-icons/io';
import { GrMysql } from 'react-icons/gr';
import { FaNpm, FaAws, FaJenkins, FaJava, FaPython } from 'react-icons/fa';
import { SkillLevel } from '@contracts';

const FlexIcon: FC<{ children: React.ReactNode }> = ({ children }) => (
    <Flex
      w={12}
      h={12}
      align={'center'}
      justify={'center'}
      rounded={'full'}
      bgColor={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      mb={1}
    >
      {children}
    </Flex>
  ),
  Icon: FC<Parameters<typeof IconBase>[0]> = (props) => (
    <FlexIcon>
      <IconBase {...props} />
    </FlexIcon>
  ),
  IconLink: FC<Parameters<typeof IconLinkBase>[0]> = (props) => (
    <FlexIcon>
      <IconLinkBase {...props} />
    </FlexIcon>
  ),
  Image: FC<Parameters<typeof ImageBase>[0]> = (props) => (
    <FlexIcon>
      <ImageBase {...props} />
    </FlexIcon>
  );

export const Socials = {
  GitHub: ({ to = portfolio.github }) => (
    <IconLink
      to={to}
      icon={<BsGithub />}
      label={'github'}
      btnProps={{
        fontSize: '3xl',
      }}
    />
  ),
  LinkedIn: () => <IconLink to={portfolio.linkedin} icon={<BsLinkedin size="28px" />} label={'linkedin'} />,
  Twitter: () => <IconLink to={portfolio.twitter} icon={<BsTwitter size="28px" />} label={'twitter'} />,
} as const;

export const Libs = {
  NodeJS: {
    icon: () => (
      <IconLink icon={<Icon as={IoLogoNodejs} w={10} h={10} color={'green.600'} />} to={'https://nodejs.org/en/'} />
    ),
    level: SkillLevel.Advanced,
  },
  JavaScript: {
    icon: () => (
      <IconLink
        icon={<Icon as={SiJavascript} w={10} h={10} color={'#f0db4f'} />}
        to={'https://developer.mozilla.org/en-US/docs/Web/JavaScript'}
      />
    ),
    level: SkillLevel.Advanced,
  },
  Typescript: {
    icon: () => (
      <IconLink
        icon={<Icon as={SiTypescript} w={10} h={10} color={'blue.600'} />}
        to={'https://www.typescriptlang.org/'}
      />
    ),
    level: SkillLevel.Advanced,
  },
  Python: {
    icon: () => (
      <IconLink
        icon={<Icon as={FaPython} w={10} h={10} color={'yellow.200'} />}
        to={'https://www.python.org/static/favicon.ico'}
      />
    ),
    level: SkillLevel.Intermediate,
  },
  Java: {
    icon: () => <Icon as={FaJava} w={10} h={10} color={'blue.600'} />,
    level: SkillLevel.Beginner,
  },
  React: {
    icon: () => <IconLink icon={<Icon as={SiReact} w={10} h={10} color={'blue.200'} />} to={'https://reactjs.org/'} />,
    level: SkillLevel.Advanced,
  },
  ReactNative: {
    icon: () => (
      <IconLink icon={<Icon as={SiReact} w={10} h={10} color={'blue.300'} />} to={'https://reactnative.dev/'} />
    ),
    level: SkillLevel.Intermediate,
  },
  Dotnet: {
    icon: () => (
      <IconLink
        icon={<Icon as={SiDotnet} w={10} h={10} color={'purple.300'} />}
        to={'https://dotnet.microsoft.com/en-us/'}
      />
    ),
    level: SkillLevel.Beginner,
    title: '.NET',
  },
  Csharp: { icon: () => <Icon as={SiSharp} w={10} h={10} color={'blue.700'} />, level: SkillLevel.Noob, title: 'C#' },
  Cpp: { icon: () => <Icon as={SiCplusplus} w={10} h={10} color={'blue.700'} />, level: SkillLevel.Noob, title: 'C++' },
  GO: {
    icon: () => (
      <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Go_Logo_Blue.svg/215px-Go_Logo_Blue.svg.png" />
    ),
    level: SkillLevel.Beginner,
  },
} as const;

export const SecondaryLibs = {
  CucumberJS: {
    icon: () => (
      <IconLink
        icon={<Icon as={SiCucumber} w={10} h={10} color={'green.500'} />}
        to={'https://cucumber.io/docs/installation/javascript/'}
      />
    ),
    level: SkillLevel.Advanced,
  },
  Sequelize: {
    icon: () => (
      <IconLink icon={<Icon as={SiSequelize} w={10} h={10} color={'blue.400'} />} to={'https://sequelize.org/'} />
    ),
    level: SkillLevel.Advanced,
  },
  Prisma: { icon: () => <Icon as={SiPrisma} w={10} h={10} color={'blue.800'} />, level: SkillLevel.Beginner },
  NextJS: { icon: () => <Icon as={SiNextdotjs} w={10} h={10} color={'gray.600'} />, level: SkillLevel.Noob },
  NestJS: { icon: () => <Icon as={SiNestjs} w={10} h={10} color={'red.600'} />, level: SkillLevel.Intermediate },
  Fastify: {
    icon: () => (
      <IconLink icon={<Icon as={SiFastify} w={10} h={10} color={'gray.600'} />} to={'https://www.fastify.io/'} />
    ),
    level: SkillLevel.Intermediate,
  },
  MySQL: { icon: () => <Icon as={GrMysql} w={10} h={10} color={'blue.500'} />, level: SkillLevel.Intermediate },
  Postgres: {
    icon: () => (
      <IconLink icon={<Icon as={SiPostgresql} w={10} h={10} color={'blue.600'} />} to={'https://www.postgresql.org/'} />
    ),
    level: SkillLevel.Advanced,
  },
  Redis: {
    icon: () => (
      <Image w={10} h={10} src="https://pbs.twimg.com/profile_images/1285653263824691205/mu4nJ7Gb_normal.png" />
    ),
    level: SkillLevel.Advanced,
  },
  Koa: {
    icon: () => <IconLink icon={<Image w={10} src="images/koa.jpg" />} to={'https://koajs.com/'} />,
    level: SkillLevel.Advanced,
  },
  SocketIO: { icon: () => <Icon as={SiSocketdotio} w={10} h={10} color={'gray.800'} />, level: SkillLevel.Advanced },
  Swagger: {
    icon: () => (
      <IconLink icon={<Icon as={SiSwagger} w={10} h={10} color={'green.400'} />} to={'https://swagger.io/'} />
    ),
    level: SkillLevel.Advanced,
  },
  Jest: {
    icon: () => (
      <IconLink icon={<Image w={10} h={10} src="https://jestjs.io/img/jest.png" />} to={'https://jestjs.io'} />
    ),
    level: SkillLevel.Advanced,
  },
  ESLint: {
    icon: () => (
      <IconLink icon={<Icon as={SiEslint} w={10} h={10} color={'purple.800'} />} to={'https://eslint.org/'} />
    ),
    level: SkillLevel.Advanced,
  },
  Express: { icon: () => <Icon as={SiExpress} w={10} h={10} color={'gray.600'} />, level: SkillLevel.Advanced },
  npm: {
    icon: ({ to }: { to?: string }) => (
      <IconLink icon={<Icon as={FaNpm} w={10} h={10} color={'red.600'} />} to={to || 'https://www.npmjs.com/'} />
    ),
    level: SkillLevel.Advanced,
  },
  html: {
    icon: () => (
      <IconLink
        icon={<Icon as={SiHtml5} w={10} h={10} color={'orange.400'} />}
        to={'https://developer.mozilla.org/en-US/docs/Web/HTML'}
      />
    ),
    level: SkillLevel.Advanced,
  },
  css: {
    icon: () => (
      <IconLink
        icon={<Icon as={SiCss3} w={10} h={10} color={'teal.400'} />}
        to={'https://developer.mozilla.org/en-US/docs/Web/CSS'}
      />
    ),
    level: SkillLevel.Advanced,
  },
  GooglePlay: {
    icon: ({ to }: { to?: string }) => (
      <IconLink
        icon={<Image w={10} h={10} src="https://www.gstatic.com/android/market_images/web/favicon_v2.ico" />}
        to={to || 'https://play.google.com/'}
      />
    ),
    level: SkillLevel.Advanced,
  },
} as const;

export const CiLibs = {
  DataDog: { icon: () => <Icon as={SiDatadog} w={10} h={10} color={'purple.600'} />, level: SkillLevel.Intermediate },
  Docker: { icon: () => <Icon as={SiDocker} w={10} h={10} color={'blue.400'} />, level: SkillLevel.Advanced },
  Kubernetes: {
    icon: () => <Icon as={SiKubernetes} w={10} h={10} color={'blue.600'} />,
    level: SkillLevel.Intermediate,
  },
  OctopusDeploy: {
    icon: () => <Icon as={SiOctopusdeploy} w={10} h={10} color={'blue.400'} />,
    level: SkillLevel.Advanced,
  },
  Jenkins: { icon: () => <Icon as={FaJenkins} w={10} h={10} color={'red.400'} />, level: SkillLevel.Advanced },
  AWS: {
    icon: () => <Icon as={FaAws} w={10} h={10} color={'orange.400'} />,
    level: SkillLevel.Intermediate,
  },
  Bamboo: { icon: () => <Icon as={SiBamboo} w={10} h={10} color={'blue.600'} />, level: SkillLevel.Advanced },
  BitBucket: { icon: () => <Icon as={SiBitbucket} w={10} h={10} color={'blue.800'} />, level: SkillLevel.Advanced },
  Confluence: { icon: () => <Icon as={SiConfluence} w={10} h={10} color={'blue.600'} />, level: SkillLevel.Advanced },
  Jira: { icon: () => <Icon as={SiJira} w={10} h={10} color={'blue.600'} />, level: SkillLevel.Advanced },
} as const;
