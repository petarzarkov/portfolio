import React, { FC, useState } from "react";
import { AspectRatio, Box, Text, Spinner, Code } from "@chakra-ui/react";
import { ExternalLink, Feature, Libs, Project, SecondaryLibs, Socials, Title } from "@components";

export const Projects: FC = () => {
  const [isFrameLoading, setFrameLoading] = useState(true);
  const projects = [
    {
      title: "💫 Wisdoms App",
      subTitle: "API",
      description: "NodeJS + Koa API + simple html, developed to spew jokes in english/bulgarian.",
      devStack: [
        <Libs.NodeJS.icon key={"NodeW"} />,
        <Libs.Typescript.icon key={"TSW"} />,
        <Libs.JavaScript.icon key={"JSW"} />,
        <SecondaryLibs.Postgres.icon key={"PGW"} />,
        <SecondaryLibs.Koa.icon key={"KoaW"} />,
        <SecondaryLibs.html.icon key={"htmlW"} />,
        <SecondaryLibs.css.icon key={"cssW"} />,
        <SecondaryLibs.ESLint.icon key={"EslintW"} />,
      ],
      features: [
        <Feature
          key={"WisdomsRepo"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/wisdoms"} />}
          content={<ExternalLink to={"https://github.com/petarzarkov/wisdoms"} text={"repo"} />}
        />,
        <Feature
          key={"SequelizeWisdoms"}
          icon={<SecondaryLibs.Sequelize.icon />}
          content={<Text fontWeight={600}>Sequelize: used for DB migrations, layer over PostgeSQL, and Object-Relational Mapping</Text>}
        />
      ],
      preview: <AspectRatio w={400} minH={isFrameLoading ? 200 : 600}>
        <>
          {isFrameLoading && <Spinner
            thickness='4px'
            speed='1.85s'
            emptyColor='gray.200'
            color='blue.500'
            size='xs'
          />}
          <iframe src='https://wisdoms-app.herokuapp.com/' style={{ borderRadius: 15 }} onLoad={() => setFrameLoading(false)} />
        </>
      </AspectRatio>
    },
    {
      title: "🔥 Hot Utils 🔥",
      subTitle: "npm package",
      description: "hot-utils npm package - various NodeJS utils with type definition inference",
      devStack: [
        <Libs.NodeJS.icon key={"NodeHot"} />,
        <Libs.Typescript.icon key={"TSH"} />,
        <Libs.JavaScript.icon key={"JSH"} />,
        <SecondaryLibs.npm.icon key={"npmH"} to={"https://www.npmjs.com/package/hot-utils"} />,
        <SecondaryLibs.ESLint.icon key={"EslintH"} />,
        <SecondaryLibs.Jest.icon key={"jesth"} />,
      ],
      features: [
        <Feature
          key={"HotDescription"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/hotstuff/blob/main/README.md"} />}
          content={<Code>Provides utilities for http requests. Url manipulation and building. Logger. Object utils. Promise utils.</Code>}
        />,
        <Feature
          key={"HotRepo"}
          icon={<Socials.GitHub to={"https://github.com/petarzarkov/hotstuff"} />}
          content={<ExternalLink to={"https://github.com/petarzarkov/hotstuff"} text={"repo"} />}
        />,
        <Feature
          key={"npmhot"}
          icon={<SecondaryLibs.npm.icon to={"https://www.npmjs.com/package/hot-utils"} />}
          content={<ExternalLink to={"https://www.npmjs.com/package/hot-utils"} text={"npm hot-utils"} />}
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