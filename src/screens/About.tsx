import React, { FC } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

// Replace test data with your own
const features = [
  {
    title: "Mobile Application Development",
    text: "React Native; Android, Eclipse/Android Studio, Java, Xml, designing/styling, animation, sounds, splash screens, fragments, widgets;",
  },
  {
    title: "Database Development",
    text: "Normalization to fourth normal form; MySQL, SQL Server, SQL queries, Oracle, PostGres;",
  },
];

export const About: FC = () => {
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
        <Heading fontSize={"3xl"}>About</Heading>
        <Text color={"gray.600"} fontSize={"xl"}>
        Software developer with 7 years of experience in the sphere and another roughly 5 years in the area of IT.
        </Text>
      </Stack>

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