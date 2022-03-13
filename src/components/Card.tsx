import React, { FC } from "react";
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
} from "@chakra-ui/react";
import { portfolio } from "@config";

export const Card: FC<
{
  name?: string;
  subName?: string;
  avatarSize?: ThemingProps<"Avatar">["size"];
}> =
({ name = portfolio.name, subName = portfolio.title, avatarSize = "xl" }) => {
  return (
    <Center py={6}>
      <Box
        maxW={"270px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
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
            size={avatarSize}
            src={
              "images/avtr1.jpg"
            }
            title={name}
            css={{
              border: "2px solid white",
            }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={"center"} mb={5}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {name}
            </Heading>
            <Text color={"gray.500"}>{subName}</Text>
          </Stack>
        </Box>
      </Box>
    </Center>
  );
};
