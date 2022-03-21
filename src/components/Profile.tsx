import React, { FC, ReactNode } from "react";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  useColorModeValue,
  ThemingProps,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
import { portfolio } from "@config";
import { Libs } from "./Icons";

const Card: FC<
{
  name?: string;
  subName?: string;
  avatarSize?: ThemingProps<"Avatar">["size"];
}> =
({ name = portfolio.name, subName = portfolio.title, avatarSize = "xl" }) => {
  return (
    <Center>
      <Box
        maxW={"270px"}
        w={"full"}
        bg={useColorModeValue("primary.50", "primary.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}>
        <Image
          h={"120px"}
          w={"full"}
          src={
            "images/dice.jpg"
          }
          objectFit={"cover"}
        />
        <Flex justify={"center"} mt={-12}>
          <Avatar
            borderColor={useColorModeValue("primary.200", "primary.700")}
            borderWidth={2}
            borderStyle={"groove"}
            size={avatarSize}
            src={
              "images/avatar.jpg"
            }
            title={name}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={"center"} mb={5}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {name}
            </Heading>
            <Text color={"primary.500"}>{subName}</Text>
          </Stack>
        </Box>
      </Box>
    </Center>
  );
};

const StatsCard: FC<{
  title: string;
  stat: string;
  icon: ReactNode;
}> = ({ title, stat, icon }) => {

  return (
    <Stat
      px={{ base: 2, md: 4 }}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("primary.800", "primary.500")}
      rounded={"lg"}>
      <VStack>
        <Box >
          <StatLabel isTruncated fontSize={"xs"} color={useColorModeValue("primary.800", "primary.500")}>
            {title}
          </StatLabel>
          <StatNumber fontSize={"md"} fontWeight={"medium"} color={useColorModeValue("primary.500", "primary.300")}>
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

export const Profile: FC = () => {
  const stats = [
    { stat: "React Native", title: "Expand on", icon: <Libs.ReactNative.icon /> },
    { stat: "Typescript", title: "Expand on", icon: <Libs.Typescript.icon /> },
    { stat: "NodeJS", title: "Expand on", icon: <Libs.NodeJS.icon /> },
  ];
  return (
    <Box minW={"10vh"}>
      <Card avatarSize={"2xl"} />
      <Box w={"full"} mx={"auto"} pt={1} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1
          textAlign={"center"}
          fontSize={"xl"}
          pb={1}
          fontWeight={"bold"}>
            Current Focuses
        </chakra.h1>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
          {stats.map(({ stat, title, icon }, index) => <StatsCard key={`${title}-${index}`} title={title} stat={stat} icon={icon} />)}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
