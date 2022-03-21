import React, { FC, useState } from "react";
import { Badge, AspectRatio, Box, Text, Spinner, Code, VStack, Flex, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from "@chakra-ui/react";
import { CiLibs, CustomTab, ExternalLink, Feature, Libs, Project, SecondaryLibs, Socials, Title } from "@components";
import { useThemeProvider } from "@hooks";
import { CgProfile } from "react-icons/cg";

const RoleCard: FC<{ role: string }> = ({ role }) => {
  const { theme } = useThemeProvider();
  return <VStack textAlign={"center"} color={useColorModeValue("primary.300", "primary.500")}>
    <CgProfile size={35} />
    <Text fontWeight='bold'>
    Role
      <Badge colorScheme={theme}>
        {role}
      </Badge>
    </Text>
  </VStack>;
};

export const Projects: FC = () => {
  const [isFrameLoading, setFrameLoading] = useState(true);
  const [isRLoading, setRLoading] = useState(true);
  const { theme } = useThemeProvider();
  const hobbyProjects: (Parameters<typeof Project>[0])[] = [
    {
      title: "💫 Wisdoms App",
      subTitle: "API",
      description: "NodeJS + Koa API + simple html, developed to spew jokes in english/bulgarian.",
      devStack: [
        <Libs.NodeJS.icon key={"NodeW"} />,
        <Libs.Typescript.icon key={"TSW"} />,
        <Libs.JavaScript.icon key={"JSW"} />,
        <SecondaryLibs.Postgres.icon key={"PGW"} />,
        <SecondaryLibs.Koa.icon key={"KoaW"} />,
        <SecondaryLibs.html.icon key={"htmlW"} />,
        <SecondaryLibs.css.icon key={"cssW"} />,
        <SecondaryLibs.ESLint.icon key={"EslintW"} />,
      ],
      features: [
        <Feature
          key={"WisdomsRepo"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/wisdoms"} />}
          content={<ExternalLink to={"https://github.com/petarzarkov/wisdoms"} text={"repo"} />}
        />,
        <Feature
          key={"SequelizeWisdoms"}
          icon={<SecondaryLibs.Sequelize.icon />}
          content={<Text fontWeight={600}>Sequelize: used for DB migrations, layer over PostgeSQL, and Object-Relational Mapping</Text>}
        />
      ],
      preview: <AspectRatio w={400} h={isFrameLoading ? 400 : 600}>
        <>
          {isFrameLoading && <Spinner
            thickness='4px'
            speed='1.85s'
            emptyColor='primary.200'
            color='primary.500'
            size='xs'
          />}
          <iframe src='https://wisdoms-app.herokuapp.com/' style={{ borderRadius: 15 }} onLoad={() => setFrameLoading(false)} />
        </>
      </AspectRatio>
    },
    {
      title: "🔥 Hot Utils",
      subTitle: "npm package",
      description: "hot-utils npm package - various NodeJS utils with type definition inference",
      devStack: [
        <Libs.NodeJS.icon key={"NodeHot"} />,
        <Libs.Typescript.icon key={"TSH"} />,
        <Libs.JavaScript.icon key={"JSH"} />,
        <SecondaryLibs.npm.icon key={"npmH"} to={"https://www.npmjs.com/package/hot-utils"} />,
        <SecondaryLibs.ESLint.icon key={"EslintH"} />,
        <SecondaryLibs.Jest.icon key={"jesth"} />,
      ],
      features: [
        <Feature
          key={"HotDescription"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/hotstuff/blob/main/README.md"} />}
          content={<Code>Provides utilities for http requests. Url manipulation and building. Logger. Object utils. Promise utils.</Code>}
        />,
        <Feature
          key={"HotRepo"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/hotstuff"} />}
          content={<ExternalLink to={"https://github.com/petarzarkov/hotstuff"} text={"repo"} />}
        />,
        <Feature
          key={"npmhot"}
          icon={<SecondaryLibs.npm.icon to={"https://www.npmjs.com/package/hot-utils"} />}
          content={<ExternalLink to={"https://www.npmjs.com/package/hot-utils"} text={"npm hot-utils"} />}
        />
      ],
      preview: <Flex
        justify="center"
        w={"full"}
        minH={"320px"}
        alignItems={"center"}
        backgroundImage={"images/img5.jpg"} rounded={"md"} backgroundSize={"cover"} backgroundRepeat="no-repeat" backgroundPosition={"center"}>
        <VStack>
          <a href="https://github.com/petarzarkov/hotstuff/actions/"><img src="https://github.com/petarzarkov/hotstuff/actions/workflows/build.yml/badge.svg?branch=main" alt="Build status" /></a>
          <a href="https://packagephobia.now.sh/result?p=hot-utils"><img src="https://badgen.net/packagephobia/install/hot-utils" alt="Current version" /></a>
          <a href="https://www.npmjs.com/package/hot-utils"><img src="https://img.shields.io/npm/v/hot-utils" alt="Install size"/></a>
          <a href="https://github.com/petarzarkov/hotstuff/blob/main/LICENSE"><img src="https://img.shields.io/github/license/petarzarkov/hotstuff" alt="License"/></a>
        </VStack>
      </Flex>
    },
    {
      title: "🕹️ Impossible Quiz",
      subTitle: "android app",
      description: "Developed with React Native. Over 4000 Trivia Questions",
      devStack: [
        <Libs.NodeJS.icon key={"NodeIQ"} />,
        <Libs.ReactNative.icon key={"rnIQ"} />,
        <Libs.Typescript.icon key={"TSIQ"} />,
        <Libs.JavaScript.icon key={"JSIQ"} />,
        <SecondaryLibs.ESLint.icon key={"EslintIQ"} />,
      ],
      features: [
        <Feature
          key={"IQGplay"}
          icon={<SecondaryLibs.GooglePlay.icon to={"https://play.google.com/store/apps/details?id=com.impossiblequiz"} />}
          content={<ExternalLink to={"https://play.google.com/store/apps/details?id=com.impossiblequiz"} text={"Get it on Google Play"} />}
        />,
        <Feature
          key={"IQRepo"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/rn-impossible-quiz"} />}
          content={<ExternalLink to={"https://github.com/petarzarkov/rn-impossible-quiz"} text={"repo"} />}
        />,
      ],
      previewImg: "images/impQuiz.jpg"
    },
  ];

  const workProjects: (Parameters<typeof Project>[0])[] = [
    {
      title: "🚀 Rocket Crash",
      subTitle: "Game Engine",
      description: "Jump on a rocket with other players and see how far you can go before the rocket explodes.",
      devStack: [
        <Libs.NodeJS.icon key={"NodeR"} />,
        <Libs.Typescript.icon key={"TSR"} />,
        <Libs.JavaScript.icon key={"JSR"} />,
        <SecondaryLibs.Postgres.icon key={"PGR"} />,
        <SecondaryLibs.Koa.icon key={"KoaR"} />,
        <SecondaryLibs.html.icon key={"htmlR"} />,
        <SecondaryLibs.css.icon key={"cssR"} />,
        <SecondaryLibs.ESLint.icon key={"EslintR"} />,
        <SecondaryLibs.MySQL.icon key={"MySQLR"} />,
        <SecondaryLibs.Redis.icon key={"RedisR"} />,
        <SecondaryLibs.CucumberJS.icon key={"CucuR"} />,
        <SecondaryLibs.npm.icon key={"npmR"} />,
        <SecondaryLibs.Jest.icon key={"jestR"} />,
        <CiLibs.DataDog.icon key={"DDR"} />,
        <CiLibs.OctopusDeploy.icon key={"OctopusDeployR"} />,
        <CiLibs.Jira.icon key={"JiraR"} />,
        <CiLibs.Bamboo.icon key={"BambooR"} />,
        <CiLibs.BitBucket.icon key={"BitBucketR"} />,
        <CiLibs.Confluence.icon key={"ConfluenceR"} />,
      ],
      features: [
        <Feature
          key={"RoleR"}
          icon={<RoleCard role={"Lead Dev"} />}
          content={<Text fontWeight={600}>Managed the project from start to finish including FE, BE, Automation with Cucumber, and CI/CD.</Text>}
        />,
        <Feature
          key={"CIR"}
          icon={<CiLibs.BitBucket.icon />}
          content={<Text fontWeight={600}>Monorepo distributed with Docker + Octo + BitBucket + Bamboo</Text>}
        />,
        <Feature
          key={"SequelizeRocket"}
          icon={<SecondaryLibs.Sequelize.icon />}
          content={<Text fontWeight={600}>Sequelize: used for DB migrations, layer over PostgeSQL + MySQL, and Object-Relational Mapping</Text>}
        />
      ],
      previewImg: "images/rocket.gif",
      preview: <AspectRatio w={{ base: 256, md: 400, lg: 400 }} h={{ base: 256, md: 600, lg: 600 }}>
        <>
          {isRLoading && <Spinner
            thickness='4px'
            speed='1.85s'
            emptyColor='primary.200'
            color='primary.500'
            size='xs'
          />}
          <iframe
            style={{ borderRadius: 15 }}
            onLoad={() => setRLoading(false)}
            src="https://www.youtube.com/embed/qQLsUaXShnE"
            title="How to play rocket"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </>
      </AspectRatio>
    },
    {
      title: "🎲 Over Under",
      subTitle: "Game Engine",
      description: "Roll a die within a configurable range and bet a target over or under the roll.",
      devStack: [
        <Libs.Python.icon key={"PythonOU"} />,
        <SecondaryLibs.Postgres.icon key={"PGOU"} />,
        <SecondaryLibs.html.icon key={"htmlOU"} />,
        <SecondaryLibs.css.icon key={"cssOU"} />,
        <SecondaryLibs.Redis.icon key={"RedisOU"} />,
        <CiLibs.OctopusDeploy.icon key={"OctopusDeployOU"} />,
        <CiLibs.Jira.icon key={"JiraOU"} />,
        <CiLibs.Bamboo.icon key={"BambooOU"} />,
        <CiLibs.BitBucket.icon key={"BitBucketOU"} />,
        <CiLibs.Confluence.icon key={"ConfluenceOU"} />,
        <CiLibs.AWS.icon key={"AWSOU"} />,
      ],
      features: [
        <Feature
          key={"RoleOU"}
          icon={<RoleCard role={"Lead Dev"} />}
          content={<Text fontWeight={600}>
          Managed the project from start to finish including FE, BE, and CI/CD.
          Pytest was used for complete unit test coverage.
          AWS for billions of simulations to meet regulator standards.
          Extra Stack: pyramid, venv
          </Text>}
        />,
        <Feature
          key={"CIOU"}
          icon={<CiLibs.BitBucket.icon />}
          content={<Text fontWeight={600}>Repo distributed with Docker + Octo + BitBucket + Bamboo</Text>}
        />
      ],
      previewImg: "images/dice.jpg",
    },
  ];

  return (
    <Box>
      <Title
        title={"Projects"}
        subTitle={"Showcasing some of my projects."}
      />
      <Tabs isFitted variant='enclosed' colorScheme={theme}>
        <TabList>
          <CustomTab title={"Hobby"} />
          <CustomTab title={"Work"} />
        </TabList>
        <TabPanels>
          <TabPanel>
            {hobbyProjects.map(prj => <Project key={prj.title} {...prj} />)}
          </TabPanel>
          <TabPanel>
            {workProjects.map(prj => <Project key={prj.title} {...prj} />)}
          </TabPanel>
        </TabPanels>
      </Tabs>

    </Box>
  );
};