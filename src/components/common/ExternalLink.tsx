import React, { FC } from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/react";

export const ExternalLink: FC<{
  to: string;
  text: string;
  target?: React.HTMLAttributeAnchorTarget;
}> = ({ to, text, target = "_blank" }) => {
  return (
    <Link href={to} target={target}>{text} <ExternalLinkIcon mx='2px' /></Link>
  );
};