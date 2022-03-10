import React, { ReactNode } from "react";
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { BsLinkedin, BsGithub } from "react-icons/bs";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      target={"_blank"}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.400", "whiteAlpha.400"),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export const Footer = () => {
  return (
    <Box
      style={{
        left: 0,
        bottom: 0,
        right: 0,
        position: "fixed"
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
          <SocialButton label={"LinkedIn"} href={"https://www.linkedin.com/in/%E2%98%95-petar-zarkov-7989a670/"}>
            <BsLinkedin />
          </SocialButton>
          <SocialButton label={"GitHub"} href={"https://github.com/petarzarkov?tab=repositories"}>
            <BsGithub />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
};
