import React, { FC, createElement } from "react";
import { ReactElement } from "react";
import { Box, SimpleGrid, Text, Stack, Flex, HStack } from "@chakra-ui/react";
import { Libs, Title } from "@components";

const Skill: FC<{
  title: string;
  text?: string;
  level?: 1 | 2 | 3 | 4;
  icon: ReactElement;
}> = ({ title, text, icon, level = 1 }) => {
  const getLevel = () => {
    switch (level) {
      case 1:
        return <Text fontWeight={700} color="green.300">{"Beginner"}</Text>;
      case 2:
        return <Text fontWeight={700} color="blue.300">{"Intermediate"}</Text>;
      case 3:
        return <Text fontWeight={700} color="blue.500">{"Advanced"}</Text>;
      case 4:
        return <Text fontWeight={700} color="purple.300">{"Pro"}</Text>;
      default:
        return <Text fontWeight={700} color="green.300">{"Beginner"}</Text>;
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
      <HStack spacing={1}>
        <Text fontWeight={500}>{"Level:"}</Text>
        {getLevel()}
      </HStack>
      {text ? <Text color={"gray.600"}>{text}</Text> : null}
    </Stack>
  );
};

export const Skills: FC = () => {
  const skills = Object.entries(Libs).map((lib, index) =>
    <Skill
      key={index}
      title={lib[0]}
      icon={createElement(lib[1].icon)}
      level={lib[1].level as 1 | 2 | 3 | 4 | undefined}
    />);
  return (
    <Box p={4}>
      <Title
        title={"Skills"}
        subTitle={"Acquired throughout the years."}
      />
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={10}>
        {skills}
      </SimpleGrid>
    </Box>
  );
};