import React from "react";
import { portfolio } from "@config";
import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";
import { IconLink } from "@components";
import { Icon } from "@chakra-ui/react";
import { SiTypescript, SiReact, SiCsharp, SiJava, SiJavascript, SiPython } from "react-icons/si";
import { IoLogoNodejs } from "react-icons/io";

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
  Python: { icon: () => <Icon as={SiPython} w={10} h={10} color={"green.600"} />, level: 2 },
  Java: { icon: () => <Icon as={SiJava} w={10} h={10} color={"red.600"} />, level: 1 },
  React: { icon: () => <Icon as={SiReact} w={10} h={10} color={"blue.200"} />, level: 4 },
  ReactNative: { icon: () => <Icon as={SiReact} w={10} h={10} color={"blue.300"} />, level: 3 },
  "C#": { icon: () => <Icon as={SiCsharp} w={10} h={10} color={"blue.700"} />, level: 1 },
};
