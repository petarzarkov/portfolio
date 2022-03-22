import React, { FC, createElement } from "react";
import { ReactElement } from "react";
import { SimpleGrid, Text, Stack, Flex, HStack, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import { CiLibs, CustomTab, Libs, SecondaryLibs, Title } from "@components";
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
        return <Text fontWeight={700} color="green.300">{"Noob"}</Text>;
      case 2:
        return <Text fontWeight={700} color="blue.300">{"Beginner"}</Text>;
      case 3:
        return <Text fontWeight={700} color="blue.500">{"Intermediate"}</Text>;
      case 4:
        return <Text fontWeight={700} color="purple.300">{"Advanced"}</Text>;
      default:
        return <Text fontWeight={700} color="green.300">{"Noob"}</Text>;
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

type LibEntry = [string, {
  icon: (t: { to?: string }) => JSX.Element;
  level: number;
  title?: string;
}];

const parseLib = (lib: LibEntry, index: number) => <Skill
  key={index}
  title={lib[1]?.title || lib[0]}
  icon={createElement(lib[1].icon)}
  level={lib[1].level as 1 | 2 | 3 | 4 | undefined}
/>;

export const Skills: FC = () => {
  const { theme } = useThemeProvider();
  const skills = Object.entries(Libs).map(parseLib);
  const skillsSecondary = Object.entries(SecondaryLibs).map(parseLib);
  const skillsCI = Object.entries(CiLibs).map(parseLib);

  return (
    <Tabs isFitted variant='enclosed' colorScheme={theme}>
      <TabList >
        <CustomTab title={"Primary"} />
        <CustomTab title={"Secondary"} />
        <CustomTab title={"CI/CD"} />
      </TabList>
      <TabPanels>
        {[
          { title: "Primary", sub: "Programming languages and supersets.", skills: skills },
          { title: "Secondary", sub: "Libraries, packages, tools.", skills: skillsSecondary },
          { title: "CI/CD", sub: "Continuous Integration, Continuous Delivery, Continuous Deployment.", skills: skillsCI }
        ].map((panel, indx) =>
          <TabPanel key={`${panel.title}-${indx}`} minH="80vh">
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
