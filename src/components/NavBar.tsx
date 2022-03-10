/* eslint-disable max-len */
import React, { FC, ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
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
  Icon
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { routes } from "@config";
import { Link as RLink, Outlet } from "react-router-dom";
import { Footer } from "@components";
import { IconType } from "react-icons";
import { CONFETTI_DARK, CONFETTI_LIGHT } from "@theme";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const Links = Object.entries(routes);

const NavLink = ({ children, icon, to = "#" }: { children: ReactNode; icon: IconType; to?: string }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    as={RLink}
    to={to}
  >
    <Flex
      align="center"
      p="2"
      mx="2"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "cyan.400",
        color: "white",
      }}>
      {icon && (
        <Icon
          mr="2"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  </Link>
);

export const NavBar: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              {Links.map((link) => (
                <NavLink key={link[1].name} to={link[0]} icon={link[1].icon}>{link[1].name}</NavLink>
              ))}
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
              {Links.map((link) => (
                <NavLink key={link[1].name} to={link[0]} icon={link[1].icon}>{link[1].name}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Flex
        bg={useColorModeValue("white.100", "gray.800")}
        align="center"
        justify="center"
        height={"100vh"}
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
