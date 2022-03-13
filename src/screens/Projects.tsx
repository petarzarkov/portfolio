import React, { FC } from "react";
import { AspectRatio, Box, Text, Link } from "@chakra-ui/react";
import { Feature, Libs, Project, SecondaryLibs, Socials, Title } from "@components";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const Projects: FC = () => {
  const projects = [
    {
      title: "Wisdoms API",
      subTitle: "API",
      description: "NodeJS + Koa API, developed to spew jokes in english/bulgarian.",
      devStack: [
        <Libs.NodeJS.icon key={"NodeW"} />,
        <Libs.Typescript.icon key={"TSW"} />,
        <Libs.JavaScript.icon key={"JSW"} />,
        <SecondaryLibs.Postgres.icon key={"PGW"} />,
        <SecondaryLibs.Koa.icon key={"KoaW"} />,
        <SecondaryLibs.ESLint.icon key={"EslintW"} />,
      ],
      features: [
        <Feature
          key={"WisdomsRepo"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/wisdoms"} />}
          text={<Text fontWeight={600}>Repo</Text>}
        />,
        <Feature
          key={"SequelizeWisdoms"}
          icon={<SecondaryLibs.Sequelize.icon />}
          text={<Text fontWeight={600}>Sequelize: used for DB migrations, layer over PostgeSQL, and Object-Relational Mapping</Text>}
        />
      ],
      preview: <AspectRatio w={"400px"} minH={"600px"}>
        <iframe src='https://wisdoms-app.herokuapp.com/' style={{ borderRadius: 15 }}/>
      </AspectRatio>
    },
    {
      title: "Hot Utils",
      subTitle: "npm package",
      description: "hot-utils npm package - various NodeJS utils with type definition inference",
      devStack: [
        <Libs.NodeJS.icon key={"NodeHot"} />,
        <Libs.Typescript.icon key={"TSH"} />,
        <Libs.JavaScript.icon key={"JSH"} />,
        <SecondaryLibs.npm.icon key={"npmH"} />,
        <SecondaryLibs.ESLint.icon key={"EslintH"} />,
      ],
      features: [
        <Feature
          key={"HotRepo"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/hotstuff"} />}
          text={<Text fontWeight={600}>{"Repo"}</Text>}
        />,
        <Feature
          key={"npmhot"}
          icon={<SecondaryLibs.npm.icon />}
          text={<Link href={"https://www.npmjs.com/package/hot-utils"}>npm hot-utils <ExternalLinkIcon mx='2px' /></Link>}
        />
      ]
    },
  ];

  return (
    <Box p={4}>
      <Title
        title={"Projects"}
        subTitle={"Showcasing some of my projects."}
      />
      {projects.map(prj => <Project key={prj.title} {...prj} />)}
    </Box>
  );
};