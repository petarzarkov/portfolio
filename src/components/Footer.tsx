import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Socials } from "@components";

export const Footer = () => {
  return (
    <Box
      style={{
        left: 0,
        bottom: 0,
        right: 0,
        position: "inherit"
      }}
      bg={useColorModeValue("gray.100", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}>
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}>
        <Text>{`© Petar Zarkov ${new Date().getFullYear()}`}</Text>
        <Stack direction={"row"} spacing={6}>
          <Socials.LinkedIn />
          <Socials.GitHub />
        </Stack>
      </Container>
    </Box>
  );
};
