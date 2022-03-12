import React, { FC } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Icon,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { Title } from "@components";

// Replace test data with your own
const features = [
  {
    title: "Mobile Application Development",
    text: "React Native; Android, Eclipse/Android Studio, Java, Xml, designing/styling, animation, sounds, splash screens, fragments, widgets;",
    // TODO add "https://play.google.com/store/apps/details?id=com.impossiblequiz"
  },
  {
    title: "Database Development",
    text: "Normalization to fourth normal form; MySQL, SQL Server, SQL queries, Oracle, PostGres;",
  },
  {
    title: "API Development",
    text: "With NodeJS using Koa, Sequelize",
  },
  {
    title: "NPM package",
    text: "https://www.npmjs.com/package/hot-utils",
  },
];

export const About: FC = () => {
  return (
    <Box p={4}>
      <Title
        title={"About"}
        subTitle={"Software developer with 7 years of experience in the sphere and another roughly 5 years in the area of IT."}
      />
      <Container maxW={"6xl"} mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {features.map((feature, index) => (
            <HStack key={`${feature.title}-${index}`} align={"top"}>
              <Box color={"green.400"} px={2}>
                <Icon as={CheckIcon} />
              </Box>
              <VStack align={"start"}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={"gray.600"}>{feature.text}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};