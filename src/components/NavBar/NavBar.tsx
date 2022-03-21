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
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { routes } from "@config";
import { BasicStats, Card, NavLink } from "@components";
import { useThemeProvider } from "@hooks";
import { ColorTheme, themes } from "@theme";
import { BsPaletteFill } from "react-icons/bs";

export const NavBar: FC = () => {
  const { isOpen: isPalOpen, onOpen: palOnOpen, onClose: palOnClose } = useDisclosure();
  // const [paletteVisible, setPaletteVisible] = useState(false);
  const { theme, setTheme } = useThemeProvider();
  const { toggleColorMode } = useColorMode();
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
          <Button onClick={isPalOpen ? palOnClose : palOnOpen} margin={5}>
            <BsPaletteFill />
          </Button>
          <Button onClick={toggleColorMode} margin={5}>
            {useColorModeValue(<MoonIcon />, <SunIcon />)}
          </Button>
          <Menu isLazy lazyBehavior="keepMounted">
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}>
              <Avatar
                borderColor={useColorModeValue("primary.800", "primary.100")}
                borderWidth={1}
                borderStyle={"groove"}
                size={"sm"}
                src={
                  "images/avatar.jpg"
                }
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

      <Drawer placement={"top"} onClose={palOnClose} isOpen={isPalOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px' backgroundColor={useColorModeValue(`${theme}.300`, `${theme}.500`)}>Pick your theme</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <Box>
              {Object.keys(themes).map((tt, indx) =>
                <Button
                  p={1}
                  m={1}
                  variant='outline'
                  key={`${tt}-${indx}`}
                  colorScheme={tt}
                  bgColor={theme === tt ? useColorModeValue(`${tt}.300`, `${tt}.500`) : "transparent"}
                  onClick={() => setTheme(tt as ColorTheme)}
                >
                  {tt}
                </Button>)}
            </Box >
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
