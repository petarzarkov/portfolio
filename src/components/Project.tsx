import React, { FC, ReactElement } from "react";
import {
  Stack, Flex, Text, Container, HStack,
  SimpleGrid, StackDivider, useColorModeValue, Image, VStack
} from "@chakra-ui/react";
import { Title } from "@components";

export const Project: FC<{
  title: string;
  subTitle: string;
  description: string;
  features: ReactElement[] | ReactElement;
  devStack: ReactElement[];
  preview?: ReactElement;
  previewImg?: string;
}> = ({ title, subTitle, description, features, preview, devStack, previewImg }) => {
  return (
    <Container maxW={"5xl"} py={12} borderRadius={25} borderColor={"primary.400"} borderWidth={"thin"} mt={2}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stack spacing={4}>
          <Text
            textTransform={"uppercase"}
            color={"primary.400"}
            fontWeight={600}
            fontSize={"sm"}
            bg={useColorModeValue("primary.50", "primary.900")}
            p={2}
            alignSelf={"flex-start"}
            rounded={"md"}>
            {subTitle}
          </Text>
          <Title title={title} subTitle={description} />
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
              spacing={6}
              divider={<StackDivider
                borderColor={useColorModeValue("primary.300", "primary.700")} />}>
              {devStack}
            </HStack>
          </>}
        </Stack>
        <Flex>
          {preview ?
            preview && previewImg ?
              <VStack
                divider={<StackDivider borderColor={useColorModeValue("primary.300", "primary.700")} />}
              >
                <Image
                  rounded={"md"}
                  alt={"feature image"}
                  src={
                    previewImg || "images/img5.jpg"
                  }
                  objectFit={"cover"}
                />
                {preview}
              </VStack>
              : preview
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