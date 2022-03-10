import React, { FC } from "react";
import { Heading, Link } from "@chakra-ui/react";
import { Link as RLink } from "react-router-dom";

export const NotFound: FC = () => <>
  <Heading>Nothing to see here!</Heading>
  <Link to="/" as={RLink}>Go to the home page</Link>
</>;