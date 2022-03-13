import React, { FC, ReactElement } from "react";
import {
  Stack, Flex, Text, Container, Heading, HStack,
  SimpleGrid, StackDivider, useColorModeValue, Image
} from "@chakra-ui/react";

export const Feature: FC<{
  text?: ReactElement;
  icon?: ReactElement;
}> = ({ text, icon }) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex
        w={8}
        h={8}
        align={"center"}
        justify={"center"}
        rounded={"full"}>
        {icon}
      </Flex>
      {text && text}
    </Stack>
  );
};

export const Project: FC<{
  title: string;
  subTitle: string;
  description: string;
  features: ReactElement[];
  devStack: ReactElement[];
  preview?: ReactElement;
}> = ({ title, subTitle, description, features, preview, devStack }) => {
  return (
    <Container maxW={"5xl"} py={12} borderRadius={25} borderColor={"blue.200"} borderWidth={"thin"} mt={10} >
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
                borderColor={useColorModeValue("gray.300", "gray.700")}
              />
            }>
            {features}
          </Stack>
          {devStack?.length &&
          <>
            <Text color={useColorModeValue("gray.700", "gray.300")} fontSize={"lg"}>
              {"Tech Stack"}
            </Text>
            <HStack
              wrap={"wrap"}
              spacing={4}
              divider={<StackDivider
                borderColor={useColorModeValue("gray.300", "gray.700")} />}>
              {devStack}
            </HStack>
          </>}
        </Stack>
        <Flex>
          {preview ?
            preview
            :
            <Image
              rounded={"md"}
              alt={"feature image"}
              src={
                "images/img6.jpg"
              }
              objectFit={"cover"}
            />}
        </Flex>
      </SimpleGrid>
    </Container>
  );
};