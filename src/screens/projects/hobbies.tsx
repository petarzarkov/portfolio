import React from "react";
import { AspectRatio, Spinner, Code, Flex, VStack, Text } from "@chakra-ui/react";
import { Project, Libs, SecondaryLibs, Feature, Socials, ExternalLink } from "@components";

export const hobbies = (isFrameLoading: boolean, setFrameLoading: (l: boolean) => void): (Parameters<typeof Project>[0])[] => [
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
        <iframe src='https://wisdoms-app.herokuapp.com/' style={{ borderRadius: 15 }} onLoad={() => setFrameLoading(false)} scrolling="no"/>
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
        <a href="https://www.npmjs.com/package/hot-utils"><img src="https://img.shields.io/npm/v/hot-utils" alt="Install size" /></a>
        <a href="https://github.com/petarzarkov/hotstuff/blob/main/LICENSE"><img src="https://img.shields.io/github/license/petarzarkov/hotstuff" alt="License" /></a>
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