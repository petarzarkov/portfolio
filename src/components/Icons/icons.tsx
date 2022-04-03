import React, { FC } from "react";
import { portfolio } from "@config";
import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";
import { IconLink as IconLinkBase } from "@components";
import { Flex, Icon as IconBase, Image as ImageBase, useColorModeValue } from "@chakra-ui/react";
import {
  SiTypescript, SiReact, SiCsharp, SiJavascript, SiDatadog, SiSequelize,
  SiNextdotjs, SiNestjs, SiPostgresql, SiSocketdotio, SiDocker, SiKubernetes, SiDotnet,
  SiCucumber, SiPrisma, SiEslint, SiOctopusdeploy, SiBamboo, SiBitbucket, SiCplusplus, SiExpress, SiHtml5, SiCss3, SiConfluence, SiJira, SiFastify, SiSwagger
} from "react-icons/si";
import { IoLogoNodejs } from "react-icons/io";
import { GrMysql } from "react-icons/gr";
import { FaNpm } from "react-icons/fa";

const FlexIcon: FC = ({ children }) => <Flex
  w={12}
  h={12}
  align={"center"}
  justify={"center"}
  rounded={"full"}
  bgColor={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
  mb={1}>
  {children}
</Flex>;
const Icon: FC<Parameters<typeof IconBase>[0]> = (props) => <FlexIcon>
  <IconBase {...props} />
</FlexIcon>;
const IconLink: FC<Parameters<typeof IconLinkBase>[0]> = (props) => <FlexIcon>
  <IconLinkBase {...props} />
</FlexIcon>;
const Image: FC<Parameters<typeof ImageBase>[0]> = (props) => <FlexIcon>
  <ImageBase {...props} />
</FlexIcon>;

export const Socials = {
  GitHub: ({ to = portfolio.github }) => <IconLink
    to={to}
    icon={<BsGithub />}
    label={"github"}
    btnProps={{
      fontSize: "3xl"
    }}
  />,
  LinkedIn: () => <IconLink
    to={portfolio.linkedin}
    icon={<BsLinkedin size="28px" />}
    label={"linkedin"}
  />,
  Twitter: () => <IconLink
    to={portfolio.twitter}
    icon={<BsTwitter size="28px" />}
    label={"twitter"}
  />
};

export const Libs = {
  NodeJS: { icon: () => <IconLink icon={<Icon as={IoLogoNodejs} w={10} h={10} color={"green.600"} />} to={"https://nodejs.org/en/"} />, level: 4 },
  JavaScript: { icon: () => <IconLink icon={<Icon as={SiJavascript} w={10} h={10} color={"#f0db4f"} />} to={"https://developer.mozilla.org/en-US/docs/Web/JavaScript"} />, level: 4 },
  Typescript: { icon: () => <IconLink icon={<Icon as={SiTypescript} w={10} h={10} color={"blue.600"} />} to={"https://www.typescriptlang.org/"} />, level: 3 },
  Python: { icon: () => <Image w={10} h={10} src="https://www.python.org/static/favicon.ico" />, level: 2 },
  Java: { icon: () => <Image w={10} h={10} src="https://img.icons8.com/color/48/000000/java-coffee-cup-logo--v1.png" />, level: 2 },
  React: { icon: () => <IconLink icon={<Icon as={SiReact} w={10} h={10} color={"blue.200"} />} to={"https://reactjs.org/"} />, level: 4 },
  ReactNative: { icon: () => <IconLink icon={<Icon as={SiReact} w={10} h={10} color={"blue.300"} />} to={"https://reactnative.dev/"} />, level: 3 },
  Dotnet: { icon: () => <IconLink icon={<Icon as={SiDotnet} w={10} h={10} color={"purple.300"} />} to={"https://dotnet.microsoft.com/en-us/"} />, level: 2, title: ".NET" },
  Csharp: { icon: () => <Icon as={SiCsharp} w={10} h={10} color={"blue.700"} />, level: 1, title: "C#" },
  Cpp: { icon: () => <Icon as={SiCplusplus} w={10} h={10} color={"blue.700"} />, level: 1, title: "C++" },
  GO: { icon: () => <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Go_Logo_Blue.svg/215px-Go_Logo_Blue.svg.png" />, level: 1 },
};

export const SecondaryLibs = {
  CucumberJS: { icon: () => <IconLink icon={<Icon as={SiCucumber} w={10} h={10} color={"green.500"} />} to={"https://cucumber.io/docs/installation/javascript/"} />, level: 4 },
  Sequelize: { icon: () => <IconLink icon={<Icon as={SiSequelize} w={10} h={10} color={"blue.400"} />} to={"https://sequelize.org/"} />, level: 4 },
  Prisma: { icon: () => <Icon as={SiPrisma} w={10} h={10} color={"blue.800"} />, level: 2 },
  NextJS: { icon: () => <Icon as={SiNextdotjs} w={10} h={10} color={"gray.600"} />, level: 1 },
  NestJS: { icon: () => <Icon as={SiNestjs} w={10} h={10} color={"red.600"} />, level: 1 },
  Fastify: { icon: () => <IconLink icon={<Icon as={SiFastify} w={10} h={10} color={"gray.600"} />} to={"https://www.fastify.io/"} />, level: 3 },
  MySQL: { icon: () => <Icon as={GrMysql} w={10} h={10} color={"blue.500"} />, level: 3 },
  Postgres: { icon: () => <IconLink icon={<Icon as={SiPostgresql} w={10} h={10} color={"blue.600"} />} to={"https://www.postgresql.org/"} />, level: 4 },
  Redis: { icon: () => <Image w={10} h={10} src="https://pbs.twimg.com/profile_images/1285653263824691205/mu4nJ7Gb_normal.png" />, level: 2 },
  Koa: { icon: () => <IconLink icon={<Image w={10} src="images/koa.jpg" />} to={"https://koajs.com/"} />, level: 4 },
  SocketIO: { icon: () => <Icon as={SiSocketdotio} w={10} h={10} color={"gray.800"} />, level: 4 },
  Swagger: { icon: () => <IconLink icon={<Icon as={SiSwagger} w={10} h={10} color={"green.400"} />} to={"https://swagger.io/"} />, level: 3 },
  Jest: { icon: () => <IconLink icon={<Image w={10} h={10} src="https://jestjs.io/img/jest.png" />} to={"https://jestjs.io"} />, level: 4 },
  ESLint: { icon: () => <IconLink icon={<Icon as={SiEslint} w={10} h={10} color={"purple.800"} />} to={"https://eslint.org/"} />, level: 4 },
  Express: { icon: () => <Icon as={SiExpress} w={10} h={10} color={"gray.600"} />, level: 4 },
  npm: { icon: ({ to }: { to?: string }) => <IconLink icon={<Icon as={FaNpm} w={10} h={10} color={"red.600"} />} to={to || "https://www.npmjs.com/"} />, level: 4 },
  html: { icon: () => <IconLink icon={<Icon as={SiHtml5} w={10} h={10} color={"orange.400"} />} to={"https://developer.mozilla.org/en-US/docs/Web/HTML"} />, level: 4 },
  css: { icon: () => <IconLink icon={<Icon as={SiCss3} w={10} h={10} color={"teal.400"} />} to={"https://developer.mozilla.org/en-US/docs/Web/CSS"} />, level: 4 },
  GooglePlay: {
    icon: ({ to }: { to?: string }) => <IconLink icon={<Image w={10} h={10} src="https://www.gstatic.com/android/market_images/web/favicon_v2.ico" />} to={to || "https://play.google.com/"} />,
    level: 4
  },
};

export const CiLibs = {
  DataDog: { icon: () => <Icon as={SiDatadog} w={10} h={10} color={"purple.600"} />, level: 3 },
  Docker: { icon: () => <Icon as={SiDocker} w={10} h={10} color={"blue.400"} />, level: 4 },
  Kubernetes: { icon: () => <Icon as={SiKubernetes} w={10} h={10} color={"blue.600"} />, level: 3 },
  OctopusDeploy: { icon: () => <Icon as={SiOctopusdeploy} w={10} h={10} color={"blue.400"} />, level: 4 },
  Jenkins: { icon: () => <Image src="https://www.jenkins.io/images/logos/jenkins/jenkins.svg" />, level: 4 },
  AWS: { icon: () => <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/512px-Amazon_Web_Services_Logo.svg.png?20170912170050" />, level: 2 },
  Bamboo: { icon: () => <Icon as={SiBamboo} w={10} h={10} color={"blue.600"} />, level: 4 },
  BitBucket: { icon: () => <Icon as={SiBitbucket} w={10} h={10} color={"blue.800"} />, level: 4 },
  Confluence: { icon: () => <Icon as={SiConfluence} w={10} h={10} color={"blue.600"} />, level: 4 },
  Jira: { icon: () => <Icon as={SiJira} w={10} h={10} color={"blue.600"} />, level: 4 },
};