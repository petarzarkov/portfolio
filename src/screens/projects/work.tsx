import React, { FC } from 'react';
import {
  AspectRatio,
  Badge,
  ListItem,
  Spinner,
  Text,
  UnorderedList,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { CiLibs, Feature, Libs, Project, SecondaryLibs } from '@components';
import { useThemeProvider } from '@hooks';
import { CgProfile } from 'react-icons/cg';

const RoleCard: FC<{ role: string }> = ({ role }) => {
  const { theme } = useThemeProvider();
  return (
    <VStack textAlign={'center'} color={useColorModeValue('primary.300', 'primary.500')}>
      <CgProfile size={35} />
      <Text fontWeight="bold">
        Role
        <Badge colorScheme={theme}>{role}</Badge>
      </Text>
    </VStack>
  );
};

export const work = (
  isFrameLoading: boolean,
  setFrameLoading: (l: boolean) => void,
): Parameters<typeof Project>[0][] => [
  {
    title: '🚀 Rocket Crash',
    subTitle: 'Game Engine',
    description: 'Jump on a rocket with other players and see how far you can go before the rocket explodes.',
    devStack: [
      Libs.NodeJS.icon,
      Libs.Typescript.icon,
      Libs.JavaScript.icon,
      SecondaryLibs.Postgres.icon,
      SecondaryLibs.Koa.icon,
      SecondaryLibs.html.icon,
      SecondaryLibs.css.icon,
      SecondaryLibs.ESLint.icon,
      SecondaryLibs.MySQL.icon,
      SecondaryLibs.Redis.icon,
      SecondaryLibs.CucumberJS.icon,
      SecondaryLibs.npm.icon,
      SecondaryLibs.Jest.icon,
      CiLibs.DataDog.icon,
      CiLibs.OctopusDeploy.icon,
      CiLibs.Jira.icon,
      CiLibs.Bamboo.icon,
      CiLibs.BitBucket.icon,
      CiLibs.Confluence.icon,
    ].map((devIcon, indx) => React.createElement(devIcon, { key: `${indx}-rocket-dev-stack` })),
    features: [
      {
        icon: <RoleCard role={'Lead Dev'} />,
        content: (
          <Text fontWeight={600}>
            Managed the project from start to finish including FE, BE, Automation with Cucumber, and CI/CD.
          </Text>
        ),
      },
      {
        icon: <CiLibs.BitBucket.icon />,
        content: <Text fontWeight={600}>Monorepo distributed with Docker + Octo + BitBucket + Bamboo</Text>,
      },
      {
        icon: <SecondaryLibs.Sequelize.icon />,
        content: (
          <Text fontWeight={600}>
            Sequelize: used for DB migrations, layer over PostgeSQL + MySQL, and Object-Relational Mapping
          </Text>
        ),
      },
    ].map((feature, indx) => <Feature key={`${indx}-rocket-feature`} {...feature} />),
    previewImg: 'images/rocket.gif',
    preview: (
      <AspectRatio
        w={{ base: isFrameLoading ? 400 : 256, md: 400, lg: 400 }}
        h={{ base: isFrameLoading ? 400 : 256, md: isFrameLoading ? 400 : 600, lg: isFrameLoading ? 400 : 600 }}
      >
        <>
          {isFrameLoading && (
            <Spinner thickness="4px" speed="1.85s" emptyColor="primary.200" color="primary.500" size="xs" />
          )}
          <iframe
            style={{ borderRadius: 15 }}
            onLoad={() => setFrameLoading(false)}
            src="https://www.youtube.com/embed/qQLsUaXShnE"
            title="How to play rocket"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </>
      </AspectRatio>
    ),
  },
  {
    title: '🎲 Over Under',
    subTitle: 'Game Engine',
    description: 'Roll a die within a configurable range and bet a target over or under the roll.',
    devStack: [
      Libs.Python.icon,
      SecondaryLibs.Postgres.icon,
      SecondaryLibs.html.icon,
      SecondaryLibs.css.icon,
      SecondaryLibs.Redis.icon,
      CiLibs.OctopusDeploy.icon,
      CiLibs.Jira.icon,
      CiLibs.Bamboo.icon,
      CiLibs.BitBucket.icon,
      CiLibs.Confluence.icon,
      CiLibs.AWS.icon,
    ].map((devIcon, indx) => React.createElement(devIcon, { key: `${indx}-ou-dev-stack` })),
    features: [
      {
        icon: <RoleCard role={'Lead Dev'} />,
        content: (
          <Text fontWeight={600}>
            Managed the project from start to finish including FE, BE, and CI/CD. Pytest was used for complete unit test
            coverage. AWS for billions of simulations to meet regulator standards. Extra Stack: pyramid, venv
          </Text>
        ),
      },
      {
        icon: <CiLibs.BitBucket.icon />,
        content: <Text fontWeight={600}>Repo distributed with Docker + Octo + BitBucket + Bamboo</Text>,
      },
    ].map((feature, indx) => <Feature key={`${indx}-ou-feature`} {...feature} />),
    previewImg: 'images/dice.jpg',
  },
  {
    title: '🎰 Casino Products',
    subTitle: 'APIs, Back-office tools (FE|BE)',
    description: 'Various services developed for the lifecycle of an online casino | casino hub.',
    devStack: [
      Libs.Dotnet.icon,
      Libs.Csharp.icon,
      Libs.NodeJS.icon,
      Libs.Typescript.icon,
      Libs.JavaScript.icon,
      SecondaryLibs.Postgres.icon,
      SecondaryLibs.MySQL.icon,
      SecondaryLibs.html.icon,
      SecondaryLibs.css.icon,
      SecondaryLibs.Redis.icon,
      CiLibs.OctopusDeploy.icon,
      CiLibs.Jira.icon,
      CiLibs.Bamboo.icon,
      CiLibs.BitBucket.icon,
      CiLibs.Confluence.icon,
      CiLibs.AWS.icon,
      CiLibs.Jenkins.icon,
    ].map((devIcon, indx) => React.createElement(devIcon, { key: `${indx}-cp-dev-stack` })),
    features: (
      <UnorderedList>
        {[
          'Improve casino services to expand product feature set and accelerate development.',
          'Develop pipeline improvements that reduce costs and time requirements for maintaining existing products and building new products and integrating new providers.',
          'Create tools and systems that enhance ability to debug, test, and react to customer and client feedback.',
          'Work across teams to provide client side support for larger infrastructure initiatives.',
          'Maintain casino services and ensure their consistent success.',
        ].map((bullet, indx) => (
          <ListItem key={`${indx}-cp-bullets`}>
            <Text fontWeight={600}>{bullet}</Text>
          </ListItem>
        ))}
      </UnorderedList>
    ),
    previewImg: 'images/slots.jpg',
  },
];
