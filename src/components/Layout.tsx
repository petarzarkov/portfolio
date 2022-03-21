import React, { FC } from "react";
import {
  Box,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { BackTop, Footer, NavBar } from "@components";

export const Layout: FC = () => {

  return (
    <>
      <NavBar />

      <Flex
        bg={useColorModeValue("primary.100", "primary.800")}
        align="center"
        justify="center"
        minHeight={"84.6vh"}
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
