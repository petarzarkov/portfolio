/* eslint-disable max-len */
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
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { routes } from "@config";
import { Outlet } from "react-router-dom";
import { Footer, NavLink } from "@components";
import { CONFETTI_DARK, CONFETTI_LIGHT } from "@theme";

export const NavBar: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const Links = useMemo(() => Object.entries(routes), undefined);
  const LinksRendered = useMemo(() => Links.map(([link, info]) => (
    <NavLink key={info.name} to={link} icon={info.icon}>{info.name}</NavLink>
  )), Links);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
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
            <Menu>
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
                />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  Link 1
                </MenuItem>
                <MenuItem>
                  Link 2
                </MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
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
        <Box
          borderRadius="md"
          m={{ base: 2, md: 8, lg: 5 }}
          p={{ base: 2, lg: 8 }}
        >
          <Outlet />
        </Box>
      </Flex>

      <Footer />
    </>
  );
};
