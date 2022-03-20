import React, { FC, useMemo } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { routes } from "@config";
import { BasicStats, Card, NavLink } from "@components";

export const NavBar: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const Links = useMemo(() => Object.entries(routes), undefined);
  const LinksRendered = useMemo(() => Links.map(([link, info]) => (
    <NavLink key={info.name} to={link} icon={info.icon}>{info.name}</NavLink>
  )), Links);

  return (
    <Box bg={useColorModeValue("primary.200", "primary.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <HStack
            as={"nav"}
            spacing={4}
            display={{ base: "none", md: "flex" }}>
            {LinksRendered}
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          <Button onClick={toggleColorMode} margin={5}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Menu isLazy lazyBehavior="keepMounted">
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}>
              <Avatar
                size={"sm"}
                src={
                  "images/avatar.jpg"
                }
                css={{
                  border: "thin solid",
                  borderColor: useColorModeValue("primary.800", "primary.100")
                }}
              />
            </MenuButton>
            <MenuList bgColor={useColorModeValue("primary.200", "primary.800")}>
              <Box minW={"10vh"}>
                <Card avatarSize={"2xl"} />
                <BasicStats />
              </Box>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {LinksRendered}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};
