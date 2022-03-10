import React, { FC } from "react";
import { ReactElement } from "react";
import { Box, SimpleGrid, Icon, Text, Stack, Flex, HStack } from "@chakra-ui/react";
import { SiTypescript, SiJavascript, SiReact, SiPython, SiJava } from "react-icons/si";
import { IoLogoNodejs } from "react-icons/io";
import { MdSignalCellular1Bar, MdSignalCellular2Bar, MdSignalCellular3Bar, MdSignalCellular4Bar } from "react-icons/md";
import { IconBaseProps } from "react-icons";

const Skill: FC<{
  title: string;
  text?: string;
  level?: 1 | 2 | 3 | 4;
  icon: ReactElement;
}> = ({ title, text, icon, level = 1 }) => {
  const Level: FC<{ lProps: IconBaseProps }> = ({ lProps }) => {
    switch (level) {
      case 1:
        return <MdSignalCellular1Bar {...lProps} />;
      case 2:
        return <MdSignalCellular2Bar {...lProps} />;
      case 3:
        return <MdSignalCellular3Bar {...lProps} />;
      case 4:
        return <MdSignalCellular4Bar {...lProps} />;
      default:
        return <MdSignalCellular1Bar {...lProps} />;
    }
  };
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
      <HStack spacing={0}>
        <Level lProps={{
          color: "green",
          size: 45
        }} />
      </HStack>
      {text ? <Text color={"gray.600"}>{text}</Text> : null}
    </Stack>
  );
};

export const Skills: FC = () => {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={10}>
        <Skill
          icon={<Icon as={IoLogoNodejs} w={10} h={10} color={"green.600"} />}
          title={"NodeJS"}
          level={4}
        />
        <Skill
          icon={<Icon as={SiTypescript} w={10} h={10} color={"blue.600"} />}
          title={"Typescript"}
          level={3}
        />
        <Skill
          icon={<Icon as={SiJavascript} w={10} h={10} color={"#f0db4f"} />}
          title={"JavaScript"}
          level={4}
        />
        <Skill
          icon={<Icon as={SiReact} w={10} h={10} color={"blue.200"} />}
          title={"React"}
          level={2}
        />
        <Skill
          icon={<Icon as={SiReact} w={10} h={10} color={"blue.300"} />}
          title={"React Native"}
          level={2}
        />
        <Skill
          icon={<Icon as={SiPython} w={10} h={10} color={"green.600"} />}
          title={"Python"}
          level={2}
        />
        <Skill
          icon={<Icon as={SiJava} w={10} h={10} color={"red.600"} />}
          title={"Java"}
          level={1}
        />
      </SimpleGrid>
    </Box>
  );
};