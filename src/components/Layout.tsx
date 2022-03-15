import React, { FC } from "react";
import {
  Box,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { BackTop, Footer, NavBar } from "@components";
import { CONFETTI_DARK, CONFETTI_LIGHT } from "@theme";

export const Layout: FC = () => {

  return (
    <>
      <NavBar />

      <Flex
        bg={useColorModeValue("white.100", "gray.800")}
        align="center"
        justify="center"
        minHeight={"84.6vh"}
        css={{
          backgroundImage: useColorModeValue(CONFETTI_LIGHT, CONFETTI_DARK),
          backgroundAttachment: "fixed",
        }}
      >
        <Box borderRadius="md" p={4}>
          <Outlet />
        </Box>
      </Flex>

      <BackTop />
      <Footer />
    </>
  );
};
