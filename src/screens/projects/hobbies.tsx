import React, { FC, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import {
  AspectRatio,
  Box,
  Button,
  Code,
  Container,
  Flex,
  Spinner,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLink, Feature, Libs, Project, SecondaryLibs, Socials } from '@components';

const Trivia: FC = () => {
  const [questions, setQ] = useState<Record<string, unknown>[]>([]),
    [isLoading, setLoading] = useState(false),
    getQuestions = async () => {
      try {
        setLoading(true);
        const raw = await fetch('https://trivia-art.herokuapp.com/api/questions', {
            headers: {
              Accept: 'application/json',
            },
          }),
          items = (await raw.json()) as { result?: Record<string, unknown>[] };
        if (items?.result?.length) {
          setQ(items.result);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void getQuestions();
  }, []);

  return (
    <Container bgColor={useColorModeValue('primary.300', 'primary.700')} borderRadius={10}>
      <Button onClick={() => void getQuestions()} isLoading={isLoading} m={5}>
        New questions
      </Button>
      <Box>
        {isLoading ? (
          <Spinner thickness="4px" speed="1.85s" emptyColor="primary.200" color="primary.500" size="xl" />
        ) : (
          questions.length >= 1 && (
            <ReactJson
              src={questions}
              collapsed={1}
              theme={'monokai'}
              displayDataTypes={false}
              name={'trivia'}
              style={{ borderRadius: 10 }}
            />
          )
        )}
      </Box>
    </Container>
  );
};

export const hobbies = (
  isFrameLoading: boolean,
  setFrameLoading: (l: boolean) => void,
): Parameters<typeof Project>[0][] => [
  {
    title: 'Wave Simulator',
    subTitle: 'canvas',
    description: 'simulate a string wave using the wave equation',
    devStack: [Libs.NodeJS.icon, Libs.Typescript.icon, Libs.JavaScript.icon].map((devIcon, indx) =>
      React.createElement(devIcon, { key: `${indx}-rocket-dev-stack` }),
    ),
    content: (
      <Stack>
        <Text
          bg={useColorModeValue('primary.300', 'primary.700')}
          color={useColorModeValue('primary.700', 'primary.300')}
          borderRadius={'xl'}
          p={'3'}
        >
          {`Using the TRUE wave equation (with damping and stress-strain coupling)`}
        </Text>
        <Text
          bg={useColorModeValue('primary.300', 'primary.700')}
          color={useColorModeValue('primary.700', 'primary.300')}
          borderRadius={'xl'}
          p={'3'}
        >
          {`
          ∂²y/∂x² - (1/c²) ∂²y/∂t² - γ ∂y/∂t - l² ∂⁴y/∂x⁴ = 0  
          y(0, t) = y(L, t) = 0  
          y(x, 0) = f(x)
          `}
        </Text>
      </Stack>
    ),
    features: [
      <Feature
        key={'WaveSimRepo'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/wave-sim'} />}
        content={<ExternalLink to={'https://github.com/petarzarkov/wave-sim'} text={'repo'} />}
      />,
    ],
    preview: (
      <AspectRatio w={400} h={isFrameLoading ? 400 : 600}>
        <>
          {isFrameLoading && (
            <Spinner thickness="4px" speed="1.85s" emptyColor="primary.200" color="primary.500" size="xs" />
          )}
          <iframe
            src="https://petarzarkov.github.io/wave-sim/"
            style={{ borderRadius: 15 }}
            onLoad={() => setFrameLoading(false)}
            scrolling="no"
          />
        </>
      </AspectRatio>
    ),
  },
  {
    title: '❔ Trivia Art',
    subTitle: 'API',
    description: 'Over 9k+ unique trivia questions',
    devStack: [
      Libs.NodeJS.icon,
      Libs.Typescript.icon,
      Libs.JavaScript.icon,
      SecondaryLibs.Postgres.icon,
      SecondaryLibs.Fastify.icon,
      SecondaryLibs.ESLint.icon,
      SecondaryLibs.Redis.icon,
    ].map((devIcon, indx) => React.createElement(devIcon, { key: `${indx}-rocket-dev-stack` })),
    features: [
      <Feature
        key={'TriviaRepo'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/trivia-art'} />}
        content={<ExternalLink to={'https://github.com/petarzarkov/trivia-art'} text={'repo'} />}
      />,
      <Feature
        key={'TrSQ'}
        icon={<SecondaryLibs.Sequelize.icon />}
        content={
          <Text fontWeight={600}>
            Sequelize: used for DB migrations, layer over PostgeSQL, and Object-Relational Mapping
          </Text>
        }
      />,
      <Feature
        key={'TrFast'}
        icon={<SecondaryLibs.Fastify.icon />}
        content={<Text fontWeight={600}>Fastify: used for its low-overhead server, routes, validations, and auth</Text>}
      />,
      <Feature
        key={'TrSwag'}
        icon={<SecondaryLibs.Swagger.icon />}
        content={<ExternalLink to={'https://trivia-art.herokuapp.com/documentation'} text={'Swagger Docs'} />}
      />,
    ],
    preview: <Trivia />,
  },
  {
    title: '💫 Wisdoms App',
    subTitle: 'API',
    description: 'NodeJS + Koa API + simple html, developed to spew jokes in english/bulgarian.',
    devStack: [
      <Libs.NodeJS.icon key={'NodeW'} />,
      <Libs.Typescript.icon key={'TSW'} />,
      <Libs.JavaScript.icon key={'JSW'} />,
      <SecondaryLibs.Postgres.icon key={'PGW'} />,
      <SecondaryLibs.Koa.icon key={'KoaW'} />,
      <SecondaryLibs.html.icon key={'htmlW'} />,
      <SecondaryLibs.css.icon key={'cssW'} />,
      <SecondaryLibs.ESLint.icon key={'EslintW'} />,
    ],
    features: [
      <Feature
        key={'WisdomsRepo'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/wisdoms'} />}
        content={<ExternalLink to={'https://github.com/petarzarkov/wisdoms'} text={'repo'} />}
      />,
      <Feature
        key={'SequelizeWisdoms'}
        icon={<SecondaryLibs.Sequelize.icon />}
        content={
          <Text fontWeight={600}>
            Sequelize: used for DB migrations, layer over PostgeSQL, and Object-Relational Mapping
          </Text>
        }
      />,
    ],
    preview: (
      <AspectRatio w={400} h={isFrameLoading ? 400 : 600}>
        <>
          {isFrameLoading && (
            <Spinner thickness="4px" speed="1.85s" emptyColor="primary.200" color="primary.500" size="xs" />
          )}
          <iframe
            src="https://wisdoms-app.herokuapp.com/"
            style={{ borderRadius: 15 }}
            onLoad={() => setFrameLoading(false)}
            scrolling="no"
          />
        </>
      </AspectRatio>
    ),
  },
  {
    title: '🔥 Hot Utils',
    subTitle: 'npm package',
    description: 'hot-utils npm package - various NodeJS utils with type definition inference',
    devStack: [
      <Libs.NodeJS.icon key={'NodeHot'} />,
      <Libs.Typescript.icon key={'TSH'} />,
      <Libs.JavaScript.icon key={'JSH'} />,
      <SecondaryLibs.npm.icon key={'npmH'} to={'https://www.npmjs.com/package/hot-utils'} />,
      <SecondaryLibs.ESLint.icon key={'EslintH'} />,
      <SecondaryLibs.Jest.icon key={'jesth'} />,
    ],
    features: [
      <Feature
        key={'HotDescription'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/hotstuff/blob/main/README.md'} />}
        content={
          <Code>
            Provides utilities for http requests. Url manipulation and building. Logger. Object utils. Promise utils.
          </Code>
        }
      />,
      <Feature
        key={'HotRepo'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/hotstuff'} />}
        content={<ExternalLink to={'https://github.com/petarzarkov/hotstuff'} text={'repo'} />}
      />,
      <Feature
        key={'npmhot'}
        icon={<SecondaryLibs.npm.icon to={'https://www.npmjs.com/package/hot-utils'} />}
        content={<ExternalLink to={'https://www.npmjs.com/package/hot-utils'} text={'npm hot-utils'} />}
      />,
    ],
    preview: (
      <Flex
        justify="center"
        w={'full'}
        minH={'320px'}
        alignItems={'center'}
        backgroundImage={'images/img5.jpg'}
        rounded={'md'}
        backgroundSize={'cover'}
        backgroundRepeat="no-repeat"
        backgroundPosition={'center'}
      >
        <VStack>
          <a href="https://github.com/petarzarkov/hotstuff/actions/">
            <img
              src="https://github.com/petarzarkov/hotstuff/actions/workflows/build.yml/badge.svg?branch=main"
              alt="Build status"
            />
          </a>
          <a href="https://packagephobia.now.sh/result?p=hot-utils">
            <img src="https://badgen.net/packagephobia/install/hot-utils" alt="Current version" />
          </a>
          <a href="https://www.npmjs.com/package/hot-utils">
            <img src="https://img.shields.io/npm/v/hot-utils" alt="Install size" />
          </a>
          <a href="https://github.com/petarzarkov/hotstuff/blob/main/LICENSE">
            <img src="https://img.shields.io/github/license/petarzarkov/hotstuff" alt="License" />
          </a>
        </VStack>
      </Flex>
    ),
  },
  {
    title: '🕹️ Impossible Quiz',
    subTitle: 'android app',
    description: 'Developed with React Native. Over 4000 Trivia Questions',
    devStack: [
      <Libs.NodeJS.icon key={'NodeIQ'} />,
      <Libs.ReactNative.icon key={'rnIQ'} />,
      <Libs.Typescript.icon key={'TSIQ'} />,
      <Libs.JavaScript.icon key={'JSIQ'} />,
      <SecondaryLibs.ESLint.icon key={'EslintIQ'} />,
    ],
    features: [
      <Feature
        key={'IQGplay'}
        icon={<SecondaryLibs.GooglePlay.icon to={'https://play.google.com/store/apps/details?id=com.impossiblequiz'} />}
        content={
          <ExternalLink
            to={'https://play.google.com/store/apps/details?id=com.impossiblequiz'}
            text={'Get it on Google Play'}
          />
        }
      />,
      <Feature
        key={'IQRepo'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/rn-impossible-quiz'} />}
        content={<ExternalLink to={'https://github.com/petarzarkov/rn-impossible-quiz'} text={'repo'} />}
      />,
    ],
    previewImg: 'images/impQuiz.jpg',
  },
];
