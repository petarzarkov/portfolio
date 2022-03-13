import React, { FC } from "react";
import { Stack, Container, Heading, Text } from "@chakra-ui/react";

export const Title: FC<{ title: string; subTitle?: string }> =
({ title, subTitle }) =>
  <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"} padding={4} mb={10}>
    <Heading fontSize={"3xl"}>{title}</Heading>
    {subTitle && <Text color={"gray.600"} fontSize={"xl"}>
      {subTitle}
    </Text>}
  </Stack>;