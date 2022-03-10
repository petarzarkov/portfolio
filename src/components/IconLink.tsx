import React, { ReactElement } from "react";
import { IconButton, useColorModeValue, Link, IconButtonProps } from "@chakra-ui/react";

export const IconLink = ({ to = "#", icon, label, btnProps }:
{ label: string; icon: ReactElement; to?: string; btnProps?: Partial<IconButtonProps> }) => <Link href={to} target={"_blank"}>
  <IconButton
    {...btnProps}
    aria-label={label}
    variant="ghost"
    size="lg"
    icon={icon}
    _hover={{
      bg: "blue.500",
      color: useColorModeValue("white", "gray.700"),
    }}
    isRound
  />
</Link>;