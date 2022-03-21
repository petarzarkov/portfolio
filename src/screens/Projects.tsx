import React, { FC, useState, useMemo } from "react";
import { Box, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { CustomTab, Project, Title } from "@components";
import { useThemeProvider } from "@hooks";
import { hobbies } from "./projects/hobbies";
import { work } from "./projects/work";

export const Projects: FC = () => {
  const [isFrameLoading, setFrameLoading] = useState(true);
  const [isRLoading, setRLoading] = useState(true);
  const { theme } = useThemeProvider();
  const hobbyProjects = useMemo(() => hobbies(isFrameLoading, setFrameLoading), [isFrameLoading]);
  const workProjects = useMemo(() => work(isRLoading, setRLoading), [isRLoading]);

  return (
    <Box>
      <Title
        title={"Projects"}
        subTitle={"Showcasing some of my projects."}
      />
      <Tabs isFitted variant='enclosed' colorScheme={theme}>
        <TabList>
          <CustomTab title={"Work"} />
          <CustomTab title={"Hobby"} />
        </TabList>
        <TabPanels>
          <TabPanel>
            {workProjects.map(prj => <Project key={prj.title} {...prj} />)}
          </TabPanel>
          <TabPanel>
            {hobbyProjects.map(prj => <Project key={prj.title} {...prj} />)}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};