import React, { FC } from "react";
import {
  Box, useColorModeValue,
} from "@chakra-ui/react";
import { Feature, Libs, Project, SecondaryLibs, Title } from "@components";

export const Projects: FC = () => {
  const projects = [
    {
      title: "Wisdoms API",
      subTitle: "API",
      description: "Developed to spew jokes in english/bulgarian.",
      features: [
        <Feature
          key={"Node"}
          icon={<Libs.NodeJS.icon />}
          iconBg={useColorModeValue("yellow.100", "yellow.900")}
          text={"Used for alabala"}
        />,
        <Feature
          key={"TSTS"}
          icon={<Libs.Typescript.icon />}
          iconBg={useColorModeValue("green.100", "green.900")}
          text={"Used for alabala"}
        />,
        <Feature
          key={"SEQL"}
          icon={<SecondaryLibs.Sequelize.icon />}
          iconBg={useColorModeValue("purple.100", "purple.900")}
          text={"Used for alabala"}
        />
      ]
    },
  ];

  return (
    <Box p={4}>
      <Title
        title={"Projects"}
        subTitle={"Software developer with 7 years of experience in the sphere and another roughly 5 years in the area of IT."}
      />
      {projects.map(prj => <Project key={prj.title} {...prj} />)}
    </Box>
  );
};