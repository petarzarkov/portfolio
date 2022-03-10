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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { routes } from "@config";
import { Link as RLink, Outlet } from "react-router-dom";
import { BsGithub, BsLinkedin } from "react-icons/bs";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const Links = Object.entries(routes);

const NavLink = ({ children, to = "#" }: { children: ReactNode; to?: string }) => (
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
    {children}
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
            <Box>Zarkov</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <NavLink key={link[1]} to={link[0]}>{link[1]}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Link colorScheme='blue' href='https://www.linkedin.com/in/%E2%98%95-petar-zarkov-7989a670/' target="_blank" >
              <BsLinkedin />
            </Link>
            <Link colorScheme='gray' href='https://github.com/petarzarkov?tab=repositories' target="_blank" >
              <BsGithub />
            </Link>
            <Button onClick={toggleColorMode}>
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
                    "https://media-exp1.licdn.com/dms/image/C4D03AQHmxPrFeb4-Dw/profile-displayphoto-shrink_100_100/0/1640594404106?e=1652313600&v=beta&t=15LkuFvCi6d9iJpq9ft_9JfPkKUIkS2U_In9tkJXWXw"
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
                <NavLink key={link[1]} to={link[0]}>{link[1]}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>
        <Outlet />
      </Box>
    </>
  );
};
