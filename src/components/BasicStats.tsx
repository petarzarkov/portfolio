import React, { FC, ReactNode } from "react";
import {
  Box,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Libs } from "@components";

const StatsCard: FC<{
  title: string;
  stat: string;
  icon: ReactNode;
}> = ({ title, stat, icon }) => {

  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("primary.800", "primary.500")}
      rounded={"lg"}>
      <VStack>
        <Box >
          <StatLabel isTruncated fontSize={"sm"}>
            {title}
          </StatLabel>
          <StatNumber fontSize={"md"} fontWeight={"medium"}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("primary.800", "primary.200")}
          alignContent={"center"}>
          {icon}
        </Box>
      </VStack>
    </Stat>
  );
};

export const BasicStats: FC = () => {
  const stats = [
    { stat: "React Native", title: "Expand on", icon: <Libs.ReactNative.icon /> },
    { stat: "Typescript", title: "Expand on", icon: <Libs.Typescript.icon /> },
    { stat: "NodeJS", title: "Expand on", icon: <Libs.NodeJS.icon /> },
  ];
  return (
    <Box w={"full"} mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={"center"}
        fontSize={"xl"}
        py={10}
        fontWeight={"bold"}>
          Current Focuses
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        {stats.map(({ stat, title, icon }, index) => <StatsCard key={`${title}-${index}`} title={title} stat={stat} icon={icon} />)}
      </SimpleGrid>
    </Box>
  );
};