import React, { FC } from "react";
import { ReactElement } from "react";
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from "@chakra-ui/react";
import { SiTypescript, SiJavascript, SiReact, SiPython, SiJava } from "react-icons/si";
import { IoLogoNodejs } from "react-icons/io";

const Skill: FC<{
  title: string;
  text?: string;
  icon: ReactElement;
}> = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"gray.100"}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      {text ? <Text color={"gray.600"}>{text}</Text> : null}
    </Stack>
  );
};

export const Skills: FC = () => {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Skill
          icon={<Icon as={IoLogoNodejs} w={10} h={10} color={"green.600"} />}
          title={"NodeJS"}
        />
        <Skill
          icon={<Icon as={SiTypescript} w={10} h={10} color={"blue.600"} />}
          title={"Typescript"}
        />
        <Skill
          icon={<Icon as={SiJavascript} w={10} h={10} color={"#f0db4f"} />}
          title={"JavaScript"}
        />
        <Skill
          icon={<Icon as={SiReact} w={10} h={10} color={"blue.200"} />}
          title={"React"}
        />
        <Skill
          icon={<Icon as={SiReact} w={10} h={10} color={"blue.300"} />}
          title={"React Native"}
        />
        <Skill
          icon={<Icon as={SiPython} w={10} h={10} color={"green.600"} />}
          title={"Python"}
        />
        <Skill
          icon={<Icon as={SiJava} w={10} h={10} color={"red.600"} />}
          title={"Java"}
        />
      </SimpleGrid>
    </Box>
  );
};