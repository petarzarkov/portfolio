import React from "react";
import { portfolio } from "@config";
import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";
import { IconLink } from "@components";
import { Icon, Image } from "@chakra-ui/react";
import {
  SiTypescript, SiReact, SiCsharp, SiJavascript, SiDatadog, SiSequelize,
  SiNextdotjs, SiNestjs, SiPostgresql, SiSocketdotio, SiDocker, SiKubernetes,
  SiCucumber, SiPrisma, SiEslint, SiOctopusdeploy, SiBamboo
} from "react-icons/si";
import { IoLogoNodejs } from "react-icons/io";
import { GrMysql } from "react-icons/gr";

export const Socials = {
  GitHub: () => <IconLink
    to={portfolio.github}
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
  NodeJS: { icon: () => <Icon as={IoLogoNodejs} w={10} h={10} color={"green.600"} />, level: 4 },
  JavaScript: { icon: () => <Icon as={SiJavascript} w={10} h={10} color={"#f0db4f"} />, level: 4 },
  Typescript: { icon: () => <Icon as={SiTypescript} w={10} h={10} color={"blue.600"} />, level: 3 },
  Python: { icon: () => <Image w={10} h={10} src="https://www.python.org/static/favicon.ico" />, level: 2 },
  Java: { icon: () => <Image w={10} h={10} src="https://img.icons8.com/color/48/000000/java-coffee-cup-logo--v1.png" />, level: 2 },
  React: { icon: () => <Icon as={SiReact} w={10} h={10} color={"blue.200"} />, level: 4 },
  ReactNative: { icon: () => <Icon as={SiReact} w={10} h={10} color={"blue.300"} />, level: 3 },
  "C#": { icon: () => <Icon as={SiCsharp} w={10} h={10} color={"blue.700"} />, level: 1 },
  GO: { icon: () => <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Go_Logo_Blue.svg/215px-Go_Logo_Blue.svg.png" />, level: 1 },
};

export const SecondaryLibs = {
  CucumberJS: { icon: () => <Icon as={SiCucumber} w={10} h={10} color={"green.500"} />, level: 4 },
  Sequelize: { icon: () => <Icon as={SiSequelize} w={10} h={10} color={"blue.400"} />, level: 4 },
  Prisma: { icon: () => <Icon as={SiPrisma} w={10} h={10} color={"blue.800"} />, level: 2 },
  NextJS: { icon: () => <Icon as={SiNextdotjs} w={10} h={10} color={"gray.600"} />, level: 1 },
  NestJS: { icon: () => <Icon as={SiNestjs} w={10} h={10} color={"red.600"} />, level: 1 },
  MySQL: { icon: () => <Icon as={GrMysql} w={10} h={10} color={"blue.500"} />, level: 3 },
  Postgres: { icon: () => <Icon as={SiPostgresql} w={10} h={10} color={"blue.600"} />, level: 4 },
  Redis: { icon: () => <Image w={10} h={10} src="https://pbs.twimg.com/profile_images/1285653263824691205/mu4nJ7Gb_normal.png" />, level: 2 },
  SocketIO: { icon: () => <Icon as={SiSocketdotio} w={10} h={10} color={"gray.800"} />, level: 4 },
  Jest: { icon: () => <Image w={10} h={10} src="https://jestjs.io/img/jest.png" />, level: 4 },
  ESLint: { icon: () => <Icon as={SiEslint} w={10} h={10} color={"purple.800"} />, level: 4 },
};

export const CiLibs = {
  DataDog: { icon: () => <Icon as={SiDatadog} w={10} h={10} color={"purple.600"} />, level: 3 },
  Docker: { icon: () => <Icon as={SiDocker} w={10} h={10} color={"blue.400"} />, level: 4 },
  Kubernetes: { icon: () => <Icon as={SiKubernetes} w={10} h={10} color={"blue.600"} />, level: 3 },
  OctopusDeploy: { icon: () => <Icon as={SiOctopusdeploy} w={10} h={10} color={"blue.400"} />, level: 4 },
  Jenkins: { icon: () => <Image  src="https://www.jenkins.io/images/logos/jenkins/jenkins.svg" />, level: 4 },
  AWS: { icon: () => <Image  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/512px-Amazon_Web_Services_Logo.svg.png?20170912170050" />, level: 2 },
  Bamboo: { icon: () => <Icon as={SiBamboo} w={10} h={10} color={"blue.600"} />, level: 4 },
};