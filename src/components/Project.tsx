import React, { FC, ReactElement } from "react";
import {
  Stack, Flex, Text, Container, Heading, HStack,
  SimpleGrid, StackDivider, useColorModeValue, Image
} from "@chakra-ui/react";

export const Feature: FC<{
  content?: ReactElement;
  icon?: ReactElement;
}> = ({ content, icon }) => {
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
      {content && content}
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
  previewImg?: string;
}> = ({ title, subTitle, description, features, preview, devStack, previewImg }) => {
  return (
    <Container maxW={"5xl"} py={12} borderRadius={25} borderColor={"blue.400"} borderWidth={"thin"} mt={10} >
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Text
            textTransform={"uppercase"}
            color={"blue.400"}
            fontWeight={600}
            fontSize={"sm"}
            bg={useColorModeValue("primary.50", "primary.900")}
            p={2}
            alignSelf={"flex-start"}
            rounded={"md"}>
            {subTitle}
          </Text>
          <Heading>{title}</Heading>
          <Text color={"primary.500"} fontSize={"lg"}>
            {description}
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue("primary.300", "primary.700")}
              />
            }>
            {features}
          </Stack>
          {devStack?.length &&
          <>
            <Text color={useColorModeValue("primary.700", "primary.300")} fontSize={"lg"} fontWeight={600}>
              {"Tech Stack"}
            </Text>
            <HStack
              wrap={"wrap"}
              spacing={4}
              divider={<StackDivider
                borderColor={useColorModeValue("primary.300", "primary.700")} />}>
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
                previewImg || "images/img5.jpg"
              }
              objectFit={"cover"}
            />}
        </Flex>
      </SimpleGrid>
    </Container>
  );
};