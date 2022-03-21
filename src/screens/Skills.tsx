import React, { FC, createElement } from "react";
import { ReactElement } from "react";
import { SimpleGrid, Text, Stack, Flex, HStack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { CiLibs, Libs, SecondaryLibs, Title } from "@components";
import { useThemeProvider } from "@hooks";

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
        w={12}
        h={12}
        align={"center"}
        justify={"center"}
        rounded={"full"}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <HStack spacing={1} wrap={"wrap"}>
        <Text fontWeight={500}>{"Level:"}</Text>
        {getLevel()}
      </HStack>
      {text ? <Text color={"primary.600"}>{text}</Text> : null}
    </Stack>
  );
};

export const Skills: FC = () => {
  const { theme } = useThemeProvider();
  const skills = Object.entries(Libs).map((lib, index) =>
    <Skill
      key={index}
      title={(lib[1] as { title?: string })?.title || lib[0]}
      icon={createElement(lib[1].icon)}
      level={lib[1].level as 1 | 2 | 3 | 4 | undefined}
    />);
  const skillsSecondary = Object.entries(SecondaryLibs).map((lib, index) =>
    <Skill
      key={index}
      title={lib[0]}
      icon={createElement(lib[1].icon)}
      level={lib[1].level as 1 | 2 | 3 | 4 | undefined}
    />);
  const skillsCI = Object.entries(CiLibs).map((lib, index) =>
    <Skill
      key={index}
      title={lib[0]}
      icon={createElement(lib[1].icon)}
      level={lib[1].level as 1 | 2 | 3 | 4 | undefined}
    />);

  return (
    <Tabs isFitted variant='enclosed' colorScheme={theme}>
      <TabList >
        <Tab>Primary</Tab>
        <Tab>Secondary</Tab>
        <Tab>CI/CD</Tab>
      </TabList>
      <TabPanels>
        {[
          { title: "Primary", sub: "Programming languages and supersets.", skills: skills },
          { title: "Secondary", sub: "Libraries, packages, tools.", skills: skillsSecondary },
          { title: "CI/CD", sub: "Continuous Integration, Continuous Delivery, Continuous Deployment.", skills: skillsCI }
        ].map((panel, indx) =>
          <TabPanel key={`${panel.title}-${indx}`}>
            <Title
              title={panel.title}
              subTitle={panel.sub}
            />
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={10}>
              {panel.skills}
            </SimpleGrid>
          </TabPanel>)}
      </TabPanels>
    </Tabs>
  );
};