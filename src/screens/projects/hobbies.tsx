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
    title: 'Derp AI',
    subTitle: 'Synthesize an answer by quering multiple AI APIs',
    description:
      'NestJS Backend, Postgres db with TypeORM, WebSocket integration with Socket.io, AI integration with Gemini, Huggingface, etc.',
    devStack: [
      <Libs.NodeJS.icon key={'NodeDerp'} />,
      <Libs.Typescript.icon key={'TSderp'} />,
      <Libs.JavaScript.icon key={'JSderp'} />,
      <SecondaryLibs.NestJS.icon key={'nestderp'} />,
      <SecondaryLibs.TypeORM.icon key={'typeormderp'} />,
      <SecondaryLibs.ESLint.icon key={'EslintDerp'} />,
      <SecondaryLibs.Postgres.icon key={'postgresderp'} />,
      <SecondaryLibs.SocketIO.icon key={'socketderp'} />,
      <SecondaryLibs.Swagger.icon key={'swaggerderp'} />,
      <SecondaryLibs.Jest.icon key={'jestderp'} />,
    ],
    features: [
      <Feature
        key={'DerpAIRepo'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/derp.ai'} />}
        content={<ExternalLink to={'https://github.com/petarzarkov/derp.ai'} text={'derp.ai.repo'} />}
      />,
    ],
    preview: (
      <AspectRatio w={400} h={isFrameLoading ? 400 : 600}>
        <>
          {isFrameLoading && (
            <Spinner thickness="4px" speed="1.85s" emptyColor="primary.200" color="primary.500" size="xs" />
          )}
          <iframe
            src="https://derp.ai.petarzarkov.com/"
            style={{ borderRadius: 15 }}
            onLoad={() => setFrameLoading(false)}
            scrolling="no"
          />
        </>
      </AspectRatio>
    ),
  },
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
    title: '💫 Wisdoms App',
    subTitle: 'API',
    description: 'NestJS + basic html, developed to spew jokes in english/bulgarian.',
    devStack: [
      <Libs.NodeJS.icon key={'NodeW'} />,
      <Libs.Typescript.icon key={'TSW'} />,
      <Libs.JavaScript.icon key={'JSW'} />,
      <SecondaryLibs.NestJS.icon key={'nestjswisdom'} />,
      <SecondaryLibs.html.icon key={'htmlW'} />,
      <SecondaryLibs.css.icon key={'cssW'} />,
      <SecondaryLibs.ESLint.icon key={'EslintW'} />,
    ],
    features: [
      <Feature
        key={'WisdomsRepo'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/wisdoms-nest'} />}
        content={<ExternalLink to={'https://github.com/petarzarkov/wisdoms-nest'} text={'repo'} />}
      />,
    ],
    preview: (
      <AspectRatio w={400} h={isFrameLoading ? 400 : 600}>
        <>
          {isFrameLoading && (
            <Spinner thickness="4px" speed="1.85s" emptyColor="primary.200" color="primary.500" size="xs" />
          )}
          <iframe
            src="https://wisdoms.petarzarkov.com/"
            style={{ borderRadius: 15 }}
            onLoad={() => setFrameLoading(false)}
            scrolling="no"
          />
        </>
      </AspectRatio>
    ),
  },
  {
    title: '🔥 @toplo ',
    subTitle: 'npm packages',
    description: '@toplo npm packages monorepo - various util packages with type definition inference',
    devStack: [
      <Libs.NodeJS.icon key={'NodeHot'} />,
      <Libs.Typescript.icon key={'TSH'} />,
      <Libs.JavaScript.icon key={'JSH'} />,
      <SecondaryLibs.npm.icon key={'npmH'} to={'https://www.npmjs.com/search?q=keywords:@toplo'} />,
      <SecondaryLibs.ESLint.icon key={'EslintH'} />,
      <SecondaryLibs.Jest.icon key={'jesth'} />,
    ],
    features: [
      <Feature
        key={'@toplo-desc'}
        icon={<Socials.GitHub to={'https://github.com/petarzarkov/toplo/blob/main/README.md'} />}
        content={
          <Code>
            Various npm packages with different use cases e.g. utilities for http requests. Url manipulation and
            building. Logger. Object utils. Promise utils.
          </Code>
        }
      />,
      <Feature
        key={'@toplo/api'}
        icon={<SecondaryLibs.npm.icon to={'https://www.npmjs.com/package/@toplo/api'} />}
        content={
          <div>
            <Code>Various NodeJS API utils with TS support</Code>
            <ExternalLink to={'https://www.npmjs.com/package/@toplo/api'} text={'npm @toplo/api'} />
          </div>
        }
      />,
      <Feature
        key={'@toplo/common'}
        icon={<SecondaryLibs.npm.icon to={'https://www.npmjs.com/package/@toplo/common'} />}
        content={
          <div>
            <Code>Common @toplo stuff</Code>
            <ExternalLink to={'https://www.npmjs.com/package/@toplo/common'} text={'npm @toplo/common'} />
          </div>
        }
      />,
      <Feature
        key={'@toplo/components'}
        icon={<SecondaryLibs.npm.icon to={'https://www.npmjs.com/package/@toplo/components'} />}
        content={
          <div>
            <Code>@toplo React components using ChakraUI</Code>
            <ExternalLink to={'https://www.npmjs.com/package/@toplo/components'} text={'npm @toplo/components'} />
          </div>
        }
      />,
      <Feature
        key={'@toplo/db'}
        icon={<SecondaryLibs.npm.icon to={'https://www.npmjs.com/package/@toplo/db'} />}
        content={
          <div>
            <Code>toplo db utils</Code>
            <ExternalLink to={'https://www.npmjs.com/package/@toplo/db'} text={'npm @toplo/db'} />
          </div>
        }
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
          <a href="https://github.com/petarzarkov/toplo/actions/">
            <img
              src="https://github.com/petarzarkov/toplo/actions/workflows/build.yml/badge.svg?branch=main"
              alt="Build status"
            />
          </a>
          <a href="https://packagephobia.now.sh/result?p=@toplo/common">
            <img src="https://badgen.net/packagephobia/install/@toplo/common" alt="Current version" />
          </a>
          <a href="https://www.npmjs.com/package/@toplo/common">
            <img src="https://img.shields.io/npm/v/@toplo/common" alt="Install size" />
          </a>
          <a href="https://github.com/petarzarkov/toplo/blob/main/LICENSE">
            <img src="https://img.shields.io/github/license/petarzarkov/toplo" alt="License" />
          </a>
        </VStack>
      </Flex>
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
