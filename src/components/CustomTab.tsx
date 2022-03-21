import React, { FC } from "react";
import { Tab, useColorModeValue, Heading } from "@chakra-ui/react";

export const CustomTab: FC<{ title: string }> = ({ title }) =>
  <Tab
    _hover={{ backgroundColor: useColorModeValue("primary.200", "primary.400") }}
    _selected={{ backgroundColor: useColorModeValue("primary.300", "primary.500") }}
  >
    <Heading
      fontSize={"md"}
      color={useColorModeValue("primary.800", "primary.100")}
    >
      {title}
    </Heading>
  </Tab>;