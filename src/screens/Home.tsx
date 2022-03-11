/* eslint-disable max-len */
import React, { FC, ReactElement } from "react";
import {
  Avatar,
  Box,
  chakra,
  Flex,
  Icon,
  Text,
  SimpleGrid,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsHeartFill, BsYoutube } from "react-icons/bs";
import { IconLink } from "@components";

const descriptions = [
  {
    name: "Fireship",
    role: "The best programming content creator",
    content:
        <VStack>
          <Text
            fontFamily={"Inter"}
            fontWeight={"medium"}
          >
              Check him out:
          </Text>
          <IconLink
            to={"https://www.youtube.com/c/Fireship"}
            icon={<BsYoutube size="28px" color="red" />}
            label={"youtube-fireship"}
            bgHover={"gray.300"}
          />
        </VStack>,
    avatar:
        "https://yt3.ggpht.com/ytc/AKedOLTcIl6kKt3lEPJEySUf_hpHiKDKiFeo9eWPReLysQ=s88-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Engineering Man",
    role: "Arranging 0's and 1's in the exact right order",
    content: <VStack>
      <Text
        fontFamily={"Inter"}
        fontWeight={"medium"}
      >
              Check him out:
      </Text>
      <IconLink
        to={"https://www.youtube.com/c/EngineerMan"}
        icon={<BsYoutube size="28px" color="red" />}
        label={"youtube-engineering-man"}
        bgHover={"gray.300"}
      />
    </VStack>,
    avatar:
        "https://yt3.ggpht.com/ytc/AKedOLT4T_g-knQFqV1Bln8ZjowePaTU0wwQioCj-bEJbw=s88-c-k-c0x00ffffff-no-rj",
  },
];

const Card: FC<{
  name: string;
  role: string;
  content: ReactElement;
  avatar: string;
}> = ({ name, role, content, avatar }) => {

  return (
    <Flex
      boxShadow={"lg"}
      maxW={"640px"}
      direction={{ base: "column-reverse", md: "row" }}
      width={"full"}
      rounded={"xl"}
      p={10}
      justifyContent={"space-between"}
      position={"relative"}
      bg={useColorModeValue("gray.100", "gray.700")}
    >
      <Flex
        zIndex={"1"}
        direction={"column"}
        textAlign={"left"}
        justifyContent={"space-between"}>
        <chakra.span
          fontFamily={"Inter"}
          fontWeight={"medium"}
          fontSize={"15px"}
          color={useColorModeValue("gray.500", "gray.300")}
          pb={4}>
          {content}
        </chakra.span>
        <chakra.p fontFamily={"Work Sans"} fontWeight={"bold"} fontSize={14}>
          {name}
          <chakra.span
            fontFamily={"Inter"}
            fontWeight={"medium"}
            color={useColorModeValue("gray.500", "gray.300")}>
            {" "}
            - {role}
          </chakra.span>
        </chakra.p>
      </Flex>
      <Avatar
        src={avatar}
        height={"80px"}
        width={"80px"}
        alignSelf={"center"}
        m={{ base: "0 0 35px 0", md: "0 0 0 50px" }}
      />
    </Flex>
  );
};

export const Home = () => {
  return (
    <Flex
      textAlign={"center"}
      pt={10}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}>
      <Box width={{ base: "full", sm: "lg", lg: "xl" }} margin={"auto"}>
        <chakra.h3
          fontFamily={"Work Sans"}
          fontWeight={"bold"}
          fontSize={20}
          textTransform={"uppercase"}
          color={"purple.400"}>
          {"Home"}
        </chakra.h3>
        <chakra.h1
          py={5}
          fontSize={48}
          fontFamily={"Work Sans"}
          fontWeight={"bold"}
          color={useColorModeValue("gray.700", "gray.50")}>
          {"Inspirations"}
        </chakra.h1>
        <chakra.h2
          margin={"auto"}
          width={"70%"}
          fontFamily={"Inter"}
          fontWeight={"medium"}
          color={useColorModeValue("gray.500", "gray.400")}>
          What or who got me into{" "}
          <chakra.strong color={useColorModeValue("gray.700", "gray.50")}>
            Programming
          </chakra.strong>{" "}
          and keeps me in it!
        </chakra.h2>
      </Box>
      <SimpleGrid
        columns={{ base: 1, xl: 2 }}
        spacing={"20"}
        mt={16}
        mx={"auto"}>
        {descriptions.map((cardInfo) => (
          <Card {...cardInfo} key={cardInfo.name} />
        ))}
      </SimpleGrid>
      <Box>
        <Icon viewBox="0 0 40 35" mt={14} boxSize={10} color={"purple.400"}>
          <BsHeartFill size={40} />
        </Icon>
      </Box>
    </Flex>
  );
};
