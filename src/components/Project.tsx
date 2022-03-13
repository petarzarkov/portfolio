import React, { FC, ReactElement } from "react";
import {
  Stack, Flex, Text, Container, Heading,
  SimpleGrid, StackDivider, useColorModeValue, Image
} from "@chakra-ui/react";

export const Feature: FC<{
  text: string;
  iconBg: string;
  icon?: ReactElement;
}> = ({ text, icon, iconBg }) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex
        w={8}
        h={8}
        align={"center"}
        justify={"center"}
        rounded={"full"}
        bg={iconBg}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

export const Project: FC<{
  title: string;
  subTitle: string;
  description: string;
  features: ReactElement[];
}> = ({ title, subTitle, description, features }) => {
  return (
    <Container maxW={"5xl"} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Text
            textTransform={"uppercase"}
            color={"blue.400"}
            fontWeight={600}
            fontSize={"sm"}
            bg={useColorModeValue("blue.50", "blue.900")}
            p={2}
            alignSelf={"flex-start"}
            rounded={"md"}>
            {subTitle}
          </Text>
          <Heading>{title}</Heading>
          <Text color={"gray.500"} fontSize={"lg"}>
            {description}
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.100", "gray.700")}
              />
            }>
            {features}
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={"md"}
            alt={"feature image"}
            src={
              "images/img6.jpg"
            }
            objectFit={"cover"}
          />
        </Flex>
      </SimpleGrid>
    </Container>
  );
};