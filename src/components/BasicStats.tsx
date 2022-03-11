import React, { FC, ReactNode } from "react";
import {
  Box,
  chakra,
  Flex,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoLogoNodejs } from "react-icons/io";
import { SiReact, SiTypescript } from "react-icons/si";

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
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}>
      <Flex justifyContent={"space-between"}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"medium"} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent={"center"}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
};

const stats = [
  { stat: "React Native", title: "Expand on", icon: <Icon as={SiReact} w={10} h={10} color={"blue.300"} /> },
  { stat: "Typescript", title: "Expand on", icon: <Icon as={SiTypescript} w={10} h={10} color={"blue.600"} /> },
  { stat: "NodeJS", title: "Expand on", icon: <Icon as={IoLogoNodejs} w={10} h={10} color={"green.600"} /> },
];
export const BasicStats: FC = () => {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={"center"}
        fontSize={"4xl"}
        py={10}
        fontWeight={"bold"}>
          Current Focuses
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        {stats.map(({ stat, title, icon }) => <StatsCard key={title} title={title} stat={stat} icon={icon} />)}
      </SimpleGrid>
    </Box>
  );
};