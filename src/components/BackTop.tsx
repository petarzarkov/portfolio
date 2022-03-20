import React, { FC, useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

export const BackTop: FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollUp = () => {
    window.scrollTo( { left: 0, top: 0, behavior: "smooth" } );
  };

  return (
    <>
      {scrollPosition > 500 && (
        <Box position='fixed'
          bottom='90px'
          right={["8px", "84px"]}
          zIndex={1}
        >
          <Button
            onClick={() => handleScrollUp()}
            colorScheme="primary"
            bgGradient="linear(to-r, primary.400, primary.500, primary.600)"
            color="primary"
            variant="ghost">
            <ArrowUpIcon />
          </Button>
        </Box>
      )}
    </>
  );
};
