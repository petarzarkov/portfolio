import React, { FC } from "react";
import { Stack, Container, Heading, Text, useColorModeValue } from "@chakra-ui/react";

export const Title: FC<{ title: string; subTitle?: string }> =
({ title, subTitle }) =>
  <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"} padding={4} mb={10}>
    <Heading fontSize={"3xl"} color={useColorModeValue("primary.800", "primary.100")}>{title}</Heading>
    {subTitle && <Text color={useColorModeValue("primary.600", "primary.400")} fontSize={"xl"}>
      {subTitle}
    </Text>}
  </Stack>;