import React, { FC, ReactNode } from "react";
import {
  Flex,
  Link,
  useColorModeValue,
  Icon
} from "@chakra-ui/react";
import { Link as RLink, useMatch, useResolvedPath } from "react-router-dom";
import { IconType } from "react-icons";

export const NavLink: FC<{ children: ReactNode; icon: IconType; to?: string }> = ({ children, icon, to = "#" }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      background={match ? useColorModeValue("gray.200", "gray.500") : undefined}
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
};