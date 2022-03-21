import React, { FC, Suspense } from "react";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
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
          <Suspense fallback={
            <Box boxShadow='lg' w={"100vh"} h={"50vh"}>
              <SkeletonCircle size='10' />
              <SkeletonText mt='4' noOfLines={10} spacing='4' />
            </Box>}>
            <Outlet />
          </Suspense>
        </Box>
      </Flex>

      <BackTop />
      <Footer />
    </>
  );
};
